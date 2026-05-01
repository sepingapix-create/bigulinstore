"use server";

import { z } from "zod";
import { db } from "@/db";
import { auth } from "@/auth";
import { products, orders, orderItems, productInventory, coupons, affiliates, affiliateReferrals, affiliateVisits, users } from "@/db/schema";
import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { eq, sql, and, desc, count } from "drizzle-orm";
import { StylepayService } from "@/lib/payments/stylepay";
import { sendEmail, sendEmailDirect } from "@/lib/email/sender";
import { OrderCreatedEmail } from "@/lib/email/templates/OrderCreatedEmail";
import { OrderPaidEmail } from "@/lib/email/templates/OrderPaidEmail";
import { AffiliateSaleEmail } from "@/lib/email/templates/AffiliateSaleEmail";

export async function validateCouponAction(code: string) {
  try {
    const coupon = await db.query.coupons.findFirst({
      where: and(eq(coupons.code, code), eq(coupons.isActive, true)),
    });

    if (!coupon) {
      return { success: false, message: "Cupom inválido ou expirado" };
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return { success: false, message: "Este cupom já expirou" };
    }

    if (coupon.usedCount! >= coupon.maxUses!) {
      return { success: false, message: "Este cupom atingiu o limite de usos" };
    }

    return { 
      success: true, 
      discountPercentage: coupon.discountPercentage,
      code: coupon.code 
    };
  } catch (error) {
    console.error("Erro ao validar cupom:", error);
    return { success: false, message: "Erro ao validar cupom" };
  }
}

// Zod schema for checkout input validation
const checkoutSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive().min(1),
    })
  ).min(1, "O carrinho não pode estar vazio"),
});

export type CheckoutState = {
  success: boolean;
  message?: string;
  orderId?: string;
  pixCode?: string;
  errors?: Record<string, string[]>;
};

export async function processCheckout(
  prevState: CheckoutState,
  formData: FormData
): Promise<CheckoutState> {
  console.log("[CHECKOUT DEBUG] processCheckout action started.");
  try {
    // 1. Authenticate user via NextAuth v5
    const session = await auth();
    if (!session?.user?.id) {
      console.log("[CHECKOUT DEBUG] User not logged in. Redirecting to login.");
      return { success: false, message: "Você precisa estar logado para finalizar a compra" };
    }

    const userId = session.user.id;
    console.log(`[CHECKOUT DEBUG] User authenticated. User ID: ${userId}`);

    // 2. Parse and validate input
    const rawItems = formData.get("items");
    const couponCode = formData.get("couponCode") as string | null;
    const contactName = formData.get("contactName") as string | null;
    const contactEmail = formData.get("contactEmail") as string | null;
    const contactDocument = formData.get("contactDocument") as string | null;

    console.log(`[CHECKOUT DEBUG] Received items: ${rawItems}`);
    console.log(`[CHECKOUT DEBUG] Contact Info - Name: ${contactName}, Email: ${contactEmail}, Document: ${contactDocument}`);

    if (!rawItems || typeof rawItems !== "string") {
      console.error("[CHECKOUT ERROR] Invalid checkout items format.");
      return { success: false, message: "Dados de checkout inválidos" };
    }

    const parsedData = checkoutSchema.safeParse({ items: JSON.parse(rawItems) });
    if (!parsedData.success) {
      return {
        success: false,
        message: "Erro de validação",
        errors: parsedData.error.flatten().fieldErrors,
      };
    }

    const { items } = parsedData.data;

    // 3. Process the order within a transaction
    const result = await db.transaction(async (tx) => {
      let subtotal = 0;
      const orderItemsToInsert = [];

      for (const item of items) {
        // Fetch product to validate price and stock
        const [product] = await tx
          .select()
          .from(products)
          .where(eq(products.id, item.productId));

        if (!product) {
          throw new Error(`Produto ${item.productId} não encontrado`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Estoque insuficiente para o produto: ${product.name}`);
        }

        const itemTotal = Number(product.price) * item.quantity;
        subtotal += itemTotal;

        orderItemsToInsert.push({
          id: crypto.randomUUID(),
          productId: item.productId,
          quantity: item.quantity,
          priceAtPurchase: product.price,
        });

        // NOTA: O estoque só será deduzido e as chaves marcadas como vendidas
        // quando o pagamento for confirmado em fulfillOrder().
      }

      // Handle coupon discount
      let discountAmount = 0;
      let appliedCouponCode = null;

      if (couponCode) {
        const coupon = await tx.query.coupons.findFirst({
          where: and(eq(coupons.code, couponCode), eq(coupons.isActive, true)),
        });

        if (coupon && (!coupon.expiresAt || new Date(coupon.expiresAt) >= new Date()) && coupon.usedCount! < coupon.maxUses!) {
          discountAmount = (subtotal * coupon.discountPercentage) / 100;
          appliedCouponCode = coupon.code;

          // Increment coupon use
          await tx.update(coupons)
            .set({ usedCount: (coupon.usedCount || 0) + 1 })
            .where(eq(coupons.code, coupon.code));
        }
      }

      const totalAmount = subtotal - discountAmount;
      const orderId = crypto.randomUUID();
      console.log(`[CHECKOUT DEBUG] Final totalAmount: ${totalAmount}, generated orderId: ${orderId}`);

      // 4. Fetch user details for Stylepay
      console.log(`[CHECKOUT DEBUG] Fetching user details for ID: ${userId}`);
      const [userData] = await tx.select().from(users).where(eq(users.id, userId));

      // Update user document if provided and different
      if (contactDocument && contactDocument !== userData.document) {
        await tx.update(users).set({ document: contactDocument }).where(eq(users.id, userId));
      }

      // 5. Format products for Stylepay
      const stylepayProducts = [];
      for (const item of orderItemsToInsert) {
        const product = await tx.query.products.findFirst({ where: eq(products.id, item.productId) });
        stylepayProducts.push({
          name: product?.name || "Produto",
          quantity: item.quantity.toString(),
          price: Number(item.priceAtPurchase)
        });
      }

      console.log(`[CHECKOUT DEBUG] Formatted ${stylepayProducts.length} products for Stylepay.`);

      // 6. Generate REAL PIX via Stylepay
      console.log("[CHECKOUT DEBUG] Calling StylepayService.createPixPayment...");
      let payment;
      try {
        payment = await StylepayService.createPixPayment(
          totalAmount, 
          orderId,
          {
            name: contactName || userData.name || "Cliente",
            email: contactEmail || userData.email,
            document: contactDocument || userData.document || "12345678909", // Fallback for testing, should be collected
            phoneNumber: userData.phone || "11999999999",
            address: {
              street: userData.street || "Rua Principal",
              number: userData.number || "1",
              neighborhood: userData.neighborhood || "Centro",
              city: userData.city || "São Paulo",
              state: userData.state || "SP",
              zipCode: userData.zipCode || "01001000"
            }
          },
          stylepayProducts
        );
        console.log("[CHECKOUT DEBUG] Stylepay payment created successfully. Payment ID:", payment?.paymentId);
      } catch (err) {
        console.error("[CHECKOUT FATAL ERROR] Failed inside StylepayService.createPixPayment:", err);
        throw err;
      }

      // 7. Create the order (saving Stylepay paymentId so we can match webhook events)
      console.log(`[CHECKOUT DEBUG] Saving stylepayTransactionId: ${payment.paymentId}`);
      await tx.insert(orders).values({
        id: orderId,
        userId: userId!,
        totalAmount: totalAmount.toFixed(2),
        discountAmount: discountAmount.toFixed(2),
        couponCode: appliedCouponCode,
        pixCode: payment.qrCode,           // REAL PIX CODE
        qrCodeImage: payment.qrCodeImage,  // BASE64 IMAGE
        stylepayTransactionId: payment.paymentId ? String(payment.paymentId) : null,
      });

      // 8. Insert order items
      for (const orderItem of orderItemsToInsert) {
        await tx.insert(orderItems).values({
          ...orderItem,
          orderId: orderId,
        });
      }

      console.log(`[CHECKOUT DEBUG] Transaction complete. Returning orderId: ${orderId}`);
      return { orderId, pixCode: payment.qrCode };
    });

    console.log("[CHECKOUT DEBUG] Revalidating paths...");
    revalidatePath("/admin/products");
    revalidatePath("/profile");

    // ─── Order Created Email ───
    try {
      const session2 = await auth();
      const userEmail = session2?.user?.email;
      const userName = session2?.user?.name || "Cliente";

      if (userEmail && result.pixCode) {
        // Fetch item names for the email
        const emailItems = [];
        const rawItems2 = formData.get("items");
        if (rawItems2) {
          const parsed2 = JSON.parse(rawItems2 as string) as { productId: string; quantity: number }[];
          for (const i of parsed2) {
            const prod = await db.query.products.findFirst({ where: eq(products.id, i.productId) });
            if (prod) {
              emailItems.push({ name: prod.name, quantity: i.quantity, price: Number(prod.price) });
            }
          }
        }

        sendEmail({
          to: userEmail,
          subject: `Pedido #${result.orderId!.slice(0, 8).toUpperCase()} criado — Pague com PIX ⚡`,
          react: OrderCreatedEmail({
            name: userName,
            orderId: result.orderId!,
            items: emailItems,
            totalAmount: emailItems.reduce((s, i) => s + i.price * i.quantity, 0),
            pixCode: result.pixCode,
          }),
          tags: [{ name: "type", value: "order_created" }],
        });
      }
    } catch (emailErr) {
      console.error("[Email] Falha ao enfileirar email de pedido criado:", emailErr);
    }

    console.log(`[CHECKOUT DEBUG] Checkout finished successfully! Returning orderId: ${result.orderId}`);
    return { success: true, orderId: result.orderId, pixCode: result.pixCode };
  } catch (error: any) {
    console.error("[CHECKOUT FATAL ERROR] Erro ao processar checkout:", error);
    return { success: false, message: error.message || "Erro interno no servidor ao processar o pedido" };
  }
}

/**
 * Core fulfillment logic: marks an order as PAID, delivers digital inventory,
 * and credits affiliate commissions. Called by both admin simulation and the
 * Stylepay webhook.
 */
export async function fulfillOrder(
  orderId: string,
  stylepayTransactionId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await db.transaction(async (tx) => {
      // 1. Check if already paid (idempotency guard)
      const [existing] = await tx.select().from(orders).where(eq(orders.id, orderId));
      if (!existing) throw new Error(`Pedido ${orderId} não encontrado`);
      if (existing.status === "PAID") {
        console.log(`[FULFILL] Order ${orderId} already PAID – skipping.`);
        return;
      }

      // 2. Update order status (explicit assignment so Drizzle always includes the column)
      await tx.update(orders)
        .set({
          status: "PAID",
          updatedAt: new Date(),
          stylepayTransactionId: stylepayTransactionId ?? null,
        })
        .where(eq(orders.id, orderId));

      const orderData = existing;
      let attributionAffiliateId: string | null = null;

      // 3. Affiliate commission attribution
      if (orderData.couponCode) {
        const coupon = await tx.query.coupons.findFirst({
          where: eq(coupons.code, orderData.couponCode),
        });
        if (coupon?.affiliateId) attributionAffiliateId = coupon.affiliateId;
      } else {
        try {
          const { cookies } = await import("next/headers");
          const cookieStore = await cookies();
          const visitId = cookieStore.get("referral_visit_id")?.value;
          if (visitId) {
            const [visit] = await tx.select().from(affiliateVisits).where(eq(affiliateVisits.id, visitId)).limit(1);
            if (visit) attributionAffiliateId = visit.affiliateId;
          }
        } catch (err) {
          console.error("[FULFILL] Error reading referral cookie:", err);
        }
      }

      if (attributionAffiliateId) {
        const affiliate = await tx.query.affiliates.findFirst({
          where: eq(affiliates.id, attributionAffiliateId),
        });

        if (affiliate) {
          const commissionAmount = (Number(orderData.totalAmount) * affiliate.commissionRate!) / 100;

          await tx.insert(affiliateReferrals).values({
            id: crypto.randomUUID(),
            affiliateId: affiliate.id,
            orderId: orderId,
            commissionAmount: commissionAmount.toFixed(2),
            status: "PAID",
          });

          await tx.update(affiliates)
            .set({
              balance: (Number(affiliate.balance) + commissionAmount).toFixed(2),
              totalEarned: (Number(affiliate.totalEarned) + commissionAmount).toFixed(2),
            })
            .where(eq(affiliates.id, affiliate.id));

          // ─── Affiliate Sale Email ───
          try {
            const affiliateUser = await tx.query.users.findFirst({
              where: eq(users.id, affiliate.userId),
            });
            if (affiliateUser?.email) {
              sendEmail({
                to: affiliateUser.email,
                subject: `💰 Nova comissão de R$ ${commissionAmount.toFixed(2)}!`,
                react: AffiliateSaleEmail({
                  affiliateName: affiliateUser.name || "Afiliado",
                  commissionAmount: commissionAmount,
                  orderTotal: Number(orderData.totalAmount),
                  orderId: orderId,
                  newBalance: Number(affiliate.balance) + commissionAmount,
                }),
                tags: [{ name: "type", value: "affiliate_sale" }],
              });
            }
          } catch (emailErr) {
            console.error("[Email] Falha ao enfileirar email de comissão:", emailErr);
          }

          try {
            const [latestVisit] = await tx
              .select()
              .from(affiliateVisits)
              .where(and(
                eq(affiliateVisits.affiliateId, affiliate.id),
                eq(affiliateVisits.userId, orderData.userId)
              ))
              .orderBy(desc(affiliateVisits.createdAt))
              .limit(1);

            if (latestVisit) {
              await tx.update(affiliateVisits).set({ convertedToSale: true }).where(eq(affiliateVisits.id, latestVisit.id));
            } else {
              const [lastAffiliateVisit] = await tx
                .select()
                .from(affiliateVisits)
                .where(and(
                  eq(affiliateVisits.affiliateId, affiliate.id),
                  eq(affiliateVisits.convertedToSale, false)
                ))
                .orderBy(desc(affiliateVisits.createdAt))
                .limit(1);
              if (lastAffiliateVisit) {
                await tx.update(affiliateVisits).set({ convertedToSale: true }).where(eq(affiliateVisits.id, lastAffiliateVisit.id));
              }
            }
          } catch (vErr) {
            console.error("[FULFILL] Error updating visit conversion:", vErr);
          }
        }
      }

      // 4. Deliver digital inventory
      const items = await tx.query.orderItems.findMany({
        where: eq(orderItems.orderId, orderId),
      });

      for (const item of items) {
        const availableContent = await tx.query.productInventory.findMany({
          where: and(
            eq(productInventory.productId, item.productId),
            eq(productInventory.isSold, false)
          ),
          limit: item.quantity,
          orderBy: (inventory, { asc }) => [asc(inventory.createdAt)],
        });

        for (const content of availableContent) {
          await tx.update(productInventory)
            .set({ isSold: true, orderId: orderId })
            .where(eq(productInventory.id, content.id));
        }

        // Recalcular e atualizar o estoque real do produto após a venda
        const currentStock = await tx.select({ value: count() })
          .from(productInventory)
          .where(and(eq(productInventory.productId, item.productId), eq(productInventory.isSold, false)));
        
        await tx.update(products)
          .set({ stock: currentStock[0].value })
          .where(eq(products.id, item.productId));
      }
    });

    // ─── Order Paid / Delivery Email ───
    try {
      const orderWithUser = await db.query.orders.findFirst({
        where: eq(orders.id, orderId),
        with: { user: true, items: { with: { product: true } } },
      });

      if (orderWithUser?.user?.email) {
        // Build delivered items list with keys
        const deliveredItems: { productName: string; keys: string[] }[] = [];

        const deliveredContent = await db.query.productInventory.findMany({
          where: and(
            eq(productInventory.orderId, orderId),
            eq(productInventory.isSold, true)
          ),
        });

        // Group keys by productId
        const keysByProduct = new Map<string, string[]>();
        for (const content of deliveredContent) {
          const existing = keysByProduct.get(content.productId) || [];
          existing.push(content.content);
          keysByProduct.set(content.productId, existing);
        }

        for (const item of orderWithUser.items) {
          const keys = keysByProduct.get(item.productId) || [];
          if (keys.length > 0) {
            deliveredItems.push({
              productName: (item as any).product?.name || "Produto",
              keys,
            });
          }
        }

        await sendEmailDirect({
          to: orderWithUser.user.email,
          subject: `✅ Pagamento confirmado! Seus produtos digitais estão prontos — #${orderId.slice(0, 8).toUpperCase()}`,
          react: OrderPaidEmail({
            name: orderWithUser.user.name || "Cliente",
            orderId,
            totalAmount: Number(orderWithUser.totalAmount),
            deliveredItems,
          }),
          tags: [{ name: "type", value: "order_paid" }],
        });
      }
    } catch (emailErr) {
      console.error("[Email] Falha ao enviar email de pedido pago:", emailErr);
    }

    revalidatePath(`/order/${orderId}`);
    revalidatePath("/profile");
    return { success: true };
  } catch (error: any) {
    console.error("[FULFILL] Error fulfilling order:", error);
    return { success: false, error: error.message || "Erro ao processar pedido" };
  }
}

export async function simulatePaymentAction(orderId: string) {
  const result = await fulfillOrder(orderId);
  if (!result.success) return { error: result.error || "Erro ao aprovar pedido" };
  return { success: true };
}

export async function checkOrderStatus(orderId: string) {
  try {
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      columns: {
        status: true,
      },
    });

    if (!order) return { error: "Pedido não encontrado" };

    return { status: order.status };
  } catch (error) {
    console.error("Error checking order status:", error);
    return { error: "Erro ao verificar status" };
  }
}


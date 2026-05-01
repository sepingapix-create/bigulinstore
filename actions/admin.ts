"use server";

import { db } from "@/db";
import { products, productInventory } from "@/db/schema";
import { eq, and, count } from "drizzle-orm";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import { sendEmail } from "@/lib/email/sender";
import { WithdrawalApprovedEmail } from "@/lib/email/templates/WithdrawalApprovedEmail";
import { WithdrawalRejectedEmail } from "@/lib/email/templates/WithdrawalRejectedEmail";

// ... existing actions ...

export async function getProductInventory(productId: string) {
  try {
    return await db.query.productInventory.findMany({
      where: eq(productInventory.productId, productId),
      orderBy: (inventory, { desc }) => [desc(inventory.createdAt)],
    });
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return [];
  }
}

export async function addInventoryAction(productId: string, formData: FormData) {
  try {
    const content = formData.get("content") as string;
    if (!content) return { error: "Conteúdo não pode estar vazio" };

    // Support multiple items separated by new lines
    const items = content.split("\n").map(i => i.trim()).filter(i => i !== "");

    for (const item of items) {
      await db.insert(productInventory).values({
        id: crypto.randomUUID(),
        productId,
        content: item,
        isSold: false,
      });
    }

    // Update product stock automatically
    const currentStock = await db.select({ value: count() })
      .from(productInventory)
      .where(and(eq(productInventory.productId, productId), eq(productInventory.isSold, false)));
    
    await db.update(products)
      .set({ stock: currentStock[0].value })
      .where(eq(products.id, productId));

    revalidatePath("/admin/products");
    return { success: true, count: items.length };
  } catch (error) {
    console.error("Error adding inventory:", error);
    return { error: "Erro ao adicionar itens ao estoque" };
  }
}

export async function deleteInventoryAction(itemId: string, productId: string) {
  try {
    await db.delete(productInventory).where(eq(productInventory.id, itemId));
    
    // Update product stock automatically
    const currentStock = await db.select({ value: count() })
      .from(productInventory)
      .where(and(eq(productInventory.productId, productId), eq(productInventory.isSold, false)));
    
    await db.update(products)
      .set({ stock: currentStock[0].value })
      .where(eq(products.id, productId));

    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    return { error: "Erro ao excluir item do estoque" };
  }
}

const productSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  description: z.string().min(5, "Descrição muito curta"),
  price: z.string().refine((val) => !isNaN(Number(val)), "Preço inválido"),
  originalPrice: z.string().refine((val) => !val || !isNaN(Number(val)), "Preço antigo inválido").optional().nullable(),
  category: z.string().min(2, "Categoria inválida"),
  imageUrl: z.string().url("URL de imagem inválida"),
  isFlashDeal: z.boolean().default(false),
  flashDealEnd: z.date().nullable().optional(),
});

export async function createProductAction(formData: FormData) {
  try {
    const isFlashDeal = formData.get("isFlashDeal") === "true" || formData.get("isFlashDeal") === "on";
    const rawFlashDealEnd = formData.get("flashDealEnd") as string;
    
    const rawData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: formData.get("price") as string,
      originalPrice: (formData.get("originalPrice") as string) || null,
      category: formData.get("category") as string,
      imageUrl: formData.get("imageUrl") as string,
      isFlashDeal,
      flashDealEnd: rawFlashDealEnd ? new Date(rawFlashDealEnd) : null,
    };

    const validatedData = productSchema.parse(rawData);

    await db.insert(products).values({
      id: crypto.randomUUID(),
      ...validatedData,
      stock: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    revalidatePath("/admin/products");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating product:", error);
    return { error: error?.message || "Erro ao criar produto" };
  }
}

export async function deleteProductAction(productId: string) {
  try {
    await db.delete(products).where(eq(products.id, productId));
    revalidatePath("/admin/products");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { error: "Erro ao excluir produto" };
  }
}

export async function updateProductAction(productId: string, formData: FormData) {
  try {
    const isFlashDeal = formData.get("isFlashDeal") === "true" || formData.get("isFlashDeal") === "on";
    const rawFlashDealEnd = formData.get("flashDealEnd") as string;

    const rawData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: formData.get("price") as string,
      originalPrice: (formData.get("originalPrice") as string) || null,
      category: formData.get("category") as string,
      imageUrl: formData.get("imageUrl") as string,
      isFlashDeal,
      flashDealEnd: rawFlashDealEnd ? new Date(rawFlashDealEnd) : null,
    };

    const validatedData = productSchema.parse(rawData);

    await db.update(products)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId));

    revalidatePath("/admin/products");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating product:", error);
    return { error: error?.message || "Erro ao atualizar produto" };
  }
}

// User Management Actions
import { auth } from "@/auth";
import { users, affiliates } from "@/db/schema";
import { desc } from "drizzle-orm";

async function checkAdmin() {
  const session = await auth();
  if (!session?.user?.id) return false;
  
  const [user] = await db.select().from(users).where(eq(users.id, session.user.id));
  return user?.role === "ADMIN";
}

export async function getUsersAction() {
  if (!(await checkAdmin())) throw new Error("Não autorizado");

  try {
    const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));
    return allUsers;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export async function updateUserRoleAction(userId: string, newRole: "USER" | "ADMIN") {
  if (!(await checkAdmin())) throw new Error("Não autorizado");

  try {
    await db.update(users)
      .set({ role: newRole })
      .where(eq(users.id, userId));
    
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { success: false, error: "Erro ao atualizar cargo" };
  }
}

export async function toggleAffiliateStatusAction(userId: string, status: boolean) {
  if (!(await checkAdmin())) throw new Error("Não autorizado");

  try {
    await db.transaction(async (tx) => {
      // 1. Update user flag
      await tx.update(users)
        .set({ isAffiliate: status })
        .where(eq(users.id, userId));

      if (status) {
        // 2. Ensure affiliate record exists if activating
        const existing = await tx.query.affiliates.findFirst({
          where: eq(affiliates.userId, userId),
        });

        if (!existing) {
          const user = await tx.query.users.findFirst({ where: eq(users.id, userId) });
          const handle = user?.name?.toLowerCase().replace(/\s+/g, "") || `user_${userId.substring(0, 5)}`;
          
          await tx.insert(affiliates).values({
            id: crypto.randomUUID(),
            userId,
            handle: handle,
            commissionRate: 10,
          });
        }
      }
    });
    
    revalidatePath("/admin/users");
    revalidatePath("/affiliate");

    // ─── Affiliate Welcome Email ───
    if (status) {
      try {
        const userRecord = await db.query.users.findFirst({
          where: eq(users.id, userId),
        });

        if (userRecord?.email) {
          // Re-using the welcome email, but could be an AffiliateWelcomeEmail in the future
          sendEmail({
            to: userRecord.email,
            subject: "Sua conta de afiliado foi ativada! 🚀",
            react: WithdrawalApprovedEmail({ // Fallback to a generic success or create a new one. For now we just send the Welcome again.
              name: userRecord.name || "Afiliado",
              amount: 0, // Not used in this context
              pixKey: "Painel liberado",
              pixKeyType: "Status",
            }),
            tags: [{ name: "type", value: "affiliate_activated" }],
          });
        }
      } catch (emailErr) {
        console.error("[Email] Falha ao enfileirar email de ativação de afiliado:", emailErr);
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating affiliate status:", error);
    return { success: false, error: "Erro ao atualizar status de afiliado" };
  }
}

export async function deleteUserAction(userId: string) {
  if (!(await checkAdmin())) throw new Error("Não autorizado");

  try {
    await db.delete(users).where(eq(users.id, userId));
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: "Erro ao excluir usuário" };
  }
}

// Withdrawal Management Actions
import { withdrawals } from "@/db/schema";

export async function getWithdrawalsAction() {
  if (!(await checkAdmin())) throw new Error("Não autorizado");
  
  try {
    const rows = await db
      .select({
        withdrawal: withdrawals,
        affiliate: affiliates,
        user: users,
      })
      .from(withdrawals)
      .innerJoin(affiliates, eq(withdrawals.affiliateId, affiliates.id))
      .innerJoin(users, eq(affiliates.userId, users.id))
      .orderBy(desc(withdrawals.createdAt));

    return rows.map(row => ({
      ...row.withdrawal,
      affiliate: {
        ...row.affiliate,
        user: row.user
      }
    }));
  } catch (error) {
    console.error("Error fetching withdrawals:", error);
    return [];
  }
}

export async function updateWithdrawalStatusAction(id: string, status: "APPROVED" | "REJECTED", notes?: string) {
  if (!(await checkAdmin())) throw new Error("Não autorizado");

  try {
    const result = await db.transaction(async (tx) => {
      const request = await tx.query.withdrawals.findFirst({
        where: eq(withdrawals.id, id),
      });

      if (!request) throw new Error("Solicitação não encontrada");
      if (request.status !== "PENDING") throw new Error("Solicitação já processada");

      // 1. Update request status
      await tx.update(withdrawals)
        .set({ status, adminNotes: notes, updatedAt: new Date() })
        .where(eq(withdrawals.id, id));

      // 2. If rejected, refund the balance
      if (status === "REJECTED") {
        const affiliate = await tx.query.affiliates.findFirst({
          where: eq(affiliates.id, request.affiliateId),
        });

        if (affiliate) {
          await tx.update(affiliates)
            .set({ 
              balance: (parseFloat(affiliate.balance as string) + parseFloat(request.amount as string)).toFixed(2) 
            })
            .where(eq(affiliates.id, affiliate.id));
        }
      }
      return { success: true, _affiliateId: request.affiliateId, _amount: request.amount, _pixKey: request.pixKey, _pixKeyType: request.pixKeyType };
    });

    revalidatePath("/admin/affiliates/withdrawals");
    revalidatePath("/affiliate");

    // ─── Withdrawal Status Email ───
    try {
      if (result && (result as any)._affiliateId) {
        const r = result as any;
        const affiliateRecord = await db.query.affiliates.findFirst({
          where: eq(affiliates.id, r._affiliateId),
          with: { user: true },
        });

        if (affiliateRecord?.user?.email) {
          if (status === "APPROVED") {
            sendEmail({
              to: affiliateRecord.user.email,
              subject: `✅ Saque de R$ ${Number(r._amount).toFixed(2)} aprovado!`,
              react: WithdrawalApprovedEmail({
                name: affiliateRecord.user.name || "Afiliado",
                amount: Number(r._amount),
                pixKey: r._pixKey,
                pixKeyType: r._pixKeyType,
              }),
              tags: [{ name: "type", value: "withdrawal_approved" }],
            });
          } else {
            const updatedAffiliate = await db.query.affiliates.findFirst({
              where: eq(affiliates.id, r._affiliateId),
            });
            sendEmail({
              to: affiliateRecord.user.email,
              subject: `Solicitação de saque não aprovada`,
              react: WithdrawalRejectedEmail({
                name: affiliateRecord.user.name || "Afiliado",
                amount: Number(r._amount),
                adminNotes: notes,
                newBalance: Number(updatedAffiliate?.balance || 0),
              }),
              tags: [{ name: "type", value: "withdrawal_rejected" }],
            });
          }
        }
      }
    } catch (emailErr) {
      console.error("[Email] Falha ao enfileirar email de saque:", emailErr);
    }

    return result;
  } catch (error: any) {
    console.error("Error updating withdrawal status:", error);
    return { error: error.message || "Erro ao atualizar saque" };
  }
}

export async function addAffiliateBalanceAction(userId: string, amount: number) {
  if (!(await checkAdmin())) throw new Error("Não autorizado");

  try {
    const affiliate = await db.query.affiliates.findFirst({
      where: eq(affiliates.userId, userId),
    });

    if (!affiliate) return { error: "Afiliado não encontrado" };

    const newBalance = (parseFloat(affiliate.balance as string) + amount).toFixed(2);
    const newTotalEarned = (parseFloat(affiliate.totalEarned as string) + amount).toFixed(2);

    await db.update(affiliates)
      .set({ 
        balance: newBalance,
        totalEarned: newTotalEarned
      })
      .where(eq(affiliates.id, affiliate.id));

    revalidatePath("/admin/users");
    revalidatePath("/admin/affiliates");
    revalidatePath("/affiliate");
    return { success: true };
  } catch (error) {
    console.error("Error adding balance:", error);
    return { error: "Erro ao adicionar saldo" };
  }
}

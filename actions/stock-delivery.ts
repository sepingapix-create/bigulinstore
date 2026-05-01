"use server";

import { db } from "@/db";
import { stockItems, stockDeliveries, stockAuditLogs, orders, orderItems, products } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { auth } from "@/auth"; // Assuming auth is exported from @/auth or wherever NextAuth is configured. Will adjust if needed.
import crypto from "crypto"; 

function generateId() {
  return crypto.randomUUID();
}

/**
 * Sincroniza o estoque de um produto baseado nos slots disponíveis.
 */
export async function synchronizeProductStock(productId: string) {
  // Calculated as Sum(maxSlots - usedSlots)
  const items = await db.select().from(stockItems).where(eq(stockItems.productId, productId));
  
  const totalAvailable = items.reduce((acc, item) => acc + (item.maxSlots - item.usedSlots), 0);
  
  await db.update(products)
    .set({ stock: totalAvailable })
    .where(eq(products.id, productId));
    
  return totalAvailable;
}

export async function addManualDelivery(orderId: string, productId: string, stockItemId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Não autorizado" };
  }

  try {
    // 1. Transaction to guarantee concurrency and idempotency
    await db.transaction(async (tx) => {
      // Get order details
      const [order] = await tx.select().from(orders).where(eq(orders.id, orderId));
      if (!order) throw new Error("Pedido não encontrado.");

      // Get order item to know purchased quantity
      const [item] = await tx.select().from(orderItems)
        .where(and(eq(orderItems.orderId, orderId), eq(orderItems.productId, productId)));
      
      if (!item) throw new Error("Produto não pertence a este pedido.");
      const purchasedQuantity = item.quantity;

      // Get current deliveries for this order and product
      const deliveriesCount = await tx
        .select({ count: sql<number>`count(*)` })
        .from(stockDeliveries)
        .innerJoin(stockItems, eq(stockDeliveries.stockItemId, stockItems.id))
        .where(and(
          eq(stockDeliveries.orderId, orderId),
          eq(stockItems.productId, productId)
        ));
      
      const currentDeliveries = Number(deliveriesCount[0]?.count ?? 0);

      // Validation to avoid over-delivery
      if (currentDeliveries >= purchasedQuantity) {
        throw new Error("A quantidade máxima de entregas para este produto já foi atingida.");
      }

      // Check stock item availability
      const [stockItem] = await tx.select().from(stockItems).where(eq(stockItems.id, stockItemId));
      if (!stockItem) throw new Error("Item de estoque não encontrado.");
      if (stockItem.usedSlots >= stockItem.maxSlots) {
        throw new Error("Este item de estoque não tem mais slots disponíveis.");
      }

      // Perform updates
      await tx.update(stockItems)
        .set({ usedSlots: stockItem.usedSlots + 1 })
        .where(eq(stockItems.id, stockItemId));

      const deliveryId = generateId();
      await tx.insert(stockDeliveries).values({
        id: deliveryId,
        orderId,
        stockItemId,
      });

      // Audit Log
      await tx.insert(stockAuditLogs).values({
        id: generateId(),
        adminId: session.user!.id!, // Non-null assertion since we checked at start
        orderId: orderId,
        stockItemId: stockItemId,
        action: "DELIVERY_ADDED",
        details: `Adicionou manualmente a entrega do item ${stockItemId} (Slot ${stockItem.usedSlots + 1}/${stockItem.maxSlots})`,
      });
    });

    // Sync product stock after transaction
    await synchronizeProductStock(productId);

    return { success: true };
  } catch (error: any) {
    console.error("Error adding delivery:", error);
    return { error: error.message || "Erro interno ao adicionar entrega." };
  }
}

export async function removeDelivery(deliveryId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Não autorizado" };
  }

  try {
    let productIdToSync: string | null = null;

    await db.transaction(async (tx) => {
      // Find delivery
      const [delivery] = await tx.select().from(stockDeliveries).where(eq(stockDeliveries.id, deliveryId));
      if (!delivery) throw new Error("Entrega não encontrada.");

      // Find stock item
      const [stockItem] = await tx.select().from(stockItems).where(eq(stockItems.id, delivery.stockItemId));
      if (!stockItem) throw new Error("Item de estoque não encontrado.");

      productIdToSync = stockItem.productId;

      // Decrement used slots
      await tx.update(stockItems)
        .set({ usedSlots: Math.max(0, stockItem.usedSlots - 1) })
        .where(eq(stockItems.id, stockItem.id));

      // Remove delivery
      await tx.delete(stockDeliveries).where(eq(stockDeliveries.id, deliveryId));

      // Audit Log
      await tx.insert(stockAuditLogs).values({
        id: generateId(),
        adminId: session.user!.id!, // Non-null assertion since we checked at start
        orderId: delivery.orderId,
        stockItemId: stockItem.id,
        action: "DELIVERY_REMOVED",
        details: `Removeu manualmente a entrega (deliveryId: ${deliveryId})`,
      });
    });

    // Sync product stock
    if (productIdToSync) {
      await synchronizeProductStock(productIdToSync);
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error removing delivery:", error);
    return { error: error.message || "Erro interno ao remover entrega." };
  }
}

export async function addStockItem(productId: string, content: string, maxSlots: number = 1) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Não autorizado" };
  }

  try {
    const id = generateId();
    await db.insert(stockItems).values({
      id,
      productId,
      content,
      maxSlots,
      usedSlots: 0,
    });

    // Update product stock display
    await synchronizeProductStock(productId);

    return { success: true, id };
  } catch (error: any) {
    console.error("Error adding stock item:", error);
    return { error: "Erro ao adicionar item ao estoque." };
  }
}

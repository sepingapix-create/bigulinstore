"use server";

import { db } from "@/db";
import { orders, users, orderItems, products, stockDeliveries, stockItems } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";

export async function getOrderDeliveryDetails(orderId: string) {
  try {
    // Fetch purchased items
    const items = await db
      .select({
        id: orderItems.id,
        productId: orderItems.productId,
        quantity: orderItems.quantity,
        productName: products.name,
      })
      .from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, orderId));

    // Build the info required by the Delivery Editor
    const itemsInfo = await Promise.all(
      items.map(async (item) => {
        // Fetch deliveries for this product in this order
        const deliveries = await db
          .select({
            id: stockDeliveries.id,
            stockItemId: stockDeliveries.stockItemId,
            content: stockItems.content,
            deliveredAt: stockDeliveries.deliveredAt,
          })
          .from(stockDeliveries)
          .innerJoin(stockItems, eq(stockDeliveries.stockItemId, stockItems.id))
          .where(
            and(
              eq(stockDeliveries.orderId, orderId),
              eq(stockItems.productId, item.productId)
            )
          );

        // Fetch available stock items for this product
        const availableStockItems = await db
          .select({
            id: stockItems.id,
            content: stockItems.content,
            usedSlots: stockItems.usedSlots,
            maxSlots: stockItems.maxSlots,
          })
          .from(stockItems)
          .where(
            and(
              eq(stockItems.productId, item.productId),
              sql`${stockItems.usedSlots} < ${stockItems.maxSlots}`
            )
          );

        return {
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          deliveries,
          availableStockItems,
        };
      })
    );

    return { success: true, items: itemsInfo };
  } catch (error) {
    console.error("Error fetching order delivery details:", error);
    return { success: false, error: "Falha ao buscar detalhes do pedido." };
  }
}

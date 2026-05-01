"use server";

import { db } from "@/db";
import { products, stockItems } from "@/db/schema";
import { eq, sql, count } from "drizzle-orm";

export async function getInventoryDashboardData() {
  try {
    const data = await db
      .select({
        id: products.id,
        name: products.name,
        category: products.category,
        currentStock: products.stock,
        totalItems: sql<number>`(SELECT COUNT(*) FROM stock_items WHERE productId = ${products.id})`,
        soldItems: sql<number>`(SELECT COUNT(*) FROM stock_items WHERE productId = ${products.id} AND usedSlots > 0)`,
      })
      .from(products);

    return { success: true, products: data };
  } catch (error) {
    console.error("Error fetching inventory data:", error);
    return { success: false, error: "Falha ao carregar estoque." };
  }
}

export async function getProductStockItems(productId: string) {
  try {
    const items = await db
      .select()
      .from(stockItems)
      .where(eq(stockItems.productId, productId))
      .orderBy(sql`createdAt DESC`);

    return { success: true, items };
  } catch (error) {
    console.error("Error fetching stock items:", error);
    return { success: false, error: "Falha ao buscar itens." };
  }
}

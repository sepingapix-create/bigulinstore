"use server";

import { db } from "@/db";
import { products } from "@/db/schema";
import { like, or } from "drizzle-orm";

export async function searchProductsAction(query: string) {
  if (!query || query.length < 2) return [];

  try {
    const results = await db.select().from(products).where(
      or(
        like(products.name, `%${query}%`),
        like(products.category, `%${query}%`),
        like(products.description, `%${query}%`)
      )
    ).limit(5);

    return results;
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
}

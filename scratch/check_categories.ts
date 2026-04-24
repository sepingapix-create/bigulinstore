import { db } from "../db";
import { products } from "../db/schema";
import { sql } from "drizzle-orm";

async function checkCategories() {
  try {
    const categories = await db.select({ 
      category: products.category,
      count: sql<number>`count(*)`
    }).from(products).groupBy(products.category);
    
    console.log("Categories found:", JSON.stringify(categories, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkCategories();

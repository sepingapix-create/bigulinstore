import { db } from "@/db";
import { products } from "@/db/schema";
import { desc } from "drizzle-orm";
import { ProductsClient } from "@/components/admin/ProductsClient";

export default async function AdminProductsPage() {
  const allProducts = await db
    .select()
    .from(products)
    .orderBy(desc(products.createdAt));

  const serialized = allProducts.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description ?? "",
    price: p.price,
    category: p.category,
    stock: Number(p.stock),
    imageUrl: p.imageUrl,
    originalPrice: p.originalPrice,
    isFlashDeal: Boolean(p.isFlashDeal),
    flashDealEnd: p.flashDealEnd ? p.flashDealEnd.toISOString() : null,
  }));

  return <ProductsClient initialProducts={serialized} />;
}

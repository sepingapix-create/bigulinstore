import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, and, ne } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ProductDetailsClient } from "@/components/products/ProductDetailsClient";
import { ProductCard } from "@/components/products/ProductCard";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.id, resolvedParams.id));

  if (!product) {
    notFound();
  }

  // Fetch similar products (same category, different ID)
  const similarProducts = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.category, product.category),
        ne(products.id, product.id)
      )
    )
    .limit(4);

  return (
    <div className="flex-1 text-white">
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        <ProductDetailsClient product={product} />

        {similarProducts.length > 0 && (
          <div className="mt-24 space-y-8">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <h2 className="text-2xl font-black italic uppercase">Produtos Similares</h2>
              <span className="text-sm text-muted-foreground italic">Recomendado pelo Império</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

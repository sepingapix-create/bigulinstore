"use client";

import { useState } from "react";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/db/schema";
import { Badge } from "@/components/ui/badge";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>("Todos");

  // Extract unique categories from products
  const categories = ["Todos", ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts =
    activeCategory === "Todos"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <div className="w-full">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {categories.map((category) => (
          <Badge
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            className={`cursor-pointer px-4 py-1.5 text-sm font-medium transition-all ${
              activeCategory === category
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "hover:bg-muted"
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </Badge>
        ))}
      </div>

      {/* Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">
            Nenhum produto encontrado nesta categoria.
          </p>
        </div>
      )}
    </div>
  );
}

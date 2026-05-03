"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { ShoppingCart, Check } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/db/schema";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  product: Product;
  className?: string;
  showIcon?: boolean;
}

export function AddToCartButton({ product, className, showIcon = true }: AddToCartButtonProps) {
  const { addItem } = useCartStore();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setAdded(true);
    toast.success(`${product.name} adicionado ao carrinho!`);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Button 
      className={cn(
        "font-semibold transition-all duration-300",
        added 
          ? "bg-green-500 hover:bg-green-600 text-white" 
          : "bg-zinc-800 hover:bg-zinc-700 text-white border border-white/5 shadow-lg shadow-black/20",
        className
      )}
      disabled={product.stock === 0 || added}
      onClick={handleAdd}
    >
      {added ? (
        <Check className={cn("h-4 w-4", showIcon && "mr-2")} />
      ) : (
        showIcon && <ShoppingCart className="mr-2 h-4 w-4" />
      )}
      {product.stock === 0 ? "Sem Estoque" : added ? "Adicionado!" : "Adicionar ao Carrinho"}
    </Button>
  );
}

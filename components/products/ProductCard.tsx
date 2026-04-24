"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AddToCartButton } from "./AddToCartButton";
import { FlashDealTimer } from "./FlashDealTimer";
import { Zap, ShoppingCart, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/db/schema";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const router = useRouter();

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
    router.push("/checkout");
  };

  const formatPrice = (val: any) => new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(val));

  const isFlashDeal = product.isFlashDeal && product.flashDealEnd && new Date(product.flashDealEnd) > new Date();

  return (
    <div className="group relative rounded-[24px] bg-[#08090C] border border-white/5 hover:border-red-500/40 transition-all duration-500 overflow-hidden flex flex-col h-full hover:shadow-[0_0_40px_rgba(220,38,38,0.15)]">
      
      {/* Cover Image */}
      <Link href={`/product/${product.id}`} className="relative aspect-[4/3] w-full block shrink-0 overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Soft bottom fade to blend with card bg */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#08090C] to-transparent opacity-80" />

        {/* Top Left Category Pill */}
        <div className="absolute top-3 left-3">
          <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 shadow-lg">
            <span className="text-[9px] font-black italic uppercase text-red-500 tracking-widest drop-shadow-md">
              {product.category}
            </span>
          </div>
        </div>

        {/* Flash Deal Alternative Badge */}
        {isFlashDeal && (
          <div className="absolute top-3 right-3">
            <div className="bg-red-600 rounded-full px-2 py-1 flex items-center shadow-[0_0_15px_rgba(220,38,38,0.6)] animate-pulse">
              <Zap className="h-3 w-3 fill-white text-white" />
            </div>
          </div>
        )}

        {/* Out of stock overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-[#0f0f13] border border-white/10 rounded-full px-5 py-2 shadow-2xl">
              <span className="text-[10px] font-black text-white uppercase tracking-widest">
                ESGOTADO
              </span>
            </div>
          </div>
        )}
      </Link>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-grow z-10">
        <Link href={`/product/${product.id}`} className="mb-4 block">
          <h3 className="text-[17px] font-bold text-white line-clamp-2 leading-snug group-hover:text-red-400 transition-colors tracking-tight">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto">
          {/* Availability Status */}
          <div className="flex items-center gap-2 mb-3">
            <div className={cn(
              "w-1.5 h-1.5 rounded-full", 
              product.stock > 0 ? "bg-[#00E676] shadow-[0_0_8px_rgba(0,230,118,0.6)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"
            )} />
            <span className={cn(
              "text-[9px] font-black uppercase tracking-[0.15em]", 
              product.stock > 0 ? "text-[#00E676]" : "text-red-500"
            )}>
              {product.stock > 0 ? "Disponível" : "Sem Estoque"}
            </span>
          </div>

          {/* Price and Action Row */}
          <div className="flex items-end justify-between border-t border-white/5 pt-4">
            {/* Price block */}
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
                  POR
                </span>
                <span className="text-2xl font-black text-white italic tracking-tighter">
                  {formatPrice(product.price)}
                </span>
              </div>
              <span className="text-[9px] font-black text-[#00E676] uppercase tracking-[0.15em] mt-1 drop-shadow-[0_0_8px_rgba(0,230,118,0.2)]">
                À vista no Pix
              </span>
            </div>

            {/* Circular Buy Button */}
            <button 
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className={cn(
                "h-11 w-11 rounded-full flex items-center justify-center transition-all duration-300 relative group/btn",
                product.stock > 0 
                  ? "bg-red-600 hover:bg-red-500 text-white hover:scale-110 shadow-[0_0_20px_rgba(220,38,38,0.4)]" 
                  : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
              )}
            >
              <ShoppingCart className={cn("h-4 w-4", product.stock > 0 && "group-hover/btn:scale-110 transition-transform")} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

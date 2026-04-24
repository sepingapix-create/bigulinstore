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

  const getCategoryIcon = (category: string) => {
    const cat = category?.toUpperCase() || "";
    if (cat.includes("STREAMING")) return "🚀";
    if (cat.includes("JOGO") || cat.includes("STEAM")) return "🎮";
    if (cat.includes("DESIGN")) return "🎨";
    return "🏮";
  };

  return (
    <div className="group relative rounded-3xl bg-[#0a0a0a] border border-white/5 hover:border-red-500/30 transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(220,38,38,0.2)] overflow-hidden flex flex-col h-full">
      
      {/* Premium Inner Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

      {/* Cover Image */}
      <Link href={`/product/${product.id}`} className="relative aspect-[4/3] w-full overflow-hidden block">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-105 group-hover:rotate-1"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Soft dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-500" />
        
        {isFlashDeal && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-red-600/90 backdrop-blur-md text-white border border-red-400/30 font-bold px-3 py-1 shadow-[0_0_20px_rgba(220,38,38,0.4)] animate-pulse uppercase tracking-wider text-[10px]">
              <Zap className="h-3 w-3 mr-1.5 fill-white" /> Oferta Flash
            </Badge>
          </div>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
            <span className="text-white font-black text-2xl tracking-widest uppercase italic rotate-[-5deg] border-y-2 border-red-500 py-2 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]">
              ESGOTADO
            </span>
          </div>
        )}

        {/* Category Pill */}
        <div className="absolute bottom-4 left-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl translate-y-2 group-hover:translate-y-0 transition-all duration-500">
             <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-300">
               {getCategoryIcon(product.category)} {product.category}
             </span>
          </div>
        </div>
      </Link>

      {/* Content Area */}
      <div className="p-5 flex-grow flex flex-col relative z-10">
        <Link href={`/product/${product.id}`} className="mb-6">
          <h3 className="text-lg font-semibold text-zinc-100 line-clamp-2 leading-snug group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-red-200 transition-all duration-300">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto flex items-end justify-between">
          <div className="flex flex-col">
             <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest mb-1">
               Acesso Imediato
             </span>
             <div className="flex items-baseline gap-1">
               <span className="text-sm font-bold text-zinc-400 mb-1">R$</span>
               <span className="text-3xl font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(255,255,255,0.1)]">
                 {formatPrice(product.price).replace("R$", "").trim()}
               </span>
             </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="p-5 pt-0 relative z-10 mt-2">
        <Button 
          onClick={handleBuyNow}
          className={cn(
            "w-full h-12 relative overflow-hidden group/btn bg-white/5 hover:bg-red-600 text-zinc-300 hover:text-white border border-white/10 hover:border-red-500 font-bold uppercase tracking-widest transition-all duration-500 rounded-xl shadow-lg",
            product.stock === 0 && "opacity-50 grayscale pointer-events-none"
          )}
        >
          <span className="relative flex items-center justify-center z-10 text-[11px] sm:text-xs">
            <ShoppingCart className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform duration-300" />
            Comprar Agora
          </span>
        </Button>
      </div>
    </div>
  );
}

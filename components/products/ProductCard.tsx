"use client";

import Image from "next/image";
import Link from "next/link";
import { Zap, ShoppingCart, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/db/schema";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
    toast.success(`${product.name} adicionado ao carrinho!`, {
      icon: <ShoppingCart className="h-4 w-4 text-primary" />,
      style: {
        background: "#0a0a0a",
        color: "#fff",
        border: "1px solid rgba(220, 38, 38, 0.2)",
      },
    });
  };

  const formatPrice = (val: any) => new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(val));

  const isFlashDeal = product.isFlashDeal && product.flashDealEnd && new Date(product.flashDealEnd) > new Date();

  return (
    <div className="group relative rounded-xl bg-[#0d0d10] border border-white/5 hover:border-red-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_-8px_rgba(220,38,38,0.25)] overflow-hidden flex flex-col h-full">

      {/* Cover Image */}
      <Link href={`/product/${product.id}`} className="relative aspect-[16/9] w-full block shrink-0 overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0d0d10] to-transparent" />

        {/* Category pill */}
        <div className="absolute top-2 left-2">
          <span className="bg-black/70 backdrop-blur-md border border-white/10 rounded-full px-2 py-0.5 text-[8px] font-black italic uppercase text-red-400 tracking-widest">
            {product.category}
          </span>
        </div>

        {/* Flash badge */}
        {isFlashDeal && (
          <div className="absolute top-2 right-2">
            <span className="bg-red-600 rounded-full p-1 flex items-center shadow-[0_0_10px_rgba(220,38,38,0.6)] animate-pulse">
              <Zap className="h-2.5 w-2.5 fill-white text-white" />
            </span>
          </div>
        )}

        {/* Out of stock */}
        {product.stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <span className="bg-black/80 border border-white/10 rounded-full px-3 py-1 text-[9px] font-black text-white uppercase tracking-widest">
              Esgotado
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-3 flex flex-col flex-grow">
        <Link href={`/product/${product.id}`} className="block mb-2">
          <h3 className="text-[13px] font-bold text-white line-clamp-1 leading-tight group-hover:text-red-400 transition-colors uppercase italic">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto">
          {/* Status dot */}
          <div className="flex items-center gap-1.5 mb-2">
            <span className={cn(
              "w-1 h-1 rounded-full",
              product.stock > 0
                ? "bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.7)]"
                : "bg-red-500"
            )} />
            <span className={cn(
              "text-[8px] font-black uppercase tracking-widest italic",
              product.stock > 0 ? "text-emerald-400" : "text-zinc-500"
            )}>
              {product.stock > 0 ? "Disponível" : "Sem estoque"}
            </span>
          </div>

          {/* Price Row */}
          <div className="border-t border-white/5 pt-2 mb-3">
            <div className="flex flex-col">
              {product.originalPrice ? (
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="text-[7px] sm:text-[8px] text-red-500 font-bold uppercase tracking-widest bg-red-500/10 px-1 rounded whitespace-nowrap">Promo</span>
                  <span className="text-[8px] sm:text-[9px] text-zinc-500 font-bold line-through whitespace-nowrap">{formatPrice(product.originalPrice)}</span>
                </div>
              ) : (
                <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-wider leading-none mb-0.5">POR</p>
              )}
              <div className="flex items-baseline gap-1.5">
                <p className="text-sm sm:text-lg font-black text-white italic tracking-tight leading-none">
                  {formatPrice(product.price)}
                </p>
                <p className="text-[7px] sm:text-[8px] font-black text-emerald-400 uppercase tracking-widest">PIX</p>
              </div>
            </div>
          </div>

          {/* Buttons Row */}
          <div className="flex gap-1.5">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              title="Adicionar ao Carrinho"
              className={cn(
                "flex items-center justify-center p-2 rounded-lg border transition-all duration-300",
                product.stock > 0
                  ? "border-white/10 bg-white/5 hover:bg-white/10 text-white hover:scale-105 active:scale-95"
                  : "border-zinc-800 text-zinc-700 cursor-not-allowed"
              )}
            >
              <ShoppingCart className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className={cn(
                "flex-1 flex items-center justify-center py-2 rounded-lg text-[9px] font-black uppercase italic tracking-wider transition-all duration-300",
                product.stock > 0
                  ? "bg-primary hover:bg-primary/90 text-white hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                  : "bg-zinc-900 text-zinc-700 cursor-not-allowed"
              )}
            >
              <span>Comprar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


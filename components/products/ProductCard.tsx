"use client";

import Image from "next/image";
import Link from "next/link";
import { Zap, ShoppingCart } from "lucide-react";
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
          <h3 className="text-[13px] font-bold text-white line-clamp-1 leading-tight group-hover:text-red-400 transition-colors">
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
              "text-[8px] font-black uppercase tracking-widest",
              product.stock > 0 ? "text-emerald-400" : "text-red-500"
            )}>
              {product.stock > 0 ? "Disponível" : "Sem estoque"}
            </span>
          </div>

          {/* Price + Button row */}
          <div className="flex items-center justify-between border-t border-white/5 pt-2 gap-2">
            <div>
              <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-wider leading-none mb-0.5">POR</p>
              <p className="text-base font-black text-white italic tracking-tight leading-none">
                {formatPrice(product.price)}
              </p>
              <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mt-0.5">PIX</p>
            </div>

            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className={cn(
                "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider transition-all duration-300",
                product.stock > 0
                  ? "bg-red-600 hover:bg-red-500 text-white hover:scale-105 shadow-[0_0_12px_rgba(220,38,38,0.35)]"
                  : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
              )}
            >
              <ShoppingCart className="h-3 w-3 shrink-0" />
              Comprar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


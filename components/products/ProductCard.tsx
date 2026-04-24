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

  // Category Icons Mapping (Optional, for extra flavor)
  const getCategoryIcon = (category: string) => {
    const cat = category?.toUpperCase() || "";
    if (cat.includes("STREAMING")) return "🚀";
    if (cat.includes("JOGO") || cat.includes("STEAM")) return "🎮";
    if (cat.includes("DESIGN")) return "🎨";
    return "🏮";
  };

  return (
    <Card className={cn(
      "flex flex-col overflow-hidden bg-black border-[#1e293b] hover:border-red-500/50 transition-all duration-500 group relative",
      "shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.15)]",
      isFlashDeal && "border-red-500/30"
    )}>
      {/* Cover Image */}
      <Link href={`/product/${product.id}`} className="relative aspect-[4/3] w-full overflow-hidden cursor-pointer">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
        
        {isFlashDeal && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-red-600 text-white border-none font-black px-3 py-1 shadow-lg animate-pulse">
              <Zap className="h-3 w-3 mr-1 fill-white" /> FLASH
            </Badge>
          </div>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
            <span className="text-white font-black text-xl tracking-tighter uppercase italic rotate-[-10deg] border-4 border-white/20 px-4 py-1">
              ESGOTADO
            </span>
          </div>
        )}
      </Link>

      <CardContent className="p-5 flex-grow flex flex-col gap-3">
        {/* Category Header */}
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500">
          <span>{getCategoryIcon(product.category)} CATALOGO | {product.category}</span>
        </div>

        {/* Title */}
        <Link href={`/product/${product.id}`}>
          <h3 className="text-lg font-bold text-white line-clamp-2 leading-tight group-hover:text-red-500 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Price Section */}
        <div className="mt-auto pt-2 flex items-center justify-between">
          <div className="flex flex-col">
             <span className="text-2xl font-black text-[#facc15] drop-shadow-[0_0_10px_rgba(250,204,21,0.3)]">
               {formatPrice(product.price)}+
             </span>
             <span className="text-[10px] text-muted-foreground font-medium uppercase">
               À vista no Pix
             </span>
          </div>
          
          {/* Status/Decorative Icon */}
          <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
             <LayoutGrid className="h-5 w-5 text-red-500 opacity-80" />
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Button 
          onClick={handleBuyNow}
          className={cn(
            "w-full h-12 bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-500 hover:to-yellow-500 text-white font-black uppercase italic tracking-tighter transition-all duration-300 shadow-lg shadow-red-600/20 active:scale-[0.98]",
            product.stock === 0 && "opacity-50 grayscale pointer-events-none"
          )}
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          COMPRAR AGORA
        </Button>
      </CardFooter>
      
      {/* Glow effect on hover */}
      <div className="absolute inset-0 pointer-events-none border border-transparent group-hover:border-red-500/20 transition-all duration-500 rounded-xl" />
    </Card>
  );
}

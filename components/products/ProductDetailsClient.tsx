"use client";

import { AddToCartButton } from "./AddToCartButton";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { Zap, Shield, CreditCard, Check, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/db/schema";

interface ProductDetailsClientProps {
  product: Product;
}

export function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const { addItem } = useCartStore();
  const router = useRouter();

  const handleBuyNow = () => {
    addItem(product, 1);
    router.push("/checkout"); 
  };

  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(product.price));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column - 7/12 */}
      <div className="lg:col-span-8 space-y-8">
        {/* Breadcrumbs / Back button */}
        <Link 
          href="/" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar para o catálogo
        </Link>

        {/* Hero Section (Image & Basic Info) */}
        <div className="group bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:border-primary/30">
          <div className="relative aspect-video w-full overflow-hidden">
            <Image 
              src={product.imageUrl} 
              alt={product.name} 
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              priority
            />
            <div className="absolute top-6 left-6 z-10">
              <span className="px-4 py-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest text-white group-hover:bg-primary group-hover:border-primary/50 transition-all">
                Entrega Automática
              </span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-8 space-y-6 transition-all hover:border-primary/20 hover:shadow-[0_0_30px_rgba(220,38,38,0.05)]">
          <div className="flex items-center gap-3 border-b border-[#1A1A1A] pb-4">
            <Zap className="h-5 w-5 text-primary animate-pulse" />
            <h2 className="text-xl font-bold italic uppercase tracking-tighter">Descrição do Produto</h2>
          </div>
          <div className="prose prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {product.description}
            </p>
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-sm text-green-400/80 hover:text-green-400 transition-colors cursor-default group">
                <Check className="h-4 w-4 transition-transform group-hover:scale-125" /> 
                <span>Acesso imediato após a confirmação</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-green-400/80 hover:text-green-400 transition-colors cursor-default group">
                <Check className="h-4 w-4 transition-transform group-hover:scale-125" /> 
                <span>Suporte premium incluso</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-green-400/80 hover:text-green-400 transition-colors cursor-default group">
                <Check className="h-4 w-4 transition-transform group-hover:scale-125" /> 
                <span>Garantia de funcionamento</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - 4/12 */}
      <div className="lg:col-span-4 space-y-6">
        {/* Purchase Card */}
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-8 shadow-2xl transition-all duration-500 hover:border-primary/50 hover:shadow-primary/10 hover:-translate-y-1">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-black tracking-tighter mb-2 uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">{product.name}</h1>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase border border-primary/20">
                  {product.category}
                </span>
                <span className="text-xs text-muted-foreground italic">
                  {product.stock} unidades em estoque
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground italic">Preço individual</p>
              {product.originalPrice && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest rounded border border-red-500/20">Promoção</span>
                  <span className="text-lg text-zinc-500 font-bold line-through">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(product.originalPrice))}
                  </span>
                </div>
              )}
              <div className="flex items-end gap-2">
                <span className="text-5xl font-black text-white tracking-tighter">{formattedPrice}</span>
                <span className="text-sm text-muted-foreground mb-2 italic">à vista no PIX</span>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <Button 
                onClick={handleBuyNow}
                className="w-full h-16 text-lg font-black uppercase italic bg-primary hover:bg-primary/90 text-white shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-all hover:scale-[1.03] active:scale-95"
                disabled={product.stock === 0}
              >
                Comprar Agora
              </Button>
              <AddToCartButton 
                product={product} 
                className="w-full h-14 text-lg font-bold transition-all hover:scale-[1.02]"
                showIcon={true}
              />
            </div>
          </div>
        </div>

        {/* Benefits Badges */}
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-card/30 border border-border/10 transition-all hover:bg-primary/5 hover:border-primary/30 hover:translate-x-1 cursor-default group">
            <Zap className="h-6 w-6 text-primary shrink-0 transition-transform group-hover:scale-125" />
            <div>
              <h4 className="text-sm font-bold uppercase italic">Entrega Imediata</h4>
              <p className="text-xs text-muted-foreground mt-1">Receba seus dados instantaneamente após o pagamento.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-xl bg-card/30 border border-border/10 transition-all hover:bg-green-500/5 hover:border-green-500/30 hover:translate-x-1 cursor-default group">
            <Shield className="h-6 w-6 text-green-500 shrink-0 transition-transform group-hover:scale-125" />
            <div>
              <h4 className="text-sm font-bold uppercase italic">Compra Segura</h4>
              <p className="text-xs text-muted-foreground mt-1">Seus dados estão protegidos por criptografia de ponta-a-ponta.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-xl bg-card/30 border border-border/10 transition-all hover:bg-purple-500/5 hover:border-purple-500/30 hover:translate-x-1 cursor-default group">
            <CreditCard className="h-6 w-6 text-purple-500 shrink-0 transition-transform group-hover:scale-125" />
            <div>
              <h4 className="text-sm font-bold uppercase italic">Múltiplas Formas</h4>
              <p className="text-xs text-muted-foreground mt-1">Aceitamos PIX, Cartão de Crédito e Criptomoedas.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

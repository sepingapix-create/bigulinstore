"use client";

import { useCartStore } from "@/store/cartStore";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function CartSheet() {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems, clearCart } = useCartStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Wait for hydration to avoid mismatch with localStorage
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const formatCurrency = (val: number) => new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(val);

  const handleCheckout = () => {
    if (items.length === 0) return;
    setIsOpen(false);
    router.push("/checkout");
  };

  if (!isHydrated) {
    return (
      <Button variant="ghost" size="icon" className="group relative hover:bg-muted/50 rounded-full transition-all duration-300 hover:scale-110 active:scale-90">
        <ShoppingCart className="h-5 w-5 transition-all duration-300 group-hover:text-primary group-hover:drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
      </Button>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger 
        render={
          <button className="group relative hover:bg-muted/50 rounded-full cursor-pointer inline-flex items-center justify-center h-9 w-9 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:scale-110 active:scale-90 border-0 bg-transparent">
            <ShoppingCart className="h-5 w-5 transition-all duration-300 group-hover:text-primary group-hover:drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
            {totalItems > 0 && (
              <Badge 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-primary text-primary-foreground border-2 border-background transition-transform duration-300 group-hover:scale-110 group-hover:animate-pulse"
              >
                {totalItems}
              </Badge>
            )}
            <span className="sr-only">Carrinho</span>
          </button>
        }
      />
      
      <SheetContent className="w-full sm:max-w-md bg-zinc-950/95 backdrop-blur-2xl border-l-white/5 flex flex-col p-0 overflow-hidden">
        <SheetHeader className="p-6 pb-4 border-b border-white/5">
          <SheetTitle className="flex items-center gap-3 text-xl font-bold text-white">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ShoppingCart className="h-5 w-5 text-primary" />
            </div>
            Seu Carrinho ({totalItems})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground text-center px-6">
            <div className="bg-white/5 p-8 rounded-full mb-6">
              <ShoppingCart className="h-16 w-16 opacity-10" />
            </div>
            <p className="text-xl font-bold text-white uppercase italic tracking-tighter mb-2">Seu carrinho está vazio</p>
            <p className="text-sm leading-relaxed max-w-[240px]">Explore o catálogo do Império para adicionar assinaturas.</p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6">
              <div className="py-6 space-y-8">
                {items.map((item) => (
                  <div key={item.product.id} className="group relative flex gap-4 transition-all">
                    <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0 group-hover:border-primary/30 transition-colors">
                      <Image 
                        src={item.product.imageUrl} 
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm text-white truncate group-hover:text-primary transition-colors uppercase italic">{item.product.name}</h4>
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5 truncate italic">
                            {item.product.category}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-0.5">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
                            onClick={() => item.quantity > 1 ? updateQuantity(item.product.id, item.quantity - 1) : removeItem(item.product.id)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-xs font-black w-6 text-center tabular-nums">{item.quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <p className="font-black text-sm text-primary tabular-nums">
                            {formatCurrency(Number(item.product.price) * item.quantity)}
                          </p>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 transition-all rounded-full" 
                            onClick={() => removeItem(item.product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-6 bg-white/[0.02] border-t border-white/5 mt-auto space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-medium italic">
                  <span className="text-zinc-500">Subtotal</span>
                  <span className="text-zinc-300">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-lg font-black uppercase italic text-white tracking-tighter">Total PIX</span>
                  <span className="text-2xl font-black text-white tabular-nums drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
              </div>
              
              <Button 
                className="w-full h-14 text-sm font-black uppercase italic bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-xl shadow-red-600/20 transition-all hover:scale-[1.02] active:scale-95 group rounded-2xl"
                onClick={handleCheckout}
              >
                <CheckCircle2 className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Finalizar Compra
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

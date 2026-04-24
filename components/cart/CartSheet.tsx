"use client";

import { useCartStore } from "@/store/cartStore";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2, Plus, Minus, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

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

  const formattedTotal = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(totalPrice);

  const handleCheckout = () => {
    if (items.length === 0) return;
    setIsOpen(false);
    router.push("/checkout");
  };

  if (!isHydrated) {
    return (
      <Button variant="ghost" size="icon" className="relative hover:bg-muted/50 rounded-full">
        <ShoppingCart className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="relative hover:bg-muted/50 rounded-full cursor-pointer inline-flex items-center justify-center h-9 w-9 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
        <ShoppingCart className="h-5 w-5" />
        {totalItems > 0 && (
          <Badge 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-primary text-primary-foreground border-2 border-background"
          >
            {totalItems}
          </Badge>
        )}
        <span className="sr-only">Carrinho</span>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg bg-background/95 backdrop-blur-xl border-l-border/50 flex flex-col">
        <SheetHeader className="pb-4 border-b border-border/50">
          <SheetTitle className="flex items-center gap-2 text-xl font-bold">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Seu Carrinho
            <Badge variant="secondary" className="ml-2 bg-muted/50">{totalItems} itens</Badge>
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <ShoppingCart className="h-16 w-16 mb-4 opacity-20" />
            <p className="text-lg font-medium">Seu carrinho está vazio</p>
            <p className="text-sm">Adicione algumas assinaturas para continuar.</p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6 py-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4 p-3 rounded-lg border border-border/50 bg-card/30">
                    <div className="relative h-20 w-20 rounded-md overflow-hidden bg-muted/20 shrink-0">
                      <Image 
                        src={item.product.imageUrl} 
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-semibold text-sm line-clamp-1">{item.product.name}</h4>
                        <p className="text-primary font-bold text-sm mt-1">
                          {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(item.product.price))}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 bg-muted/50 rounded-md p-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 rounded-sm"
                            onClick={() => item.quantity > 1 ? updateQuantity(item.product.id, item.quantity - 1) : removeItem(item.product.id)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 rounded-sm"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => removeItem(item.product.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="pt-6 border-t border-border/50 mt-auto">
              <div className="flex justify-between items-end mb-6">
                <span className="text-muted-foreground font-medium">Subtotal</span>
                <span className="text-2xl font-black text-foreground">{formattedTotal}</span>
              </div>
              <Button 
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40"
                onClick={handleCheckout}
              >
                <CreditCard className="mr-2 h-5 w-5" /> Ir para o Checkout
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

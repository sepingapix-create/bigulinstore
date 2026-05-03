"use client";

import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "../../components/ui/separator";
import { ShoppingCart, ArrowLeft, CreditCard, ShieldCheck, Zap, Loader2, Check, Plus, Minus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tag, Ticket, FileText } from "lucide-react";
import { processCheckout, validateCouponAction } from "@/actions/checkout";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { items, getTotalPrice, getTotalItems, clearCart, updateQuantity, removeItem } = useCartStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; percentage: number } | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="bg-card/50 p-8 rounded-full mb-6">
          <ShoppingCart className="h-16 w-16 text-muted-foreground opacity-20" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Seu carrinho está vazio</h1>
        <p className="text-muted-foreground mb-8 text-center max-w-md">
          Você ainda não adicionou nenhuma assinatura. Explore nosso catálogo para encontrar as melhores ofertas.
        </p>
        <Link href="/">
          <Button size="lg" className="rounded-full px-8">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Catálogo
          </Button>
        </Link>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const discountAmount = appliedCoupon ? (subtotal * appliedCoupon.percentage) / 100 : 0;
  const totalPrice = subtotal - discountAmount;

  const formatBRL = (val: number) => new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(val);

  const handleApplyCoupon = async () => {
    if (!couponInput) return;
    setIsValidating(true);
    const result = await validateCouponAction(couponInput);
    if (result.success) {
      setAppliedCoupon({ code: result.code!, percentage: result.discountPercentage! });
      toast.success(`Cupom ${result.code} aplicado: ${result.discountPercentage}% de desconto!`);
    } else {
      toast.error(result.message);
    }
    setIsValidating(false);
  };

  const handleFinalize = async () => {
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      const checkoutItems = items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }));
      formData.append("items", JSON.stringify(checkoutItems));
      if (appliedCoupon) {
        formData.append("couponCode", appliedCoupon.code);
      }
      
      // Append contact info
      if (contactName) formData.append("contactName", contactName);
      if (contactEmail) formData.append("contactEmail", contactEmail);

      const result = await processCheckout({ success: false }, formData);
      
      if (result.success && result.orderId) {
        clearCart();
        toast.success("Pedido criado com sucesso!");
        router.push(`/order/${result.orderId}?pixCode=${result.pixCode}`);
      } else {
        toast.error(result.message || "Erro ao processar pedido");
        if (result.message?.includes("logado")) {
            router.push("/login?callbackUrl=/checkout");
        }
      }
    } catch (error) {
      toast.error("Ocorreu um erro inesperado");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex-1 pt-8 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted/50">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-black tracking-tight uppercase">Finalizar Compra</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="bg-card/30 border-border/50 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:border-primary/20">
              <CardHeader className="border-b border-border/50 bg-muted/10 py-4">
                <CardTitle className="text-lg flex items-center gap-2 italic uppercase font-black tracking-tighter">
                  <ShoppingCart className="h-5 w-5 text-primary animate-pulse" />
                  Itens do Pedido ({getTotalItems()})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/30">
                  {items.map((item) => (
                    <div key={item.product.id} className="group flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-6 transition-all duration-300 hover:bg-primary/5 cursor-default">
                      <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-xl overflow-hidden bg-muted/20 border border-border/50 shrink-0 transition-transform duration-500 group-hover:scale-105 group-hover:border-primary/30 mx-auto sm:mx-0">
                        <Image 
                          src={item.product.imageUrl} 
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col py-0 sm:py-1 text-center sm:text-left">
                        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-2">
                          <div>
                            <Badge variant="outline" className="mb-1 sm:mb-2 bg-primary/5 text-primary border-primary/20 text-[8px] sm:text-[10px] uppercase font-bold group-hover:bg-primary group-hover:text-white transition-all mx-auto sm:mx-0">
                              {item.product.category}
                            </Badge>
                            <h3 className="font-bold text-lg sm:text-xl uppercase italic tracking-tighter group-hover:text-primary transition-colors">{item.product.name}</h3>
                          </div>
                          <p className="font-black text-xl sm:text-2xl text-primary tabular-nums transition-transform group-hover:scale-110">
                            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(item.product.price) * item.quantity)}
                          </p>
                        </div>
                        <div className="mt-4 sm:mt-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                          <div className="flex items-center bg-muted/20 border border-border/30 rounded-lg p-1 w-fit">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 rounded-md hover:bg-primary/20 hover:text-primary transition-colors"
                              onClick={() => {
                                if (item.quantity > 1) {
                                  updateQuantity(item.product.id, item.quantity - 1);
                                } else {
                                  removeItem(item.product.id);
                                }
                              }}
                            >
                              {item.quantity === 1 ? <Trash2 className="h-3 w-3 text-red-500" /> : <Minus className="h-3 w-3" />}
                            </Button>
                            <span className="w-8 text-center text-sm font-black tabular-nums">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 rounded-md hover:bg-primary/20 hover:text-primary transition-colors"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground italic group-hover:text-white transition-colors">Entrega Automática ⚡</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information Section */}
            <Card className="bg-card/30 border-border/50 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:border-primary/20">
              <CardHeader className="border-b border-border/50 bg-muted/10 py-4">
                <CardTitle className="text-lg flex items-center gap-2 italic uppercase font-black tracking-tighter">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  Dados de Entrega
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Preencha seus dados para receber o acesso das contas.
                </p>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactName" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Nome Completo</Label>
                    <Input 
                      id="contactName"
                      placeholder="Ex: João da Silva"
                      className="bg-muted/20 border-border/50 focus:border-primary transition-all rounded-xl"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">E-mail para Entrega</Label>
                    <Input 
                      id="contactEmail"
                      type="email"
                      placeholder="seu@email.com"
                      className="bg-muted/20 border-border/50 focus:border-primary transition-all rounded-xl"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Benefits section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="group bg-card/20 p-5 rounded-xl border border-border/30 flex items-center gap-3 transition-all duration-300 hover:bg-blue-500/5 hover:border-blue-500/30 hover:-translate-y-1 cursor-default">
                <div className="bg-blue-500/10 p-2 rounded-lg transition-transform group-hover:scale-125">
                  <Zap className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">Entrega</p>
                  <p className="text-sm font-bold uppercase italic">Instantânea</p>
                </div>
              </div>
              <div className="group bg-card/20 p-5 rounded-xl border border-border/30 flex items-center gap-3 transition-all duration-300 hover:bg-green-500/5 hover:border-green-500/30 hover:-translate-y-1 cursor-default">
                <div className="bg-green-500/10 p-2 rounded-lg transition-transform group-hover:scale-125">
                  <ShieldCheck className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">Compra</p>
                  <p className="text-sm font-bold uppercase italic">100% Segura</p>
                </div>
              </div>
              <div className="group bg-card/20 p-5 rounded-xl border border-border/30 flex items-center gap-3 transition-all duration-300 hover:bg-purple-500/5 hover:border-purple-500/30 hover:-translate-y-1 cursor-default">
                <div className="bg-purple-500/10 p-2 rounded-lg transition-transform group-hover:scale-125">
                  <Check className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">Suporte</p>
                  <p className="text-sm font-bold uppercase italic">Premium</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Right Side */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <Card className="border-border/50 bg-card/40 backdrop-blur-md shadow-2xl shadow-primary/5 transition-all duration-500 hover:border-primary/50 hover:shadow-primary/10">
                <CardHeader className="pb-2 border-b border-border/10 mb-4 bg-muted/5">
                  <CardTitle className="text-lg uppercase italic font-black tracking-tighter">Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm italic">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-bold">{formatBRL(subtotal)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-sm text-green-500 italic">
                      <span className="flex items-center gap-1 font-bold">
                        <Tag className="h-3 w-3" /> 
                        Desconto ({appliedCoupon.percentage}%)
                      </span>
                      <span className="font-black">-{formatBRL(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm italic">
                    <span className="text-muted-foreground font-medium">Taxas</span>
                    <span className="font-bold text-green-500 uppercase">Grátis</span>
                  </div>
                  <Separator className="bg-border/30" />
                  <div className="flex justify-between items-end pt-2 group">
                    <span className="text-lg font-black uppercase italic">Total</span>
                    <span className="text-4xl font-black text-primary drop-shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-transform group-hover:scale-105">
                      {formatBRL(totalPrice)}
                    </span>
                  </div>

                  <div className="pt-4">
                    <Label htmlFor="coupon" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 block italic">
                      Cupom de Desconto
                    </Label>
                    <div className="flex gap-2 group">
                      <div className="relative flex-1">
                        <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                        <Input 
                          id="coupon"
                          placeholder="Digite seu cupom"
                          className="pl-9 bg-muted/20 border-border/50 focus:border-primary transition-all rounded-xl"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          disabled={appliedCoupon !== null || isValidating}
                        />
                      </div>
                      <Button 
                        type="button" 
                        variant="secondary"
                        className="rounded-xl font-bold uppercase italic px-4 hover:bg-primary hover:text-white transition-all"
                        onClick={handleApplyCoupon}
                        disabled={!couponInput || appliedCoupon !== null || isValidating}
                      >
                        {isValidating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Aplicar"}
                      </Button>
                    </div>
                  </div>

                  <div className="group bg-muted/30 p-5 rounded-2xl space-y-3 mt-4 border border-border/20 transition-all hover:bg-muted/40 hover:border-primary/20">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">Forma de Pagamento</p>
                    <div className="flex items-center gap-3">
                      <div className="bg-background p-2.5 rounded-xl border border-border/50 transition-transform group-hover:scale-110 group-hover:border-primary/50">
                        <Image src="https://logopng.com.br/logos/pix-106.png" alt="PIX" width={40} height={40} className="invert brightness-0" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-black uppercase italic tracking-tight">PIX Copia e Cola</p>
                        <p className="text-[10px] text-muted-foreground italic">Aprovação em até 30 segundos</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3 pb-8">
                  {/* Terms acceptance */}
                  <button
                    type="button"
                    onClick={() => setTermsAccepted(v => !v)}
                    className={`w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all duration-300 ${
                      termsAccepted
                        ? "border-green-500/40 bg-green-500/5 shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                        : "border-border/40 bg-muted/10 hover:border-primary/30 hover:bg-primary/5"
                    }`}
                  >
                    <div className={`mt-0.5 shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-300 ${
                      termsAccepted ? "border-green-500 bg-green-500" : "border-zinc-600"
                    }`}>
                      {termsAccepted && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Li e concordo com os{" "}
                      <Link
                        href="/termos"
                        target="_blank"
                        onClick={e => e.stopPropagation()}
                        className="text-primary hover:underline font-bold inline-flex items-center gap-1"
                      >
                        <FileText className="h-3 w-3" /> Termos e Condições da Compra
                      </Link>
                      . Estou ciente da política de não reembolso e das regras de uso dos serviços.
                    </p>
                  </button>

                  <Button 
                    className="w-full h-16 text-xl font-black uppercase italic bg-primary hover:bg-primary/90 text-white shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-all hover:scale-[1.03] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                    disabled={isProcessing || !contactName || !contactEmail || !termsAccepted}
                    onClick={handleFinalize}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Processando...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-6 w-6" /> Confirmar e Pagar
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              {/* Secure badge */}
              <div className="flex items-center justify-center gap-2 text-muted-foreground opacity-40 transition-opacity hover:opacity-100 cursor-default group">
                <ShieldCheck className="h-4 w-4 transition-transform group-hover:scale-125" />
                <span className="text-[10px] uppercase font-black tracking-widest italic">Ambiente de Pagamento Seguro</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

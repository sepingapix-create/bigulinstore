import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap, ShoppingCart, Rocket, User, ShieldCheck, Target, Heart, Instagram, Twitter, Send, MessageSquare, Bookmark } from "lucide-react";
import { db } from "@/db";
import { products } from "@/db/schema";
import { desc, sql } from "drizzle-orm";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { GlobalFlashTimer } from "@/components/GlobalFlashTimer";
import { SupportButton } from "@/components/layout/SupportButton";

export default async function Home() {
  const allProducts = await db.select({
    id: products.id,
    name: products.name,
    description: products.description,
    price: products.price,
    category: products.category,
    stock: products.stock,
    imageUrl: products.imageUrl,
    createdAt: products.createdAt,
    updatedAt: products.updatedAt,
    originalPrice: products.originalPrice,
    isFlashDeal: products.isFlashDeal,
    flashDealEnd: products.flashDealEnd,
  }).from(products).orderBy(desc(products.createdAt));
  
  const flashDealProducts = allProducts.filter(p => p.isFlashDeal);
  const regularProducts = allProducts.filter(p => !p.isFlashDeal);

  // Group regular products by category
  const productsByCategory = regularProducts.reduce((acc, product) => {
    const category = product.category || "Outros";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<string, typeof regularProducts>);

  const categories = Object.keys(productsByCategory).sort((a, b) => {
    const aLower = a.toLowerCase();
    const bLower = b.toLowerCase();
    
    // 1st priority: Streaming
    if (aLower.includes("streaming") && !bLower.includes("streaming")) return -1;
    if (!aLower.includes("streaming") && bLower.includes("streaming")) return 1;
    
    // 2nd priority: Jogos/Games
    if (aLower.includes("jogo") && !bLower.includes("jogo")) return -1;
    if (!aLower.includes("jogo") && bLower.includes("jogo")) return 1;

    // Default: Alphabetical
    return a.localeCompare(b);
  });

  // Find the earliest flash deal end date to show on the global timer
  const activeFlashDeals = flashDealProducts.filter(p => p.flashDealEnd && p.flashDealEnd > new Date());
  const earliestFlashDeal = activeFlashDeals.length > 0 
    ? activeFlashDeals.reduce((prev, curr) => (prev.flashDealEnd! < curr.flashDealEnd! ? prev : curr))
    : null;

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 overflow-hidden">
          {/* Decorative gradients */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 italic animate-in fade-in slide-in-from-top-12 duration-1000 ease-out">
              Império <br />
              <span className="inline-block pb-2 pr-4 text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 animate-pulse">
                Bigulin
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
              Desperte o poder do entretenimento premium com entrega instantânea e o selo de qualidade do Dragão.
            </p>
            <div className="flex items-center justify-center gap-4 animate-in fade-in zoom-in-95 duration-1000 delay-500 fill-mode-both">
              <Link href="#catalogo">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 h-12 text-lg font-semibold shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] hover:scale-110 active:scale-95">
                  Ver Catálogo
                </Button>
              </Link>
              <Link href="#como-funciona">
                <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-lg font-medium border-red-500/20 hover:bg-red-500/10 transition-all text-red-500 hover:scale-105 active:scale-95">
                  Como Funciona <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <SupportButton variant="inline" />
            </div>
          </div>
        </section>
        

        {/* Flash Deals Section */}
        {activeFlashDeals.length > 0 && (
          <section className="py-20 relative overflow-hidden bg-red-950/5 border-t border-red-500/10">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="container mx-auto px-4">
              <ScrollReveal>
              <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
                <div className="text-center md:text-left">
                  <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4 border border-red-500/20">
                    <Zap className="h-4 w-4 fill-red-500" /> Ofertas Relâmpago
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black tracking-tight italic">
                    CORRA ANTES QUE <span className="text-red-500">ACABE!</span>
                  </h2>
                </div>
                <div className="bg-card/40 backdrop-blur-md p-4 rounded-2xl border border-border/50 flex items-center gap-4">
                  <p className="text-xs font-bold text-muted-foreground uppercase vertical-text">Expira em</p>
                  <GlobalFlashTimer targetDate={earliestFlashDeal!.flashDealEnd!.toISOString()} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {activeFlashDeals.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              </ScrollReveal>
            </div>
          </section>
        )}

        {/* Catalog Section */}
        <section id="catalogo" className="py-20 bg-card/5 border-t border-border/10">
          <div className="container mx-auto px-4">
            <ScrollReveal direction="right">
              <div className="mb-16 text-center">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 italic">
                  NOSSO <span className="text-primary">CATÁLOGO</span> IMPERIAL
                </h2>
                <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
              </div>
            </ScrollReveal>

            {categories.length === 0 && flashDealProducts.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground italic">
                Nenhum produto disponível no momento. Volte mais tarde!
              </div>
            ) : (
              <div className="space-y-24">
                {categories.map((category) => (
                  <div key={category} className="space-y-12">
                    <ScrollReveal>
                      <div className="flex justify-center">
                        <div className="inline-flex items-center gap-3 bg-black/50 backdrop-blur-xl border-2 border-red-600/30 px-8 py-3 rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.15)] group hover:border-red-500 transition-all duration-500">
                          <Bookmark className="h-6 w-6 text-red-500 fill-red-500/20 group-hover:scale-110 transition-transform" />
                          <h3 className="text-xl md:text-2xl font-black tracking-widest text-red-100 uppercase italic">
                            {category}
                          </h3>
                        </div>
                      </div>
                    </ScrollReveal>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {productsByCategory[category].map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* How it Works Section */}
        <section id="como-funciona" className="py-24 bg-card/10 backdrop-blur-sm relative overflow-hidden border-t border-border/20">
           <div className="absolute top-0 right-0 p-24 opacity-5 rotate-12">
              <Zap className="h-64 w-64 text-yellow-500" />
           </div>
           
           <div className="container mx-auto px-4 relative z-10">
              <ScrollReveal>
              <div className="text-center mb-16">
                 <Badge className="bg-red-600/10 text-red-600 border-red-600/20 px-4 py-1 rounded-full mb-4">O CAMINHO DO DRAGÃO</Badge>
                 <h2 className="text-4xl md:text-5xl font-black italic uppercase mb-4">Como o Império Funciona</h2>
                 <p className="text-muted-foreground max-w-xl mx-auto">
                    Nosso sistema é otimizado para velocidade. Do pagamento à entrega, tudo acontece em questão de minutos.
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                 {[
                   { step: "01", title: "Escolha", desc: "Selecione seu serviço premium preferido em nosso catálogo imperial.", icon: ShoppingCart },
                   { step: "02", title: "Pagamento", desc: "Pague via PIX com segurança. O sistema identifica seu pagamento instantaneamente.", icon: Zap },
                   { step: "03", title: "Processamento", desc: "Nossos guardiões preparam seu acesso único com a máxima velocidade.", icon: User },
                   { step: "04", title: "Domínio", desc: "Receba seus dados de acesso no perfil e e-mail. Agora o império é seu!", icon: Rocket }
                 ].map((item, idx) => (
                   <div key={idx} className={cn(
                      "relative group p-6 rounded-3xl border border-red-500/10 bg-card/30 hover:bg-card/50 transition-all duration-500 hover:border-red-500/30 hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-500/10 animate-in fade-in slide-in-from-bottom-12 fill-mode-both",
                      idx === 0 ? "delay-0" : idx === 1 ? "delay-100" : idx === 2 ? "delay-200" : "delay-300"
                    )}>
                      <div className="absolute -top-4 -left-4 w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center font-black text-white shadow-lg shadow-red-600/20 group-hover:rotate-12 transition-transform">
                         {item.step}
                      </div>
                      <div className="mb-6 pt-4">
                         <item.icon className="h-10 w-10 text-yellow-500 mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500" />
                         <h4 className="text-xl font-bold uppercase italic mb-2 group-hover:text-primary transition-colors">{item.title}</h4>
                         <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
              </ScrollReveal>
           </div>
        </section>

        <section id="sobre-nos" className="py-24 border-t border-red-500/10">
          <div className="container mx-auto px-4">
            <ScrollReveal direction="left">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="relative">
                  <div className="absolute -top-10 -left-10 w-40 h-40 bg-red-600/10 blur-[60px] rounded-full" />
                  <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 mb-4 px-4">NOSSA HONRA</Badge>
                  <h2 className="text-4xl md:text-5xl font-black italic uppercase mb-6 leading-tight">
                    Forjados na <span className="text-red-500">Transparência</span> e Rapidez
                  </h2>
                  <div className="space-y-6 text-muted-foreground leading-relaxed">
                    <p>
                      A <span className="text-foreground font-bold">Bigulin</span> nasceu com uma missão clara: democratizar o acesso ao entretenimento premium com a honra e a velocidade que nossos clientes merecem.
                    </p>
                    <p>
                      Em um mercado saturado de incertezas, nós nos erguemos como um porto seguro. Cada assinatura entregue pelo nosso império carrega o selo de autenticidade e suporte incondicional. Não vendemos apenas acessos, vendemos tranquilidade e diversão imediata.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                    <div className="p-4 rounded-2xl bg-card/40 border border-border/50">
                      <ShieldCheck className="h-6 w-6 text-red-500 mb-2" />
                      <h5 className="font-bold text-sm uppercase italic">Segurança</h5>
                      <p className="text-[10px] text-muted-foreground">Proteção total em cada transação.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-card/40 border border-border/50">
                      <Target className="h-6 w-6 text-yellow-500 mb-2" />
                      <h5 className="font-bold text-sm uppercase italic">Precisão</h5>
                      <p className="text-[10px] text-muted-foreground">Entrega instantânea via sistema.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-card/40 border border-border/50">
                      <Heart className="h-6 w-6 text-red-500 mb-2" />
                      <h5 className="font-bold text-sm uppercase italic">Paixão</h5>
                      <p className="text-[10px] text-muted-foreground">Suporte que realmente se importa.</p>
                    </div>
                  </div>
                </div>
                
                <div className="relative group">
                   <div className="absolute inset-0 bg-gradient-to-tr from-red-600/20 to-transparent blur-2xl rounded-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
                   <div className="relative aspect-square md:aspect-video rounded-3xl border-2 border-red-500/20 overflow-hidden bg-muted/20 flex items-center justify-center p-8 text-center">
                      <div>
                         <div className="text-7xl mb-4">🏮</div>
                         <h3 className="text-2xl font-black italic uppercase text-red-500 mb-2">O Selo do Dragão</h3>
                         <p className="text-sm text-muted-foreground max-w-xs mx-auto italic">
                            "Onde há fumaça, há fogo. Onde há Bigulin, há qualidade garantida."
                         </p>
                      </div>
                   </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      {/* Social Media Section */}
      <section className="py-12 border-t border-border/40 bg-card/10">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-black italic uppercase mb-8">Siga o Império</h3>
          <div className="flex justify-center gap-6">
            <Link href="#" className="group p-5 rounded-3xl bg-muted/20 border border-border/50 hover:border-pink-500/50 hover:bg-pink-500/5 hover:text-pink-500 transition-all duration-500 hover:-translate-y-2 shadow-xl hover:shadow-pink-500/20">
              <Instagram className="h-7 w-7 transition-all duration-500 group-hover:rotate-12 group-hover:scale-125" />
            </Link>
            <Link href="#" className="group p-5 rounded-3xl bg-muted/20 border border-border/50 hover:border-blue-400/50 hover:bg-blue-400/5 hover:text-blue-400 transition-all duration-500 hover:-translate-y-2 shadow-xl hover:shadow-blue-400/20">
              <Twitter className="h-7 w-7 transition-all duration-500 group-hover:-rotate-12 group-hover:scale-125" />
            </Link>
            <Link href="#" className="group p-5 rounded-3xl bg-muted/20 border border-border/50 hover:border-sky-500/50 hover:bg-sky-500/5 hover:text-sky-500 transition-all duration-500 hover:-translate-y-2 shadow-xl hover:shadow-sky-500/20">
              <Send className="h-7 w-7 transition-all duration-500 group-hover:rotate-12 group-hover:scale-125 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
            <Link href="https://wa.me/5500000000000" target="_blank" className="group p-5 rounded-3xl bg-muted/20 border border-border/50 hover:border-green-500/50 hover:bg-green-500/5 hover:text-green-500 transition-all duration-500 hover:-translate-y-2 shadow-xl hover:shadow-green-500/20">
              <svg 
                viewBox="0 0 24 24" 
                className="h-7 w-7 transition-all duration-500 group-hover:scale-125"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </Link>
          </div>
          <p className="mt-8 text-sm text-muted-foreground italic">Fique por dentro das novidades e sorteios exclusivos do Dragão.</p>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="border-t border-border/40 bg-background py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Bigulin. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

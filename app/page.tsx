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
import { HeroVector } from "@/components/animations/HeroVector";

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

  // Group all products by category (including flash deals)
  const productsByCategory = allProducts.reduce((acc, product) => {
    const category = product.category || "Outros";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<string, typeof allProducts>);

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
        <section className="relative pt-20 pb-16 overflow-hidden min-h-[60vh] flex items-center">
          {/* Animated SVG Vector */}
          <HeroVector />

          {/* Soft background radial */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-primary/10 blur-[140px] rounded-full pointer-events-none" />

          <div className="container mx-auto px-4 relative z-10 text-center w-full">
            {/* Badge above title */}
            <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-600/20 text-red-500 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 animate-in fade-in slide-in-from-top-4 duration-700">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_6px_rgba(220,38,38,0.8)] animate-pulse" />
              Entrega instantânea · Qualidade imperial
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 italic animate-in fade-in slide-in-from-top-12 duration-1000 ease-out leading-none">
              IMPÉRIO <br />
              <span className="inline-block pb-2 pr-4 text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-yellow-500 to-red-600">
                BIGULIN
              </span>
            </h1>

            <p className="text-base text-muted-foreground max-w-xl mx-auto mb-6 font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both leading-relaxed">
              Desperte o poder do entretenimento premium com entrega
              instantânea e o selo de qualidade do Dragão.
            </p>

            <div className="flex flex-row items-center justify-center gap-3 animate-in fade-in zoom-in-95 duration-1000 delay-500 fill-mode-both">
              <Link href="#catalogo">
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-7 h-11 text-sm font-bold shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] hover:scale-110 active:scale-95">
                  Ver Catálogo
                </Button>
              </Link>
              <Link href="#como-funciona">
                <Button size="sm" variant="ghost" className="rounded-full px-7 h-11 text-sm font-medium hover:bg-red-500/10 transition-all text-muted-foreground hover:text-red-400 hover:scale-105 active:scale-95">
                  Como Funciona <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Trust Stats */}
            <div className="mt-8 flex flex-row items-center justify-center gap-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700 fill-mode-both">
              {[
                { value: "10K+", label: "Clientes Satisfeitos" },
                { value: "99.9%", label: "Uptime do Sistema" },
                { value: "<1min", label: "Entrega Média" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-black text-white tracking-tight">{stat.value}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        

        {/* Flash Deals Section */}
        {activeFlashDeals.length > 0 && (
          <section className="py-10 relative overflow-hidden bg-red-950/5 border-t border-red-500/10">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="container mx-auto px-4">
              <ScrollReveal>
              <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                {/* Left: minimal title */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="h-3 w-3 fill-red-500 text-red-500" />
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-500">Tempo Limitado</p>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                      Ofertas <span className="text-zinc-500 font-light">relâmpago</span>
                    </h2>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-red-500/30 to-transparent hidden sm:block" />
                </div>

                {/* Right: timer */}
                <div className="flex items-center gap-3 bg-black/40 border border-red-500/10 px-4 py-2 rounded-xl">
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Expira em</p>
                  <GlobalFlashTimer targetDate={earliestFlashDeal!.flashDealEnd!.toISOString()} />
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {activeFlashDeals.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              </ScrollReveal>
            </div>
          </section>
        )}

        {/* Catalog Section */}
        <section id="catalogo" className="py-10 bg-card/5 border-t border-border/10">
          <div className="container mx-auto px-4">
            <ScrollReveal direction="right">
              <div className="mb-8 flex items-center gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-500 mb-1">Império Bigulin</p>
                  <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    Catálogo
                    <span className="text-zinc-500 font-light ml-2">completo</span>
                  </h2>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-red-500/30 to-transparent ml-4" />
              </div>
            </ScrollReveal>

            {categories.length === 0 && flashDealProducts.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground italic">
                Nenhum produto disponível no momento. Volte mais tarde!
              </div>
            ) : (
              <div className="space-y-12">
                {categories.map((category) => (
                  <div key={category} className="space-y-6">
                    <ScrollReveal>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="w-1 h-4 rounded-full bg-red-500 shadow-[0_0_8px_rgba(220,38,38,0.6)]" />
                        <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-400">
                          {category}
                        </h3>
                        <div className="flex-1 h-px bg-white/5" />
                      </div>
                    </ScrollReveal>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
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
        <section id="como-funciona" className="py-12 relative overflow-hidden border-t border-border/10">
           <div className="container mx-auto px-4 relative z-10">
              <ScrollReveal>
              {/* Section header — same style as catalog */}
              <div className="flex items-center gap-4 mb-10">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-500 mb-1">Passo a passo</p>
                  <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    Como funciona
                    <span className="text-zinc-500 font-light ml-2">o império</span>
                  </h2>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-red-500/30 to-transparent ml-4" />
              </div>

              {/* Steps */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
                 {[
                   { step: "01", title: "Escolha",        desc: "Selecione seu serviço premium preferido em nosso catálogo.", icon: ShoppingCart, accent: "text-blue-400",   glow: "group-hover:shadow-[0_0_20px_rgba(96,165,250,0.15)]",  bar: "from-blue-500",   iconBg: "bg-blue-500/10"   },
                   { step: "02", title: "Pagamento",      desc: "Pague via PIX com segurança. Aprovação em segundos.",       icon: Zap,          accent: "text-yellow-400", glow: "group-hover:shadow-[0_0_20px_rgba(250,204,21,0.15)]",  bar: "from-yellow-500", iconBg: "bg-yellow-500/10" },
                   { step: "03", title: "Processamento",  desc: "Nosso sistema prepara seu acesso com a máxima velocidade.", icon: User,         accent: "text-purple-400", glow: "group-hover:shadow-[0_0_20px_rgba(192,132,252,0.15)]", bar: "from-purple-500", iconBg: "bg-purple-500/10" },
                   { step: "04", title: "Domínio",        desc: "Receba seus dados de acesso no perfil e no e-mail.",        icon: Rocket,       accent: "text-green-400",  glow: "group-hover:shadow-[0_0_20px_rgba(74,222,128,0.15)]",  bar: "from-green-500",  iconBg: "bg-green-500/10"  },
                 ].map((item, idx) => (
                   <div key={idx} className={`group relative bg-[#0d0d10] hover:bg-[#111115] transition-all duration-300 p-6 flex flex-col gap-4 ${item.glow}`}>
                     {/* Top accent line on hover */}
                     <div className={`absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r ${item.bar} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                     <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black text-zinc-700 tracking-[0.2em]">{item.step}</span>
                       <div className={`p-1.5 rounded-lg ${item.iconBg} transition-all duration-300`}>
                         <item.icon className={`h-3.5 w-3.5 text-zinc-600 group-hover:${item.accent} transition-colors duration-300`} />
                       </div>
                     </div>
                     <div>
                       <h4 className={`text-sm font-bold text-white mb-1.5 group-hover:${item.accent} transition-colors`}>{item.title}</h4>
                       <p className="text-xs text-zinc-600 leading-relaxed">{item.desc}</p>
                     </div>
                     <div className="mt-auto pt-4 border-t border-white/5">
                       <div className={`h-0.5 rounded-full bg-gradient-to-r ${item.bar} to-transparent transition-all duration-500 group-hover:w-full`} style={{ width: `${(idx + 1) * 25}%` }} />
                     </div>
                   </div>
                 ))}
              </div>
              </ScrollReveal>
           </div>
        </section>


        <section id="sobre-nos" className="py-12 border-t border-border/10">
          <div className="container mx-auto px-4">
            <ScrollReveal direction="left">
              {/* Section header */}
              <div className="flex items-center gap-4 mb-10">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-500 mb-1">Nossa missão</p>
                  <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    Sobre
                    <span className="text-zinc-500 font-light ml-2">o império</span>
                  </h2>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-red-500/30 to-transparent ml-4" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Left: text content */}
                <div>
                  <div className="space-y-4 text-zinc-500 text-sm leading-relaxed mb-8">
                    <p>
                      A <span className="text-white font-semibold">Bigulin</span> nasceu com uma missão clara: democratizar o acesso ao entretenimento premium com a honra e a velocidade que nossos clientes merecem.
                    </p>
                    <p>
                      Em um mercado saturado de incertezas, nós nos erguemos como um porto seguro. Cada assinatura entregue carrega o selo de autenticidade e suporte incondicional.
                    </p>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-px bg-white/5 rounded-xl overflow-hidden border border-white/5">
                    {[
                      { icon: ShieldCheck, label: "Segurança", desc: "Total em cada transação", iconColor: "text-red-400",    iconBg: "bg-red-500/10",    topBar: "from-red-500"    },
                      { icon: Target,      label: "Precisão",  desc: "Entrega instantânea",    iconColor: "text-yellow-400", iconBg: "bg-yellow-500/10", topBar: "from-yellow-500" },
                      { icon: Heart,       label: "Paixão",    desc: "Suporte que se importa", iconColor: "text-pink-400",   iconBg: "bg-pink-500/10",   topBar: "from-pink-500"   },
                    ].map((s) => (
                      <div key={s.label} className="group relative bg-[#0d0d10] hover:bg-[#111115] transition-all duration-300 p-4 flex flex-col gap-2">
                        <div className={`absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r ${s.topBar} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                        <div className={`w-7 h-7 rounded-lg ${s.iconBg} flex items-center justify-center mb-1`}>
                          <s.icon className={`h-3.5 w-3.5 ${s.iconColor}`} />
                        </div>
                        <p className="text-xs font-bold text-white">{s.label}</p>
                        <p className="text-[10px] text-zinc-600 leading-snug">{s.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: quote card with glow */}
                <div className="relative">
                  <div className="absolute inset-0 bg-red-600/5 blur-2xl rounded-3xl" />
                  <div className="relative bg-[#0d0d10] border border-red-500/15 rounded-2xl p-8 flex flex-col items-center text-center shadow-[0_0_40px_-10px_rgba(220,38,38,0.2)]">
                    <div className="relative mb-5">
                      <div className="absolute inset-0 text-5xl blur-xl opacity-30 select-none">愛</div>
                      <span className="relative text-5xl select-none text-red-400">愛</span>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-500 mb-3">O Selo do Dragão</p>
                    <p className="text-sm text-zinc-400 italic leading-relaxed max-w-xs">
                      "Onde há fumaça, há fogo. Onde há Bigulin, há qualidade garantida."
                    </p>
                    <div className="mt-6 flex items-center gap-3">
                      <div className="h-px w-12 bg-gradient-to-r from-transparent to-red-500/50" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Império Bigulin</span>
                      <div className="h-px w-12 bg-gradient-to-l from-transparent to-red-500/50" />
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      {/* Social Media Section */}
      <section className="py-8 border-t border-border/40 bg-card/10">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-xl font-black italic uppercase mb-5">Siga o Império</h3>
          <div className="flex justify-center gap-6">
            <Link href="#" className="group p-4 rounded-2xl bg-muted/20 border border-border/50 hover:border-pink-500/50 hover:bg-pink-500/5 hover:text-pink-500 transition-all duration-500 hover:-translate-y-1 shadow-lg hover:shadow-pink-500/20">
              <Instagram className="h-6 w-6 transition-all duration-500 group-hover:rotate-12 group-hover:scale-125" />
            </Link>
            <Link href="#" className="group p-4 rounded-2xl bg-muted/20 border border-border/50 hover:border-blue-400/50 hover:bg-blue-400/5 hover:text-blue-400 transition-all duration-500 hover:-translate-y-1 shadow-lg hover:shadow-blue-400/20">
              <Twitter className="h-6 w-6 transition-all duration-500 group-hover:-rotate-12 group-hover:scale-125" />
            </Link>
            <Link href="#" className="group p-4 rounded-2xl bg-muted/20 border border-border/50 hover:border-sky-500/50 hover:bg-sky-500/5 hover:text-sky-500 transition-all duration-500 hover:-translate-y-1 shadow-lg hover:shadow-sky-500/20">
              <Send className="h-6 w-6 transition-all duration-500 group-hover:rotate-12 group-hover:scale-125 group-hover:translate-x-1 group-hover:-translate-y-1" />
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
          <p className="mt-4 text-xs text-muted-foreground italic">Fique por dentro das novidades e sorteios exclusivos do Dragão.</p>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="border-t border-border/40 bg-background py-10">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-4 text-center">
          <Link href="/termos" className="text-sm text-muted-foreground hover:text-red-500 transition-colors underline-offset-4 hover:underline">
            Termos e Condições da Compra
          </Link>
          <p className="text-sm text-muted-foreground/60">&copy; {new Date().getFullYear()} Império Bigulin. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

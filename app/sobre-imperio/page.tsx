import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { ShieldCheck, Target, Heart, Award, Globe, ArrowLeft, Star, Crown, Rocket, Zap, Users } from "lucide-react";
import Link from "next/link";

export default function SobreImperioPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-20 pb-16 overflow-hidden relative group/page">
      {/* Immersive Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-[600px] h-[600px] bg-red-600/5 blur-[140px] rounded-full group-hover/page:bg-red-600/10 transition-colors duration-1000" />
        <div className="absolute bottom-20 -right-20 w-[600px] h-[600px] bg-yellow-500/5 blur-[140px] rounded-full group-hover/page:bg-yellow-500/10 transition-colors duration-1000" />
        
        {/* Balanced Watermark Kanji */}
        <div className="absolute top-1/4 right-0 text-[180px] font-bold text-white/[0.01] select-none pointer-events-none -rotate-12 italic group-hover/page:translate-x-4 group-hover/page:-translate-y-4 transition-transform duration-[3000ms] ease-out">
          龍
        </div>
        <div className="absolute bottom-1/4 left-0 text-[180px] font-bold text-white/[0.01] select-none pointer-events-none rotate-12 italic group-hover/page:-translate-x-4 group-hover/page:translate-y-4 transition-transform duration-[3000ms] ease-out">
          帝
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Top Navigation */}
        <ScrollReveal direction="down">
          <div className="flex justify-between items-center mb-10">
            <Link 
              href="/" 
              className="inline-flex items-center gap-3 text-zinc-500 hover:text-red-500 transition-all group"
            >
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:border-red-500/50 group-hover:bg-red-500/10 transition-all group-hover:scale-110 shadow-xl">
                <ArrowLeft className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.3em]">Voltar ao catálogo</span>
            </Link>
          </div>
        </ScrollReveal>

        {/* Hero Section - Refined Proportions */}
        <div className="max-w-5xl mx-auto text-center mb-20 group/hero">
          <div className="flex flex-col items-center mb-10 group/title cursor-default">
            
            <div className="animate-in fade-in zoom-in duration-1000 fill-mode-both">
              <h1 className="text-5xl md:text-[100px] font-black italic leading-[0.8] tracking-tighter uppercase flex flex-col items-center">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 py-4 drop-shadow-[0_10px_40px_rgba(220,38,38,0.3)] group-hover/title:scale-[1.02] transition-transform duration-700">IMPÉRIO</span>
                <span className="text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] group-hover/title:translate-y-[-10px] transition-transform duration-700">BIGULIN</span>
              </h1>
            </div>
          </div>
          <ScrollReveal delay={400}>
            <p className="text-lg md:text-xl text-zinc-500 leading-relaxed font-medium max-w-2xl mx-auto italic group-hover/hero:text-zinc-400 transition-colors duration-500">
              "Forjando um novo padrão de honra no entretenimento digital."
            </p>
          </ScrollReveal>
        </div>

        {/* Pillar Values Section */}
        <div className="relative mb-24">
          <div className="text-center mb-12 group/pillars">
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600 mb-3 group-hover/pillars:text-zinc-400 transition-colors">Nossos Pilares</h3>
            <div className="h-px w-20 bg-red-500 mx-auto group-hover/pillars:w-40 transition-all duration-700" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, color: "text-red-500", title: "Honra", desc: "Nossa palavra é lei. Se prometemos entrega imediata, você receberá instantaneamente sem burocracias." },
              { icon: Target, color: "text-yellow-500", title: "Foco", desc: "Nossa mira está sempre voltada para a melhor experiência do usuário e curadoria de serviços." },
              { icon: Heart, color: "text-pink-500", title: "Lealdade", desc: "Tratamos nossos clientes como aliados imperiais de longa data em nossa jornada ao topo." },
              { icon: Zap, color: "text-blue-400", title: "Agilidade", desc: "O tempo é o recurso mais precioso. No Império, sua entrega acontece na velocidade do pensamento." },
              { icon: Globe, color: "text-emerald-400", title: "Sabedoria", desc: "Curadoria de elite para selecionar apenas os melhores serviços disponíveis no mercado global." },
              { icon: Rocket, color: "text-purple-400", title: "Domínio", desc: "Infraestrutura de ponta para garantir que seu acesso nunca sofra interrupções ou falhas." },
            ].map((v, i) => (
              <div 
                key={i} 
                className="group bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 p-8 rounded-[32px] hover:from-white/[0.05] transition-all duration-500 hover:border-red-500/20 hover:-translate-y-2 relative overflow-hidden group/pcard h-full animate-in fade-in slide-in-from-bottom-8 fill-mode-both"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.02] -mr-12 -mt-12 rounded-full group-hover:scale-150 group-hover:bg-red-500/[0.02] transition-all duration-700" />
                
                <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-red-500/10 transition-all duration-500 shadow-xl group-hover:shadow-red-500/10`}>
                  <v.icon className={`h-7 w-7 ${v.color} group-hover:rotate-12 group-hover:scale-110 transition-all duration-500`} />
                </div>
                
                <h4 className="text-xl font-black mb-3 uppercase italic tracking-tighter group-hover:text-white transition-colors">{v.title}</h4>
                <p className="text-zinc-500 leading-relaxed text-sm font-medium group-hover:text-zinc-400 transition-colors">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Split Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-10">
            <ScrollReveal direction="left">
              <div className="relative group/text">
                <div className="absolute -left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-red-600 to-transparent rounded-full group-hover/text:h-full transition-all duration-500" />
                <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter mb-4 group-hover/text:translate-x-2 transition-transform duration-500">
                  Nossa <span className="text-red-500">Missão</span>
                </h2>
                <p className="text-zinc-400 leading-relaxed text-lg font-light group-hover/text:text-zinc-300 transition-colors duration-500">
                  A Bigulin nasceu da necessidade de um mercado mais transparente e ágil. Percebemos que o acesso ao conteúdo premium era muitas vezes burocrático e incerto. <span className="text-white font-medium italic">Nossa missão é democratizar esse acesso</span>, garantindo que cada cliente se sinta como parte da realeza.
                </p>
              </div>
            </ScrollReveal>
 
            <ScrollReveal direction="left" delay={200}>
              <div className="relative group/text2">
                <div className="absolute -left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-500 to-transparent rounded-full group-hover/text2:h-full transition-all duration-500" />
                <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter mb-4 group-hover/text2:translate-x-2 transition-transform duration-500">
                  A <span className="text-yellow-500">Filosofia</span>
                </h2>
                <p className="text-zinc-400 leading-relaxed text-lg font-light group-hover/text2:text-zinc-300 transition-colors duration-500">
                  O Dragão representa nossa força, proteção e sabedoria. Quando você vê o nosso selo, saiba que aquele produto foi testado e aprovado sob os mais <span className="text-white font-medium italic">rigorosos padrões imperiais</span>. Não aceitamos nada menos que a perfeição absoluta.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={400}>
              <div className="flex flex-wrap gap-6 pt-4">
                {[
                  { icon: Award, label: "Qualidade Premium", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
                  { icon: Globe, label: "Alcance Global", color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
                  { icon: Star, label: "Suporte Real", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
                ].map((badge, idx) => (
                  <div key={idx} className={`bg-[#0d0d10] border ${badge.border} px-8 py-4 rounded-2xl flex items-center gap-4 hover:bg-white/[0.03] transition-all hover:-translate-y-2 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] cursor-default group`}>
                    <badge.icon className={`h-5 w-5 ${badge.color} group-hover:scale-125 group-hover:rotate-12 transition-all duration-500`} />
                    <span className="font-bold text-xs uppercase tracking-widest italic">{badge.label}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Featured Card - The Artifact */}
          <div className="lg:col-span-5">
            <ScrollReveal direction="right">
              <div className="relative group/card">
                {/* Outer Glow */}
                <div className="absolute inset-0 bg-red-600/10 blur-[60px] rounded-[50px] group-hover/card:bg-red-600/20 group-hover/card:scale-105 transition-all duration-700" />
                
                {/* The Card */}
                <div className="relative bg-gradient-to-br from-[#111115] to-[#0a0a0c] border border-white/10 rounded-[40px] p-10 flex flex-col items-center text-center shadow-2xl overflow-hidden group-hover/card:border-red-500/40 transition-all duration-500 group-hover/card:-translate-y-2">
                  {/* Internal Decorative Lines */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 -mr-16 -mt-16 rounded-full blur-2xl group-hover/card:bg-red-500/10 transition-colors" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-500/5 -ml-16 -mt-16 rounded-full blur-2xl group-hover/card:bg-yellow-500/10 transition-colors" />

                  <div className="mb-8 relative">
                    <div className="text-[120px] font-bold text-red-500/10 select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-2xl group-hover/card:text-red-500/30 group-hover/card:scale-125 transition-all duration-1000">愛</div>
                    <div className="text-[120px] font-bold text-red-500 select-none relative animate-pulse drop-shadow-[0_0_15px_rgba(220,38,38,0.5)] group-hover/card:drop-shadow-[0_0_25px_rgba(220,38,38,0.7)] transition-all">愛</div>
                  </div>

                  <div className="space-y-5 relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-red-500 group-hover/card:tracking-[0.7em] transition-all duration-700">O Selo do Dragão</p>
                    <p className="text-2xl text-white italic font-light leading-snug group-hover/card:text-zinc-100 transition-colors">
                      "Onde há fumaça, há fogo. Onde há <span className="font-bold text-red-500">Bigulin</span>, há qualidade garantida."
                    </p>
                    <div className="flex items-center justify-center gap-4 pt-4">
                      <div className="h-px w-12 bg-gradient-to-r from-transparent to-zinc-700 group-hover/card:w-20 transition-all duration-700" />
                      <span className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-500 whitespace-nowrap">Fundação Imperial</span>
                      <div className="h-px w-12 bg-gradient-to-l from-transparent to-zinc-700 group-hover/card:w-20 transition-all duration-700" />
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
}

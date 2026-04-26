import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Users, TrendingUp, DollarSign, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AfiliadosPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 relative overflow-hidden">
      {/* Background Dragon Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/[0.03] blur-[140px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <ScrollReveal direction="down">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase mb-6 leading-none">
              Junte-se ao <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-yellow-500 to-red-600">Exército Imperial</span>
            </h1>
            <p className="text-zinc-500 text-lg max-w-2xl mx-auto italic">
              Ganhe comissões reais indicando os melhores produtos do mercado digital. 
              Sua jornada para o topo começa aqui.
            </p>
            <div className="mt-10">
              <Link href="/login?callbackUrl=/affiliate">
                <Button size="lg" className="rounded-full bg-red-600 hover:bg-red-700 text-white font-black italic uppercase h-16 px-12 text-lg shadow-[0_0_40px_rgba(220,38,38,0.3)] hover:scale-105 transition-all">
                  Quero ser Afiliado <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              icon: TrendingUp, 
              title: "Alta Conversão", 
              desc: "Nossos produtos são selecionados a dedo para garantir que você converta o máximo de cliques em vendas." 
            },
            { 
              icon: DollarSign, 
              title: "Comissões Reais", 
              desc: "Receba uma porcentagem justa de cada venda indicada. Pagamentos rápidos via PIX sem burocracia." 
            },
            { 
              icon: Users, 
              title: "Painel Completo", 
              desc: "Acompanhe seus cliques, vendas e comissões em tempo real com nosso portal de afiliados exclusivo." 
            },
          ].map((item, idx) => (
            <ScrollReveal key={idx} delay={idx * 100}>
              <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[40px] space-y-6 text-center group hover:border-red-500/20 transition-all">
                <div className="w-16 h-16 rounded-3xl bg-white/5 mx-auto flex items-center justify-center group-hover:scale-110 group-hover:bg-red-500/10 transition-all">
                  <item.icon className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">{item.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-20 text-center">
          <Link href="/" className="text-zinc-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
            ← Voltar para o Império
          </Link>
        </div>
      </div>
    </div>
  );
}

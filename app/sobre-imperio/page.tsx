import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { ShieldCheck, Target, Heart, Zap, Award, Globe } from "lucide-react";

export default function SobreImperioPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-20 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-40 -left-20 w-[500px] h-[500px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-40 -right-20 w-[500px] h-[500px] bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-24">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-600/20 text-red-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
              Nossa História
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 italic leading-none">
              O <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-yellow-500 to-red-600">IMPÉRIO</span> BIGULIN
            </h1>
            <p className="text-xl text-zinc-400 leading-relaxed font-medium">
              Não somos apenas uma loja de assinaturas. Somos o portal para o entretenimento que você merece, entregue com a honra e a velocidade de um dragão.
            </p>
          </ScrollReveal>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <ScrollReveal direction="left">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-black uppercase italic tracking-tighter text-red-500">Nossa Missão</h2>
                <p className="text-zinc-400 leading-relaxed text-lg">
                  A Bigulin nasceu da necessidade de um mercado mais transparente e ágil. Percebemos que o acesso ao conteúdo premium era muitas vezes burocrático e incerto. Nossa missão é democratizar esse acesso, garantindo que cada cliente se sinta como parte da realeza.
                </p>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-3xl font-black uppercase italic tracking-tighter text-yellow-500">O Selo do Dragão</h2>
                <p className="text-zinc-400 leading-relaxed text-lg">
                  O Dragão representa nossa força, proteção e sabedoria. Quando você vê o nosso selo, saiba que aquele produto foi testado e aprovado sob os mais rigorosos padrões imperiais. Não aceitamos nada menos que a perfeição.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <div className="bg-[#0d0d10] border border-white/5 px-6 py-3 rounded-2xl flex items-center gap-3">
                  <Award className="h-5 w-5 text-red-500" />
                  <span className="font-bold text-sm uppercase italic">Qualidade Premium</span>
                </div>
                <div className="bg-[#0d0d10] border border-white/5 px-6 py-3 rounded-2xl flex items-center gap-3">
                  <Globe className="h-5 w-5 text-yellow-500" />
                  <span className="font-bold text-sm uppercase italic">Alcance Global</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div className="relative">
              <div className="absolute inset-0 bg-red-600/10 blur-3xl rounded-full" />
              <div className="relative bg-[#0d0d10] border border-red-500/20 rounded-[40px] p-12 flex flex-col items-center text-center shadow-2xl">
                <div className="mb-8">
                   <div className="text-[120px] font-bold text-red-500/20 select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-xl">愛</div>
                   <div className="text-[120px] font-bold text-red-500 select-none relative animate-pulse">愛</div>
                </div>
                <p className="text-2xl text-zinc-300 italic leading-relaxed mb-8">
                  "Onde há fumaça, há fogo. Onde há Bigulin, há qualidade garantida."
                </p>
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
                <p className="mt-6 text-sm font-black uppercase tracking-[0.4em] text-zinc-600">Fundação Imperial</p>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: ShieldCheck, color: "text-red-500", title: "Honra", desc: "Nossa palavra é lei. Se prometemos entrega imediata, você receberá instantaneamente." },
            { icon: Target, color: "text-yellow-500", title: "Foco", desc: "Nossa mira está sempre voltada para a melhor experiência do usuário possível." },
            { icon: Heart, color: "text-pink-500", title: "Lealdade", desc: "Tratamos nossos clientes como aliados de longa data em nossa jornada." },
          ].map((v, i) => (
            <ScrollReveal key={i} delay={i * 200}>
              <div className="group bg-[#0d0d10] border border-white/5 p-8 rounded-3xl hover:bg-white/[0.02] transition-all hover:border-white/10 hover:-translate-y-2">
                <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <v.icon className={`h-7 w-7 ${v.color}`} />
                </div>
                <h4 className="text-xl font-bold mb-4 uppercase italic">{v.title}</h4>
                <p className="text-zinc-500 leading-relaxed">{v.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}

import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { ShoppingCart, Zap, User, Rocket, ShieldCheck, Target, Heart, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ComoFuncionaPage() {
  const steps = [
    { 
      step: "01", 
      title: "Escolha seu Destino",        
      desc: "Navegue por nosso catálogo imperial e selecione o serviço premium que mais combina com seu estilo. Temos desde assinaturas de streaming até jogos exclusivos.", 
      icon: ShoppingCart, 
      accent: "text-blue-400",   
      glow: "hover:shadow-[0_0_30px_rgba(96,165,250,0.2)]",  
      bar: "from-blue-500",   
      iconBg: "bg-blue-500/10"   
    },
    { 
      step: "02", 
      title: "Tributo via PIX",      
      desc: "O pagamento é realizado via PIX para garantir a máxima velocidade. Nosso sistema identifica o pagamento em segundos, sem burocracia ou espera.",       
      icon: Zap,          
      accent: "text-yellow-400", 
      glow: "hover:shadow-[0_0_30px_rgba(250,204,21,0.2)]",  
      bar: "from-yellow-500", 
      iconBg: "bg-yellow-500/10" 
    },
    { 
      step: "03", 
      title: "Forja do Acesso",  
      desc: "Assim que o tributo é confirmado, nossos sistemas automáticos preparam seus dados de acesso. Cada conta é verificada para garantir que você receba apenas o melhor.", 
      icon: User,         
      accent: "text-purple-400", 
      glow: "hover:shadow-[0_0_30px_rgba(192,132,252,0.2)]", 
      bar: "from-purple-500", 
      iconBg: "bg-purple-500/10" 
    },
    { 
      step: "04", 
      title: "Domínio Total",        
      desc: "Receba seus dados instantaneamente na tela, no seu perfil e por e-mail. Agora o poder está em suas mãos. Aproveite seu conteúdo premium sem limites.",        
      icon: Rocket,       
      accent: "text-green-400",  
      glow: "hover:shadow-[0_0_30px_rgba(74,222,128,0.2)]",  
      bar: "from-green-500",  
      iconBg: "bg-green-500/10"  
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <ScrollReveal direction="left">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-red-500 transition-colors mb-12 group"
          >
            <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:border-red-500/50 group-hover:bg-red-500/10 transition-all">
              <ArrowLeft className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest">Voltar ao catálogo</span>
          </Link>
        </ScrollReveal>

        {/* Header Section */}
        <div className="text-center mb-20">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-600/20 text-red-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
              O Caminho do Guerreiro
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 italic leading-none cursor-default transition-all duration-500 hover:scale-[1.03] hover:drop-shadow-[0_0_20px_rgba(220,38,38,0.3)] group">
              COMO <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-yellow-500 py-2 inline-block group-hover:drop-shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all duration-500">FUNCIONA</span>
            </h1>
            <p className="text-zinc-500 max-w-2xl mx-auto text-lg leading-relaxed">
              Entrar para o Império Bigulin é simples e rápido. Criamos um sistema automatizado para que você gaste menos tempo esperando e mais tempo aproveitando.
            </p>
          </ScrollReveal>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {steps.map((item, idx) => (
            <ScrollReveal key={idx} direction={idx % 2 === 0 ? "left" : "right"}>
              <div className={`group relative bg-[#0d0d10] border border-white/5 p-10 rounded-3xl transition-all duration-500 ${item.glow} hover:border-white/10 hover:-translate-y-2`}>
                <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${item.bar} to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-t-3xl`} />
                
                <div className="flex items-start justify-between mb-8">
                  <span className="text-4xl font-black text-zinc-800 tracking-tighter group-hover:text-zinc-700 transition-colors">
                    {item.step}
                  </span>
                  <div className={`p-4 rounded-2xl ${item.iconBg} group-hover:scale-110 transition-transform duration-500`}>
                    <item.icon className={`h-8 w-8 ${item.accent}`} />
                  </div>
                </div>

                <h3 className={`text-2xl font-bold mb-4 group-hover:${item.accent} transition-colors`}>
                  {item.title}
                </h3>
                <p className="text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors">
                  {item.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Trust Section */}
        <div className="bg-gradient-to-b from-card/30 to-transparent border border-white/5 rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />
          
          <ScrollReveal>
            <h2 className="text-3xl font-black italic uppercase mb-12">Por que confiar no Império?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: ShieldCheck, title: "Segurança Absoluta", desc: "Processamento criptografado e garantia em todas as contas." },
                { icon: Target, title: "Foco no Cliente", desc: "Suporte especializado pronto para resolver qualquer dúvida." },
                { icon: Heart, title: "Lealdade Imperial", desc: "Buscamos sempre as melhores ofertas para nossos membros." },
              ].map((feature, i) => (
                <div key={i} className="flex flex-col items-center group cursor-default">
                  <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20 group-hover:scale-110 group-hover:bg-red-600/20 group-hover:border-red-500/50 group-hover:shadow-[0_0_20px_rgba(220,38,38,0.2)] transition-all duration-500">
                    <feature.icon className="h-8 w-8 text-red-500 transition-transform duration-500 group-hover:rotate-12" />
                  </div>
                  <h4 className="font-bold mb-3 uppercase tracking-tighter text-lg group-hover:text-red-500 transition-colors duration-300">{feature.title}</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors duration-300 max-w-[200px]">{feature.desc}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}

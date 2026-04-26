import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { MessageSquare, Mail, MessageCircle, Clock, Hash, HelpCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ContatoPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none -mt-32 -mr-32" />

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <ScrollReveal direction="down">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase mb-6">
              Fale com o <span className="text-red-500">Império</span>
            </h1>
            <p className="text-zinc-500 text-lg">Nosso suporte real está pronto para atendê-lo 24 horas por dia.</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ScrollReveal direction="left" delay={100}>
            <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[40px] space-y-6 flex flex-col h-full group hover:border-red-500/20 hover:bg-white/[0.04] transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(220,38,38,0.1)]">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-500">
                <MessageCircle className="h-7 w-7 text-emerald-500" />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white mb-2">WhatsApp Real</h2>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Para suporte imediato, dúvidas sobre pedidos ou problemas técnicos, fale diretamente com nossos generais pelo WhatsApp.
                </p>
              </div>
              <div className="mt-auto pt-6">
                <Button className="w-full rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 shadow-[0_10px_20px_-5px_rgba(16,185,129,0.3)] transition-all hover:shadow-[0_15px_30px_rgba(16,185,129,0.4)]">
                  Chamar no WhatsApp
                </Button>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={200}>
            <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[40px] space-y-6 flex flex-col h-full group hover:border-blue-500/20 hover:bg-white/[0.04] transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(37,99,235,0.1)]">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-500">
                <Mail className="h-7 w-7 text-blue-500" />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white mb-2">E-mail Imperial</h2>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Para parcerias comerciais, questões administrativas ou feedbacks detalhados, envie uma mensagem para nossa central.
                </p>
              </div>
              <div className="mt-auto pt-6">
                <Button className="w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 shadow-[0_10px_20px_-5px_rgba(37,99,235,0.3)] transition-all hover:shadow-[0_15px_30px_rgba(37,99,235,0.4)]">
                  contato@bigulin.store
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* FAQ Grid */}
        <div className="mt-20">
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40">Dúvidas Rápidas</h3>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { q: "Qual o prazo de entrega?", a: "A entrega é automática e imediata após a confirmação do pagamento." },
              { q: "Como recebo meu produto?", a: "Você receberá os detalhes no e-mail cadastrado e na sua Área do Cliente." },
              { q: "Quais as formas de pagamento?", a: "Aceitamos PIX (confirmação imediata) e cartões de crédito." },
              { q: "O suporte funciona aos finais de semana?", a: "Sim, nossos generais estão de plantão 24 horas, 7 dias por semana." }
            ].map((item, idx) => (
              <ScrollReveal key={idx} delay={idx * 50}>
                <div className="bg-white/[0.01] border border-white/5 p-6 rounded-3xl group hover:border-white/10 hover:bg-white/[0.03] transition-all cursor-default">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-red-500/10 group-hover:text-red-500 transition-all">
                      <HelpCircle className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-black uppercase italic tracking-tight text-white group-hover:text-red-500 transition-colors">{item.q}</h4>
                      <p className="text-xs text-zinc-500 leading-relaxed">{item.a}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Discord/Community Section */}
        <ScrollReveal delay={500}>
          <div className="mt-20 relative group overflow-hidden rounded-[40px] border border-white/5 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent p-1">
            <div className="absolute inset-0 bg-indigo-500/5 blur-3xl group-hover:bg-indigo-500/10 transition-colors duration-1000" />
            <div className="relative bg-[#080808] rounded-[38px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center md:text-left">
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <Hash className="h-5 w-5 text-indigo-400" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Comunidade</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase text-white">
                  Entre no nosso <span className="text-indigo-400">Discord</span>
                </h3>
                <p className="text-zinc-500 text-sm max-w-md italic">
                  Faça parte da nossa legião de clientes. Participe de sorteios, receba cupons exclusivos e converse com outros membros.
                </p>
              </div>
              <Button className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-black italic uppercase h-14 px-8 shadow-[0_10px_30px_rgba(79,70,229,0.3)] transition-all hover:scale-110 active:scale-95 whitespace-nowrap">
                Entrar na Legião <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={400}>
          <div className="mt-12 bg-gradient-to-r from-red-600/10 to-transparent border border-red-500/20 p-6 rounded-3xl flex items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-red-500">
              <Clock className="h-5 w-5 animate-pulse" />
              <span className="font-black uppercase italic tracking-widest text-xs">Atendimento 24/7</span>
            </div>
            <div className="h-4 w-px bg-white/10 hidden md:block" />
            <p className="text-zinc-500 text-xs font-medium hidden md:block">Tempo médio de resposta: <span className="text-white font-bold">5 minutos</span></p>
          </div>
        </ScrollReveal>

        <div className="mt-16 text-center">
          <Link href="/" className="text-zinc-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
            ← Voltar para o Império
          </Link>
        </div>
      </div>
    </div>
  );
}

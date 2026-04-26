import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { ShieldCheck, Lock, Eye, Share2, UserCheck, Trash2 } from "lucide-react";
import Link from "next/link";

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        <ScrollReveal direction="down">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase mb-6">
              Política de <span className="text-red-500">Privacidade</span>
            </h1>
            <p className="text-zinc-500 text-lg">Sua segurança e privacidade são as leis do nosso Império.</p>
          </div>
        </ScrollReveal>

        <div className="space-y-12">
          <ScrollReveal delay={100}>
            <section className="bg-white/[0.02] border border-white/5 p-8 rounded-[32px] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mb-2">
                <Lock className="h-6 w-6 text-red-500" />
              </div>
              <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">Proteção de Dados</h2>
              <p className="text-zinc-400 leading-relaxed text-sm">
                Utilizamos criptografia de ponta a ponta para garantir que seus dados pessoais e informações de pagamento 
                nunca sejam expostos. No Bigulin, sua identidade é tratada com o mais alto nível de sigilo imperial.
              </p>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <section className="bg-white/[0.02] border border-white/5 p-8 rounded-[32px] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-2">
                <Eye className="h-6 w-6 text-yellow-500" />
              </div>
              <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">Uso de Informações</h2>
              <p className="text-zinc-400 leading-relaxed text-sm">
                Coletamos apenas o essencial para processar suas assinaturas e garantir a entrega imediata. 
                Não vendemos, trocamos ou compartilhamos seus dados com terceiros fora da nossa infraestrutura segura.
              </p>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <section className="bg-white/[0.02] border border-white/5 p-8 rounded-[32px] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-2">
                <ShieldCheck className="h-6 w-6 text-blue-500" />
              </div>
              <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">Cookies e Rastreamento</h2>
              <p className="text-zinc-400 leading-relaxed text-sm">
                Utilizamos cookies apenas para melhorar sua experiência de navegação e manter sua sessão ativa. 
                Nenhuma informação sensível é armazenada em cookies persistentes no seu navegador.
              </p>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <section className="bg-white/[0.02] border border-white/5 p-8 rounded-[32px] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-2">
                <Share2 className="h-6 w-6 text-emerald-500" />
              </div>
              <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">Compartilhamento</h2>
              <p className="text-zinc-400 leading-relaxed text-sm">
                Seus dados só são compartilhados com parceiros essenciais para a operação do Império, como processadores de pagamento 
                seguros e gateways de PIX. Nunca vendemos sua lista de contatos para marketing de terceiros.
              </p>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={500}>
            <section className="bg-white/[0.02] border border-white/5 p-8 rounded-[32px] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-2">
                <UserCheck className="h-6 w-6 text-purple-500" />
              </div>
              <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">Seus Direitos</h2>
              <p className="text-zinc-400 leading-relaxed text-sm">
                Como aliado do Império, você tem o direito de solicitar o acesso, a correção ou a exclusão total de seus dados 
                de nossa base a qualquer momento. Respeitamos integralmente a LGPD e a sua autonomia digital.
              </p>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={600}>
            <section className="bg-white/[0.02] border border-white/5 p-8 rounded-[32px] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center mb-2">
                <Trash2 className="h-6 w-6 text-pink-500" />
              </div>
              <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">Retenção de Dados</h2>
              <p className="text-zinc-400 leading-relaxed text-sm">
                Mantemos seus dados apenas pelo tempo necessário para cumprir obrigações legais ou processar seus serviços. 
                Contas inativas por longo período são automaticamente auditadas e seus dados sensíveis são anonimizados.
              </p>
            </section>
          </ScrollReveal>
        </div>

        <div className="mt-16 text-center space-y-6">
          <Link href="/" className="text-zinc-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest block">
            ← Voltar para o Império
          </Link>
          <p className="text-[10px] text-zinc-700 uppercase tracking-widest font-medium">
            Última Atualização: 26 de Abril de 2026
          </p>
        </div>
      </div>
    </div>
  );
}

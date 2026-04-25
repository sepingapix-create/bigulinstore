import Link from "next/link";
import { ArrowLeft, ShieldCheck, Users, Ban, RefreshCw, AlertTriangle, Headphones, Phone, Clock } from "lucide-react";

export const metadata = {
  title: "Termos e Condições | Império Bigulin",
  description: "Termos e Condições da Compra no Império Bigulin",
};

export default function TermosPage() {
  const termos = [
    {
      icon: Users,
      color: "from-blue-600/20 to-blue-600/5",
      border: "border-blue-500/20",
      iconColor: "text-blue-400",
      glow: "shadow-[0_0_20px_rgba(59,130,246,0.15)]",
      title: "Uso de Serviços Compartilhados",
      content: "Ao adquirir uma assinatura compartilhada, você está ciente de que a conta será utilizada por outras pessoas além de você. Isso pode resultar em limitações de acesso ou de número de telas disponíveis."
    },
    {
      icon: Ban,
      color: "from-red-600/20 to-red-600/5",
      border: "border-red-500/20",
      iconColor: "text-red-400",
      glow: "shadow-[0_0_20px_rgba(220,38,38,0.15)]",
      title: "Conduta e Suspensão",
      content: "Ao efetuar a compra, você concorda que qualquer uso indevido dos serviços ou produtos da loja poderá resultar na suspensão de sua conta, sem possibilidade de reembolso ou recurso."
    },
    {
      icon: RefreshCw,
      color: "from-orange-600/20 to-orange-600/5",
      border: "border-orange-500/20",
      iconColor: "text-orange-400",
      glow: "shadow-[0_0_20px_rgba(234,88,12,0.15)]",
      title: "Política de Reembolso",
      content: "Em caso de insatisfação com o serviço adquirido, você está ciente de que não fazemos devolução após a compra."
    },
    {
      icon: AlertTriangle,
      color: "from-yellow-600/20 to-yellow-600/5",
      border: "border-yellow-500/20",
      iconColor: "text-yellow-400",
      glow: "shadow-[0_0_20px_rgba(234,179,8,0.15)]",
      title: "Erro de Compra",
      content: "Todos os serviços estão devidamente categorizados e descritos. Em caso de erro na compra por parte do cliente, não será realizada troca do serviço."
    },
    {
      icon: Headphones,
      color: "from-green-600/20 to-green-600/5",
      border: "border-green-500/20",
      iconColor: "text-green-400",
      glow: "shadow-[0_0_20px_rgba(34,197,94,0.15)]",
      title: "Suporte e Garantia",
      content: "Você tem direito a suporte técnico durante o período de garantia especificado na descrição do serviço/assinatura adquirido. Após o término desse período, o suporte será encerrado."
    },
    {
      icon: Phone,
      color: "from-purple-600/20 to-purple-600/5",
      border: "border-purple-500/20",
      iconColor: "text-purple-400",
      glow: "shadow-[0_0_20px_rgba(147,51,234,0.15)]",
      title: "Responsabilidade de Contatar o Suporte",
      content: "Em caso de problemas com sua conta ou serviço, é sua responsabilidade entrar em contato com o suporte para obter esclarecimentos ou solicitar trocas."
    },
    {
      icon: Clock,
      color: "from-pink-600/20 to-pink-600/5",
      border: "border-pink-500/20",
      iconColor: "text-pink-400",
      glow: "shadow-[0_0_20px_rgba(236,72,153,0.15)]",
      title: "Vencimento de Garantia e Não Uso",
      content: "Se a garantia do serviço adquirido expirar, e você não tiver utilizado o serviço, a loja não tem obrigação de prorrogar o período de garantia."
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-24 pt-28 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-yellow-600/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        {/* Back button */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors mb-12 group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Voltar para o Império
        </Link>

        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="relative inline-flex mb-8">
            <div className="absolute inset-0 rounded-full bg-red-600/20 blur-xl scale-150" />
            <div className="relative p-5 rounded-full bg-gradient-to-br from-red-600/20 to-red-900/10 border border-red-500/20">
              <ShieldCheck className="w-10 h-10 text-red-500" />
            </div>
          </div>
          <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-600/20 text-red-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            Leia antes de comprar
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 leading-tight">
            Termos e Condições
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-yellow-500">
              da Compra
            </span>
          </h1>
          <p className="text-zinc-400 text-base max-w-lg mx-auto leading-relaxed">
            Ao concluir sua compra, você confirma que leu, entendeu e concorda com todos os termos listados abaixo.
          </p>
        </div>

        {/* Terms list */}
        <div className="space-y-4">
          {termos.map((termo, index) => {
            const Icon = termo.icon;
            return (
              <div
                key={index}
                className={`relative group rounded-2xl border ${termo.border} bg-gradient-to-br ${termo.color} p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 ${termo.glow} hover:border-opacity-60 animate-in fade-in slide-in-from-bottom-4 fill-mode-both`}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="flex gap-5 items-start">
                  {/* Icon */}
                  <div className={`shrink-0 p-3 rounded-xl bg-black/30 border ${termo.border} ${termo.glow}`}>
                    <Icon className={`h-5 w-5 ${termo.iconColor}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Number + Title */}
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h2 className={`text-base font-bold ${termo.iconColor} tracking-tight`}>
                        {termo.title}
                      </h2>
                    </div>

                    {/* Divider */}
                    <div className={`h-px w-full bg-gradient-to-r ${termo.color} mb-3 opacity-50`} />

                    {/* Content */}
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {termo.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer confirmation box */}
        <div className="mt-12 rounded-3xl border border-red-500/20 bg-gradient-to-br from-red-600/10 to-transparent p-8 text-center shadow-[0_0_40px_rgba(220,38,38,0.1)] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700 fill-mode-both">
          <ShieldCheck className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-zinc-300 font-medium text-sm leading-relaxed max-w-lg mx-auto">
            Ao concluir sua compra, você confirma que <span className="text-white font-bold">leu, entendeu e concorda</span> com todos os termos e condições acima. Eles são vinculativos e regem sua relação com o Império Bigulin.
          </p>
          <Link href="/">
            <button className="mt-6 px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-sm font-bold uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:scale-105 active:scale-95">
              Entendi, voltar ao catálogo
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

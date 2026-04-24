import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Termos e Condições | Império Bigulin",
  description: "Termos e Condições da Compra no Império Bigulin",
};

export default function TermosPage() {
  const termos = [
    {
      title: "Uso de Serviços Compartilhados",
      content: "Ao adquirir uma assinatura compartilhada, você está ciente de que a conta será utilizada por outras pessoas além de você. Isso pode resultar em limitações de acesso ou de número de telas disponíveis."
    },
    {
      title: "Conduta e Suspensão",
      content: "Ao efetuar a compra, você concorda que qualquer uso indevido dos serviços ou produtos da loja poderá resultar na suspensão de sua conta, sem possibilidade de reembolso ou recurso."
    },
    {
      title: "Política de Reembolso",
      content: "Em caso de insatisfação com o serviço adquirido, você está ciente de que não fazemos devolução após a compra."
    },
    {
      title: "Erro de Compra",
      content: "Todos os serviços estão devidamente categorizados e descritos. Em caso de erro na compra por parte do cliente, não será realizada troca do serviço."
    },
    {
      title: "Suporte e Garantia",
      content: "Você tem direito a suporte técnico durante o período de garantia especificado na descrição do serviço/assinatura adquirido. Após o término desse período, o suporte será encerrado."
    },
    {
      title: "Responsabilidade de Contatar o Suporte",
      content: "Em caso de problemas com sua conta ou serviço, é sua responsabilidade entrar em contato com o suporte para obter esclarecimentos ou solicitar trocas."
    },
    {
      title: "Vencimento de Garantia e Não Uso",
      content: "Se a garantia do serviço adquirido expirar, e você não tiver utilizado o serviço, a loja não tem obrigação de prorrogar o período de garantia."
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20 pt-32">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-8 text-muted-foreground hover:text-white">
            &larr; Voltar para o Império
          </Button>
        </Link>
        
        <div className="mb-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-red-600/10 mb-6">
            <ShieldCheck className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-6">
            Termos e Condições <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-yellow-500">da Compra</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
            Ao concluir sua compra, você confirma que leu, entendeu e concorda com todos os termos listados abaixo.
          </p>
        </div>

        <div className="space-y-6">
          {termos.map((termo, index) => (
            <section 
              key={index} 
              className="bg-card/20 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-sm hover:border-red-500/20 transition-colors duration-300 animate-in fade-in slide-in-from-bottom-8 fill-mode-both"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
                <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl bg-red-600/10 text-red-500 font-black text-xl border border-red-500/20 shadow-[0_0_15px_rgba(220,38,38,0.15)]">
                  {index + 1}
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold mb-3 text-zinc-100">{termo.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {termo.content}
                  </p>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

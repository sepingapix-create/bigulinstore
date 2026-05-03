"use client";

import { Headphones, MessageCircle, X, ChevronLeft, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "Como recebo meu produto?",
    a: "Após a confirmação do pagamento, os dados de acesso são enviados instantaneamente para o seu e-mail e ficam disponíveis no seu perfil no site."
  },
  {
    q: "Quanto tempo demora a entrega?",
    a: "A entrega é automática via PIX. Assim que o sistema confirma o recebimento, você recebe o produto em segundos."
  },
  {
    q: "Onde vejo minhas compras?",
    a: "Basta clicar no ícone do seu perfil no topo do site e selecionar 'Meus Pedidos' para ver todo o seu histórico e dados de acesso."
  },
  {
    q: "As contas têm garantia?",
    a: "Sim! Todas as nossas assinaturas contam com suporte total durante todo o período contratado."
  }
];

import { usePathname } from "next/navigation";

export function SupportButton({ variant = "floating" }: { variant?: "floating" | "inline" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<"main" | "faq">("main");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const pathname = usePathname();

  // If floating, hide on certain pages
  const isHiddenPage = pathname?.startsWith("/admin") || 
                       pathname?.startsWith("/affiliate") || 
                       pathname?.startsWith("/profile") || 
                       pathname?.startsWith("/order") || 
                       pathname === "/login" || 
                       pathname === "/register";

  if (variant === "floating" && isHiddenPage) {
    return null;
  }

  const openJivo = () => {
    if (typeof window !== "undefined" && (window as any).jivo_api) {
      (window as any).jivo_api.open();
    } else {
      // Fallback to whatsapp if jivo not loaded or just wait
      window.open("https://wa.me/5500000000000", "_blank");
    }
  };

  const toggleOpen = () => {
    // Instead of opening our custom menu, we now open JivoSite directly
    openJivo();
  };

  return (
    <div className={cn(
      "z-50",
      variant === "floating" ? "fixed bottom-6 right-6" : "relative inline-block"
    )}>
      {/* Popover content */}
      <div className={cn(
        "absolute bg-card/95 backdrop-blur-xl border border-red-500/20 rounded-3xl shadow-2xl w-80 transition-all duration-300 overflow-hidden flex flex-col",
        variant === "floating" ? "bottom-[calc(100%+16px)] right-0 origin-bottom-right" : "top-[calc(100%+16px)] left-1/2 -translate-x-1/2 origin-top",
        isOpen ? "scale-100 opacity-100 pointer-events-auto" : "scale-95 opacity-0 pointer-events-none",
        variant === "floating" ? (isOpen ? "translate-y-0" : "translate-y-4") : (isOpen ? "translate-y-0" : "-translate-y-4")
      )}>
        {/* Header */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between bg-red-600/5">
          <div className="flex items-center gap-3">
            {view === "faq" && (
              <button 
                onClick={() => setView("main")}
                className="hover:bg-white/10 p-1 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-red-500" />
              </button>
            )}
            <div className="bg-red-600/10 p-1.5 rounded-lg">
               <Headphones className="h-5 w-5 text-red-600" />
            </div>
            <span className="font-black text-sm uppercase italic tracking-tighter">
              {view === "faq" ? "Dúvidas Frequentes" : "Suporte Imperial"}
            </span>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Body */}
        <div className="max-h-[400px] overflow-y-auto p-5 text-left">
          {view === "main" ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h4 className="text-xl font-black italic uppercase mb-2">Saudações, Guerreiro!</h4>
                <p className="text-sm text-muted-foreground">
                  Nossos guardiões imperiais estão prontos para te guiar. Como podemos ajudar hoje?
                </p>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={openJivo}
                  className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-red-600/20 group"
                >
                  <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform" /> 
                  Abrir Chat Online
                </button>
                <button 
                  onClick={() => setView("faq")}
                  className="w-full border border-border/50 hover:bg-muted/50 text-sm font-bold py-4 rounded-2xl transition-all"
                >
                  Perguntas Frequentes
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 animate-in fade-in slide-in-from-left-4 duration-300">
              {FAQS.map((faq, idx) => (
                <div key={idx} className="border border-white/5 rounded-xl overflow-hidden">
                  <button 
                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
                  >
                    <span className="text-sm font-bold pr-4">{faq.q}</span>
                    <ChevronDown className={cn("h-4 w-4 text-red-500 transition-transform", openFaqIndex === idx && "rotate-180")} />
                  </button>
                  {openFaqIndex === idx && (
                    <div className="p-4 pt-0 text-xs text-muted-foreground leading-relaxed animate-in slide-in-from-top-2 duration-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-muted/20 border-t border-white/5 text-center">
           <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
             Atendimento 24/7 • Selo Bigulin de Qualidade
           </p>
        </div>
      </div>

      {/* Button */}
      {variant === "floating" ? (
        <button 
          onClick={toggleOpen}
          className="h-16 w-16 bg-red-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-red-600/40 hover:scale-110 active:scale-95 transition-all group border-2 border-yellow-500/50 relative"
        >
          <Headphones className={cn("h-8 w-8 transition-all", isOpen ? "rotate-12" : "group-hover:-rotate-12")} />
          <div className="absolute -top-1 -right-1 h-4 w-4 bg-yellow-500 rounded-full border-2 border-red-600 animate-pulse" />
        </button>
      ) : (
        <button 
          onClick={toggleOpen}
          className="inline-flex items-center justify-center rounded-full px-8 h-12 text-lg font-medium border border-red-500/20 hover:bg-red-500/10 transition-all text-red-500 hover:scale-105 active:scale-95"
        >
          <Headphones className="mr-2 h-4 w-4" /> Suporte Imperial
        </button>
      )}
    </div>
  );
}

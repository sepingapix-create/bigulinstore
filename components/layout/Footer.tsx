"use client";

import Link from "next/link";
import { Zap, ShieldCheck, ChevronRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/5 pt-16 pb-8 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none -mb-64 -ml-64" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16 items-start">
          {/* Brand Section */}
          <div className="lg:col-span-5 space-y-8 group/brand">
            <div className="space-y-1 transition-transform duration-500 group-hover/brand:translate-x-2">
              <span className="text-[10px] font-black tracking-[0.4em] text-white uppercase opacity-80 block group-hover/brand:text-red-500 transition-colors duration-500">
                O IMPÉRIO
              </span>
              <h2 className="text-3xl font-black italic tracking-tighter uppercase text-red-600 transition-all duration-500 group-hover/brand:drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                BIGULIN
              </h2>
            </div>
            
            <p className="text-zinc-500 text-sm leading-relaxed max-w-sm transition-colors duration-500 group-hover/brand:text-zinc-400">
              Sua plataforma premium para assinaturas digitais, contas e softwares. 
              Entrega automática e suporte especializado 24/7 sob o selo de qualidade do Dragão.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[11px] font-bold uppercase tracking-wider transition-all duration-500 hover:scale-105 hover:bg-emerald-500/20 cursor-default">
                <Zap className="h-3.5 w-3.5" />
                Entrega Imediata
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[11px] font-bold uppercase tracking-wider transition-all duration-500 hover:scale-105 hover:bg-blue-500/20 cursor-default">
                <ShieldCheck className="h-3.5 w-3.5" />
                100% Seguro
              </div>
            </div>
          </div>

          {/* Spacing for Desktop */}
          <div className="hidden lg:block lg:col-span-1" />

          {/* Navigation */}
          <div className="lg:col-span-4 lg:col-start-8 space-y-6">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">Navegação</h3>
            <ul className="grid grid-cols-2 gap-4">
              {[
                { label: "Início", href: "/" },
                { label: "Catálogo", href: "/#catalogo" },
                { label: "Área do Cliente", href: "/profile" },
                { label: "Sobre o Império", href: "/sobre-imperio" },
              ].map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href} 
                    className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <ChevronRight className="h-3 w-3 text-red-500 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-center gap-x-12 gap-y-4 text-center italic flex-wrap">
          <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-widest">
            © 2026 <span className="text-zinc-400">Bigulin Store</span>. Todos os direitos reservados.
          </p>

          <Link 
            href="/termos" 
            className="text-[11px] text-zinc-500 hover:text-white transition-colors uppercase tracking-[0.2em] font-black hover:scale-105"
          >
            Termos e Condições da Compra
          </Link>
          
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
            <span className="text-zinc-600">Pagamentos seguros via</span>
            <span className="text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">PIX</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

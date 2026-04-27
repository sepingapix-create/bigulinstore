"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, Package, Tag, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { searchProductsAction } from "@/actions/search";
import { Product } from "@/db/schema";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search logic with debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        setIsSearching(true);
        setIsOpen(true);
        const data = await searchProductsAction(query);
        setResults(data);
        setIsSearching(false);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard shortcut (Cmd+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        const input = document.getElementById("global-search-input");
        input?.focus();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div className="flex-1 max-w-2xl mx-0 sm:mx-4 relative transition-all duration-500 ease-in-out focus-within:max-w-3xl" ref={dropdownRef}>
      <div className="relative group">
        <Search className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-all duration-300",
          isOpen ? "text-primary scale-110" : "text-muted-foreground"
        )} />
        <Input 
          id="global-search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Buscar no império das assinaturas..." 
          className="w-full pl-12 pr-12 bg-muted/20 border border-border/40 focus-visible:ring-primary/30 focus-visible:bg-muted/40 focus-visible:border-primary/50 transition-all rounded-2xl h-12 text-base shadow-inner"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-2">
          <kbd className="pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded-md border border-border/50 bg-background/50 px-2 font-mono text-[10px] font-medium text-muted-foreground opacity-100 group-focus-within:border-primary/50 group-focus-within:text-primary transition-colors">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>

      {/* Results Dropdown */}
      {isOpen && (
        <div className="fixed inset-x-4 top-[72px] sm:absolute sm:inset-x-auto sm:top-full sm:left-0 sm:right-0 sm:w-full sm:mt-2 bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden z-[60] animate-in fade-in zoom-in-95 duration-200">
          <div className="p-2">
            {isSearching ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-1">
                <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center">
                  Resultados Sugeridos
                </div>
                {results.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => {
                      router.push(`/product/${product.id}`);
                      setIsOpen(false);
                      setQuery("");
                    }}
                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-primary/10 transition-colors text-left group"
                  >
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted/20 border border-border/30 shrink-0">
                      <Image 
                        src={product.imageUrl} 
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate group-hover:text-primary transition-colors uppercase italic">
                        {product.name}
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-1">
                        <Badge variant="outline" className="text-[8px] h-3.5 px-1 bg-muted/50 border-border/30 uppercase tracking-tighter">
                          {product.category}
                        </Badge>
                        <span className="text-xs font-black text-primary tabular-nums">
                          {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(product.price))}
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <div className="bg-muted/50 p-3 rounded-full mb-3">
                  <Package className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">Nenhum produto encontrado</p>
                <p className="text-xs text-muted-foreground mt-1">Tente buscar por outras palavras-chave ou categorias.</p>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="bg-muted/30 px-3 py-2 border-t border-border/50 flex flex-wrap justify-between items-center gap-2 text-[9px] text-muted-foreground">
            <div className="flex gap-2">
              <span className="flex items-center gap-1">
                <kbd className="bg-muted/50 px-1 rounded border border-border/50 font-sans">ESC</kbd> fechar
              </span>
              <span className="flex items-center gap-1">
                <kbd className="bg-muted/50 px-1 rounded border border-border/50 font-sans">⏎</kbd> selecionar
              </span>
            </div>
            <div className="font-black text-primary/70 italic tracking-tighter uppercase ml-auto">
              Bigulin <span className="text-yellow-500">Premium</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

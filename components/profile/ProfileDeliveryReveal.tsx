"use client";

import { useState } from "react";
import { Eye, EyeOff, Copy, CheckCheck, Key } from "lucide-react";

interface ProfileDeliveryRevealProps {
  productName: string;
  contents: string[];
}

export function ProfileDeliveryReveal({ productName, contents }: ProfileDeliveryRevealProps) {
  const [revealed, setRevealed] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="border-t border-green-500/20 bg-green-500/5">
      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-green-400 hover:text-green-300 hover:bg-green-500/10 transition-all group"
        >
          <Key className="h-3.5 w-3.5 group-hover:rotate-12 transition-transform" />
          <span className="uppercase tracking-widest">Revelar Acesso</span>
          <Eye className="h-3.5 w-3.5" />
        </button>
      ) : (
        <div className="p-4 space-y-2">
          <p className="text-[10px] uppercase tracking-widest text-green-400 font-bold mb-3 flex items-center gap-1">
            <Key className="h-3 w-3" /> Seu acesso — {productName}
          </p>

          {contents.map((content, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-background/60 border border-green-500/30 group"
            >
              <code className="flex-1 text-xs text-green-300 font-mono break-all select-all">
                {content}
              </code>
              <button
                onClick={() => handleCopy(content, index)}
                className="shrink-0 p-1.5 rounded-md hover:bg-green-500/20 transition-colors text-green-500"
                title="Copiar"
              >
                {copiedIndex === index ? (
                  <CheckCheck className="h-3.5 w-3.5 text-green-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          ))}

          <button
            onClick={() => setRevealed(false)}
            className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <EyeOff className="h-3 w-3" /> Ocultar
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface OpenJivoButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function OpenJivoButton({ className, children }: OpenJivoButtonProps) {
  const openJivo = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined" && (window as any).jivo_api) {
      (window as any).jivo_api.open();
    } else {
      window.open("https://wa.me/5500000000000", "_blank");
    }
  };

  return (
    <button onClick={openJivo} className={className}>
      {children || (
        <>
          <MessageSquare className="h-6 w-6 transition-all duration-500 group-hover:rotate-12 group-hover:scale-125" />
        </>
      )}
    </button>
  );
}

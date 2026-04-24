"use client";

import { useState, useEffect } from "react";
import { Timer } from "lucide-react";

export function FlashDealTimer({ endTime }: { endTime: Date }) {
  const [timeLeft, setTimeLeft] = useState<{ h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const distance = new Date(endTime).getTime() - now;

      if (distance < 0) {
        setTimeLeft(null);
        return;
      }

      setTimeLeft({
        h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  if (!timeLeft) return null;

  return (
    <div className="flex items-center gap-1.5 bg-red-500/10 text-red-500 px-2 py-1 rounded-md border border-red-500/20 animate-pulse">
      <Timer className="h-3 w-3" />
      <span className="text-[10px] font-black tabular-nums">
        {String(timeLeft.h).padStart(2, "0")}:{String(timeLeft.m).padStart(2, "0")}:{String(timeLeft.s).padStart(2, "0")}
      </span>
    </div>
  );
}

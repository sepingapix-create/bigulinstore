"use client";

import React, { useState, useEffect } from "react";

interface GlobalFlashTimerProps {
  targetDate: string; // ISO date string
}

export function GlobalFlashTimer({ targetDate }: GlobalFlashTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex gap-4">
      <div className="text-center w-12">
        <div className="text-2xl font-black tabular-nums">{String(timeLeft.days).padStart(2, "0")}</div>
        <div className="text-[10px] text-muted-foreground uppercase font-bold">Dias</div>
      </div>
      <div className="text-2xl font-black text-red-500">:</div>
      <div className="text-center w-12">
        <div className="text-2xl font-black tabular-nums text-red-500">{String(timeLeft.hours).padStart(2, "0")}</div>
        <div className="text-[10px] text-muted-foreground uppercase font-bold">Horas</div>
      </div>
      <div className="text-2xl font-black text-red-500">:</div>
      <div className="text-center w-12">
        <div className="text-2xl font-black tabular-nums text-red-500">{String(timeLeft.minutes).padStart(2, "0")}</div>
        <div className="text-[10px] text-muted-foreground uppercase font-bold">Min</div>
      </div>
      <div className="text-2xl font-black text-red-500">:</div>
      <div className="text-center w-12">
        <div className="text-2xl font-black tabular-nums text-red-500">{String(timeLeft.seconds).padStart(2, "0")}</div>
        <div className="text-[10px] text-muted-foreground uppercase font-bold">Seg</div>
      </div>
    </div>
  );
}

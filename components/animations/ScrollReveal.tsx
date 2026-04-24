"use client";

import { motion, useInView, useAnimation, Variant } from "framer-motion";
import { useEffect, useRef, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  width?: "fit-content" | "100%";
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  distance?: number;
}

export function ScrollReveal({ 
  children, 
  width = "100%", 
  direction = "up", 
  delay = 0.2, 
  duration = 0.5,
  distance = 50
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView, mainControls]);

  const getHiddenPosition = () => {
    switch (direction) {
      case "up": return { y: distance, opacity: 0 };
      case "down": return { y: -distance, opacity: 0 };
      case "left": return { x: distance, opacity: 0 };
      case "right": return { x: -distance, opacity: 0 };
      default: return { y: distance, opacity: 0 };
    }
  };

  return (
    <div ref={ref} style={{ position: "relative", width, overflow: "visible" }}>
      <motion.div
        variants={{
          hidden: getHiddenPosition(),
          visible: { x: 0, y: 0, opacity: 1 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration, delay, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
}

"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export function NavbarWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/affiliate") || pathname?.startsWith("/profile") || pathname?.startsWith("/order")) return null;
  
  return <>{children}</>;
}

import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bigulin | Império das Assinaturas Premium",
  description: "O maior império de assinaturas premium do Brasil. Entrega imediata, suporte 24/7 e os melhores preços sob o selo do Dragão.",
};

import { Navbar } from "@/components/layout/Navbar";
import { SupportButton } from "@/components/layout/SupportButton";
import { Toaster } from "@/components/ui/sonner";
import { AffiliateTracker } from "@/components/affiliate/AffiliateTracker";
import { Suspense } from "react";

import { NavbarWrapper } from "@/components/layout/NavbarWrapper";
import { Footer } from "@/components/layout/Footer";
import NextTopLoader from 'nextjs-toploader';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${outfit.variable} ${jakarta.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-jakarta overflow-x-hidden">
        <NextTopLoader
          color="#dc2626"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #dc2626,0 0 5px #dc2626"
        />
        <NavbarWrapper>
          <Navbar />
        </NavbarWrapper>
        <div className="flex-1 animate-in fade-in duration-700 ease-in-out">
          {children}
        </div>
        <Suspense fallback={null}>
          <AffiliateTracker />
        </Suspense>
        <Footer />
        <SupportButton />
        <Toaster position="top-right" richColors duration={2000} closeButton />
      </body>
    </html>
  );
}

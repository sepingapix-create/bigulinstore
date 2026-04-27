import { auth } from "@/auth";
import { getAffiliateStatsAction } from "@/actions/affiliate";
import { AffiliatePortalClient } from "@/components/affiliate/AffiliatePortalClient";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function AffiliatePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/affiliate");
  }

  const affiliateStats = await getAffiliateStatsAction();

  return (
    <div className="flex-1 bg-background">
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 text-center md:text-left">
          <div>
            <h1 className="text-3xl md:text-6xl font-black tracking-tight mb-2 sm:mb-4 italic uppercase italic">
              Portal de <span className="text-primary">Afiliados</span>
            </h1>
            <p className="text-base sm:text-xl text-muted-foreground">
              Transforme sua influência em lucro. Ganhe comissões por cada venda indicada.
            </p>
          </div>
          <Link href="/">
            <Button className="rounded-full px-8 h-12 bg-primary hover:bg-primary/90 text-white font-black italic uppercase transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] active:scale-95 group border-2 border-white/10 shrink-0">
               <ArrowRight className="mr-2 h-5 w-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
               Voltar ao Menu Principal
            </Button>
          </Link>
        </div>

        <AffiliatePortalClient initialStats={affiliateStats} />
      </main>
    </div>
  );
}

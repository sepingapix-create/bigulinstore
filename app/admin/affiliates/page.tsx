import { db } from "@/db";
import { affiliates, affiliateVisits, users, affiliateReferrals } from "@/db/schema";
import { desc, eq, count, sql } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  MousePointerClick,
  DollarSign,
  ShoppingBag,
  UserCheck,
  MapPin,
} from "lucide-react";

const fmt = (n: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);

export default async function AdminAffiliatesPage() {
  // ── 1. All affiliates with owner info ─────────────────────────────────────
  const allAffiliates = await db
    .select({ affiliate: affiliates, user: users })
    .from(affiliates)
    .innerJoin(users, eq(affiliates.userId, users.id))
    .orderBy(desc(affiliates.createdAt));

  // ── 2. Visit counts per affiliate ─────────────────────────────────────────
  const visitCounts = await db
    .select({
      affiliateId: affiliateVisits.affiliateId,
      total: count(),
    })
    .from(affiliateVisits)
    .groupBy(affiliateVisits.affiliateId);

  const visitMap = Object.fromEntries(visitCounts.map((v) => [v.affiliateId, v]));

  // ── 3. Referral (confirmed sale) counts ───────────────────────────────────
  const referralCounts = await db
    .select({ affiliateId: affiliateReferrals.affiliateId, total: count() })
    .from(affiliateReferrals)
    .groupBy(affiliateReferrals.affiliateId);

  const referralMap = Object.fromEntries(referralCounts.map((r) => [r.affiliateId, r.total]));

  // ── 4. Detailed visits (Refactored to single query for performance) ─────────
  const recentVisits = await db
    .select({ visit: affiliateVisits, visitUser: users, affiliateId: affiliateVisits.affiliateId })
    .from(affiliateVisits)
    .leftJoin(users, eq(affiliateVisits.userId, users.id))
    .orderBy(desc(affiliateVisits.createdAt))
    .limit(1000);

  // Group in JS
  const visitsDetailMap: Record<string, any[]> = {};
  recentVisits.forEach((v) => {
    if (!visitsDetailMap[v.affiliateId]) visitsDetailMap[v.affiliateId] = [];
    if (visitsDetailMap[v.affiliateId].length < 50) {
      visitsDetailMap[v.affiliateId].push({ visit: v.visit, visitUser: v.visitUser });
    }
  });

  // ─── 4.5 Resilient IP Geolocation ──────────────────────────────────────────
  let ipLocationMap: Record<string, any> = {};
  try {
    const { getBatchLocations } = await import("@/lib/geolocation");
    const allIps = recentVisits.map(v => v.visit.visitorIp!).filter(Boolean);
    if (allIps.length > 0) {
      ipLocationMap = await getBatchLocations(allIps);
    }
  } catch (geoErr) {
    console.error("Geolocation fetch failed, continuing without it:", geoErr);
  }

  // ── 5. Grand totals ───────────────────────────────────────────────────────
  const totalVisits = visitCounts.reduce((s, v) => s + Number(v.total || 0), 0);
  const totalSales = referralCounts.reduce((s, r) => s + Number(r.total || 0), 0);
  const totalCommissions = allAffiliates.reduce(
    (s, { affiliate }) => s + Number(affiliate.totalEarned || 0),
    0
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight italic uppercase italic">Afiliados</h1>
          <p className="text-muted-foreground mt-1">
            Veja todos os afiliados, quem entrou no site com o código de cada um e as conversões.
          </p>
        </div>
        <a href="/admin/affiliates/withdrawals">
          <Button variant="outline" className="bg-primary/10 border-primary/20 text-primary hover:bg-primary/20">
            <DollarSign className="mr-2 h-4 w-4" /> Solicitações de Saque
          </Button>
        </a>
      </div>

      {/* ── Summary Cards ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Afiliados", value: allAffiliates.length, icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "Visitas Totais", value: totalVisits, icon: MousePointerClick, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Vendas Geradas", value: totalSales, icon: ShoppingBag, color: "text-cyan-500", bg: "bg-cyan-500/10" },
          { label: "Comissões Pagas", value: fmt(totalCommissions), icon: DollarSign, color: "text-green-500", bg: "bg-green-500/10" },
        ].map((card) => (
          <Card key={card.label} className="bg-[#0A0A0A] border-[#1A1A1A]">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`${card.bg} p-3 rounded-xl`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">{card.label}</p>
                <p className="text-2xl font-black">{card.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Overview Table ──────────────────────────────────────────────────── */}
      <Card className="bg-[#0A0A0A] border-[#1A1A1A] overflow-hidden">
        <CardHeader>
          <CardTitle>Visão Geral dos Afiliados</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-[#111111]">
              <TableRow className="hover:bg-transparent border-[#1A1A1A]">
                <TableHead>Afiliado</TableHead>
                <TableHead>Handle / Cupom</TableHead>
                <TableHead><div className="flex items-center gap-1"><MousePointerClick className="h-3 w-3" /> Visitas</div></TableHead>
                <TableHead><div className="flex items-center gap-1"><ShoppingBag className="h-3 w-3" /> Vendas</div></TableHead>
                <TableHead>Conversão</TableHead>
                <TableHead>Saldo</TableHead>
                <TableHead>Total Ganho</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allAffiliates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground italic">
                    Nenhum afiliado cadastrado ainda.
                  </TableCell>
                </TableRow>
              ) : (
                allAffiliates.map(({ affiliate, user }) => {
                  const visits = Number(visitMap[affiliate.id]?.total ?? 0);
                  const sales = Number(referralMap[affiliate.id] ?? 0);
                  const conv = visits > 0 ? ((sales / visits) * 100).toFixed(1) : "0.0";
                  const convNum = Number(conv);
                  return (
                    <TableRow key={affiliate.id} className="border-[#1A1A1A] hover:bg-muted/5">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xs font-black">
                            {user.name?.substring(0, 2).toUpperCase() ?? "??"}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5">
                          <Badge variant="outline" className="text-primary border-primary/30 font-mono text-xs">
                            @{affiliate.handle}
                          </Badge>
                          <p className="text-[10px] text-muted-foreground font-mono">cupom: {affiliate.handle.toUpperCase()}10</p>
                        </div>
                      </TableCell>
                      <TableCell><span className="font-bold text-blue-400">{visits}</span></TableCell>
                      <TableCell><span className="font-bold text-cyan-400">{sales}</span></TableCell>
                      <TableCell>
                        <Badge className={
                          convNum >= 5 ? "bg-green-500/15 text-green-400 border-green-500/20" :
                          convNum >= 1 ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/20" :
                          "bg-muted/30 text-muted-foreground border-transparent"
                        }>
                          {conv}%
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-green-400">{fmt(Number(affiliate.balance))}</TableCell>
                      <TableCell className="font-bold">{fmt(Number(affiliate.totalEarned))}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ── Per-Affiliate Visitor Details ───────────────────────────────────── */}
      {allAffiliates.map(({ affiliate, user }) => {
        const visits = visitsDetailMap[affiliate.id] ?? [];
        if (visits.length === 0) return null;

        return (
          <Card key={affiliate.id} className="bg-[#0A0A0A] border-[#1A1A1A] overflow-hidden">
            <CardHeader className="border-b border-[#1A1A1A] flex flex-row items-center gap-4 pb-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-sm font-black shrink-0">
                {user.name?.substring(0, 2).toUpperCase() ?? "??"}
              </div>
              <div className="flex-1">
                <CardTitle className="text-base flex items-center gap-2 flex-wrap">
                  @{affiliate.handle}
                  <Badge variant="outline" className="text-[10px] text-muted-foreground">
                    {visits.length} visita{visits.length !== 1 ? "s" : ""}
                  </Badge>
                </CardTitle>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-[#0D0D0D]">
                  <TableRow className="hover:bg-transparent border-[#1A1A1A]">
                    <TableHead>Data / Hora</TableHead>
                    <TableHead><div className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Localização</div></TableHead>
                    <TableHead>Usuário Registrado</TableHead>
                    <TableHead>Dispositivo</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visits.map(({ visit, visitUser }) => {
                    const ua = visit.userAgent ?? "";
                    const device =
                      /mobile|android|iphone/i.test(ua) ? "📱 Mobile" :
                      /tablet|ipad/i.test(ua) ? "📟 Tablet" :
                      "🖥️ Desktop";

                    return (
                      <TableRow key={visit.id} className="border-[#1A1A1A] hover:bg-muted/5 text-sm">
                        <TableCell className="text-muted-foreground font-mono text-xs">
                          {new Date(visit.createdAt!).toLocaleString("pt-BR", {
                            day: "2-digit", month: "2-digit", year: "2-digit",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </TableCell>
                        <TableCell className="font-semibold text-xs text-muted-foreground whitespace-nowrap">
                          {visit.visitorIp && ipLocationMap[visit.visitorIp] ? (
                            <div className="flex flex-col">
                              <span>{ipLocationMap[visit.visitorIp].city}</span>
                              <span className="text-[10px] opacity-60 font-medium">{ipLocationMap[visit.visitorIp].region}</span>
                            </div>
                          ) : (
                            <span className="italic opacity-50">Local desconhecido</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {visitUser ? (
                            <div className="flex items-center gap-2">
                              <UserCheck className="h-3.5 w-3.5 text-green-500 shrink-0" />
                              <div>
                                <p className="text-xs font-semibold">{visitUser.name}</p>
                                <p className="text-[10px] text-muted-foreground">{visitUser.email}</p>
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">Visitante anônimo</span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs">{device}</TableCell>
                        <TableCell>
                          {visit.convertedToSale ? (
                            <Badge className="bg-green-500/15 text-green-400 border-green-500/20 text-[10px]">Comprou</Badge>
                          ) : visit.convertedToUser ? (
                            <Badge className="bg-blue-500/15 text-blue-400 border-blue-500/20 text-[10px]">Cadastrou</Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground text-[10px]">Só visitou</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );
      })}

      {/* Empty state for detail section */}
      {allAffiliates.length > 0 &&
        allAffiliates.every(({ affiliate }) => (visitsDetailMap[affiliate.id]?.length ?? 0) === 0) && (
          <Card className="bg-[#0A0A0A] border-[#1A1A1A]">
            <CardContent className="py-16 text-center flex flex-col items-center gap-3">
              <MousePointerClick className="h-10 w-10 text-muted-foreground opacity-20" />
              <p className="text-muted-foreground italic text-sm">
                Nenhuma visita via link de afiliado registrada ainda.
              </p>
              <p className="text-xs text-muted-foreground">
                As visitas aparecem aqui quando alguém acessa o site com{" "}
                <code className="text-primary font-mono">?ref=handle</code> na URL.
              </p>
            </CardContent>
          </Card>
        )}
    </div>
  );
}

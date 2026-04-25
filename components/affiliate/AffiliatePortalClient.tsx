"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Link as LinkIcon, 
  Copy, 
  CheckCircle2, 
  Rocket,
  ShieldCheck,
  Gift,
  LayoutDashboard,
  Wallet,
  Trophy,
  ArrowRight,
  Target,
  MessageCircle,
  Globe,
  Share2,
  ChevronRight,
  Info,
  Wrench,
  MousePointerClick,
  UserCheck,
  MapPin
} from "lucide-react";
import { joinAffiliateAction, requestWithdrawalAction } from "@/actions/affiliate";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Tab = "overview" | "visits" | "tools" | "payouts" | "leaderboard";

export function AffiliatePortalClient({ initialStats }: { initialStats: any }) {
  const [stats, setStats] = useState(initialStats);
  const [handle, setHandle] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  
  // Withdrawal state
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [pixKey, setPixKey] = useState("");
  const [pixKeyType, setPixKeyType] = useState("cpf");
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle) return;
    
    setIsJoining(true);
    const result = await joinAffiliateAction(handle);
    
    if ("success" in result && result.success) {
      toast.success("Parabéns! Você agora é um afiliado oficial.");
      window.location.reload();
    } else {
      const errorMsg = "error" in result ? result.error : "Erro ao entrar no programa";
      toast.error(errorMsg);
    }
    setIsJoining(false);
  };

  const handleWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawAmount || !pixKey) return;
    
    const amount = parseFloat(withdrawAmount);
    if (amount > parseFloat(stats.balance)) {
      toast.error("Saldo insuficiente");
      return;
    }

    setIsWithdrawing(true);
    const formData = new FormData();
    formData.append("amount", withdrawAmount);
    formData.append("pixKey", pixKey);
    formData.append("pixKeyType", pixKeyType);

    const result = await requestWithdrawalAction(formData);

    if ("success" in result && result.success) {
      toast.success("Solicitação de saque enviada com sucesso!");
      setWithdrawAmount("");
      setPixKey("");
      // Refresh local stats if needed or rely on server revalidation
      window.location.reload();
    } else {
      const errorMsg = "error" in result ? result.error : "Erro ao solicitar saque";
      toast.error(errorMsg);
    }
    setIsWithdrawing(false);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    toast.success("Copiado!");
    setTimeout(() => setCopiedText(null), 2000);
  };

  if (!stats) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
        <div className="lg:col-span-3 space-y-10">
          <div className="space-y-6">
            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1 text-sm font-bold rounded-full">
              PROGRAMA DE PARCEIROS 2.0
            </Badge>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              Sua influência <br />
              <span className="text-primary">vale ouro.</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-xl">
              Junte-se ao programa de afiliados mais inovador do mercado de assinaturas. Ganhe dinheiro compartilhando o que você já ama.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-card/50 border border-border/50 p-6 rounded-2xl space-y-3">
              <div className="bg-green-500/10 w-12 h-12 rounded-xl flex items-center justify-center text-green-500">
                <DollarSign className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-lg">Comissões Recorrentes</h4>
              <p className="text-sm text-muted-foreground">Ganhe até 15% em cada venda. Sem limite de ganhos mensais.</p>
            </div>
            <div className="bg-card/50 border border-border/50 p-6 rounded-2xl space-y-3">
              <div className="bg-blue-500/10 w-12 h-12 rounded-xl flex items-center justify-center text-blue-500">
                <Gift className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-lg">Cupons Personalizados</h4>
              <p className="text-sm text-muted-foreground">Crie seu próprio código de desconto e atraia mais clientes.</p>
            </div>
          </div>

          <div className="flex items-center gap-6 pt-4 border-t border-border/30">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted overflow-hidden">
                   <img src={`https://i.pravatar.cc/100?u=${i}`} alt="Avatar" />
                </div>
              ))}
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Junte-se a <span className="text-foreground font-bold">+1.200 parceiros</span> lucrando diariamente.
            </p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <Card className="border-border/50 bg-card/30 backdrop-blur-md shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
               <Rocket className="h-12 w-12 text-primary/10 -rotate-12" />
            </div>
            <CardHeader className="pb-8">
              <CardTitle className="text-2xl font-black italic uppercase">Começar Agora</CardTitle>
              <CardDescription>Escolha seu handle único e ative suas ferramentas.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleJoin} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="handle" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Handle do Afiliado</Label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-black">@</span>
                    <Input 
                      id="handle" 
                      placeholder="seu_nome" 
                      className="pl-10 h-14 bg-muted/20 border-border/50 focus:border-primary text-lg font-bold transition-all"
                      value={handle}
                      onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                      maxLength={15}
                      required
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground text-center">
                    Seu link será: <span className="text-primary font-mono">bigulin.com/v/{handle || "..."}</span>
                  </p>
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest rounded-xl shadow-xl shadow-primary/20 group"
                  disabled={isJoining || handle.length < 3}
                >
                  {isJoining ? "Ativando..." : "Quero ser um Afiliado"}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 border-t border-border/20 pt-6 bg-muted/10">
              <div className="flex items-center gap-3 text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                <ShieldCheck className="h-4 w-4 text-green-500" /> Aprovação Instantânea
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  const [referralLink, setReferralLink] = useState("");

  useEffect(() => {
    setReferralLink(`${window.location.origin}?ref=${stats.handle}`);
  }, [stats.handle]);

  const myCoupon = stats.coupons?.[0]?.code || `${stats.handle.toUpperCase()}10`;
  const nextTierGoal = 10;
  const currentReferrals = stats.referrals?.length || 0;
  const progressToNextTier = Math.min((currentReferrals / nextTierGoal) * 100, 100);

  return (
    <div className="space-y-8">
      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-2xl w-fit border border-border/40">
        <button 
          onClick={() => setActiveTab("overview")}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95",
            activeTab === "overview" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:bg-muted/50"
          )}
        >
          <LayoutDashboard className="h-4 w-4" /> Geral
        </button>
        <button 
          onClick={() => setActiveTab("visits")}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95",
            activeTab === "visits" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:bg-muted/50"
          )}
        >
          <MousePointerClick className="h-4 w-4" /> Visitas
        </button>
        <button 
          onClick={() => setActiveTab("tools")}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95",
            activeTab === "tools" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:bg-muted/50"
          )}
        >
          <Wrench className="h-4 w-4" /> Ferramentas
        </button>
        <button 
          onClick={() => setActiveTab("leaderboard")}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95",
            activeTab === "leaderboard" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:bg-muted/50"
          )}
        >
          <Trophy className="h-4 w-4" /> Ranking
        </button>
        <button 
          onClick={() => setActiveTab("payouts")}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95",
            activeTab === "payouts" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:bg-muted/50"
          )}
        >
          <Wallet className="h-4 w-4" /> Pagamentos
        </button>
      </div>

      {activeTab === "overview" && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-card/30 border-border/50 relative overflow-hidden group hover:border-green-500/30 hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(34,197,94,0.1)]">
               <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 group-hover:scale-125 transition-all duration-700">
                  <DollarSign className="h-24 w-24 text-green-500" />
               </div>
               <CardContent className="p-6">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Saldo Disponível</p>
                  <h3 className="text-4xl font-black text-green-500 mb-2 group-hover:scale-105 origin-left transition-transform duration-500">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(stats.balance))}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] text-green-500 font-bold bg-green-500/10 w-fit px-2 py-0.5 rounded-full group-hover:bg-green-500/20 transition-colors">
                    <TrendingUp className="h-3 w-3" /> +12% esta semana
                  </div>
               </CardContent>
            </Card>

            <Card className="bg-card/30 border-border/50 relative overflow-hidden group hover:border-primary/30 hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(220,38,38,0.1)]">
               <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 group-hover:scale-125 transition-all duration-700">
                  <TrendingUp className="h-24 w-24 text-primary" />
               </div>
               <CardContent className="p-6">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Acumulado</p>
                  <h3 className="text-4xl font-black mb-2 group-hover:scale-105 origin-left transition-transform duration-500">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(stats.totalEarned))}
                  </h3>
                  <p className="text-[10px] text-muted-foreground font-medium italic">Desde o início da parceria</p>
               </CardContent>
            </Card>

            <Card className="bg-card/30 border-border/50 relative overflow-hidden group hover:border-blue-500/30 hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.1)]">
               <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 group-hover:scale-125 transition-all duration-700">
                  <MousePointerClick className="h-24 w-24 text-blue-500" />
               </div>
               <CardContent className="p-6">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Total de Visitas</p>
                  <h3 className="text-4xl font-black mb-2 group-hover:scale-105 origin-left transition-transform duration-500">{stats.visitStats?.totalVisits || 0}</h3>
                  <div className="flex items-center gap-1 text-[10px] text-blue-500 font-bold group-hover:text-blue-400 transition-colors">
                    <Globe className="h-3 w-3" /> Tráfego via link de indicação
                  </div>
               </CardContent>
            </Card>

            <Card className="bg-card/30 border-border/50 relative overflow-hidden group">
               <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                  <UserCheck className="h-24 w-24 text-purple-500" />
               </div>
               <CardContent className="p-6">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Contas Registradas</p>
                  <h3 className="text-4xl font-black mb-2">{stats.visitStats?.convertedUsers || 0}</h3>
                  <div className="flex items-center gap-1 text-[10px] text-purple-500 font-bold">
                    <UserCheck className="h-3 w-3" /> Clientes reais captados
                  </div>
               </CardContent>
            </Card>

            <Card className="bg-card/30 border-border/50 relative overflow-hidden group">
               <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                  <Users className="h-24 w-24 text-cyan-500" />
               </div>
               <CardContent className="p-6">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Total de Vendas</p>
                  <h3 className="text-4xl font-black mb-2">{currentReferrals}</h3>
                  <div className="flex items-center gap-1 text-[10px] text-cyan-500 font-bold">
                    <Target className="h-3 w-3" /> {Math.round((currentReferrals / 50) * 100)}% da meta mensal
                  </div>
               </CardContent>
            </Card>

            <Card className="bg-primary border-none shadow-xl shadow-primary/20 relative overflow-hidden group hover:scale-[1.03] transition-all duration-500 cursor-default">
               <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent group-hover:from-white/30 transition-all duration-500" />
               <div className="absolute -right-6 -bottom-6 opacity-20 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700">
                  <Trophy className="h-24 w-24 text-white" />
               </div>
               <CardContent className="p-6 relative z-10 text-white">
                  <p className="text-xs font-bold text-white/70 uppercase tracking-widest mb-1">Sua Comissão</p>
                  <h3 className="text-5xl font-black mb-2 group-hover:scale-110 origin-left transition-transform duration-500">{stats.commissionRate}%</h3>
                  <Badge className="bg-white/20 text-white border-none text-[9px] uppercase font-bold group-hover:bg-white/30 transition-colors">
                    Nível Bronze
                  </Badge>
               </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tier Progress */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="bg-card/30 border-border/50 p-8 overflow-hidden relative group hover:border-primary/20 transition-all duration-500">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[100px] rounded-full -mr-48 -mt-48 group-hover:bg-primary/10 transition-all duration-700" />
                <div className="relative z-10">
                  <div className="flex justify-between items-end mb-6">
                    <div className="group-hover:translate-x-1 transition-transform duration-500">
                      <h4 className="text-xl font-bold mb-1">Rumo ao Nível Silver 🥈</h4>
                      <p className="text-sm text-muted-foreground">Complete {nextTierGoal - currentReferrals} vendas para subir sua comissão para 15%.</p>
                    </div>
                    <div className="text-right group-hover:-translate-x-1 transition-transform duration-500">
                       <span className="text-3xl font-black text-primary">{currentReferrals}</span>
                       <span className="text-muted-foreground font-bold"> / {nextTierGoal}</span>
                    </div>
                  </div>
                  <Progress value={progressToNextTier} className="h-3 bg-muted/50 overflow-hidden" />
                  <div className="grid grid-cols-4 mt-8 gap-4">
                     {[
                       { label: "Bronze (10%)", active: true },
                       { label: "Silver (15%)", active: false },
                       { label: "Gold (20%)", active: false },
                       { label: "Platinum (25%)", active: false }
                     ].map((tier, idx) => (
                       <div key={idx} className="flex flex-col items-center gap-2 group/tier cursor-default">
                          <div className={cn("w-2 h-2 rounded-full transition-all duration-500", tier.active ? "bg-primary scale-125 shadow-[0_0_10px_rgba(220,38,38,0.5)]" : "bg-muted group-hover/tier:bg-muted-foreground")} />
                          <span className={cn("text-[10px] font-bold uppercase transition-colors duration-500", tier.active ? "text-primary" : "text-muted-foreground group-hover/tier:text-zinc-400")}>{tier.label}</span>
                       </div>
                     ))}
                  </div>
                </div>
              </Card>

              {/* Quick Tools Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Card className="bg-card/30 border-border/50 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <LinkIcon className="h-5 w-5 text-primary" />
                    </div>
                    <h5 className="font-bold">Link Rápido</h5>
                  </div>
                  <div className="flex gap-2">
                    <Input readOnly value={referralLink} className="h-9 text-[10px] font-mono bg-muted/20" />
                    <Button size="sm" variant="secondary" onClick={() => copyToClipboard(referralLink, "link")}>
                      {copiedText === "link" ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </Card>
                <Card className="bg-card/30 border-border/50 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Gift className="h-5 w-5 text-primary" />
                    </div>
                    <h5 className="font-bold">Seu Cupom</h5>
                  </div>
                  <div className="flex gap-2">
                    <Input readOnly value={myCoupon} className="h-9 text-xs font-black tracking-widest bg-muted/20 text-primary" />
                    <Button size="sm" variant="secondary" onClick={() => copyToClipboard(myCoupon, "coupon")}>
                      {copiedText === "coupon" ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </Card>
              </div>
            </div>

            {/* Recent Activity */}
            <Card className="bg-card/30 border-border/50">
               <CardHeader className="border-b border-border/30">
                  <CardTitle className="text-lg">Atividade Recente</CardTitle>
               </CardHeader>
               <CardContent className="p-0">
                  {stats.referrals?.length > 0 ? (
                    <div className="divide-y divide-border/20">
                      {stats.referrals.map((ref: any) => (
                        <div key={ref.id} className="p-4 flex items-center justify-between hover:bg-muted/10 transition-colors">
                           <div className="flex items-center gap-3">
                              <div className="bg-green-500/10 p-2 rounded-full text-green-500">
                                 <DollarSign className="h-4 w-4" />
                              </div>
                              <div>
                                 <p className="text-sm font-bold">Venda Confirmada</p>
                                 <p className="text-[10px] text-muted-foreground uppercase">{new Date(ref.createdAt).toLocaleDateString("pt-BR")}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-sm font-black text-green-500">+{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(ref.commissionAmount))}</p>
                              <Badge variant="outline" className="text-[8px] h-4 uppercase border-green-500/30 text-green-500">{ref.status}</Badge>
                           </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center flex flex-col items-center gap-4">
                       <div className="bg-muted/50 p-4 rounded-full">
                          <Rocket className="h-8 w-8 text-muted-foreground opacity-20" />
                       </div>
                       <p className="text-sm text-muted-foreground italic">Nada por aqui ainda...</p>
                    </div>
                  )}
               </CardContent>
               <CardFooter className="p-4 border-t border-border/30 justify-center">
                  <Button variant="ghost" size="sm" className="text-xs font-bold text-muted-foreground hover:text-primary">
                    Ver Histórico Completo <ChevronRight className="ml-1 h-3 w-3" />
                  </Button>
               </CardFooter>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "visits" && (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
           <Card className="bg-card/30 border-border/50 overflow-hidden">
              <CardHeader className="border-b border-border/30">
                 <CardTitle className="text-xl font-black italic uppercase">Detalhamento de Visitas</CardTitle>
                 <CardDescription>Acompanhe quem está acessando seu link em tempo real.</CardDescription>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                 <Table>
                    <TableHeader className="bg-muted/30">
                       <TableRow className="hover:bg-transparent border-border/30">
                          <TableHead>Data / Hora</TableHead>
                          <TableHead><div className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Localização</div></TableHead>
                          <TableHead>Usuário</TableHead>
                          <TableHead>Dispositivo</TableHead>
                          <TableHead>Status</TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                       {stats.visits?.length > 0 ? (
                         stats.visits.map(({ visit, visitor, location: loc }: any) => {
                           const ua = visit.userAgent ?? "";
                           const device =
                             /mobile|android|iphone/i.test(ua) ? "📱 Mobile" :
                             /tablet|ipad/i.test(ua) ? "📟 Tablet" :
                             "🖥️ Desktop";

                           return (
                             <TableRow key={visit.id} className="border-border/20 hover:bg-muted/5 text-sm">
                               <TableCell className="text-muted-foreground font-mono text-xs whitespace-nowrap">
                                 {new Date(visit.createdAt!).toLocaleString("pt-BR", {
                                   day: "2-digit", month: "2-digit", year: "2-digit",
                                   hour: "2-digit", minute: "2-digit",
                                 })}
                               </TableCell>
                               <TableCell className="font-semibold text-xs text-muted-foreground whitespace-nowrap">
                                 {loc ? (
                                   <div className="flex flex-col">
                                     <span>{loc.city}</span>
                                     <span className="text-[10px] opacity-60 font-medium">{loc.regionName}</span>
                                   </div>
                                 ) : (
                                   <span className="italic opacity-50">Local desconhecido</span>
                                 )}
                               </TableCell>
                               <TableCell>
                                 {visitor ? (
                                   <div className="flex items-center gap-2">
                                     <UserCheck className="h-3.5 w-3.5 text-green-500 shrink-0" />
                                     <div>
                                       <p className="text-xs font-semibold">{visitor.name}</p>
                                       <p className="text-[10px] text-muted-foreground">{visitor.email}</p>
                                     </div>
                                   </div>
                                 ) : (
                                   <span className="text-xs text-muted-foreground italic">Visitante anônimo</span>
                                 )}
                               </TableCell>
                               <TableCell className="text-xs whitespace-nowrap">{device}</TableCell>
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
                         })
                       ) : (
                         <TableRow>
                           <TableCell colSpan={5} className="py-12 text-center">
                              <div className="flex flex-col items-center gap-3 opacity-20">
                                 <MousePointerClick className="h-10 w-10" />
                                 <p className="text-sm font-medium">Nenhuma visita registrada ainda.</p>
                              </div>
                           </TableCell>
                         </TableRow>
                       )}
                    </TableBody>
                 </Table>
              </CardContent>
           </Card>
        </div>
      )}

      {activeTab === "tools" && (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                 <Card className="bg-card/30 border-border/50">
                    <CardHeader>
                       <CardTitle>Kit de Marketing</CardTitle>
                       <CardDescription>Use nossos templates prontos para divulgar em suas redes.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8 p-6">
                       <div className="space-y-4">
                          <Label className="flex items-center gap-2">
                             <MessageCircle className="h-4 w-4 text-green-500" /> Sugestão para Instagram / WhatsApp
                          </Label>
                          <div className="relative">
                             <textarea 
                               readOnly 
                               value={`🔥 Melhores assinaturas premium (Netflix, Spotify, VPN) com o menor preço do mercado! Entrega instantânea e suporte 24h.\n\nUse meu cupom: ${myCoupon} e ganhe 10% de desconto!\n\nLink: bigulin.com/v/${stats.handle}`}
                               className="w-full h-32 bg-muted/20 border border-border/50 rounded-xl p-4 text-sm font-medium resize-none focus:outline-none"
                             />
                             <Button 
                               size="sm" 
                               className="absolute bottom-4 right-4" 
                               onClick={() => copyToClipboard(`🔥 Melhores assinaturas premium...`, "kit1")}
                             >
                               {copiedText === "kit1" ? <CheckCircle2 className="h-4 w-4" /> : "Copiar Legenda"}
                             </Button>
                          </div>
                       </div>

                       <div className="space-y-4">
                          <Label className="flex items-center gap-2">
                             <Globe className="h-4 w-4 text-blue-400" /> Sugestão para Redes Sociais / X
                          </Label>
                          <div className="relative">
                             <textarea 
                               readOnly 
                               value={`Querendo economizar nas assinaturas? 💸 Use meu cupom ${myCoupon} na Bigulin e garanta 10% OFF agora! 🚀\n\nConfere aí: bigulin.com/v/${stats.handle}`}
                               className="w-full h-24 bg-muted/20 border border-border/50 rounded-xl p-4 text-sm font-medium resize-none focus:outline-none"
                             />
                             <Button 
                               size="sm" 
                               className="absolute bottom-4 right-4" 
                               onClick={() => copyToClipboard(`Querendo economizar nas assinaturas...`, "kit2")}
                             >
                               {copiedText === "kit2" ? <CheckCircle2 className="h-4 w-4" /> : "Copiar Tweet"}
                             </Button>
                          </div>
                       </div>
                    </CardContent>
                 </Card>

                 <Card className="bg-card/30 border-border/50">
                    <CardHeader>
                       <CardTitle>Banners e Criativos</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                       <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {[1,2,3].map(i => (
                            <div key={i} className="aspect-square bg-muted/30 rounded-xl border-2 border-dashed border-border/50 flex flex-col items-center justify-center text-center p-4 group cursor-pointer hover:border-primary/50 transition-all">
                               <Share2 className="h-6 w-6 text-muted-foreground mb-2 group-hover:text-primary transition-colors" />
                               <span className="text-[10px] font-bold uppercase text-muted-foreground">Baixar Criativo #{i}</span>
                            </div>
                          ))}
                       </div>
                    </CardContent>
                 </Card>
              </div>

              <div className="space-y-6">
                 <Card className="bg-primary/10 border-primary/20">
                    <CardHeader>
                       <CardTitle className="text-sm uppercase tracking-widest font-black">Regras da Parceria</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-xs font-medium text-muted-foreground leading-relaxed">
                       <div className="flex gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1 shrink-0" />
                          <p>O cookie de indicação tem validade de 30 dias após o primeiro clique.</p>
                       </div>
                       <div className="flex gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1 shrink-0" />
                          <p>Comissões são creditadas instantaneamente após a confirmação do pagamento.</p>
                       </div>
                       <div className="flex gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1 shrink-0" />
                          <p>É proibido o uso de técnicas de SPAM ou anúncios diretos com o link em redes de pesquisa.</p>
                       </div>
                    </CardContent>
                 </Card>
              </div>
           </div>
        </div>
      )}

      {activeTab === "leaderboard" && (
        <div className="animate-in fade-in zoom-in-95 duration-500">
           <Card className="bg-card/30 border-border/50 max-w-2xl mx-auto">
              <CardHeader className="text-center">
                 <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/10 text-yellow-500 mb-4 mx-auto border-2 border-yellow-500/20">
                    <Trophy className="h-8 w-8" />
                 </div>
                 <CardTitle className="text-2xl font-black italic uppercase">Top Parceiros do Mês</CardTitle>
                 <CardDescription>Os afiliados que mais geraram vendas este mês.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                 <div className="divide-y divide-border/20">
                    {[
                      { name: "rafael_pro", sales: 154, earned: "R$ 1.540,00" },
                      { name: "tech_ofertas", sales: 122, earned: "R$ 1.220,00" },
                      { name: "desconto_ja", sales: 98, earned: "R$ 980,00" },
                      { name: "seu_nome_aqui", sales: 0, earned: "R$ 0,00", isMe: true }
                    ].map((user, idx) => (
                      <div key={idx} className={cn(
                        "p-6 flex items-center justify-between",
                        user.isMe && "bg-primary/5"
                      )}>
                        <div className="flex items-center gap-4">
                           <div className={cn(
                             "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs",
                             idx === 0 ? "bg-yellow-500 text-black" : 
                             idx === 1 ? "bg-slate-300 text-black" : 
                             idx === 2 ? "bg-orange-600 text-white" : "bg-muted text-muted-foreground"
                           )}>
                             {idx + 1}
                           </div>
                           <div>
                              <p className="font-bold flex items-center gap-2">
                                @{user.name} 
                                {user.isMe && <Badge className="bg-primary text-[8px] h-4">VOCÊ</Badge>}
                              </p>
                              <p className="text-xs text-muted-foreground">{user.sales} vendas realizadas</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="font-black text-primary">{user.earned}</p>
                           {idx === 0 && <span className="text-[8px] font-bold text-yellow-500 uppercase tracking-widest">Nível Platinum</span>}
                        </div>
                      </div>
                    ))}
                 </div>
              </CardContent>
           </Card>
        </div>
      )}

      {activeTab === "payouts" && (
        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                 <Card className="bg-card/30 border-border/50">
                    <CardHeader>
                       <CardTitle>Solicitar Saque</CardTitle>
                       <CardDescription>Transfira seus lucros diretamente para sua conta PIX.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                       <form onSubmit={handleWithdrawal} className="space-y-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <Label className="text-xs font-bold text-muted-foreground uppercase">Valor do Saque</Label>
                                <div className="relative">
                                   <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">R$</span>
                                   <Input 
                                      type="number" 
                                      placeholder="0,00" 
                                      step="0.01"
                                      min="50"
                                      value={withdrawAmount}
                                      onChange={(e) => setWithdrawAmount(e.target.value)}
                                      className="pl-10 h-12 bg-muted/20 border-border/50 font-bold" 
                                      required
                                   />
                                </div>
                                <p className="text-[10px] text-muted-foreground italic">Mínimo de R$ 50,00</p>
                             </div>
                             <div className="space-y-2">
                                <Label className="text-xs font-bold text-muted-foreground uppercase">Tipo de Chave</Label>
                                <Select value={pixKeyType} onValueChange={setPixKeyType}>
                                   <SelectTrigger className="h-12 bg-muted/20 border-border/50 font-bold">
                                      <SelectValue placeholder="Selecione o tipo" />
                                   </SelectTrigger>
                                   <SelectContent className="bg-[#0A0A0A] border-[#1A1A1A] text-white">
                                      <SelectItem value="cpf">CPF</SelectItem>
                                      <SelectItem value="email">E-mail</SelectItem>
                                      <SelectItem value="phone">Celular</SelectItem>
                                      <SelectItem value="random">Chave Aleatória</SelectItem>
                                   </SelectContent>
                                </Select>
                             </div>
                          </div>
                          <div className="space-y-2">
                             <Label className="text-xs font-bold text-muted-foreground uppercase">Chave PIX</Label>
                             <Input 
                                placeholder="Insira sua chave aqui" 
                                value={pixKey}
                                onChange={(e) => setPixKey(e.target.value)}
                                className="h-12 bg-muted/20 border-border/50 font-bold" 
                                required
                             />
                          </div>
                          <Button 
                            type="submit"
                            disabled={isWithdrawing || !withdrawAmount || !pixKey}
                            className="w-full h-14 bg-green-600 hover:bg-green-500 text-white font-black uppercase tracking-widest shadow-xl shadow-green-600/20 group disabled:opacity-50"
                          >
                             {isWithdrawing ? "Processando..." : "Confirmar Saque via PIX ⚡"}
                             <Wallet className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                          </Button>
                       </form>
                    </CardContent>
                 </Card>

                 {/* Withdrawal History Table */}
                 <Card className="bg-card/30 border-border/50 overflow-hidden">
                    <CardHeader className="border-b border-border/30">
                       <CardTitle className="text-lg font-bold">Histórico de Saques</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 overflow-x-auto">
                       <Table>
                          <TableHeader className="bg-muted/30">
                             <TableRow className="hover:bg-transparent border-border/30">
                                <TableHead>Data</TableHead>
                                <TableHead>Valor</TableHead>
                                <TableHead>Chave PIX</TableHead>
                                <TableHead>Status</TableHead>
                             </TableRow>
                          </TableHeader>
                          <TableBody>
                             {stats.withdrawals?.length > 0 ? (
                               stats.withdrawals.map((w: any) => (
                                 <TableRow key={w.id} className="border-border/20 hover:bg-muted/5">
                                   <TableCell className="text-xs text-muted-foreground font-mono">
                                     {new Date(w.createdAt).toLocaleDateString("pt-BR")}
                                   </TableCell>
                                   <TableCell className="font-bold">
                                     {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(w.amount))}
                                   </TableCell>
                                   <TableCell>
                                      <div className="text-xs">
                                         <p className="font-bold uppercase text-[9px] text-muted-foreground">{w.pixKeyType}</p>
                                         <p className="font-mono">{w.pixKey}</p>
                                      </div>
                                   </TableCell>
                                   <TableCell>
                                      <Badge 
                                        variant="outline" 
                                        className={cn(
                                          "text-[9px] uppercase font-bold",
                                          w.status === "PENDING" && "border-yellow-500/50 text-yellow-500 bg-yellow-500/10",
                                          w.status === "APPROVED" && "border-green-500/50 text-green-500 bg-green-500/10",
                                          w.status === "REJECTED" && "border-red-500/50 text-red-500 bg-red-500/10",
                                        )}
                                      >
                                         {w.status === "PENDING" ? "Pendente" : 
                                          w.status === "APPROVED" ? "Aprovado" : "Rejeitado"}
                                      </Badge>
                                      {w.adminNotes && (
                                        <p className="text-[9px] text-muted-foreground mt-1 max-w-[150px] truncate" title={w.adminNotes}>
                                          Note: {w.adminNotes}
                                        </p>
                                      )}
                                   </TableCell>
                                 </TableRow>
                               ))
                             ) : (
                               <TableRow>
                                 <TableCell colSpan={4} className="py-12 text-center text-muted-foreground italic text-sm">
                                   Nenhum saque solicitado ainda.
                                 </TableCell>
                               </TableRow>
                             )}
                          </TableBody>
                       </Table>
                    </CardContent>
                 </Card>
              </div>

              <Card className="bg-muted/10 border-border/50 h-fit">
                 <CardHeader>
                    <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                       <Info className="h-4 w-4 text-primary" /> Info de Pagamento
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    <div className="p-4 rounded-xl bg-card/50 border border-border/30">
                       <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Mínimo para Saque</p>
                       <p className="text-xl font-black text-primary">R$ 50,00</p>
                    </div>
                    <div className="p-4 rounded-xl bg-card/50 border border-border/30">
                       <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Prazo de Processamento</p>
                       <p className="text-xl font-black">24 Horas Úteis</p>
                    </div>
                    <div className="p-4 rounded-xl bg-card/50 border border-border/30">
                       <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Taxa de Saque</p>
                       <p className="text-xl font-black text-green-500">GRÁTIS (PIX)</p>
                    </div>
                 </CardContent>
              </Card>
           </div>
        </div>
      )}
    </div>
  );
}

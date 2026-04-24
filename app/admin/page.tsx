import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Clock,
} from "lucide-react";
import { db } from "@/db";
import { products, orders, users } from "@/db/schema";
import { sql, desc, eq } from "drizzle-orm";
import Link from "next/link";

export default async function AdminDashboard() {
  const [productsCount] = await db.select({ count: sql<number>`count(*)` }).from(products);
  const [usersCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
  const [ordersCount] = await db.select({ count: sql<number>`count(*)` }).from(orders);
  const [paidCount] = await db.select({ count: sql<number>`count(*)` }).from(orders).where(sql`status = 'PAID'`);
  const [pendingCount] = await db.select({ count: sql<number>`count(*)` }).from(orders).where(sql`status = 'PENDING'`);

  const [revenueResult] = await db
    .select({ total: sql<string>`COALESCE(sum(totalAmount), 0)` })
    .from(orders)
    .where(sql`status = 'PAID'`);

  const revenue = Number(revenueResult?.total ?? 0);
  const formatBRL = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  // Recent orders with user info
  const recentOrders = await db
    .select({ order: orders, user: users })
    .from(orders)
    .innerJoin(users, eq(orders.userId, users.id))
    .orderBy(desc(orders.createdAt))
    .limit(6);

  const statCards = [
    {
      label: "Receita Total",
      value: formatBRL(revenue),
      icon: DollarSign,
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/10",
      glow: "shadow-green-500/5",
    },
    {
      label: "Vendas Pagas",
      value: paidCount?.count ?? 0,
      icon: CheckCircle,
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/10",
      glow: "shadow-primary/5",
    },
    {
      label: "Usuários",
      value: usersCount?.count ?? 0,
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/10",
      glow: "shadow-blue-500/5",
    },
    {
      label: "Produtos",
      value: productsCount?.count ?? 0,
      icon: Package,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/10",
      glow: "shadow-purple-500/5",
    },
  ];

  const quickLinks = [
    { href: "/admin/products", label: "Gerenciar Produtos", icon: Package, color: "from-purple-600/20 to-purple-600/5" },
    { href: "/admin/users", label: "Gerenciar Usuários", icon: Users, color: "from-blue-600/20 to-blue-600/5" },
    { href: "/admin/sales", label: "Ver Vendas", icon: ShoppingCart, color: "from-green-600/20 to-green-600/5" },
    { href: "/admin/affiliates", label: "Painel de Afiliados", icon: TrendingUp, color: "from-yellow-600/20 to-yellow-600/5" },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-primary mb-1">Sistema de Controle</p>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            Visão <span className="text-primary">Geral</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Centro de comando do Império Bigulin.
          </p>
        </div>
        {pendingCount && Number(pendingCount.count) > 0 && (
          <Link
            href="/admin/sales"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-bold hover:bg-yellow-500/20 transition-all"
          >
            <Clock className="h-4 w-4" />
            {pendingCount.count} pendente{Number(pendingCount.count) > 1 ? "s" : ""}
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map(({ label, value, icon: Icon, color, bg, border, glow }) => (
          <div
            key={label}
            className={`rounded-2xl bg-[#0A0A0A] border ${border} p-5 shadow-lg ${glow} flex flex-col gap-4`}
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</p>
              <div className={`h-8 w-8 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
            </div>
            <p className={`text-3xl font-black ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 rounded-2xl bg-[#0A0A0A] border border-[#1A1A1A] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1A1A1A]">
            <h2 className="font-black text-sm uppercase tracking-widest">Pedidos Recentes</h2>
            <Link
              href="/admin/sales"
              className="flex items-center gap-1 text-xs text-primary hover:underline font-bold"
            >
              Ver todos <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-[#1A1A1A]">
            {recentOrders.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground text-sm italic">
                Nenhuma venda registrada ainda.
              </div>
            ) : (
              recentOrders.map(({ order, user }) => (
                <div key={order.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-[10px] font-black text-primary shrink-0">
                      {user.name?.slice(0, 2).toUpperCase() ?? "??"}
                    </div>
                    <div>
                      <p className="font-bold text-xs">{user.name}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">
                        #{order.id.split("-")[0].toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-sm">
                      {formatBRL(Number(order.totalAmount))}
                    </span>
                    {order.status === "PAID" ? (
                      <span className="text-[10px] font-black bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">
                        PAGO
                      </span>
                    ) : (
                      <span className="text-[10px] font-black bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded-full">
                        PENDENTE
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Access */}
        <div className="rounded-2xl bg-[#0A0A0A] border border-[#1A1A1A] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1A1A1A]">
            <h2 className="font-black text-sm uppercase tracking-widest">Acesso Rápido</h2>
          </div>
          <div className="p-4 space-y-2">
            {quickLinks.map(({ href, label, icon: Icon, color }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r ${color} border border-white/5 hover:border-white/10 group transition-all`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-muted-foreground group-hover:text-white transition-colors" />
                  <span className="text-sm font-bold text-muted-foreground group-hover:text-white transition-colors">
                    {label}
                  </span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>

          {/* Revenue highlight */}
          <div className="mx-4 mb-4 p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/10">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Receita Confirmada</p>
            <p className="text-2xl font-black text-green-400">{formatBRL(revenue)}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{paidCount?.count ?? 0} pedidos pagos</p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { db } from "@/db";
import { orders, users } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import {
  ShoppingCart,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  CalendarDays,
  Hash,
} from "lucide-react";

export default async function AdminSalesPage() {
  const allOrders = await db
    .select({ order: orders, user: users })
    .from(orders)
    .innerJoin(users, eq(orders.userId, users.id))
    .orderBy(desc(orders.createdAt));

  const [revenueResult] = await db
    .select({ total: sql<string>`COALESCE(sum(totalAmount), 0)` })
    .from(orders)
    .where(sql`status = 'PAID'`);

  const paid = allOrders.filter((o) => o.order.status === "PAID");
  const pending = allOrders.filter((o) => o.order.status === "PENDING");
  const cancelled = allOrders.filter((o) => o.order.status === "CANCELLED");
  const revenue = Number(revenueResult?.total ?? 0);

  const formatBRL = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  const statusConfig = {
    PAID: {
      label: "Pago",
      classes: "bg-green-500/10 text-green-400 border-green-500/20",
      icon: CheckCircle,
    },
    PENDING: {
      label: "Pendente",
      classes: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      icon: Clock,
    },
    CANCELLED: {
      label: "Cancelado",
      classes: "bg-red-500/10 text-red-400 border-red-500/20",
      icon: XCircle,
    },
  } as const;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">
          Histórico de <span className="text-primary">Vendas</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Acompanhe todas as transações realizadas na plataforma.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Receita Total",
            value: formatBRL(revenue),
            icon: DollarSign,
            color: "text-green-400",
            bg: "bg-green-500/10",
          },
          {
            label: "Pedidos Pagos",
            value: paid.length,
            icon: CheckCircle,
            color: "text-primary",
            bg: "bg-primary/10",
          },
          {
            label: "Pendentes",
            value: pending.length,
            icon: Clock,
            color: "text-yellow-400",
            bg: "bg-yellow-500/10",
          },
          {
            label: "Cancelados",
            value: cancelled.length,
            icon: XCircle,
            color: "text-red-400",
            bg: "bg-red-500/10",
          },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="rounded-2xl bg-[#0A0A0A] border border-[#1A1A1A] p-4 flex items-center gap-3"
          >
            <div className={`h-9 w-9 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</p>
              <p className={`text-xl font-black ${color}`}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Orders list */}
      <div className="rounded-2xl bg-[#0A0A0A] border border-[#1A1A1A] overflow-hidden">
        {/* Table header */}
        <div className="hidden md:grid grid-cols-[120px_1fr_140px_120px_120px] gap-4 px-5 py-3 bg-[#111111] border-b border-[#1A1A1A] text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          <span className="flex items-center gap-1"><Hash className="h-3 w-3" /> Pedido</span>
          <span>Cliente</span>
          <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" /> Data</span>
          <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> Total</span>
          <span>Status</span>
        </div>

        {allOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <ShoppingCart className="h-12 w-12 text-muted-foreground/20 mb-4" />
            <p className="text-muted-foreground font-semibold">Nenhuma venda realizada ainda.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#1A1A1A]">
            {allOrders.map(({ order, user }) => {
              const status = statusConfig[order.status as keyof typeof statusConfig] ?? statusConfig.PENDING;
              const StatusIcon = status.icon;
              return (
                <div
                  key={order.id}
                  className="grid grid-cols-1 md:grid-cols-[120px_1fr_140px_120px_120px] gap-4 px-5 py-4 items-center hover:bg-white/[0.02] transition-colors"
                >
                  {/* Order ID */}
                  <span className="font-mono text-xs text-muted-foreground font-bold">
                    #{order.id.split("-")[0].toUpperCase()}
                  </span>

                  {/* Customer */}
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary/30 to-primary/5 flex items-center justify-center text-[10px] font-black text-primary shrink-0">
                      {user.name?.slice(0, 2).toUpperCase() ?? "??"}
                    </div>
                    <div>
                      <p className="font-bold text-sm leading-tight">{user.name}</p>
                      <p className="text-xs text-muted-foreground leading-tight">{user.email}</p>
                    </div>
                  </div>

                  {/* Date */}
                  <span className="text-xs text-muted-foreground">
                    {new Date(order.createdAt!).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>

                  {/* Amount */}
                  <span className="font-black text-sm">
                    {formatBRL(Number(order.totalAmount))}
                  </span>

                  {/* Status */}
                  <div>
                    <span
                      className={`inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-lg border uppercase ${status.classes}`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

import { db } from "@/db";
import { stockAuditLogs, users, orders, stockItems, products } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { ClipboardList, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function AdminAuditPage() {
  const logs = await db
    .select({
      log: stockAuditLogs,
      admin: users,
      order: orders,
      stockItem: stockItems,
      product: products,
    })
    .from(stockAuditLogs)
    .innerJoin(users, eq(stockAuditLogs.adminId, users.id))
    .innerJoin(orders, eq(stockAuditLogs.orderId, orders.id))
    .innerJoin(stockItems, eq(stockAuditLogs.stockItemId, stockItems.id))
    .innerJoin(products, eq(stockItems.productId, products.id))
    .orderBy(desc(stockAuditLogs.createdAt))
    .limit(50); // Get last 50 logs

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">
          Auditoria de <span className="text-primary">Estoque</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Histórico de alterações manuais nas entregas de produtos.
        </p>
      </div>

      <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl overflow-hidden">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <ClipboardList className="h-12 w-12 text-muted-foreground/20 mb-4" />
            <p className="text-muted-foreground font-semibold">Nenhum registro de auditoria encontrado.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#1A1A1A]">
            {logs.map(({ log, admin, order, stockItem, product }) => {
              const isAdded = log.action === "DELIVERY_ADDED";
              
              return (
                <div key={log.id} className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between hover:bg-white/[0.02] transition-colors">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className={\`text-xs font-black px-2 py-0.5 rounded-sm uppercase \${isAdded ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}\`}>
                        {isAdded ? "Adicionado" : "Removido"}
                      </span>
                      <span className="text-sm font-semibold">{product.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Admin: <strong className="text-white">{admin.name || admin.email}</strong> • 
                      Detalhes: {log.details}
                    </p>
                  </div>

                  <div className="flex flex-col md:items-end text-sm">
                    <Link href={\`/admin/orders/\${order.id}\`} className="text-primary hover:underline font-bold">
                      Pedido #{order.id.split('-')[0].toUpperCase()}
                    </Link>
                    <span className="text-xs text-muted-foreground">
                      {new Date(log.createdAt!).toLocaleString("pt-BR")}
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

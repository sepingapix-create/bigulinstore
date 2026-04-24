import { db } from "@/db";
import { orders, productInventory } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { OrderClient } from "@/components/order/OrderClient";
import Link from "next/link";
import { ChevronLeft, Home } from "lucide-react";

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, resolvedParams.id),
  });

  if (!order) {
    notFound();
  }

  const deliveredContent = await db.query.productInventory.findMany({
    where: eq(productInventory.orderId, order.id),
  });

  return (
    <div className="flex-1 flex flex-col bg-background">
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Detalhes do Pedido</h1>
            <p className="text-muted-foreground text-sm">Pedido #{resolvedParams.id.split('-')[0].toUpperCase()}</p>
          </div>
          
          <Link href="/">
            <button className="group relative flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-red-600/10 border border-white/10 hover:border-red-500/50 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-600/5 to-red-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <Home className="h-4 w-4 text-red-500 group-hover:rotate-12 transition-transform" />
              <span className="text-xs font-black uppercase italic tracking-widest px-1">Voltar ao Menu Principal</span>
              <ChevronLeft className="h-4 w-4 text-muted-foreground group-hover:-translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>

        <OrderClient 
          orderId={order.id}
          initialPixCode={order.pixCode || ""}
          initialQrCodeImage={order.qrCodeImage || ""}
          initialStatus={order.status}
          deliveredContent={deliveredContent.map(c => c.content)}
        />
      </main>
    </div>
  );
}

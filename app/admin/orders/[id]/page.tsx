import { db } from "@/db";
import { orders, users, orderItems, products, stockDeliveries, stockItems } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { notFound } from "next/navigation";
import { OrderDeliveryEditor } from "@/components/admin/OrderDeliveryEditor";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function AdminOrderDetailsPage({ params }: { params: { id: string } }) {
  // Fetch order details
  const [order] = await db
    .select({ order: orders, user: users })
    .from(orders)
    .innerJoin(users, eq(orders.userId, users.id))
    .where(eq(orders.id, params.id));

  if (!order) {
    notFound();
  }

  // Fetch purchased items
  const items = await db
    .select({
      id: orderItems.id,
      productId: orderItems.productId,
      quantity: orderItems.quantity,
      priceAtPurchase: orderItems.priceAtPurchase,
      productName: products.name,
    })
    .from(orderItems)
    .innerJoin(products, eq(orderItems.productId, products.id))
    .where(eq(orderItems.orderId, params.id));

  // Build the info required by the Delivery Editor
  const itemsInfo = await Promise.all(
    items.map(async (item) => {
      // Fetch deliveries for this product in this order
      const deliveries = await db
        .select({
          id: stockDeliveries.id,
          stockItemId: stockDeliveries.stockItemId,
          content: stockItems.content,
          deliveredAt: stockDeliveries.deliveredAt,
        })
        .from(stockDeliveries)
        .innerJoin(stockItems, eq(stockDeliveries.stockItemId, stockItems.id))
        .where(
          and(
            eq(stockDeliveries.orderId, params.id),
            eq(stockItems.productId, item.productId)
          )
        );

      // Fetch available stock items for this product
      const availableStockItems = await db
        .select({
          id: stockItems.id,
          content: stockItems.content,
          usedSlots: stockItems.usedSlots,
          maxSlots: stockItems.maxSlots,
        })
        .from(stockItems)
        .where(
          and(
            eq(stockItems.productId, item.productId),
            sql`${stockItems.usedSlots} < ${stockItems.maxSlots}`
          )
        );

      return {
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        deliveries,
        availableStockItems,
      };
    })
  );

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div>
        <Link href="/admin/sales" className="text-muted-foreground hover:text-white flex items-center gap-2 mb-4 w-fit transition-colors text-sm font-semibold">
          <ArrowLeft className="w-4 h-4" /> Voltar para Vendas
        </Link>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">
          Detalhes do <span className="text-primary">Pedido</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          #{order.order.id} - {order.user.name} ({order.user.email})
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] p-6 rounded-2xl">
          <h2 className="font-bold mb-4 uppercase tracking-wider text-sm text-muted-foreground">Informações</h2>
          <div className="space-y-2">
            <p><span className="text-muted-foreground">Status:</span> <strong className="ml-2">{order.order.status}</strong></p>
            <p><span className="text-muted-foreground">Total:</span> <strong className="ml-2">R$ {Number(order.order.totalAmount).toFixed(2).replace('.', ',')}</strong></p>
            <p><span className="text-muted-foreground">Data:</span> <strong className="ml-2">{new Date(order.order.createdAt!).toLocaleString()}</strong></p>
          </div>
        </div>
      </div>

      {/* Editor Component */}
      <div className="bg-[#0A0A0A] border border-[#1A1A1A] p-6 rounded-2xl">
        <OrderDeliveryEditor orderId={params.id} items={itemsInfo} orderStatus={order.order.status} />
      </div>
    </div>
  );
}

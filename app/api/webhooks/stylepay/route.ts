import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { fulfillOrder } from "@/actions/checkout";
import { sendEmailDirect } from "@/lib/email/sender";
import { OrderCancelledEmail } from "@/lib/email/templates/OrderCancelledEmail";

export async function POST(req: NextRequest) {
  try {
    const rawPayload = await req.json();
    const payload = rawPayload as any;

    // Log detalhado para debug
    const eventName = payload.event || payload.event_type || "indefinido";
    console.log(`[WEBHOOK] Evento Stylepay recebido: ${eventName}`, JSON.stringify(payload));

    // 1. Extrair identificadores (tentar vários campos possíveis)
    const requestNumber = payload.requestNumber || payload.metadata?.requestNumber || payload.external_id;
    const idTransaction = payload.idTransaction || payload.transaction_id || payload.id;
    const status = (payload.statusTransaction || payload.status || "").toUpperCase();

    // 2. Verificar se é um evento de SUCESSO (Pagamento Confirmado)
    // Aceita: PAID, PAID_OUT ou eventos específicos de cashin
    const isPaid = 
      status === "PAID" || 
      status === "PAID_OUT" || 
      eventName === "pix.cashin.paid" ||
      (eventName === "payment.updated" && status === "PAID");

    if (isPaid) {
      if (!requestNumber && !idTransaction) {
        console.error("[WEBHOOK] Nenhum identificador encontrado no payload");
        return NextResponse.json({ error: "Missing identifiers" }, { status: 400 });
      }

      console.log(`[WEBHOOK] Processando pagamento aprovado. Ref: ${requestNumber}, ID: ${idTransaction}`);

      // Busca o pedido
      let order = null;
      
      // Tenta por UUID (orderId)
      if (requestNumber) {
        const [found] = await db.select().from(orders).where(eq(orders.id, requestNumber));
        order = found;
      }

      // Tenta por Transaction ID salvo no checkout
      if (!order && requestNumber) {
        const [found] = await db.select().from(orders).where(eq(orders.stylepayTransactionId, String(requestNumber)));
        order = found;
      }
      
      if (!order && idTransaction) {
        const [found] = await db.select().from(orders).where(eq(orders.stylepayTransactionId, String(idTransaction)));
        order = found;
      }

      if (!order) {
        console.error(`[WEBHOOK] Pedido não encontrado. requestNumber: ${requestNumber}, idTransaction: ${idTransaction}`);
        return NextResponse.json({ ok: false, message: "Order not found" }, { status: 200 });
      }

      // Executa a entrega
      const result = await fulfillOrder(order.id, idTransaction || requestNumber);

      if (!result.success) {
        console.error(`[WEBHOOK] Erro ao entregar pedido ${order.id}:`, result.error);
        return NextResponse.json({ ok: false, error: result.error }, { status: 500 });
      }

      console.log(`[WEBHOOK] ✅ Pedido ${order.id} entregue com sucesso!`);
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // 3. Verificar se é CANCELADO
    const isCancelled = 
      status === "CANCELLED" || 
      status === "REFUNDED" || 
      eventName === "pix.cashout.cancelled";

    if (isCancelled) {
      const lookupId = idTransaction || requestNumber;
      if (lookupId) {
        const [order] = await db.select().from(orders).where(eq(orders.stylepayTransactionId, String(lookupId)));
        
      if (order && order.status === "PENDING") {
          await db.update(orders).set({ status: "CANCELLED", updatedAt: new Date() }).where(eq(orders.id, order.id));
          console.log(`[WEBHOOK] ❌ Pedido ${order.id} marcado como CANCELADO`);

          // Send cancellation email
          try {
            const [userData] = await db.select().from(users).where(eq(users.id, order.userId));
            if (userData?.email) {
              await sendEmailDirect({
                to: userData.email,
                subject: `Pedido #${order.id.slice(0, 8).toUpperCase()} cancelado`,
                react: OrderCancelledEmail({
                  name: userData.name || "Cliente",
                  orderId: order.id,
                  totalAmount: Number(order.totalAmount),
                }),
                tags: [{ name: "type", value: "order_cancelled" }],
              });
            }
          } catch (emailErr) {
            console.error("[Email] Falha ao enviar email de cancelamento:", emailErr);
          }
        }
      }
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // Outros eventos (como PENDING do payment.updated) apenas ignoramos
    console.log(`[WEBHOOK] Evento ignorado (status: ${status})`);
    return NextResponse.json({ ok: true }, { status: 200 });

  } catch (error: any) {
    console.error("[WEBHOOK] Erro fatal no processamento:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

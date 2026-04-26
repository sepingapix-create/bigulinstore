import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { fulfillOrder } from "@/actions/checkout";

interface StylepayWebhookPaid {
  event: "pix.cashin.paid";
  requestNumber: string;       // = orderId (external_id sent by us)
  statusTransaction: "PAID";
  idTransaction: string;       // Stylepay's own transaction ID
  value: number;
  debtorName: string;
  date: string;
}

interface StylepayWebhookCancelled {
  event: "pix.cashout.cancelled";
  idTransaction: string;
  statusTransaction: "CANCELLED";
  value: number;
  message: string;
}

type StylepayWebhookPayload = StylepayWebhookPaid | StylepayWebhookCancelled;

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as StylepayWebhookPayload;

    console.log("[WEBHOOK] Stylepay event received:", (payload as any).event, JSON.stringify(payload));

    // ── PIX Payment confirmed ──────────────────────────────────────────────
    if (payload.event === "pix.cashin.paid") {
      const { requestNumber, idTransaction } = payload;

      if (!requestNumber) {
        console.error("[WEBHOOK] Missing requestNumber in payload");
        return NextResponse.json({ error: "Missing requestNumber" }, { status: 400 });
      }

      console.log(`[WEBHOOK] Looking up order for requestNumber: ${requestNumber}`);

      // Try lookup in this order:
      // 1. UUID do pedido (nosso orderId)
      // 2. ID salvo no checkout (stylepayTransactionId) via requestNumber
      // 3. ID salvo no checkout (stylepayTransactionId) via idTransaction
      let [order] = await db.select().from(orders).where(eq(orders.id, requestNumber));

      if (!order) {
        console.log(`[WEBHOOK] Not found by UUID, trying stylepayTransactionId with requestNumber: ${requestNumber}`);
        [order] = await db.select().from(orders).where(eq(orders.stylepayTransactionId, requestNumber));
      }

      if (!order && idTransaction) {
        console.log(`[WEBHOOK] Still not found, trying stylepayTransactionId with idTransaction: ${idTransaction}`);
        [order] = await db.select().from(orders).where(eq(orders.stylepayTransactionId, idTransaction));
      }

      if (!order) {
        console.error(`[WEBHOOK] Order not found. requestNumber: ${requestNumber}, idTransaction: ${idTransaction}`);
        return NextResponse.json({ ok: false, message: "Order not found" }, { status: 200 });
      }

      console.log(`[WEBHOOK] Found order ${order.id} — fulfilling (txId: ${idTransaction})`);

      const result = await fulfillOrder(order.id, idTransaction || requestNumber);

      if (!result.success) {
        console.error(`[WEBHOOK] fulfillOrder failed for order ${order.id}:`, result.error);
        return NextResponse.json({ ok: false, error: result.error }, { status: 500 });
      }

      console.log(`[WEBHOOK] ✅ Order ${order.id} fulfilled successfully`);
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // ── PIX Payment cancelled ──────────────────────────────────────────────
    if (payload.event === "pix.cashout.cancelled") {
      const { idTransaction } = payload;

      // Look up order by the stored stylepayTransactionId
      const [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.stylepayTransactionId, idTransaction));

      if (order && order.status === "PENDING") {
        await db
          .update(orders)
          .set({ status: "CANCELLED", updatedAt: new Date() })
          .where(eq(orders.id, order.id));

        console.log(`[WEBHOOK] ❌ Order ${order.id} marked as CANCELLED`);
      }

      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // Unknown event – acknowledge so Stylepay doesn't retry
    const unknownPayload = payload as any;
    console.log("[WEBHOOK] Unknown event, ignoring:", unknownPayload.event);
    return NextResponse.json({ ok: true }, { status: 200 });

  } catch (error: any) {
    console.error("[WEBHOOK] Unhandled error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

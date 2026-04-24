import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { affiliates, affiliateVisits } from "@/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { handle, referrerUrl } = body;

    if (!handle) {
      return NextResponse.json({ error: "Handle obrigatório" }, { status: 400 });
    }

    // Find affiliate by handle
    const affiliate = await db.query.affiliates.findFirst({
      where: eq(affiliates.handle, handle.toLowerCase()),
    });

    if (!affiliate) {
      return NextResponse.json({ error: "Afiliado não encontrado" }, { status: 404 });
    }

    // Get visitor info from request
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = req.headers.get("user-agent") || "";

    const visitId = crypto.randomUUID();
    await db.insert(affiliateVisits).values({
      id: visitId,
      affiliateId: affiliate.id,
      visitorIp: ip,
      userAgent,
      referrerUrl: referrerUrl || null,
    });

    const response = NextResponse.json({ success: true });
    
    // Set cookie with the specific Visit ID for 30 days
    response.cookies.set("referral_visit_id", visitId, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Erro ao rastrear visita:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

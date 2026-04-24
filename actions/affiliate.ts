"use server";

import { db } from "@/db";
import { affiliates, users, coupons, affiliateReferrals, affiliateVisits, withdrawals } from "@/db/schema";
import { auth } from "@/auth";
import { eq, and, desc } from "drizzle-orm";
import crypto from "crypto";
import { revalidatePath } from "next/cache";

export async function joinAffiliateAction(handle: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Não autorizado" };

  try {
    // Check if handle already exists
    const existingHandle = await db.query.affiliates.findFirst({
      where: eq(affiliates.handle, handle.toLowerCase()),
    });

    if (existingHandle) {
      return { error: "Este nome de usuário já está em uso" };
    }

    const affiliateId = crypto.randomUUID();
    const userId = session.user.id;

    await db.transaction(async (tx) => {
      // 1. Create affiliate record
      await tx.insert(affiliates).values({
        id: affiliateId,
        userId: userId,
        handle: handle.toLowerCase(),
      });

      // 2. Update user status
      await tx.update(users)
        .set({ isAffiliate: true })
        .where(eq(users.id, userId));

      // 3. Create a unique coupon for them
      await tx.insert(coupons).values({
        code: `${handle.toUpperCase()}10`,
        discountPercentage: 10,
        affiliateId: affiliateId,
      });
    });

    revalidatePath("/affiliate");
    return { success: true };
  } catch (error) {
    console.error("Error joining affiliate:", error);
    return { error: "Erro ao processar solicitação" };
  }
}

export async function getAffiliateStatsAction() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const affiliate = await db.query.affiliates.findFirst({
    where: eq(affiliates.userId, session.user.id),
  });

  if (!affiliate) return null;

  const referrals = await db.query.affiliateReferrals.findMany({
    where: eq(affiliateReferrals.affiliateId, affiliate.id),
    orderBy: desc(affiliateReferrals.createdAt),
    limit: 10,
  });

  const affiliateCoupons = await db.query.coupons.findMany({
    where: eq(coupons.affiliateId, affiliate.id),
  });

  // Fetch visits with optional linked user info
  const visits = await db
    .select({ visit: affiliateVisits, visitor: users })
    .from(affiliateVisits)
    .leftJoin(users, eq(affiliateVisits.userId, users.id))
    .where(eq(affiliateVisits.affiliateId, affiliate.id))
    .orderBy(desc(affiliateVisits.createdAt))
    .limit(100);

  // ─── Resilient IP Geolocation ───
  const { getBatchLocations } = await import("@/lib/geolocation");
  const ipLocationMap = await getBatchLocations(visits.map(v => v.visit.visitorIp!).filter(Boolean));

  // Attach location to visits
  const enhancedVisits = visits.map(v => ({
    ...v,
    location: v.visit.visitorIp ? { 
      city: ipLocationMap[v.visit.visitorIp]?.city || "Desconhecido",
      regionName: ipLocationMap[v.visit.visitorIp]?.region || "—"
    } : null
  }));

  const totalVisits = visits.length;
  const convertedUsers = visits.filter((v) => v.visit.convertedToUser).length;
  const convertedSales = visits.filter((v) => v.visit.convertedToSale).length;

  const withdrawalHistory = await db.query.withdrawals.findMany({
    where: eq(withdrawals.affiliateId, affiliate.id),
    orderBy: desc(withdrawals.createdAt),
    limit: 20,
  });

  return {
    ...affiliate,
    referrals,
    coupons: affiliateCoupons,
    visits: enhancedVisits,
    withdrawals: withdrawalHistory,
    visitStats: { totalVisits, convertedUsers, convertedSales },
  };
}

export async function requestWithdrawalAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Não autorizado" };

  const amount = parseFloat(formData.get("amount") as string);
  const pixKey = formData.get("pixKey") as string;
  const pixKeyType = formData.get("pixKeyType") as string;

  if (isNaN(amount) || amount < 50) {
    return { error: "O valor mínimo para saque é R$ 50,00" };
  }

  try {
    const affiliate = await db.query.affiliates.findFirst({
      where: eq(affiliates.userId, session.user.id),
    });

    if (!affiliate) return { error: "Afiliado não encontrado" };

    if (parseFloat(affiliate.balance as string) < amount) {
      return { error: "Saldo insuficiente" };
    }

    await db.transaction(async (tx) => {
      // 1. Create withdrawal request
      await tx.insert(withdrawals).values({
        id: crypto.randomUUID(),
        affiliateId: affiliate.id,
        amount: amount.toFixed(2),
        pixKey,
        pixKeyType,
        status: "PENDING",
      });

      // 2. Subtract from balance (to lock the funds)
      await tx.update(affiliates)
        .set({ balance: (parseFloat(affiliate.balance as string) - amount).toFixed(2) })
        .where(eq(affiliates.id, affiliate.id));
    });

    revalidatePath("/affiliate");
    revalidatePath("/admin/affiliates/withdrawals");
    return { success: true };
  } catch (error) {
    console.error("Error requesting withdrawal:", error);
    return { error: "Erro ao processar saque" };
  }
}

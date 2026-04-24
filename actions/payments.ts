"use server";

import { db } from "@/db";
import { settings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getStylepaySettings() {
  try {
    const allSettings = await db.select().from(settings);
    
    const clientId = allSettings.find(s => s.key === "STYLEPAY_CLIENT_ID")?.value || "";
    const clientSecret = allSettings.find(s => s.key === "STYLEPAY_CLIENT_SECRET")?.value || "";
    
    return { clientId, clientSecret };
  } catch (error) {
    console.error("Error fetching Stylepay settings:", error);
    return { clientId: "", clientSecret: "" };
  }
}

export async function saveStylepaySettings(prevState: any, formData: FormData) {
  try {
    const clientId = formData.get("clientId") as string;
    const clientSecret = formData.get("clientSecret") as string;

    if (!clientId || !clientSecret) {
      return { error: "Todos os campos são obrigatórios." };
    }

    // Upsert Client ID
    await db.insert(settings)
      .values({ key: "STYLEPAY_CLIENT_ID", value: clientId })
      .onDuplicateKeyUpdate({ set: { value: clientId } });

    // Upsert Client Secret
    await db.insert(settings)
      .values({ key: "STYLEPAY_CLIENT_SECRET", value: clientSecret })
      .onDuplicateKeyUpdate({ set: { value: clientSecret } });

    revalidatePath("/admin/payments");
    return { success: true };
  } catch (error) {
    console.error("Error saving Stylepay settings:", error);
    return { error: "Erro interno ao salvar configurações." };
  }
}

import { db } from "@/db";
import { settings } from "@/db/schema";

export interface StylepayPayer {
  name: string;
  document: string;
  phoneNumber: string;
  email: string;
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface StylepayProduct {
  name: string;
  quantity: string;
  price: number;
}

export class StylepayService {
  private static apiUrl = "https://api.stylepay.com.br/api/v1/gateway/request-qrcode";

  private static async getCredentials() {
    console.log("[STYLEPAY DEBUG] Fetching credentials from database...");
    const allSettings = await db.select().from(settings);
    const clientId = allSettings.find(s => s.key === "STYLEPAY_CLIENT_ID")?.value;
    const clientSecret = allSettings.find(s => s.key === "STYLEPAY_CLIENT_SECRET")?.value;

    if (!clientId || !clientSecret) {
      console.error("[STYLEPAY ERROR] Credentials not found in database.");
      throw new Error("Stylepay credentials not configured in admin panel.");
    }
    
    console.log("[STYLEPAY DEBUG] Credentials found. ClientID length:", clientId.length);
    return { clientId, clientSecret };
  }

  /**
   * Generates a PIX payment link/QR Code using Stylepay API
   */
  static async createPixPayment(
    amount: number, 
    externalId: string, 
    payer: StylepayPayer,
    products: StylepayProduct[]
  ) {
    console.log(`[STYLEPAY DEBUG] Starting createPixPayment for order: ${externalId}, amount: ${amount}`);
    try {
      const { clientId, clientSecret } = await this.getCredentials();

      const payload = {
        amount: Number(amount.toFixed(2)),
        external_id: externalId,
        payer,
        payerQuestion: `Pagamento do pedido #${externalId}`,
        postbackUrl: `${process.env.NEXTAUTH_URL || "https://seusite.com"}/api/webhooks/stylepay`,
        products: products.map(p => ({
          ...p,
          price: Number(p.price.toFixed(2))
        }))
      };

      console.log("[STYLEPAY DEBUG] Sending payload to Stylepay:", JSON.stringify(payload, null, 2));

      console.log("[STYLEPAY DEBUG] Making POST request to:", this.apiUrl);
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "stpi": clientId,
          "stps": clientSecret,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      console.log(`[STYLEPAY DEBUG] Response received. Status: ${response.status} ${response.statusText}`);
      
      const responseText = await response.text();
      console.log(`[STYLEPAY DEBUG] Raw Response body:`, responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("[STYLEPAY ERROR] Failed to parse JSON response:", parseError);
        throw new Error("Invalid JSON response from Stylepay");
      }

      if (!response.ok || (data.statusCode && data.statusCode !== 200)) {
        console.error("[STYLEPAY ERROR] API returned error status:", data);
        throw new Error(data.message || "Erro na comunicação com Stylepay");
      }

      const paymentData = data.data || data;

      console.log("[STYLEPAY DEBUG] Successfully created PIX payment:", paymentData.payment_id);
      return {
        paymentId: paymentData.payment_id,
        qrCodeImage: paymentData.qrcode_image, // Base64
        qrCode: paymentData.qrcode, // Copia e Cola
        status: paymentData.status
      };

    } catch (error) {
      console.error("[STYLEPAY FATAL ERROR] Payment Creation Failed:", error);
      throw error;
    }
  }
}

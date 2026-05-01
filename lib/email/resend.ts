import { Resend } from "resend";

// Singleton Resend client
let resendClient: Resend | null = null;

export function getResendClient(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("[Email] RESEND_API_KEY não configurada. Adicione ao .env");
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

export const EMAIL_FROM = process.env.EMAIL_FROM || "Bingulin <onboarding@resend.dev>";
export const EMAIL_REPLY_TO = process.env.EMAIL_REPLY_TO || "suporte@bingulin.com";

/** Headers anti-spam adicionados em todos os emails */
export const ANTISPAM_HEADERS = {
  "X-Mailer": "Bingulin Transactional Mail v1.0",
  "X-Entity-Ref-ID": `bingulin-${Date.now()}`,
  "List-Unsubscribe": `<mailto:${EMAIL_REPLY_TO}?subject=unsubscribe>`,
  "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
};

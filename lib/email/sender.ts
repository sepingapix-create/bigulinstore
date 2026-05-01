/**
 * Central email sending module.
 * Use sendEmail() to enqueue (non-blocking, with retry).
 * Use sendEmailDirect() for synchronous send (e.g. webhooks).
 */

import crypto from "crypto";
import type { ReactElement } from "react";
import { enqueueEmail } from "./queue";
import { getResendClient, EMAIL_FROM, EMAIL_REPLY_TO, ANTISPAM_HEADERS } from "./resend";

interface SendEmailOptions {
  to: string;
  subject: string;
  react: ReactElement;
  tags?: { name: string; value: string }[];
}

/** Non-blocking: adds to queue with automatic retry */
export function sendEmail(options: SendEmailOptions): void {
  enqueueEmail({
    id: crypto.randomUUID(),
    ...options,
  });
}

/** Blocking: sends immediately without queue (use in webhooks for reliability) */
export async function sendEmailDirect(options: SendEmailOptions): Promise<{ success: boolean; error?: string }> {
  try {
    const { render } = await import("@react-email/render");
    const html = await render(options.react);
    const text = await render(options.react, { plainText: true });
    const resend = getResendClient();

    await resend.emails.send({
      from: EMAIL_FROM,
      to: options.to,
      replyTo: EMAIL_REPLY_TO,
      subject: options.subject,
      html,
      text,
      headers: {
        ...ANTISPAM_HEADERS,
        "X-Entity-Ref-ID": `bingulin-${crypto.randomUUID()}`,
      },
      tags: options.tags,
    });

    console.log(`[Email] ✅ Email direto enviado para ${options.to} — "${options.subject}"`);
    return { success: true };
  } catch (error: any) {
    console.error(`[Email] ❌ Falha no envio direto para ${options.to}:`, error);
    return { success: false, error: error.message };
  }
}

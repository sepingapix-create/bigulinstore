/**
 * Email queue with automatic retry and exponential backoff.
 * In-memory singleton — survives hot reloads in Next.js dev via module caching.
 */

import { getResendClient, EMAIL_FROM, EMAIL_REPLY_TO, ANTISPAM_HEADERS } from "./resend";
import type { ReactElement } from "react";

const RETRY_DELAYS_MS = [5_000, 30_000, 120_000]; // 5s, 30s, 2min
const MAX_RETRIES = RETRY_DELAYS_MS.length;
const WORKER_INTERVAL_MS = 2_000;

export interface EmailJob {
  id: string;
  to: string;
  subject: string;
  react: ReactElement;
  tags?: { name: string; value: string }[];
  attempts: number;
  nextAttemptAt: number;
  createdAt: number;
}

type QueueItem = EmailJob & { status: "pending" | "processing" | "failed" };

// ---------- Singleton queue ----------
declare global {
  // eslint-disable-next-line no-var
  var __emailQueue: QueueItem[] | undefined;
  // eslint-disable-next-line no-var
  var __emailWorkerStarted: boolean | undefined;
}

function getQueue(): QueueItem[] {
  if (!global.__emailQueue) global.__emailQueue = [];
  return global.__emailQueue;
}

// ---------- Worker ----------
async function processQueue() {
  const queue = getQueue();
  const now = Date.now();

  const pending = queue.filter(
    (j) => j.status === "pending" && j.nextAttemptAt <= now
  );

  for (const job of pending) {
    job.status = "processing";
    try {
      const resend = getResendClient();
      const { render } = await import("@react-email/render");
      const html = await render(job.react);
      const text = await render(job.react, { plainText: true });

      await resend.emails.send({
        from: EMAIL_FROM,
        to: job.to,
        replyTo: EMAIL_REPLY_TO,
        subject: job.subject,
        html,
        text,
        headers: {
          ...ANTISPAM_HEADERS,
          "X-Entity-Ref-ID": `bingulin-${job.id}`,
        },
        tags: job.tags,
      });

      // Success — remove from queue
      const idx = queue.indexOf(job);
      if (idx !== -1) queue.splice(idx, 1);
      console.log(`[EmailQueue] ✅ Email enviado para ${job.to} — "${job.subject}"`);
    } catch (err) {
      job.attempts += 1;
      if (job.attempts >= MAX_RETRIES) {
        job.status = "failed";
        console.error(
          `[EmailQueue] ❌ Email para ${job.to} falhou após ${MAX_RETRIES} tentativas:`,
          err
        );
      } else {
        job.nextAttemptAt = Date.now() + RETRY_DELAYS_MS[job.attempts];
        job.status = "pending";
        console.warn(
          `[EmailQueue] ⚠️  Retry ${job.attempts}/${MAX_RETRIES} para ${job.to} em ${RETRY_DELAYS_MS[job.attempts] / 1000}s`
        );
      }
    }
  }
}

function startWorker() {
  if (global.__emailWorkerStarted) return;
  global.__emailWorkerStarted = true;
  setInterval(processQueue, WORKER_INTERVAL_MS);
  console.log("[EmailQueue] Worker iniciado.");
}

// Start automatically on module load (server-side only)
if (typeof window === "undefined") {
  startWorker();
}

// ---------- Public API ----------
export function enqueueEmail(job: Omit<EmailJob, "attempts" | "nextAttemptAt" | "createdAt">) {
  const queue = getQueue();
  const fullJob: QueueItem = {
    ...job,
    attempts: 0,
    nextAttemptAt: Date.now(), // send immediately on first attempt
    createdAt: Date.now(),
    status: "pending",
  };
  queue.push(fullJob);
  console.log(`[EmailQueue] 📬 Email enfileirado para ${job.to} — "${job.subject}" (id: ${job.id})`);
}

export function getQueueStats() {
  const queue = getQueue();
  return {
    total: queue.length,
    pending: queue.filter((j) => j.status === "pending").length,
    processing: queue.filter((j) => j.status === "processing").length,
    failed: queue.filter((j) => j.status === "failed").length,
  };
}

"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users, affiliateVisits } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import crypto from "crypto";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { sendEmail } from "@/lib/email/sender";
import { WelcomeEmail } from "@/lib/email/templates/WelcomeEmail";

const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export async function registerAction(prevState: any, formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());
    const parsed = registerSchema.safeParse(data);

    if (!parsed.success) {
      return { error: parsed.error.issues[0].message };
    }

    const { name, email, password } = parsed.data;

    // Check if user exists
    const [existingUser] = await db.select().from(users).where(eq(users.email, email));
    
    if (existingUser) {
      return { error: "E-mail já está em uso" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if any user exists to set first as ADMIN
    const allUsers = await db.select({ id: users.id }).from(users).limit(1);
    const role = allUsers.length === 0 ? "ADMIN" : "USER";

    // Create user
    const newUserId = crypto.randomUUID();
    await db.insert(users).values({
      id: newUserId,
      name,
      email,
      password: hashedPassword,
      role,
    });

    // ─── Referral Tracking ───
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const referralVisitId = cookieStore.get("referral_visit_id")?.value;

      if (referralVisitId) {
        // Find the specific visit using the ID from the cookie
        const [targetVisit] = await db
          .select()
          .from(affiliateVisits)
          .where(eq(affiliateVisits.id, referralVisitId))
          .limit(1);

        if (targetVisit) {
          await db.update(affiliateVisits)
            .set({ 
              convertedToUser: true, 
              userId: newUserId 
            })
            .where(eq(affiliateVisits.id, targetVisit.id));
        }
      }
    } catch (err) {
      console.error("Error linking referral on registration:", err);
    }

    // ─── Welcome Email ───
    try {
      sendEmail({
        to: email,
        subject: "Bem-vindo à Bingulin! 🎉",
        react: WelcomeEmail({ name, email }),
        tags: [{ name: "type", value: "welcome" }],
      });
    } catch (emailErr) {
      console.error("[Email] Falha ao enfileirar email de boas-vindas:", emailErr);
    }

    return { success: true };
  } catch (error) {
    console.error("Erro no registro:", error);
    return { error: "Erro interno no servidor." };
  }
}

export async function loginAction(prevState: any, formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());
    
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirectTo: "/",
    });
    
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'E-mail ou senha incorretos.' }
        default:
          return { error: 'Ocorreu um erro ao fazer login.' }
      }
    }
    throw error; // Rethrow necessary for NextAuth redirects
  }
}

export async function socialLoginAction(provider: string) {
  await signIn(provider, { redirectTo: "/" });
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}

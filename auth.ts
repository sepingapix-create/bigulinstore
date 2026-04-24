import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import { users, accounts, affiliateVisits } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";
import Discord from "next-auth/providers/discord";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts as any,
  }),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null;
        
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email as string));

        if (!user || !user.password) return null;
        
        const isValid = await bcrypt.compare(credentials.password as string, user.password);
        if (!isValid) return null;
        
        return user;
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Discord({
      clientId: process.env.AUTH_DISCORD_ID,
      clientSecret: process.env.AUTH_DISCORD_SECRET,
    }),
  ],
  events: {
    async createUser({ user }) {
      if (!user.id) return;
      
      // Check if this is the first user, make them ADMIN
      const allUsers = await db.select({ id: users.id }).from(users).limit(2);
      if (allUsers.length === 1) {
        await db.update(users).set({ role: "ADMIN" }).where(eq(users.id, user.id));
      }

      // Referral Tracking
      try {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        const referralVisitId = cookieStore.get("referral_visit_id")?.value;

        if (referralVisitId) {
          const [targetVisit] = await db
            .select()
            .from(affiliateVisits)
            .where(eq(affiliateVisits.id, referralVisitId))
            .limit(1);

          if (targetVisit) {
            await db.update(affiliateVisits)
              .set({ 
                convertedToUser: true, 
                userId: user.id 
              })
              .where(eq(affiliateVisits.id, targetVisit.id));
          }
        }
      } catch (err) {
        console.error("Error linking referral on OAuth registration:", err);
      }
    }
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Fetch fresh user to get the correct role (in case it was updated in createUser event)
        const [dbUser] = await db.select().from(users).where(eq(users.id, user.id as string));
        token.id = user.id;
        token.role = dbUser?.role || "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },
});

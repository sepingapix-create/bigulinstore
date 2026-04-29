import Link from "next/link";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  ArrowLeft,
  HandCoins,
  CreditCard
} from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

import { AdminSidebar, MobileAdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Basic security check
  if (!session?.user) {
    redirect("/login");
  }

  // Fetch user from DB to check role
  const [user] = await db.select().from(users).where(eq(users.id, session.user.id!));

  if (user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden max-w-full">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 max-w-full overflow-hidden">
        <header className="h-16 border-b border-[#1A1A1A] bg-[#0A0A0A]/50 backdrop-blur-xl flex items-center justify-between px-4 sm:px-8 shrink-0 z-10 max-w-full">
          <div className="flex items-center gap-2 sm:gap-4">
            <MobileAdminSidebar />
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider truncate">Sistema de Gerenciamento</h2>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <span className="text-sm font-medium hidden sm:inline-block">{session.user.name}</span>
            <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary text-xs font-bold shrink-0">
              AD
            </div>
          </div>
        </header>
        
        <div className="flex-1 p-4 sm:p-8 overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}

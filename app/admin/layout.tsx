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

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Produtos", href: "/admin/products", icon: Package },
    { name: "Vendas", href: "/admin/sales", icon: ShoppingCart },
    { name: "Usuários", href: "/admin/users", icon: Users },
    { name: "Afiliados", href: "/admin/affiliates", icon: HandCoins },
    { name: "Pagamentos", href: "/admin/payments", icon: CreditCard },
  ];

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden max-w-full">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#1A1A1A] bg-[#0A0A0A] flex flex-col shrink-0">
        <div className="p-6 border-b border-[#1A1A1A] shrink-0">
          <Link href="/" className="flex items-center gap-2 group">
            <ArrowLeft className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="font-bold text-xl tracking-tight">Admin<span className="text-primary">Panel</span></span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/10 hover:text-primary transition-all group"
            >
              <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-[#1A1A1A] shrink-0">
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted/50 transition-all text-muted-foreground"
          >
            <Settings className="h-5 w-5 pointer-events-none" />
            <span className="font-medium">Configurações</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 max-w-full overflow-hidden">
        <header className="h-16 border-b border-[#1A1A1A] bg-[#0A0A0A]/50 backdrop-blur-xl flex items-center justify-between px-8 shrink-0 z-10 max-w-full">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider truncate">Sistema de Gerenciamento</h2>
          <div className="flex items-center gap-4 shrink-0">
            <span className="text-sm font-medium hidden sm:inline-block">{session.user.name}</span>
            <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary text-xs font-bold shrink-0">
              AD
            </div>
          </div>
        </header>
        
        <div className="flex-1 p-8 overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}

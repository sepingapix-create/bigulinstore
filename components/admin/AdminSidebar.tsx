"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Produtos", href: "/admin/products", icon: Package },
  { name: "Vendas", href: "/admin/sales", icon: ShoppingCart },
  { name: "Usuários", href: "/admin/users", icon: Users },
  { name: "Afiliados", href: "/admin/affiliates", icon: HandCoins },
  { name: "Pagamentos", href: "/admin/payments", icon: CreditCard },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-[#1A1A1A] bg-[#0A0A0A] flex flex-col shrink-0">
      <div className="p-6 border-b border-[#1A1A1A] shrink-0">
        <Link href="/" className="flex items-center gap-2 group">
          <ArrowLeft className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="font-bold text-xl tracking-tight">Painel<span className="text-primary">Admin</span></span>
        </Link>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          // Check if current path matches item href exactly or starts with it (for nested pages)
          // Exception for Dashboard (/admin) to avoid matching everything
          const isActive = item.href === "/admin" 
            ? pathname === "/admin"
            : pathname?.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all group",
                isActive 
                  ? "bg-red-500/10 text-red-500 font-bold" 
                  : "hover:bg-primary/10 hover:text-primary text-muted-foreground"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-colors",
                isActive ? "text-red-500" : "text-muted-foreground group-hover:text-primary"
              )} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#1A1A1A] shrink-0">
        <Link
          href="/admin/settings"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all group",
            pathname === "/admin/settings"
              ? "bg-red-500/10 text-red-500 font-bold"
              : "hover:bg-muted/50 text-muted-foreground"
          )}
        >
          <Settings className={cn(
            "h-5 w-5 pointer-events-none",
            pathname === "/admin/settings" ? "text-red-500" : "text-muted-foreground"
          )} />
          <span>Configurações</span>
        </Link>
      </div>
    </aside>
  );
}

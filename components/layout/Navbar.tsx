import Link from "next/link";
import { Search, ShoppingCart, User, LogOut, LayoutDashboard, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { CartSheet } from "@/components/cart/CartSheet";
import { auth } from "@/auth";
import { logoutAction } from "@/actions/auth";
import { SearchBar } from "./SearchBar";

export async function Navbar() {
  const session = await auth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4 justify-between">
        
        {/* Brand */}
        <Link href="/" className="flex items-center gap-1 group">
          <span className="text-3xl font-bold text-white transition-all duration-300 italic mr-1">
            爱
          </span>
          <span className="font-black text-2xl tracking-tighter hidden sm:inline-block uppercase italic text-red-600">
            BIGULIN
          </span>
        </Link>

        {/* Central Search */}
        <div className="flex-1 max-w-2xl mx-8 flex items-center gap-6">
          <SearchBar />
          <Link href="/sobre-imperio" className="group flex items-center gap-1.5 text-[10px] font-black uppercase italic tracking-tighter text-muted-foreground hover:text-white transition-all hidden xl:flex whitespace-nowrap bg-muted/20 px-3 py-1.5 rounded-full border border-border/50 hover:border-primary/50 hover:bg-muted/40">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary animate-pulse" />
            Sobre o Império
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          
          {/* Cart */}
          <CartSheet />

          {/* Authentication UI */}
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="relative h-9 w-9 rounded-full outline-none hover:bg-muted/50 flex items-center justify-center transition-colors cursor-pointer">
                <Avatar className="h-9 w-9 border border-border/50 transition-opacity hover:opacity-80">
                  <AvatarImage src={session.user.image || "https://github.com/shadcn.png"} alt={session.user.name || "User"} />
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {session.user.name ? session.user.name.substring(0, 2).toUpperCase() : "US"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session.user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer p-0">
                  <Link href="/profile" className="flex w-full items-center px-2 py-1.5">
                    <User className="mr-2 h-4 w-4" />
                    <span>Meu Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer p-0">
                  <Link href="/affiliate" className="flex w-full items-center px-2 py-1.5">
                    <Users className="mr-2 h-4 w-4 text-primary" />
                    <span className="font-semibold text-primary">Portal de Afiliados</span>
                  </Link>
                </DropdownMenuItem>
                {(session.user as any).role === "ADMIN" && (
                  <DropdownMenuItem className="cursor-pointer p-0">
                    <Link href="/admin" className="flex w-full items-center px-2 py-1.5">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Painel Admin</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="p-0">
                  <form action={logoutAction} className="w-full">
                    <button type="submit" className="flex w-full cursor-pointer items-center px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive rounded-sm outline-none">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login" className="inline-flex items-center justify-center h-9 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary font-medium rounded-full px-6 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
              Entrar
            </Link>
          )}

        </div>
      </div>
    </nav>
  );
}

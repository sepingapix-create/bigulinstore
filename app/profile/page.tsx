import { auth } from "@/auth";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Package, CheckCircle2, Clock, ExternalLink, ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ProfileDeliveryReveal } from "@/components/profile/ProfileDeliveryReveal";

export default async function UserProfile() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const ordersWithItems = await db.query.orders.findMany({
    where: eq(orders.userId, session.user.id!),
    orderBy: [desc(orders.createdAt)],
    with: {
      items: {
        with: {
          product: true,
        },
      },
      deliveredContent: true,
    },
  });

  const userOrders = ordersWithItems.map((order) => ({
    ...order,
    items: order.items.map((item) => ({
      ...item,
      product: item.product,
      deliveredContent: order.deliveredContent
        .filter((d) => d.productId === item.productId)
        .map((d) => d.content),
    })),
  }));

  const paidCount = userOrders.filter((o) => o.status === "PAID").length;

  return (
    <div className="flex-1 relative">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 py-12 max-w-5xl relative z-10">
        <div className="mb-6">
          <Link href="/#catalogo">
            <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-white/5 font-bold px-4 py-2 h-auto gap-2 rounded-xl transition-colors">
              <ChevronLeft className="h-4 w-4" />
              Voltar ao Catálogo
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* User Info Column */}
          <div className="lg:col-span-4 space-y-6 relative">
            <div className="sticky top-24">
              <Card className="border-white/5 bg-card/30 backdrop-blur-xl shadow-2xl overflow-hidden rounded-[2rem]">
                <div className="h-32 bg-gradient-to-br from-red-600 via-red-800 to-black relative">
                  <div className="absolute inset-0 bg-[url('/dragon-bg.png')] bg-cover bg-center mix-blend-overlay opacity-30" />
                  <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-background/80 to-transparent" />
                </div>
                
                <CardContent className="relative pt-0 pb-8 text-center px-6">
                  <div className="-mt-16 mb-4 flex justify-center">
                    <div className="relative p-1.5 rounded-full bg-gradient-to-b from-primary/50 to-transparent">
                      <Avatar className="h-28 w-28 border-4 border-background shadow-2xl">
                        <AvatarImage src={session.user.image || ""} />
                        <AvatarFallback className="text-3xl font-black bg-black text-white">
                          {session.user.name?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-black uppercase italic tracking-tight text-white drop-shadow-md">
                    {session.user.name}
                  </h2>
                  <p className="text-xs text-zinc-400 mb-8 font-medium">{session.user.email}</p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md transition-all hover:bg-white/10">
                      <p className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.2em] mb-1">Pedidos</p>
                      <p className="text-2xl font-black text-white">{userOrders.length}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 backdrop-blur-md shadow-[0_0_15px_rgba(220,38,38,0.1)] transition-all hover:bg-primary/20">
                      <p className="text-[10px] text-primary/80 uppercase font-black tracking-[0.2em] mb-1">Pagos</p>
                      <p className="text-2xl font-black text-primary">{paidCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Orders Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b border-white/10">
              <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                <ShoppingBag className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-2xl font-black uppercase italic tracking-tighter text-white">
                Histórico de Pedidos
              </h1>
            </div>

            {userOrders.length === 0 ? (
              <Card className="border-dashed border-white/10 bg-black/20 backdrop-blur-md rounded-[2rem]">
                <CardContent className="flex flex-col items-center justify-center py-24 text-zinc-500">
                  <Package className="h-16 w-16 mb-6 opacity-20" />
                  <p className="font-bold text-lg text-zinc-400">Nenhum pedido encontrado.</p>
                  <p className="text-sm mb-6">Sua jornada no Império ainda não começou.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-5">
                {userOrders.map((order) => (
                  <Card key={order.id} className="border-white/5 bg-card/30 backdrop-blur-xl shadow-2xl hover:border-primary/20 transition-all duration-500 overflow-hidden group rounded-[2rem]">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 group-hover:via-primary/50 to-transparent transition-colors" />
                    <div className="p-5 sm:p-7">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/5">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-2xl transition-all ${order.status === "PAID" ? "bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.15)]" : "bg-yellow-500/10 shadow-[0_0_15px_rgba(234,179,8,0.15)]"}`}>
                            {order.status === "PAID" ? <CheckCircle2 className="h-6 w-6 text-green-500" /> : <Clock className="h-6 w-6 text-yellow-500" />}
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-black tracking-[0.2em] text-zinc-500 mb-1">Pedido #{order.id.substring(0, 8).toUpperCase()}</p>
                            <p className="text-sm font-medium text-white">
                              {new Date(order.createdAt!).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge className={`px-3 py-1 font-black text-[10px] tracking-widest ${order.status === "PAID" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"}`}>
                            {order.status === "PAID" ? "PAGO" : "PENDENTE"}
                          </Badge>
                          <Link href={`/order/${order.id}`}>
                            <Button size="sm" variant="secondary" className="h-9 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-colors">
                              Detalhes <ExternalLink className="ml-2 h-3.5 w-3.5" />
                            </Button>
                          </Link>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {order.items.map((item: any) => (
                          <div key={item.id} className="flex flex-col gap-4">
                            <div className="flex items-center gap-5">
                              <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-black/50 border border-white/10 group-hover:border-primary/30 transition-colors">
                                <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-base font-bold text-white truncate">{item.product.name}</h4>
                                <p className="text-xs text-zinc-500 mt-1 font-medium">Quantidade: {item.quantity}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-base font-black text-primary">
                                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(item.price))}
                                </p>
                              </div>
                            </div>

                            {order.status === "PAID" && item.deliveredContent.length > 0 && (
                              <div className="mt-2">
                                <ProfileDeliveryReveal productName={item.product.name} contents={item.deliveredContent} />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

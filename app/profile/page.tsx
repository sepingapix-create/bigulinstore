import { auth } from "@/auth";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Package, CheckCircle2, Clock, ExternalLink } from "lucide-react";
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
    <div className="flex-1 bg-background">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-red-600 to-red-900" />
              <CardContent className="relative pt-0 pb-6 text-center">
                <div className="-mt-12 mb-4 flex justify-center">
                  <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                    <AvatarImage src={session.user.image || ""} />
                    <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                      {session.user.name?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <h2 className="text-xl font-bold">{session.user.name}</h2>
                <p className="text-sm text-muted-foreground mb-6">{session.user.email}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest mb-1">Pedidos</p>
                    <p className="text-xl font-black">{userOrders.length}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
                    <p className="text-xs text-primary/70 uppercase font-bold tracking-widest mb-1">Pagos</p>
                    <p className="text-xl font-black text-primary">{paidCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-[0.2em] font-black text-muted-foreground">Configurações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-sm" disabled>Editar Perfil</Button>
                <Button variant="ghost" className="w-full justify-start text-sm" disabled>Segurança</Button>
                <Button variant="ghost" className="w-full justify-start text-sm text-destructive hover:bg-destructive/10" disabled>Sair da Conta</Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-black uppercase italic tracking-tight flex items-center gap-3">
                <ShoppingBag className="h-6 w-6 text-primary" />
                Histórico de Pedidos
              </h1>
            </div>

            {userOrders.length === 0 ? (
              <Card className="border-dashed border-border/50 bg-muted/10">
                <CardContent className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                  <Package className="h-12 w-12 mb-4 opacity-20" />
                  <p className="font-medium">Você ainda não realizou nenhum pedido.</p>
                  <Link href="/#catalogo">
                    <Button variant="link" className="mt-2 text-primary font-bold">Ver Catálogo</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {userOrders.map((order) => (
                  <Card key={order.id} className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl hover:border-primary/20 transition-all overflow-hidden group">
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${order.status === "PAID" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"}`}>
                            {order.status === "PAID" ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-0.5">Pedido #{order.id.substring(0, 8).toUpperCase()}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(order.createdAt!).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={order.status === "PAID" ? "bg-green-500/20 text-green-500 border-green-500/30" : "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"}>
                            {order.status === "PAID" ? "PAGO" : "PENDENTE"}
                          </Badge>
                          <Link href={`/order/${order.id}`}>
                            <Button size="sm" variant="ghost" className="h-8 gap-1.5 text-xs font-bold group-hover:text-primary transition-colors">
                              Detalhes <ExternalLink className="h-3 w-3" />
                            </Button>
                          </Link>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {order.items.map((item: any) => (
                          <div key={item.id} className="flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                              <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-muted/50 border border-border/50">
                                <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-sm font-bold line-clamp-1">{item.product.name}</h4>
                                <p className="text-xs text-muted-foreground">Quantidade: {item.quantity}</p>
                              </div>
                              <p className="text-sm font-black text-primary">
                                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(item.price))}
                              </p>
                            </div>

                            {order.status === "PAID" && item.deliveredContent.length > 0 && (
                              <ProfileDeliveryReveal productName={item.product.name} contents={item.deliveredContent} />
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

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { orders, orderItems, products, productInventory } from "@/db/schema";
import { eq, desc, inArray } from "drizzle-orm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, User, Clock, ArrowRight, Copy, Key, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ProfileDeliveryReveal } from "@/components/profile/ProfileDeliveryReveal";

export default async function UserProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Fetch orders with items and products in a single relational query
  const ordersWithItems = await db.query.orders.findMany({
    where: eq(orders.userId, session.user.id!),
    orderBy: [desc(orders.createdAt)],
    with: {
      items: {
        with: {
          product: true,
        },
      },
      deliveredContent: true, // This is the productInventory relation
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
    <div className="flex-1 container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 italic uppercase">Meu Perfil</h1>
          <p className="text-muted-foreground text-lg">Gerencie seus dados e acesse suas assinaturas.</p>
        </div>
        <Link href="/">
          <Button className="rounded-full px-8 h-12 bg-primary hover:bg-primary/90 text-white font-black italic uppercase transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] active:scale-95 group border-2 border-white/10">
            <ArrowRight className="mr-2 h-5 w-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
            Voltar ao Menu Principal
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: User Data */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-border/50 shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-blue-600/40 to-cyan-500/40" />
            <CardContent className="pt-0 relative px-6 pb-6">
              <Avatar className="w-24 h-24 border-4 border-background absolute -top-12 shadow-lg">
                <AvatarImage src={session.user.image || "https://github.com/shadcn.png"} />
                <AvatarFallback className="bg-primary/20 text-primary text-2xl font-bold">
                  {session.user.name?.substring(0, 2).toUpperCase() || "US"}
                </AvatarFallback>
              </Avatar>
              <div className="pt-16">
                <h2 className="text-2xl font-bold">{session.user.name}</h2>
                <p className="text-muted-foreground flex items-center gap-2 mt-1">
                  <User className="h-4 w-4" /> {session.user.email}
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg border border-border/50">
                    <span className="text-xs text-muted-foreground mb-1">Pedidos</span>
                    <span className="text-2xl font-bold">{userOrders.length}</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <span className="text-xs text-green-400 mb-1">Pagos</span>
                    <span className="text-2xl font-bold text-green-400">{paidCount}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Order History */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
            <CardHeader className="border-b border-border/50 pb-6">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Clock className="h-6 w-6 text-primary" /> Histórico de Compras
              </CardTitle>
              <CardDescription>Confira o status dos seus pedidos e acesse suas assinaturas.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {userOrders.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
                  <Package className="h-16 w-16 mb-4 opacity-20" />
                  <p className="text-lg font-medium">Nenhuma compra encontrada.</p>
                  <Link
                    href="/"
                    className="mt-6 inline-flex items-center justify-center h-9 px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow"
                  >
                    Explorar Catálogo
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {userOrders.map((order) => (
                    <div key={order.id} className="p-6 transition-colors hover:bg-muted/10">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">
                            Pedido #{order.id.split("-")[0].toUpperCase()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.createdAt!).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-lg">
                            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                              Number(order.totalAmount)
                            )}
                          </span>
                          {order.status === "PAID" ? (
                            <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30 border-green-500/20 gap-1">
                              <CheckCircle2 className="h-3 w-3" /> Aprovado
                            </Badge>
                          ) : order.status === "PENDING" ? (
                            <Badge variant="outline" className="text-yellow-500 border-yellow-500/30 bg-yellow-500/10">
                              Pendente
                            </Badge>
                          ) : (
                            <Badge variant="destructive">Cancelado</Badge>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        {order.items.map((item: any) => (
                          <div key={item.id} className="rounded-xl border border-border/30 overflow-hidden">
                            <div className="flex gap-4 p-3 bg-muted/20">
                              <div className="relative h-16 w-16 rounded-md overflow-hidden bg-background shrink-0">
                                <Image
                                  src={item.product.imageUrl}
                                  alt={item.product.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 flex items-center justify-between">
                                <div>
                                  <h4 className="font-semibold text-sm line-clamp-1">{item.product.name}</h4>
                                  <p className="text-xs text-muted-foreground mt-1">Qtd: {item.quantity}</p>
                                </div>
                                {order.status === "PENDING" && (
                                  <Link
                                    href={`/order/${order.id}?pixCode=${order.pixCode || ""}`}
                                    className="inline-flex items-center justify-center h-8 px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-primary/50 text-primary hover:bg-primary/10 rounded-md shadow-sm bg-background"
                                  >
                                    Pagar PIX <ArrowRight className="ml-2 h-3 w-3" />
                                  </Link>
                                )}
                              </div>
                            </div>

                            {/* Delivered content – only shown when PAID */}
                            {order.status === "PAID" && item.deliveredContent.length > 0 && (
                              <ProfileDeliveryReveal
                                productName={item.product.name}
                                contents={item.deliveredContent}
                              />
                            )}

                            {order.status === "PAID" && item.deliveredContent.length === 0 && (
                              <div className="px-4 py-3 bg-yellow-500/5 border-t border-yellow-500/20 text-xs text-yellow-400 flex items-center gap-2">
                                <Package className="h-3 w-3" />
                                Entrega pendente – entre em contato com o suporte.
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

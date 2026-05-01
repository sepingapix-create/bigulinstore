"use client";

import { useState } from "react";
import { addManualDelivery, removeDelivery, addStockItem } from "@/actions/stock-delivery";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Trash, Plus, Package } from "lucide-react";

type OrderItemInfo = {
  productId: string;
  productName: string;
  quantity: number;
  availableStockItems: { id: string; content: string; usedSlots: number; maxSlots: number }[];
  deliveries: { id: string; stockItemId: string; content: string; deliveredAt: Date | null }[];
};

export function OrderDeliveryEditor({ orderId, items, orderStatus }: { orderId: string, items: OrderItemInfo[], orderStatus: string }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [newStockContent, setNewStockContent] = useState<Record<string, string>>({});

  const handleAddStock = async (productId: string) => {
    const content = newStockContent[productId];
    if (!content?.trim()) {
      toast.error("Insira o conteúdo do item (ex: e-mail:senha ou código)");
      return;
    }

    setLoadingId(`add-${productId}`);
    const result = await addStockItem(productId, content);
    if (result.success) {
      toast.success("Item adicionado ao estoque!");
      setNewStockContent(prev => ({ ...prev, [productId]: "" }));
      
      // Auto-link if needed
      const item = items.find(i => i.productId === productId);
      if (item && item.deliveries.length < item.quantity) {
        await addManualDelivery(orderId, productId, result.id!);
        toast.success("Item vinculado automaticamente ao pedido!");
      }
      
      router.refresh();
    } else {
      toast.error(result.error);
    }
    setLoadingId(null);
  };

  const handleAdd = async (productId: string, stockItemId: string) => {
    setLoadingId(stockItemId);
    const result = await addManualDelivery(orderId, productId, stockItemId);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Entrega adicionada com sucesso!");
      router.refresh();
    }
    setLoadingId(null);
  };

  const handleRemove = async (deliveryId: string) => {
    setLoadingId(deliveryId);
    const result = await removeDelivery(deliveryId);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Entrega removida com sucesso!");
      router.refresh();
    }
    setLoadingId(null);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold border-b border-border pb-2">Gestão de Entregas</h2>
      
      {items.map((item) => {
        const deliveredCount = item.deliveries.length;
        const isFullyDelivered = deliveredCount >= item.quantity;

        return (
          <div key={item.productId} className="bg-muted/50 p-4 rounded-xl border border-border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">{item.productName}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs text-muted-foreground">
                    Comprado: {item.quantity} | Entregue: {deliveredCount}
                  </p>
                  <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase border ${
                    orderStatus === 'PAID' 
                      ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                      : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                  }`}>
                    {orderStatus === 'PAID' ? 'Pago' : 'Pendente'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {isFullyDelivered ? (
                  <span className="text-green-500 font-black text-[10px] bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20 uppercase">Produto Entregue</span>
                ) : (
                  <span className="text-yellow-500 font-black text-[10px] bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20 uppercase">Entrega Pendente</span>
                )}
              </div>
            </div>

            {/* Current Deliveries */}
            <div className="mb-6 space-y-2">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2"><Package className="w-4 h-4" /> Itens Entregues</h4>
              {item.deliveries.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">Nenhuma entrega realizada ainda.</p>
              ) : (
                item.deliveries.map((delivery) => (
                  <div key={delivery.id} className="flex items-center justify-between bg-background p-2 px-3 rounded-lg border border-border text-sm">
                    <span className="font-mono truncate max-w-[200px]" title={delivery.content}>{delivery.content}</span>
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="w-8 h-8 rounded-md"
                      onClick={() => handleRemove(delivery.id)}
                      disabled={loadingId === delivery.id}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>

            {/* Available to Add */}
            {!isFullyDelivered && (
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2"><Plus className="w-4 h-4" /> Adicionar Entrega Manual</h4>
                
                {/* Add new stock form */}
                <div className="flex gap-2 mb-4">
                  <Input 
                    placeholder="E-mail:Senha ou Código..." 
                    className="h-8 text-xs bg-background border-border"
                    value={newStockContent[item.productId] || ""}
                    onChange={(e) => setNewStockContent(prev => ({ ...prev, [item.productId]: e.target.value }))}
                  />
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-8 px-3 text-[10px] uppercase font-black"
                    onClick={() => handleAddStock(item.productId)}
                    disabled={loadingId === `add-${item.productId}`}
                  >
                    + Estoque
                  </Button>
                </div>

                {item.availableStockItems.length === 0 ? (
                  <p className="text-xs text-red-400 italic">Nenhum item disponível. Adicione um acima para vincular.</p>
                ) : (
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {item.availableStockItems.map((stockItem) => (
                      <div key={stockItem.id} className="flex items-center justify-between bg-background p-2 px-3 rounded-lg border border-border text-sm">
                        <div className="flex flex-col">
                          <span className="font-mono truncate max-w-[200px]" title={stockItem.content}>{stockItem.content}</span>
                          <span className="text-[10px] text-muted-foreground">Slots: {stockItem.usedSlots}/{stockItem.maxSlots}</span>
                        </div>
                        <Button 
                          size="sm"
                          variant="secondary"
                          onClick={() => handleAdd(item.productId, stockItem.id)}
                          disabled={loadingId === stockItem.id}
                        >
                          Vincular
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

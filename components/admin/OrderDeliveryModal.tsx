"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Package, Loader2 } from "lucide-react";
import { OrderDeliveryEditor } from "./OrderDeliveryEditor";
import { getOrderDeliveryDetails } from "@/actions/get-order-details";
import { toast } from "sonner";

export function OrderDeliveryModal({ orderId }: { orderId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);

  const fetchData = async () => {
    setLoading(true);
    const result = await getOrderDeliveryDetails(orderId);
    if (result.success && result.items) {
      setItems(result.items);
    } else {
      toast.error(result.error);
      setIsOpen(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger 
        render={
          <Button variant="outline" size="sm" className="gap-2 border-primary/20 hover:border-primary/50 text-[10px] h-7 font-black uppercase">
            <Package className="h-3 w-3 text-primary" />
            Entregas
          </Button>
        }
      />
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0A0A0A] border-[#1A1A1A]">
        <DialogHeader>
          <DialogTitle className="text-xl font-black italic uppercase tracking-tighter">
            Gerenciar <span className="text-primary">Entregas</span>
          </DialogTitle>
          <p className="text-muted-foreground text-xs">Pedido: #{orderId.split("-")[0].toUpperCase()}</p>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground font-bold italic uppercase animate-pulse">Carregando estoque...</p>
          </div>
        ) : (
          <div className="mt-4">
            <OrderDeliveryEditor orderId={orderId} items={items} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

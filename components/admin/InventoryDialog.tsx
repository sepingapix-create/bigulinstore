"use client";

import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Package, Plus, Trash2, Loader2, Key, ShieldCheck } from "lucide-react";
import { addInventoryAction, deleteInventoryAction, getProductInventory } from "@/actions/admin";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface InventoryDialogProps {
  productId: string;
  productName: string;
}

export function InventoryDialog({ productId, productName }: InventoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (open) loadInventory();
  }, [open]);

  async function loadInventory() {
    setIsLoading(true);
    const data = await getProductInventory(productId);
    setItems(data);
    setIsLoading(false);
  }

  async function handleAdd(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsAdding(true);
    const form = event.currentTarget;
    const formData = new FormData(form);
    const result = await addInventoryAction(productId, formData);
    if (result.success) {
      toast.success(`${result.count} itens adicionados!`);
      form.reset();
      loadInventory();
    } else {
      toast.error(result.error);
    }
    setIsAdding(false);
  }

  async function handleDelete(itemId: string) {
    const result = await deleteInventoryAction(itemId, productId);
    if (result.success) {
      toast.success("Item removido");
      loadInventory();
    } else {
      toast.error(result.error);
    }
  }

  const available = items.filter(i => !i.isSold).length;
  const sold = items.filter(i => i.isSold).length;

  return (
    <>
      {/* Plain button trigger — no nesting issue */}
      <button
        onClick={() => setOpen(true)}
        title="Gerenciar estoque"
        className="h-9 w-9 rounded-xl flex items-center justify-center bg-white/10 hover:bg-primary/20 hover:text-primary text-white/70 transition-all"
      >
        <Package className="h-4 w-4 pointer-events-none" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#0A0A0A] border-[#1A1A1A] text-white sm:max-w-[620px] max-h-[90vh] flex flex-col p-0 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-[#1A1A1A] bg-gradient-to-r from-primary/10 via-transparent to-transparent">
            <DialogTitle className="flex items-center gap-3 text-lg font-black italic uppercase">
              <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Key className="h-4 w-4 text-primary" />
              </div>
              {productName}
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Gerencie os itens de entrega automática deste produto.
            </p>
            {/* Mini stats */}
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2 text-xs">
                <span className="h-2 w-2 rounded-full bg-green-500 inline-block" />
                <span className="text-muted-foreground">Disponíveis:</span>
                <span className="font-bold text-green-400">{available}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="h-2 w-2 rounded-full bg-yellow-500 inline-block" />
                <span className="text-muted-foreground">Vendidos:</span>
                <span className="font-bold text-yellow-400">{sold}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col gap-0">
            {/* Add Form */}
            <form onSubmit={handleAdd} className="p-5 border-b border-[#1A1A1A] space-y-3">
              <Label htmlFor="content" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Conteúdo do Item (pode conter múltiplas linhas)
              </Label>
              <Textarea
                id="content"
                name="content"
                placeholder={"conta@email.com:senha123\nchave-de-produto-aqui\noutra-credencial"}
                required
                className="bg-[#111111] border-[#1A1A1A] focus:border-primary/50 transition-all min-h-[90px] font-mono text-sm resize-y"
              />
              <button
                type="submit"
                disabled={isAdding}
                className="w-full h-9 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isAdding ? (
                  <><Loader2 className="h-4 w-4 animate-spin pointer-events-none" /> Adicionando...</>
                ) : (
                  <><Plus className="h-4 w-4 pointer-events-none" /> Adicionar ao Estoque</>
                )}
              </button>
            </form>

            {/* Items List */}
            <div className="flex-1 flex flex-col min-h-0 p-5">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3">
                Itens cadastrados
              </h3>
              <ScrollArea className="flex-1">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : items.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-10 w-10 text-muted-foreground/20 mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">Estoque vazio.</p>
                    <p className="text-muted-foreground/50 text-xs mt-1">Adicione itens acima.</p>
                  </div>
                ) : (
                  <div className="space-y-1.5 pr-2">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-lg border group transition-all ${
                          item.isSold
                            ? "bg-yellow-500/5 border-yellow-500/10"
                            : "bg-[#111111] border-[#1A1A1A] hover:border-primary/20"
                        }`}
                      >
                        <code className="text-[10px] font-mono break-all whitespace-pre-wrap flex-1 mr-3 text-muted-foreground/80 leading-relaxed">
                          {item.content}
                        </code>
                        {item.isSold ? (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full shrink-0">
                            <ShieldCheck className="h-3 w-3" /> Vendido
                          </div>
                        ) : (
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="h-6 w-6 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                          >
                            <Trash2 className="h-3.5 w-3.5 pointer-events-none" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>

          <div className="p-4 border-t border-[#1A1A1A] flex justify-end">
            <button
              onClick={() => setOpen(false)}
              className="px-5 py-2 rounded-xl text-sm font-bold text-muted-foreground hover:text-white hover:bg-white/5 transition-all"
            >
              Fechar
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

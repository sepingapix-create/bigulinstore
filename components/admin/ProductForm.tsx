"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2, Pencil, PackagePlus, Zap } from "lucide-react";
import { createProductAction, updateProductAction } from "@/actions/admin";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ProductFormProps {
  initialData?: {
    id: string;
    name: string;
    description: string;
    price: string;
    category: string;
    stock: number;
    imageUrl: string;
    originalPrice?: string | null;
    isFlashDeal?: boolean;
    flashDealEnd?: string | Date | null;
  };
  trigger?: React.ReactElement;
}

export function ProductForm({ initialData, trigger }: ProductFormProps) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
    price: initialData?.price ?? "",
    originalPrice: initialData?.originalPrice ?? "",
    category: initialData?.category ?? "",
    imageUrl: initialData?.imageUrl ?? "",
  });
  
  const [isFlashDeal, setIsFlashDeal] = useState(initialData?.isFlashDeal ?? false);
  const [flashDealEnd, setFlashDealEnd] = useState(() => {
    if (initialData?.flashDealEnd) {
      const d = new Date(initialData.flashDealEnd);
      // format as YYYY-MM-DDThh:mm
      return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    }
    return "";
  });
  
  const router = useRouter();
  const isEditing = !!initialData;

  // Update state when initialData changes (e.g. when opening edit dialog)
  React.useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        price: initialData.price,
        originalPrice: initialData.originalPrice ?? "",
        category: initialData.category,
        imageUrl: initialData.imageUrl,
      });
      setIsFlashDeal(initialData.isFlashDeal ?? false);
      if (initialData.flashDealEnd) {
        const d = new Date(initialData.flashDealEnd);
        setFlashDealEnd(new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
      } else {
        setFlashDealEnd("");
      }
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);

    const data = new FormData(event.currentTarget);
    const result = isEditing
      ? await updateProductAction(initialData.id, data)
      : await createProductAction(data);

    setIsPending(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(isEditing ? "Produto atualizado!" : "Produto criado com sucesso!");
      setOpen(false);
      if (!isEditing) {
        setFormData({
          name: "",
          description: "",
          price: "",
          originalPrice: "",
          category: "",
          imageUrl: "",
        });
        setIsFlashDeal(false);
        setFlashDealEnd("");
      }
      router.refresh();
    }
  }

  // Merge onClick into trigger element via cloneElement
  const triggerElement = trigger
    ? React.cloneElement(trigger as React.ReactElement<{ onClick?: () => void }>, { onClick: () => setOpen(true) })
    : (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 h-9 px-5 rounded-full bg-primary hover:bg-primary/90 text-white text-sm font-bold transition-all hover:scale-105 shadow-[0_0_20px_rgba(220,38,38,0.3)]"
      >
        <Plus className="h-4 w-4 pointer-events-none" /> Adicionar Produto
      </button>
    );

  return (
    <>
      {triggerElement}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#0A0A0A] border-[#1A1A1A] text-white sm:max-w-[520px] p-0 overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="p-6 border-b border-[#1A1A1A] bg-gradient-to-r from-primary/10 via-transparent to-transparent">
            <DialogTitle className="flex items-center gap-3 text-lg font-black italic uppercase">
              <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                {isEditing ? (
                  <Pencil className="h-4 w-4 text-primary pointer-events-none" />
                ) : (
                  <PackagePlus className="h-4 w-4 text-primary pointer-events-none" />
                )}
              </div>
              {isEditing ? "Editar Produto" : "Novo Produto"}
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-1">
              {isEditing
                ? "Atualize as informações do produto abaixo."
                : "Preencha os dados para adicionar ao catálogo."}
            </p>
          </div>

          {/* Form */}
          <form
            key={initialData?.id || "new"}
            onSubmit={handleSubmit}
            className="p-6 space-y-4 overflow-y-auto flex-1"
          >
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Nome do Produto
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Netflix Premium 4K"
                required
                className="bg-[#111111] border-[#1A1A1A] focus:border-primary/50 h-10 transition-all"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Descrição
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descreva os benefícios e recursos..."
                required
                className="bg-[#111111] border-[#1A1A1A] focus:border-primary/50 min-h-[80px] resize-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Preço (R$)
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                  className="bg-[#111111] border-[#1A1A1A] focus:border-primary/50 h-10 transition-all"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Categoria
                </Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Ex: Streaming"
                  required
                  className="bg-[#111111] border-[#1A1A1A] focus:border-primary/50 h-10 transition-all"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="imageUrl" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                URL da Imagem
              </Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://exemplo.com/imagem.jpg"
                required
                className="bg-[#111111] border-[#1A1A1A] focus:border-primary/50 h-10 transition-all"
              />
            </div>

            <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 space-y-4">
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="isFlashDeal" 
                  name="isFlashDeal"
                  checked={isFlashDeal}
                  onChange={(e) => setIsFlashDeal(e.target.checked)}
                  className="w-4 h-4 accent-red-500 cursor-pointer"
                />
                <Label htmlFor="isFlashDeal" className="text-sm font-bold uppercase tracking-widest text-red-500 cursor-pointer flex items-center gap-2">
                  <Zap className="h-4 w-4" /> Oferta Relâmpago
                </Label>
              </div>

              {isFlashDeal && (
                <div className="grid gap-4 animate-in slide-in-from-top-2 fade-in duration-300">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="originalPrice" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Preço Antigo (R$)
                      </Label>
                      <Input
                        id="originalPrice"
                        name="originalPrice"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.originalPrice}
                        onChange={handleChange}
                        placeholder="Ex: 99.90"
                        className="bg-[#111111] border-[#1A1A1A] focus:border-red-500/50 h-10 transition-all text-muted-foreground line-through"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="flashDealEnd" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Fim da Oferta
                      </Label>
                      <Input
                        id="flashDealEnd"
                        name="flashDealEnd"
                        type="datetime-local"
                        value={flashDealEnd}
                        onChange={(e) => setFlashDealEnd(e.target.value)}
                        required={isFlashDeal}
                        className="bg-[#111111] border-[#1A1A1A] focus:border-red-500/50 h-10 transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-5 py-2 rounded-xl text-sm font-bold text-muted-foreground hover:text-white hover:bg-white/5 transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-6 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-bold flex items-center gap-2 transition-all disabled:opacity-50 min-w-[140px] justify-center"
              >
                {isPending ? (
                  <><Loader2 className="h-4 w-4 animate-spin pointer-events-none" /> Salvando...</>
                ) : isEditing ? (
                  "Salvar Alterações"
                ) : (
                  "Criar Produto"
                )}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

"use client";

import { Trash2, Edit, Package, Loader2 } from "lucide-react";
import { deleteProductAction } from "@/actions/admin";
import { toast } from "sonner";
import { ProductForm } from "./ProductForm";
import { InventoryDialog } from "./InventoryDialog";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Product {
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
}

export function ProductActions({ product }: { product: Product }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Excluir "${product.name}" permanentemente?`)) return;
    setIsDeleting(true);
    const result = await deleteProductAction(product.id);
    if (result.success) {
      toast.success("Produto excluído!");
      router.refresh();
    } else {
      toast.error(result.error || "Erro ao excluir");
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* Inventory */}
      <InventoryDialog productId={product.id} productName={product.name} />

      {/* Edit */}
      <ProductForm
        initialData={product}
        trigger={
          <button
            title="Editar produto"
            className="h-9 w-9 rounded-xl flex items-center justify-center bg-white/10 hover:bg-primary/20 hover:text-primary text-white/70 transition-all"
          >
            <Edit className="h-4 w-4 pointer-events-none" />
          </button>
        }
      />

      {/* Delete */}
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        title="Excluir produto"
        className="h-9 w-9 rounded-xl flex items-center justify-center bg-white/10 hover:bg-red-500/20 hover:text-red-400 text-white/70 transition-all disabled:opacity-50"
      >
        {isDeleting ? (
          <Loader2 className="h-4 w-4 animate-spin pointer-events-none" />
        ) : (
          <Trash2 className="h-4 w-4 pointer-events-none" />
        )}
      </button>
    </div>
  );
}

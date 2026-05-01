"use client";

import { useState, useEffect } from "react";
import { getInventoryDashboardData, getProductStockItems } from "@/actions/get-inventory";
import { bulkAddStockItem, deleteStockItem } from "@/actions/stock-delivery";
import { 
  Package, 
  Search, 
  Plus, 
  Trash, 
  AlertTriangle, 
  CheckCircle,
  ClipboardList,
  Loader2,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

export function InventoryDashboard() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [stockItems, setStockItems] = useState<any[]>([]);
  const [bulkContent, setBulkContent] = useState("");
  const [isActionLoading, setIsActionLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const res = await getInventoryDashboardData();
    if (res.success) {
      setProducts(res.products || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openManager = async (product: any) => {
    setSelectedProduct(product);
    setIsActionLoading(true);
    const res = await getProductStockItems(product.id);
    if (res.success) {
      setStockItems(res.items || []);
    }
    setIsActionLoading(false);
  };

  const handleBulkAdd = async () => {
    if (!bulkContent.trim()) return;
    setIsActionLoading(true);
    const res = await bulkAddStockItem(selectedProduct.id, bulkContent);
    if (res.success) {
      toast.success(`${res.count} itens adicionados com sucesso!`);
      setBulkContent("");
      // Refresh list
      const itemsRes = await getProductStockItems(selectedProduct.id);
      if (itemsRes.success) setStockItems(itemsRes.items || []);
      fetchData();
    } else {
      toast.error(res.error);
    }
    setIsActionLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este item?")) return;
    setIsActionLoading(true);
    const res = await deleteStockItem(id);
    if (res.success) {
      toast.success("Item excluído.");
      setStockItems(prev => prev.filter(i => i.id !== id));
      fetchData();
    } else {
      toast.error(res.error);
    }
    setIsActionLoading(false);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm font-black italic uppercase animate-pulse">Carregando Inventário...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">
            Estoque <span className="text-primary">Digital</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Gerencie chaves, contas e slots de todos os produtos.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar produto..." 
            className="pl-9 bg-[#0A0A0A] border-[#1A1A1A] h-10 text-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const stockLevel = Number(product.currentStock);
          const isLow = stockLevel < 10;
          const isCritical = stockLevel === 0;

          return (
            <div 
              key={product.id} 
              className="group relative bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6 hover:border-primary/50 transition-all cursor-pointer"
              onClick={() => openManager(product)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${isCritical ? 'bg-red-500/10' : isLow ? 'bg-yellow-500/10' : 'bg-green-500/10'}`}>
                  <Package className={`h-6 w-6 ${isCritical ? 'text-red-500' : isLow ? 'text-yellow-500' : 'text-green-500'}`} />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-none mb-1">Stock</p>
                  <p className={`text-2xl font-black ${isCritical ? 'text-red-500' : isLow ? 'text-yellow-500' : 'text-green-500'}`}>
                    {stockLevel}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{product.name}</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{product.category}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#1A1A1A] flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <span className="flex items-center gap-1"><ClipboardList className="h-3 w-3" /> Total: {product.totalItems}</span>
                <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-green-500" /> Vendidos: {product.soldItems}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Manager Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0A0A0A] border-[#1A1A1A]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">
              Gerenciar Estoque: <span className="text-primary">{selectedProduct?.name}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
            {/* Bulk Import */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-tight">
                <Plus className="h-4 w-4 text-primary" />
                Importação em Massa
              </div>
              <p className="text-xs text-muted-foreground">Cole sua lista de itens abaixo (um por linha).</p>
              <Textarea 
                placeholder="email:senha&#10;email2:senha2&#10;CODIGO-123" 
                className="min-h-[250px] bg-[#050505] border-[#1A1A1A] font-mono text-xs"
                value={bulkContent}
                onChange={(e) => setBulkContent(e.target.value)}
              />
              <Button 
                className="w-full h-11 font-black uppercase italic"
                onClick={handleBulkAdd}
                disabled={isActionLoading || !bulkContent.trim()}
              >
                {isActionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Importar Lista'}
              </Button>
            </div>

            {/* Existing Items */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-tight">
                <ClipboardList className="h-4 w-4 text-primary" />
                Itens Ativos
              </div>
              
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {stockItems.length === 0 ? (
                  <div className="py-12 text-center border border-dashed border-[#1A1A1A] rounded-xl">
                    <p className="text-xs text-muted-foreground">Nenhum item cadastrado.</p>
                  </div>
                ) : (
                  stockItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-[#050505] border border-[#1A1A1A] rounded-xl group/item">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-mono font-bold truncate max-w-[200px]" title={item.content}>
                          {item.content}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${item.usedSlots > 0 ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                            {item.usedSlots > 0 ? 'Vendido' : 'Disponível'}
                          </span>
                          <span className="text-[8px] text-muted-foreground font-bold uppercase">Slots: {item.usedSlots}/{item.maxSlots}</span>
                        </div>
                      </div>
                      
                      {item.usedSlots === 0 && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover/item:opacity-100 transition-all"
                          onClick={() => handleDelete(item.id)}
                          disabled={isActionLoading}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ProductForm } from "@/components/admin/ProductForm";
import { ProductActions } from "@/components/admin/ProductActions";
import {
  Search,
  Package,
  AlertTriangle,
  TrendingUp,
  Plus,
  LayoutGrid,
  List,
  Filter,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  stock: number;
  imageUrl: string;
  isFlashDeal?: boolean;
  flashDealEnd?: string | null;
}

export function ProductsClient({ initialProducts }: { initialProducts: Product[] }) {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filterCategory, setFilterCategory] = useState("all");

  const categories = useMemo(() => {
    const cats = Array.from(new Set(initialProducts.map((p) => p.category)));
    return ["all", ...cats];
  }, [initialProducts]);

  const filtered = useMemo(() => {
    return initialProducts.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = filterCategory === "all" || p.category === filterCategory;
      return matchSearch && matchCat;
    });
  }, [initialProducts, search, filterCategory]);

  const totalStock = initialProducts.reduce((acc, p) => acc + p.stock, 0);
  const lowStock = initialProducts.filter((p) => p.stock <= 5).length;

  const formatBRL = (val: string | number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(val));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">
            Gerenciamento de{" "}
            <span className="text-primary">Produtos</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Adicione, edite ou remova produtos do catálogo do Império.
          </p>
        </div>
        <ProductForm />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl bg-[#0A0A0A] border border-[#1A1A1A] p-5 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Produtos</p>
            <p className="text-2xl font-black">{initialProducts.length}</p>
          </div>
        </div>
        <div className="rounded-2xl bg-[#0A0A0A] border border-[#1A1A1A] p-5 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Itens em Estoque</p>
            <p className="text-2xl font-black text-green-500">{totalStock}</p>
          </div>
        </div>
        <div className="rounded-2xl bg-[#0A0A0A] border border-[#1A1A1A] p-5 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Estoque Baixo</p>
            <p className="text-2xl font-black text-red-500">{lowStock}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produto..."
            className="pl-10 bg-[#0A0A0A] border-[#1A1A1A] rounded-xl h-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {/* Category filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                filterCategory === cat
                  ? "bg-primary text-white border-primary"
                  : "bg-[#0A0A0A] border-[#1A1A1A] text-muted-foreground hover:border-primary/50 hover:text-white"
              }`}
            >
              {cat === "all" ? "Todos" : cat}
            </button>
          ))}
        </div>
        {/* View toggle */}
        <div className="flex items-center bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-1">
          <button
            onClick={() => setView("grid")}
            className={`p-1.5 rounded-lg transition-all ${view === "grid" ? "bg-primary text-white" : "text-muted-foreground hover:text-white"}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-1.5 rounded-lg transition-all ${view === "list" ? "bg-primary text-white" : "text-muted-foreground hover:text-white"}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Products */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center rounded-2xl border border-dashed border-[#1A1A1A]">
          <Package className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground font-semibold">Nenhum produto encontrado.</p>
          <p className="text-muted-foreground/50 text-sm mt-1">Tente outro filtro ou adicione um novo produto.</p>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="group relative rounded-2xl border border-[#1A1A1A] bg-[#0A0A0A] overflow-hidden hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-44 w-full overflow-hidden bg-muted/10">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Stock badge overlay */}
                <div className="absolute top-2 right-2">
                  {product.stock <= 5 ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold bg-red-500/90 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
                      <AlertTriangle className="h-2.5 w-2.5" /> BAIXO
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold bg-black/60 text-green-400 px-2 py-0.5 rounded-full backdrop-blur-sm">
                      {product.stock} itens
                    </span>
                  )}
                </div>
                {/* Category badge overlay */}
                <div className="absolute top-2 left-2">
                  <Badge className="text-[10px] bg-primary/80 text-white border-none backdrop-blur-sm">
                    {product.category}
                  </Badge>
                </div>
                {/* Actions overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-300 flex items-center justify-center">
                  <ProductActions product={product} />
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-bold text-sm capitalize truncate">{product.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{product.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-lg font-black text-primary">{formatBRL(product.price)}</span>
                  <span className={`text-xs font-semibold ${product.stock <= 5 ? "text-red-400" : "text-green-400"}`}>
                    {product.stock} un.
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="rounded-2xl border border-[#1A1A1A] bg-[#0A0A0A] overflow-hidden divide-y divide-[#1A1A1A]">
          {/* Header */}
          <div className="grid grid-cols-[64px_1fr_140px_100px_100px_120px] gap-4 px-5 py-3 bg-[#111111] text-[11px] font-black uppercase tracking-widest text-muted-foreground">
            <span>Imagem</span>
            <span>Nome</span>
            <span>Categoria</span>
            <span>Preço</span>
            <span>Estoque</span>
            <span className="text-right">Ações</span>
          </div>
          {filtered.map((product) => (
            <div
              key={product.id}
              className="grid grid-cols-[64px_1fr_140px_100px_100px_120px] gap-4 px-5 py-4 items-center hover:bg-white/[0.02] transition-colors"
            >
              <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-[#1A1A1A]">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-bold text-sm capitalize">{product.name}</p>
                <p className="text-xs text-muted-foreground line-clamp-1 max-w-xs">{product.description}</p>
              </div>
              <div>
                <Badge className="text-[10px] bg-primary/10 text-primary border-primary/20">
                  {product.category}
                </Badge>
              </div>
              <span className="font-black text-sm">{formatBRL(product.price)}</span>
              <div className="flex items-center gap-2">
                <span className={`font-bold text-sm ${product.stock <= 5 ? "text-red-400" : ""}`}>
                  {product.stock}
                </span>
                {product.stock <= 5 && (
                  <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                )}
              </div>
              <div className="flex justify-end">
                <ProductActions product={product} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

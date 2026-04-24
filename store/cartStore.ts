import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/db/schema";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.product.id === product.id);
          if (existingItem) {
            // Check stock limit (mocked check, server validates again later)
            const newQuantity = existingItem.quantity + quantity;
            const finalQuantity = newQuantity > product.stock ? product.stock : newQuantity;
            
            return {
              items: state.items.map((i) =>
                i.product.id === product.id ? { ...i, quantity: finalQuantity } : i
              ),
            };
          }
          return { items: [...state.items, { product, quantity }] };
        });
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        }));
      },
      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          return total + Number(item.product.price) * item.quantity;
        }, 0);
      },
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: "cart-storage", // local storage key
    }
  )
);

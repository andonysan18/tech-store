// Archivo: src/store/cart-store.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

export interface CartItem {
  id: number;       // Es el variantId
  name: string;
  price: number;
  image: string;
  stock: number;    
  quantity: number;
}

interface CartState {
  cart: CartItem[]; // 🔥 AQUÍ ESTÁ LA CLAVE: Se llama 'cart', no 'items'
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [], // 🔥 Inicializamos como 'cart'

      addItem: (data) => {
        const currentCart = get().cart; // 🔥 Usamos 'cart'
        const existingItem = currentCart.find((item) => item.id === data.id);

        if (existingItem) {
          if (existingItem.quantity + 1 > data.stock) {
            toast.error("¡No hay suficiente stock disponible!");
            return;
          }
          
          set({
            cart: currentCart.map((item) =>
              item.id === data.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
          toast.success("Cantidad actualizada");
        } else {
          set({ cart: [...currentCart, { ...data, quantity: 1 }] });
          toast.success("Producto agregado");
        }
      },

      removeItem: (id) => {
        set({ cart: get().cart.filter((item) => item.id !== id) });
        toast.info("Producto eliminado");
      },

      updateQuantity: (id, quantity) => {
        const item = get().cart.find((i) => i.id === id);
        
        if (item && quantity > item.stock) {
            toast.error(`Solo quedan ${item.stock} unidades.`);
            return;
        }

        if (quantity < 1) return; 

        set({
          cart: get().cart.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ cart: [] }),

      getTotalItems: () => {
        return get().cart.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
    }),
    {
      name: 'tech-cart-storage',
    }
  )
);
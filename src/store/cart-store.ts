import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

export interface CartItem {
  id: number;       // Este será el variantId (o productId si no hay variante)
  name: string;
  price: number;
  image: string;
  stock: number;    // Para validar que no compre más de lo que hay
  quantity: number;
}

interface CartState {
  items: CartItem[];
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
      items: [],

      addItem: (data) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === data.id);

        if (existingItem) {
          // Si ya existe, validamos stock antes de sumar
          if (existingItem.quantity + 1 > data.stock) {
            toast.error("¡No hay suficiente stock disponible!");
            return;
          }
          
          set({
            items: currentItems.map((item) =>
              item.id === data.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
          toast.success("Cantidad actualizada en el carrito");
        } else {
          // Si es nuevo, lo agregamos
          set({ items: [...currentItems, { ...data, quantity: 1 }] });
          toast.success("Producto agregado al carrito");
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
        toast.info("Producto eliminado del carrito");
      },

      updateQuantity: (id, quantity) => {
        const item = get().items.find((i) => i.id === id);
        
        // Validación de stock en tiempo real
        if (item && quantity > item.stock) {
            toast.error(`Solo quedan ${item.stock} unidades.`);
            return;
        }

        if (quantity < 1) return; // No permitir 0 o negativos

        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
    }),
    {
      name: 'tech-cart-storage', // Nombre en localStorage
    }
  )
);
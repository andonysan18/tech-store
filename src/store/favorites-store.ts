import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

export interface FavoriteItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  condition: string; // Agregamos condition
  brand?: { name: string }; // 🔥 Agregamos esto para que funcione el filtro en el Grid
}

interface FavoritesState {
  items: FavoriteItem[];
  isFavorite: (id: number) => boolean;
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (id: number) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],
      
      isFavorite: (id) => get().items.some((item) => item.id === id),

      addFavorite: (item) => {
        set({ items: [...get().items, item] });
        toast.success("Agregado a favoritos");
      },

      removeFavorite: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
        toast.info("Eliminado de favoritos");
      },
    }),
    {
      name: 'tech-favorites-storage',
    }
  )
);
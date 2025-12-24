"use client";

import { ShoppingCart, Plus } from "lucide-react";
import { Button } from "@/src/components/ui/button"; // O tu botón nativo si no usas shadcn
import { useCartStore } from "@/src/store/cart-store";
import { cn } from "@/src/lib/utils";

interface ProductForCart {
  id: number;
  name: string;
  price: number;
  image: string;
  stock: number;
}

interface AddToCartProps {
  product: ProductForCart;
  className?: string;
  compact?: boolean; // Opción para mostrar solo el icono (útil en móviles o listas densas)
}

export function AddToCart({ product, className, compact = false }: AddToCartProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault(); // Evita navegar si está dentro de un Link
    e.stopPropagation();

    if (product.stock <= 0) return;

    addItem({
      id: product.id, // Aquí recibimos el variantId que pasaste desde la Card
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock
    });
  };

  if (product.stock <= 0) {
    return (
      <Button 
        disabled 
        variant="outline" 
        size={compact ? "icon" : "default"}
        className={cn("opacity-50 cursor-not-allowed", className)}
      >
        {compact ? <ShoppingCart size={18} /> : "Sin Stock"}
      </Button>
    );
  }

  return (
    <Button
      onClick={handleAdd}
      className={cn(
        "bg-slate-900 hover:bg-slate-800 text-white transition-all active:scale-95 shadow-lg shadow-slate-900/20",
        className
      )}
      size={compact ? "icon" : "default"}
    >
      {compact ? (
        <Plus size={18} strokeWidth={3} />
      ) : (
        <div className="flex items-center gap-2">
          <ShoppingCart size={18} />
          <span className="font-semibold">Agregar</span>
        </div>
      )}
    </Button>
  );
}
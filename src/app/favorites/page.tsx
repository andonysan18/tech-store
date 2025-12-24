"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useFavoritesStore } from "@/src/store/favorites-store";
import { ProductGrid } from "@/src/components/products/product-grid"; 
import { Heart, ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/src/components/ui/button";

export default function FavoritesPage() {
  const items = useFavoritesStore((state) => state.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4">
        
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
                    <Heart className="text-red-500 fill-red-500" size={32} />
                    Mis Favoritos
                </h1>
                <p className="text-slate-500 mt-2">
                    Tienes {items.length} productos guardados en tu lista de deseos.
                </p>
            </div>
            <Link href="/">
                <Button variant="ghost" className="text-slate-600">
                    <ArrowLeft className="mr-2" size={18} /> Seguir explorando
                </Button>
            </Link>
        </div>

        {/* Contenido */}
        {items.length > 0 ? (
            // Reutilizamos el ProductGrid que ya tiene filtros de marca
            <ProductGrid products={items} />
        ) : (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-slate-300 text-center">
                <div className="bg-slate-50 p-6 rounded-full mb-6">
                    <Heart size={64} className="text-slate-300" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Tu lista está vacía</h2>
                <p className="text-slate-500 max-w-md mb-8">
                    Aún no has guardado ningún producto. ¡Explora la tienda y guarda lo que te guste para después!
                </p>
                <Link href="/">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 font-bold h-12 px-8 shadow-lg shadow-blue-200">
                        <ShoppingBag className="mr-2" size={20} /> Ir a la Tienda
                    </Button>
                </Link>
            </div>
        )}

      </div>
    </div>
  );
}
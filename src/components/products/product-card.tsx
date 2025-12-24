"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AddToCart } from "./add-to-cart";
import { Badge } from "@/src/components/ui/badge";
import { Heart, Cpu, Smartphone, Monitor } from "lucide-react";
import { useFavoritesStore } from "@/src/store/favorites-store";

interface ProductCardProps {
  product: {
    id: number;
    variantId?: number;
    name: string;
    slug: string;
    price: number;
    image: string;
    stock: number;
    category: string;
    condition: string;
    // 🔥 Agregamos brand opcional aquí
    brand?: { name: string }; 
    specs?: { ram?: string; screen?: string };
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const isFav = isFavorite(product.id);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFav) {
      removeFavorite(product.id);
    } else {
      addFavorite({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        stock: product.stock,
        condition: product.condition,
        // 🔥 Guardamos la marca para que el filtro funcione en FavoritesPage
        brand: product.brand 
      });
    }
  };

  // Validación de imagen
  const imageSrc = product.image && product.image !== "placeholder"
    ? (product.image.startsWith("http") ? product.image : `/${product.image.startsWith("/") ? product.image.slice(1) : product.image}`)
    : "/placeholder.png"; 

  return (
    <div className="group bg-white w-full rounded-2xl border border-slate-200 p-3 flex flex-col h-full relative hover:shadow-xl hover:border-blue-200 transition-all duration-300">
      
      {/* ZONA IMAGEN */}
      <div className="relative aspect-[4/3] bg-slate-50 rounded-xl overflow-hidden mb-3">
        {mounted && (
          <button
            onClick={toggleFavorite}
            className={`absolute top-2 right-2 z-20 p-1.5 rounded-full transition-all shadow-sm ${
              isFav ? "bg-red-50 text-red-500" : "bg-white/80 text-slate-400 hover:text-red-500 hover:bg-white"
            }`}
          >
            <Heart size={16} className={isFav ? "fill-current" : ""} />
          </button>
        )}

        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 items-start">
          {product.condition === "NEW" && (
            <Badge className="bg-blue-600 hover:bg-blue-700 text-[10px] px-2 py-0.5 h-auto font-semibold shadow-sm">NUEVO</Badge>
          )}
          {product.stock === 0 && (
            <Badge variant="destructive" className="text-[10px] px-2 py-0.5 h-auto shadow-sm">AGOTADO</Badge>
          )}
          {product.condition === "REFURBISHED" && (
            <Badge className="bg-amber-500 hover:bg-amber-600 text-[10px] px-2 py-0.5 h-auto shadow-sm">REACONDICIONADO</Badge>
          )}
        </div>

        <Link href={`/product/${product.slug}`} className="relative w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              className="object-contain p-4 mix-blend-multiply"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
        </Link>
      </div>

      {/* ZONA INFO */}
      <div className="flex-1 flex flex-col min-h-[140px]">
        <p className="text-[10px] text-blue-600 font-bold tracking-wider uppercase mb-1">
          {product.category || "TECNOLOGÍA"}
        </p>

        <Link href={`/product/${product.slug}`} className="block mb-2 group-hover:text-blue-600 transition-colors">
          <h3 className="font-bold text-slate-800 text-sm leading-tight line-clamp-2 h-10" title={product.name}>
            {product.name}
          </h3>
        </Link>

        {/* Specs Chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
           {product.specs?.ram && (
             <span className="inline-flex items-center gap-1 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 text-[10px] text-slate-500 font-medium">
               <Cpu size={10} /> {product.specs.ram}
             </span>
           )}
           {product.specs?.screen && (
             <span className="inline-flex items-center gap-1 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 text-[10px] text-slate-500 font-medium">
               <Monitor size={10} /> {product.specs.screen}
             </span>
           )}
        </div>

        {/* BOTTOM: PRECIO Y CART */}
        <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            {product.condition !== "NEW" && (
                 <span className="text-[10px] text-slate-400 line-through">
                   ${(product.price * 1.1).toLocaleString("es-AR", { maximumFractionDigits: 0 })}
                 </span>
            )}
            <span className="text-lg font-bold text-slate-900 tracking-tight">
              ${product.price.toLocaleString("es-AR")}
            </span>
          </div>

          <div className="shrink-0">
             {/* 🔥 AQUÍ USAMOS variantId PARA EL CARRITO */}
             <AddToCart product={{
                 id: product.variantId || product.id, // Preferimos variantId, fallback a id
                 name: product.name,
                 price: product.price,
                 image: imageSrc,
                 stock: product.stock
             }} /> 
          </div>
        </div>
      </div>
    </div>
  );
}
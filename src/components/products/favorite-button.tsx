"use client";

import { useState, useEffect } from "react";
import { useFavoritesStore, FavoriteItem } from "@/src/store/favorites-store";
import { Button } from "@/src/components/ui/button";
import { Heart } from "lucide-react";

interface FavoriteButtonProps {
    product: FavoriteItem;
}

export function FavoriteButton({ product }: FavoriteButtonProps) {
    const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
    // Truco de hidratación (para evitar errores con LocalStorage)
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true) }, []);

    // Si no ha cargado, mostramos el botón gris por defecto
    if (!mounted) {
        return (
            <Button variant="outline" size="lg" className="w-full font-medium h-12 border-slate-300">
                <Heart className="mr-2 text-slate-400" /> Agregar a Favoritos
            </Button>
        );
    }

    const isFav = isFavorite(product.id);

    const handleToggle = () => {
        if (isFav) {
            removeFavorite(product.id);
        } else {
            addFavorite(product);
        }
    };

    return (
        <Button 
            onClick={handleToggle}
            variant="outline" 
            size="lg" 
            className={`w-full font-medium h-12 border-slate-300 transition-all duration-300 ${
                isFav 
                ? 'text-red-500 border-red-200 bg-red-50 hover:bg-red-100' 
                : 'text-slate-400 hover:text-red-500 hover:border-red-200'
            }`}
        >
            {/* El icono se rellena si es favorito */}
            <Heart className={`mr-2 ${isFav ? 'fill-current' : ''}`} size={20}/>
            {isFav ? "Quitar de Favoritos" : "Agregar a Favoritos"}
        </Button>
    );
}
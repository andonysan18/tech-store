"use client";

import { useState, useEffect } from "react"; // ⬅️ Importa useEffect
import Image from "next/image";
import { cn } from "@/src/lib/utils";

interface ProductGalleryProps {
  images: string[];
}

export function ProductGallery({ images = [] }: ProductGalleryProps) {
  // Definimos las imágenes a mostrar (o el placeholder si está vacío)
  const displayImages = images.length > 0 
    ? images 
    : ["https://placehold.co/600x600/png?text=Sin+Imagen"];

  // Estado para la imagen principal
  const [selectedImage, setSelectedImage] = useState(displayImages[0]);

  // 🔥🔥🔥 EL FIX: Sincronizar estado cuando cambian las props 🔥🔥🔥
  // Cada vez que cambias de variante, 'images' cambia. 
  // Este efecto actualiza la foto principal automáticamente.
  useEffect(() => {
    setSelectedImage(displayImages[0]);
  }, [images]); 

  return (
    <div className="flex flex-col gap-4">
      {/* 1. IMAGEN PRINCIPAL */}
      <div className="relative h-[300px] md:h-[400px] w-full max-w-[400px] mx-auto overflow-hidden rounded-2xl border border-gray-100 bg-white flex items-center justify-center p-2 shadow-sm">
        <Image
          src={selectedImage}
          alt="Imagen de producto"
          fill
          className="object-contain transition-all duration-300 hover:scale-105"
          priority // Carga rápida para la imagen principal
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* 2. MINIATURAS */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3 max-w-[400px] mx-auto w-full px-2 md:px-0">
          {displayImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(img)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg border bg-white hover:opacity-80 transition cursor-pointer",
                selectedImage === img ? "border-blue-600 ring-2 ring-blue-50" : "border-gray-200"
              )}
            >
              <Image 
                src={img} 
                alt={`Vista ${index}`} 
                fill 
                className="object-contain p-1"
                sizes="100px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
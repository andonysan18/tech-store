"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/src/lib/utils";

interface ProductGalleryProps {
  images: string[];
}

export function ProductGallery({ images = [] }: ProductGalleryProps) {
  // Si no hay imágenes, usamos una por defecto
  const displayImages = images.length > 0 
    ? images 
    : ["https://placehold.co/600x600/png?text=Sin+Imagen"];

  // Estado para saber cuál es la imagen principal actual
  const [selectedImage, setSelectedImage] = useState(displayImages[0]);

  return (
    <div className="flex flex-col gap-4">
      {/* 1. IMAGEN PRINCIPAL (Tamaño Compacto) */}
      {/* Ajuste: h-[300px] en móvil, h-[400px] en PC. Max-width limitado a 400px. */}
      <div className="relative h-[300px] md:h-[400px] w-full max-w-[400px] mx-auto overflow-hidden rounded-2xl border border-gray-100 bg-white flex items-center justify-center p-2 shadow-sm">
        <Image
          src={selectedImage}
          alt="Imagen de producto"
          fill
          className="object-contain transition-all duration-300 hover:scale-105"
          priority
        />
      </div>

      {/* 2. MINIATURAS (Alineadas al ancho de la imagen principal) */}
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
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
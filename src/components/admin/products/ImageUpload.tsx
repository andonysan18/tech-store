'use client'

import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
import { ImagePlus, Trash } from 'lucide-react';

interface ImageUploadProps {
  value: string[]; // Recibe la lista completa para mostrarla
  onChange: (value: string) => void; // 🔥 IMPORTANTE: Emite SOLO la nueva URL (string)
  onRemove: (value: string) => void;
}

export default function ImageUpload({
  value,
  onChange,
  onRemove
}: ImageUploadProps) {
  
  const onUpload = (result: any) => {
    // Comunicamos al padre solo la URL nueva
    onChange(result.info.secure_url);
  };

  return (
    <div>
      {/* Grid de Fotos Existentes */}
      <div className="mb-4 flex flex-wrap gap-4">
        {value.map((url) => (
          <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden bg-gray-100 border border-gray-200">
            <div className="z-10 absolute top-2 right-2">
              <button
                type="button"
                onClick={() => onRemove(url)}
                className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-sm transition-colors"
              >
                <Trash className="h-4 w-4" />
              </button>
            </div>
            <Image
              fill
              className="object-cover"
              alt="Imagen producto"
              src={url}
            />
          </div>
        ))}
      </div>
      
      {/* Botón de Cloudinary */}
      <CldUploadWidget 
        onSuccess={onUpload} 
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET} 
        options={{
          maxFiles: 10,
          multiple: true 
        }}
      >
        {({ open }) => {
          return (
            <button
              type="button"
              onClick={() => open()}
              className="flex items-center gap-2 bg-gray-50 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              <ImagePlus className="h-4 w-4" />
              Subir Imágenes ({value.length})
            </button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}
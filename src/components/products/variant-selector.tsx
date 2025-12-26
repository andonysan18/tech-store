"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/src/lib/utils";

interface Variant {
  id: number;
  sku: string;
  color: string | null;
  storage: string | null;
  price: number; // 👈 Esto ahora coincide con lo que enviamos desde page.tsx
  stock: number;
}

interface VariantSelectorProps {
  variants: Variant[];
}

export function VariantSelector({ variants }: VariantSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSku = searchParams.get("sku");

  const handleSelect = (sku: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sku", sku);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-4 mb-6">
      <p className="text-sm font-medium text-slate-900">Opciones disponibles:</p>
      <div className="flex flex-wrap gap-3">
        {variants.map((variant) => {
          const isActive = currentSku === variant.sku || (!currentSku && variants[0].sku === variant.sku);
          const isOutOfStock = variant.stock === 0;

          return (
            <button
              key={variant.id}
              onClick={() => handleSelect(variant.sku)}
              disabled={isOutOfStock}
              className={cn(
                "border rounded-lg px-4 py-2 text-sm font-medium transition-all relative overflow-hidden",
                isActive 
                  ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600" 
                  : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50",
                isOutOfStock && "opacity-50 cursor-not-allowed bg-slate-100 text-slate-400 decoration-slate-400 line-through"
              )}
            >
              <div className="flex flex-col items-center">
                 <span className="font-bold">
                    {variant.color} {variant.storage && `- ${variant.storage}`}
                 </span>
                 <span className="text-xs opacity-80">${Number(variant.price).toLocaleString("es-AR")}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
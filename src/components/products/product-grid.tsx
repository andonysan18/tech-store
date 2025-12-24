"use client";

import { useState } from "react";
import { ProductCard } from "@/src/components/products/product-card"; 

interface ProductGridProps {
  products: any[]; 
}

export function ProductGrid({ products }: ProductGridProps) {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  const brands = Array.from(new Set(
    products
      .map((p) => p.brand?.name)
      .filter((name) => name !== undefined && name !== null)
  ));

  const filteredProducts = selectedBrand
    ? products.filter((p) => p.brand?.name === selectedBrand)
    : products;

  return (
    <div className="flex flex-col gap-8">
      
      {/* BARRA DE FILTROS (Sin cambios) */}
      {brands.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-slate-500 mr-2">Filtrar por:</span>
            <button
                onClick={() => setSelectedBrand(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                    selectedBrand === null
                    ? "bg-slate-900 text-white border-slate-900 shadow-md"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                }`}
            >
                Todos
            </button>
            {brands.map((brand) => (
                <button
                    key={brand as string}
                    onClick={() => setSelectedBrand(brand as string)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                        selectedBrand === brand
                        ? "bg-blue-600 text-white border-blue-600 shadow-md"
                        : "bg-white text-slate-600 border-slate-200 hover:border-blue-200"
                    }`}
                >
                    {brand as string}
                </button>
            ))}
             {selectedBrand && (
                <span className="ml-auto text-xs text-slate-400 animate-in fade-in">
                    Viendo {filteredProducts.length} resultados
                </span>
            )}
          </div>
      )}

      {/* GRID DE PRODUCTOS */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in zoom-in duration-500">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                variantId: product.variantId,
                name: product.name,
                slug: product.slug, 
                price: product.price,
                image: product.image,
                stock: product.stock,
                condition: product.condition,
                category: product.category,
                specs: product.specs,
                
                // 🔥 ESTA LÍNEA FALTABA: Pasamos el descuento al componente hijo
                discount: product.discount 
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <p className="text-xl text-slate-400 font-medium">No se encontraron productos.</p>
            {selectedBrand && (
                <button 
                    onClick={() => setSelectedBrand(null)}
                    className="mt-4 text-blue-600 hover:underline text-sm"
                >
                    Ver todas las marcas
                </button>
            )}
        </div>
      )}
    </div>
  );
}
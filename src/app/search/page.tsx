import { redirect } from "next/navigation";
import { prisma } from "@/src/lib/db";
import { ProductGrid } from "@/src/components/products/product-grid";
import { Search, Frown } from "lucide-react";

interface SearchPageProps {
  searchParams: Promise<{
    q: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;

  if (!q) {
    redirect("/");
  }

  // 2. Buscamos en la Base de Datos (AHORA MÁS INTELIGENTE)
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: "insensitive" } },        // 1. Busca en el Nombre
        { description: { contains: q, mode: "insensitive" } }, // 2. Busca en la Descripción
        { brand: { name: { contains: q, mode: "insensitive" } } }, // 3. Busca por Marca (ej: "Apple")
        
        // 👇 AGREGAMOS ESTO: Busca también en el nombre de la Categoría
        { category: { name: { contains: q, mode: "insensitive" } } } 
      ],
    },
    include: {
      brand: true, // Necesario para el filtro de marcas
      category: true, // (Opcional) por si quieres mostrar la categoría
    },
  });

  // 3. Convertimos los precios
  const productsFormatted = products.map((product) => ({
    ...product,
    price: Number(product.price),
  }));

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4">
        
        <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
                <Search className="text-blue-600" size={32} />
                Resultados para "{q}"
            </h1>
            <p className="text-slate-500 mt-2">
                Encontramos {products.length} productos que coinciden con tu búsqueda.
            </p>
        </div>

        {products.length > 0 ? (
            <ProductGrid products={productsFormatted} />
        ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 text-center">
                <div className="bg-slate-100 p-4 rounded-full mb-4">
                    <Frown size={48} className="text-slate-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Ups, no encontramos nada.</h2>
                <p className="text-slate-500 max-w-md mt-2">
                    Intenta revisar la ortografía o usar términos más generales.
                </p>
            </div>
        )}

      </div>
    </div>
  );
}
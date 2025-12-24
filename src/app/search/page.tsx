// Archivo: src/app/search/page.tsx

import Link from "next/link";
import { prisma } from "@/src/lib/db";
import { ProductGrid } from "@/src/components/products/product-grid";
import { Filter, X } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/src/components/ui/sheet";

// Definimos qué parámetros puede recibir la URL (?q=iphone&category=celulares)
interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    brand?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  // Esperamos los parámetros (Next.js 15 requiere await, en 14 es opcional pero buena práctica)
  const { q, category, brand } = await searchParams;

  // 1. CONSTRUCCIÓN DINÁMICA DEL FILTRO (WHERE)
  // Empezamos vacíos y vamos agregando condiciones según lo que haya en la URL
  const where: any = {};

  // Si hay texto de búsqueda (?q=...)
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ];
  }

  // Si hay categoría (?category=...)
  if (category) {
    where.category = { slug: category };
  }

  // Si hay marca (?brand=...)
  if (brand) {
    where.brand = { slug: brand };
  }

  // 2. CONSULTAS A LA BASE DE DATOS (Paralelas para velocidad)
  const [productsRaw, categories, brands] = await Promise.all([
    // A. Buscar Productos con los filtros
    prisma.product.findMany({
      where: where,
      include: {
        category: true,
        brand: true,
        variants: true, // Vital para precio y foto
      },
      orderBy: { createdAt: 'desc' },
    }),

    // B. Traer todas las categorías (para la barra lateral)
    prisma.category.findMany({ orderBy: { name: 'asc' } }),

    // C. Traer todas las marcas (para la barra lateral)
    prisma.brand.findMany({ orderBy: { name: 'asc' } }),
  ]);

  // 3. FORMATEO DE DATOS PARA EL GRID
  // Igual que hicimos en Home y Offers, aplanamos los datos
  const productsFormatted = productsRaw.map((product) => {
    const mainVariant = product.variants[0];
    return {
      id: product.id,
      variantId: mainVariant?.id,
      name: product.name,
      slug: product.slug,
      
      // Datos de variante
      price: mainVariant ? Number(mainVariant.price) : 0,
      stock: mainVariant ? mainVariant.stock : 0,
      image: mainVariant?.images?.[0] || "/placeholder.png",
      condition: mainVariant?.condition || "NEW",
      
      // Datos generales
      category: product.category.name,
      brand: product.brand,
      discount: product.discount,
      specs: product.specs,
    };
  });

  // --- COMPONENTE INTERNO: SIDEBAR DE FILTROS ---
  // Lo definimos aquí para reusarlo en Desktop y Móvil sin crear otro archivo
  const FiltersContent = () => (
    <div className="space-y-8">
      {/* Sección Categorías */}
      <div>
        <h3 className="font-bold text-slate-900 mb-4">Categorías</h3>
        <div className="flex flex-col gap-2">
          {/* Opción "Todas" */}
          <Link 
            href={`/search?${new URLSearchParams({ ...(q && { q }), ...(brand && { brand }) }).toString()}`}
            className={`text-sm hover:text-blue-600 ${!category ? "font-bold text-blue-600" : "text-slate-600"}`}
          >
            Todas
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              // Mantenemos los otros filtros (q, brand) al cambiar categoría
              href={`/search?${new URLSearchParams({ ...(q && { q }), ...(brand && { brand }), category: cat.slug }).toString()}`}
              className={`text-sm hover:text-blue-600 ${category === cat.slug ? "font-bold text-blue-600" : "text-slate-600"}`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Sección Marcas */}
      <div>
        <h3 className="font-bold text-slate-900 mb-4">Marcas</h3>
        <div className="flex flex-wrap gap-2">
          {brands.map((b) => (
            <Link
              key={b.id}
              href={`/search?${new URLSearchParams({ ...(q && { q }), ...(category && { category }), brand: b.slug }).toString()}`}
            >
               <Badge 
                 variant="outline" 
                 className={`cursor-pointer hover:border-blue-500 ${brand === b.slug ? "bg-blue-50 border-blue-500 text-blue-700" : "bg-white text-slate-600"}`}
               >
                 {b.name}
               </Badge>
            </Link>
          ))}
        </div>
      </div>

      {/* Botón Limpiar Filtros */}
      {(q || category || brand) && (
         <div className="pt-4 border-t">
            <Link href="/search">
              <Button variant="ghost" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50">
                <X size={16} className="mr-2" /> Limpiar Filtros
              </Button>
            </Link>
         </div>
      )}
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      
      {/* Header de la página */}
      <div className="bg-slate-50 border-b border-slate-100 py-8">
        <div className="container mx-auto px-4">
           <h1 className="text-3xl font-bold text-slate-900">
             {q ? `Resultados para "${q}"` : "Nuestra Tienda"}
           </h1>
           <p className="text-slate-500 mt-2">
             Mostrando {productsFormatted.length} productos
           </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* ASIDE: FILTROS (Desktop) */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
           <FiltersContent />
        </aside>

        {/* ASIDE: FILTROS (Móvil - Sheet) */}
        <div className="lg:hidden mb-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full flex justify-between">
                 <span className="flex items-center gap-2"><Filter size={16} /> Filtrar productos</span>
                 <Badge variant="secondary">{productsFormatted.length}</Badge>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader className="mb-6">
                <SheetTitle>Filtros</SheetTitle>
              </SheetHeader>
              <FiltersContent />
            </SheetContent>
          </Sheet>
        </div>

        {/* MAIN: GRILLA DE PRODUCTOS */}
        <main className="flex-1">
           {productsFormatted.length > 0 ? (
             <ProductGrid products={productsFormatted} />
           ) : (
             <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <p className="text-slate-500 text-lg">No encontramos productos con esos filtros.</p>
                <Link href="/search" className="text-blue-600 font-bold mt-2 inline-block hover:underline">
                  Ver todos los productos
                </Link>
             </div>
           )}
        </main>

      </div>
    </div>
  );
}
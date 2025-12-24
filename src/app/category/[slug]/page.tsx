import { notFound } from "next/navigation";
import { prisma } from "@/src/lib/db";
import { ProductGrid } from "@/src/components/products/product-grid"; 
import { Smartphone, Gamepad2, Headphones, Layers, AlertCircle, Zap } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Helper para iconos dinámicos
const getCategoryIcon = (slug: string) => {
    const s = slug.toLowerCase();
    if (s.includes('celular') || s.includes('phone')) return <Smartphone size={32} className="text-blue-500" />;
    if (s.includes('game') || s.includes('consola')) return <Gamepad2 size={32} className="text-purple-500" />;
    if (s.includes('audio') || s.includes('sound')) return <Headphones size={32} className="text-green-500" />;
    if (s.includes('periferico')) return <Zap size={32} className="text-yellow-500" />;
    return <Layers size={32} className="text-slate-500" />;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  // 1. Buscamos categoría POR SLUG (Exacto y seguro)
  // Esto soluciona el problema de "Periféricos" (DB) vs "perifericos" (URL)
  const category = await prisma.category.findUnique({
    where: { 
        slug: decodedSlug 
    },
    include: {
      products: {
        include: {
            brand: true,
            variants: true 
        }
      }, 
    },
  });

  // Si no existe la categoría, mostramos error visual
  if (!category) {
    return (
        <div className="container mx-auto py-20 px-4 text-center min-h-[60vh] flex flex-col items-center justify-center">
            <div className="bg-red-50 p-4 rounded-full mb-4">
                <AlertCircle size={48} className="text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Categoría no encontrada</h1>
            <p className="text-slate-500 max-w-md mx-auto">
                No pudimos encontrar la categoría <span className="font-mono font-bold text-slate-700">"{decodedSlug}"</span>.
            </p>
        </div>
    );
  }

  // 2. FORMATEO DE DATOS
  // Transformamos los datos crudos de Prisma al formato que espera ProductGrid
  const productsFormatted = category.products.map((product) => {
    // Tomamos la primera variante como la "principal" para mostrar precio y foto
    const defaultVariant = product.variants[0];

    return {
        id: product.id,            
        variantId: defaultVariant?.id, 
        name: product.name,
        slug: product.slug,
        category: category.name,
        
        brand: product.brand,
        discount: product.discount, // Pasamos el descuento para que se vea la etiqueta
        
        // Datos de la variante:
        price: defaultVariant ? Number(defaultVariant.price) : 0,
        stock: defaultVariant ? defaultVariant.stock : 0,
        condition: defaultVariant ? defaultVariant.condition : "NEW",
        image: defaultVariant?.images?.[0] || "/placeholder.png", 
        
        specs: product.specs
    };
  });

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4">
        
        {/* Header de Categoría */}
        <div className="bg-white rounded-3xl p-8 mb-10 border border-slate-100 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {getCategoryIcon(category.slug)}
            </div>
            <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 capitalize">
                    {category.name}
                </h1>
                <p className="text-slate-500 mt-1">
                    Explora los mejores productos en {category.name}.
                </p>
            </div>
        </div>

        {/* Pasamos la lista formateada al Grid */}
        <ProductGrid products={productsFormatted} />

      </div>
    </div>
  );
}
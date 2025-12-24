import { notFound } from "next/navigation";
import { prisma } from "@/src/lib/db";
import { ProductGrid } from "@/src/components/products/product-grid"; 
import { Smartphone, Gamepad2, Headphones, Layers, AlertCircle } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const getCategoryIcon = (slug: string) => {
    const s = slug.toLowerCase();
    if (s.includes('celular') || s.includes('phone')) return <Smartphone size={32} className="text-blue-500" />;
    if (s.includes('game') || s.includes('consola')) return <Gamepad2 size={32} className="text-purple-500" />;
    if (s.includes('audio') || s.includes('sound')) return <Headphones size={32} className="text-green-500" />;
    return <Layers size={32} className="text-slate-500" />;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  // 1. Buscamos categoría y sus productos CON VARIANTES
  const category = await prisma.category.findFirst({
    where: { 
        name: { 
            contains: decodedSlug, 
            mode: 'insensitive' 
        } 
    },
    include: {
      products: {
        include: {
            brand: true,
            variants: true // <--- 🔥 IMPORTANTE: Traer variantes
        }
      }, 
    },
  });

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

  // 2. FORMATEO DE DATOS (El Puente)
  // Convertimos la estructura compleja de DB a una estructura plana para el Frontend
  const productsFormatted = category.products.map((product) => {
    // Tomamos la primera variante como la "principal" para mostrar en la tarjeta
    const defaultVariant = product.variants[0];

    return {
        id: product.id,            // ID del Producto (para links y favoritos)
        variantId: defaultVariant?.id, // ID de Variante (para el carrito)
        name: product.name,
        slug: product.slug,
        category: category.name,
        brand: product.brand,
        
        // Datos que vienen de la VARIANTE:
        price: defaultVariant ? Number(defaultVariant.price) : 0,
        stock: defaultVariant ? defaultVariant.stock : 0,
        condition: defaultVariant ? defaultVariant.condition : "NEW",
        image: defaultVariant?.images?.[0] || "/placeholder.png", 
        
        specs: product.specs // Mantenemos las specs generales
    };
  });

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4">
        
        {/* Header de Categoría */}
        <div className="bg-white rounded-3xl p-8 mb-10 border border-slate-100 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {getCategoryIcon(category.name)}
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

        {/* Pasamos la lista formateada */}
        <ProductGrid products={productsFormatted} />

      </div>
    </div>
  );
}
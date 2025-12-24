import { prisma } from "@/src/lib/db";
import { ProductGrid } from "@/src/components/products/product-grid"; 
import { Zap, AlertCircle } from "lucide-react";

export default async function OffersPage() {
  // 1. Consultamos los productos
  const productsRaw = await prisma.product.findMany({
    where: {
      discount: {
        gt: 0, // Ahora sí funcionará esto ✅
      },
    },
    include: {
      brand: true,
      category: true,
      variants: true, // Traemos variantes para precio y foto
    },
    orderBy: {
      discount: 'desc',
    },
  });

  // 2. Limpieza de datos
  const discountedProducts = productsRaw.map((product) => {
    const mainVariant = product.variants[0];

    return {
        id: product.id,
        variantId: mainVariant?.id, 
        name: product.name,
        slug: product.slug,
        
        // Datos de la variante
        price: mainVariant ? Number(mainVariant.price) : 0, 
        stock: mainVariant ? mainVariant.stock : 0,
        condition: mainVariant ? mainVariant.condition : "NEW",
        image: mainVariant?.images?.[0] || "/placeholder.png",
        
        // Datos del producto
        category: product.category.name,
        brand: product.brand, 
        discount: product.discount, // Ahora sí existe ✅
        
        createdAt: product.createdAt.toISOString(),
    };
  });

  // Filtramos productos sin variantes válidas
  const validProducts = discountedProducts.filter(p => p.price > 0);

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-8 mb-8 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="p-4 bg-red-50 text-red-600 rounded-full animate-pulse">
            <Zap size={40} fill="currentColor" />
        </div>
        <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Ofertas Flash</h1>
            <p className="text-slate-500 mt-2 text-lg">
                Descuentos exclusivos por tiempo limitado.
            </p>
        </div>
      </div>

      {/* Grid */}
      {validProducts.length > 0 ? (
        <ProductGrid products={validProducts} />
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 flex flex-col items-center">
            <div className="bg-slate-50 p-4 rounded-full mb-4">
                <AlertCircle size={48} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-700">No hay ofertas activas</h3>
            <p className="text-slate-500 mt-2">Vuelve pronto para ver nuevos descuentos.</p>
        </div>
      )}
    </div>
  );
}
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/src/lib/prisma";
import { Plus, Pencil, Search, Package, AlertCircle } from "lucide-react"; // Quitamos Trash2 de aquí
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
// 👇 1. Importamos el botón de eliminar inteligente
import { ProductDeleteButton } from "@/src/components/admin/products/product-delete-button";

// Forzamos a que la página sea dinámica para ver cambios en tiempo real
export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  
  // 1. Consultamos los productos a la base de datos
  // Incluimos Brand, Category y Variants (vital para saber precio y stock)
  const products = await prisma.product.findMany({
    include: {
      brand: true,
      category: true,
      variants: true, 
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      
      {/* --- ENCABEZADO --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Inventario de Productos</h1>
          <p className="text-slate-500 text-sm">Gestiona tu catálogo, precios y existencias.</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/20 transition-all">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Producto
          </Button>
        </Link>
      </div>

      {/* --- BARRA DE HERRAMIENTAS --- */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            placeholder="Buscar por nombre, SKU o marca..." 
            className="pl-10 border-slate-200 focus-visible:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
            <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 px-3 py-1">
                Total: {products.length}
            </Badge>
        </div>
      </div>

      {/* --- TABLA DE DATOS --- */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Producto</th>
                <th className="px-6 py-4">Categoría / Marca</th>
                <th className="px-6 py-4">Precio Base</th>
                <th className="px-6 py-4">Stock Total</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => {
                
                // 🧮 Lógica para mostrar datos resumen desde las variantes
                const mainVariant = product.variants[0];
                const mainImage = mainVariant?.images[0] || "/placeholder.png";
                
                // Precio original
                const basePrice = Number(mainVariant?.price || 0);
                
                // Calcular stock total sumando todas las variantes
                const totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0);
                
                // Calcular precio con descuento si aplica
                const hasDiscount = product.discount > 0;
                const finalPrice = basePrice * (1 - product.discount / 100);

                return (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition duration-150 group">
                    
                    {/* COLUMNA: IMAGEN Y NOMBRE */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-200 bg-gray-50 shrink-0">
                          {mainVariant ? (
                              <Image 
                                src={mainImage} 
                                alt={product.name} 
                                fill 
                                className="object-contain p-1 mix-blend-multiply"
                                sizes="48px"
                              />
                          ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-300">
                                  <Package size={20} />
                              </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 line-clamp-1">{product.name}</p>
                          <p className="text-xs text-slate-400 font-mono">Variants: {product.variants.length}</p>
                        </div>
                      </div>
                    </td>

                    {/* COLUMNA: CATEGORÍA */}
                    <td className="px-6 py-4">
                        <div className="flex flex-col">
                            <span className="text-slate-700 font-medium">{product.category.name}</span>
                            <span className="text-xs text-slate-400">{product.brand.name}</span>
                        </div>
                    </td>

                    {/* COLUMNA: PRECIO */}
                    <td className="px-6 py-4">
                        {hasDiscount ? (
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-400 line-through">
                                    ${basePrice.toLocaleString("es-AR")}
                                </span>
                                <span className="font-bold text-green-600">
                                    ${finalPrice.toLocaleString("es-AR", { maximumFractionDigits: 0 })}
                                </span>
                            </div>
                        ) : (
                            <span className="font-bold text-slate-700">
                                ${basePrice.toLocaleString("es-AR")}
                            </span>
                        )}
                    </td>

                    {/* COLUMNA: STOCK */}
                    <td className="px-6 py-4">
                      {totalStock === 0 ? (
                        <Badge variant="destructive" className="flex w-fit items-center gap-1">
                          <AlertCircle size={12} /> Agotado
                        </Badge>
                      ) : totalStock < 5 ? (
                        <Badge className="bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200">
                           Bajo: {totalStock}
                        </Badge>
                      ) : (
                        <span className="text-slate-600 font-medium text-sm">
                          {totalStock} u.
                        </span>
                      )}
                    </td>

                    {/* COLUMNA: ESTADO (Oferta / Destacado) */}
                    <td className="px-6 py-4">
                        <div className="flex gap-1 flex-wrap">
                            {product.isFeatured && (
                                <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] hover:bg-blue-100">Destacado</Badge>
                            )}
                            {hasDiscount && (
                                <Badge className="bg-green-50 text-green-700 border-green-200 text-[10px] hover:bg-green-100">Oferta {product.discount}%</Badge>
                            )}
                            {!product.isFeatured && !hasDiscount && (
                                <span className="text-xs text-slate-400">-</span>
                            )}
                        </div>
                    </td>

                    {/* COLUMNA: ACCIONES */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        
                        {/* Botón Editar (Lápiz) */}
                        <Link href={`/admin/products/${product.slug}`}>
                          <Button variant="outline" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:border-blue-200">
                            <Pencil size={14} />
                          </Button>
                        </Link>
                        
                        {/* 👇 2. Botón Eliminar Integrado */}
                        <ProductDeleteButton 
                            productId={product.id} 
                            productName={product.name} 
                        />

                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* ESTADO VACÍO */}
        {products.length === 0 && (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="bg-slate-50 p-4 rounded-full mb-4">
                <Package className="text-slate-300" size={48} />
            </div>
            <h3 className="text-lg font-bold text-slate-700">Tu inventario está vacío</h3>
            <p className="text-slate-400 max-w-sm mt-2 mb-6">
                Comienza agregando productos para vender en tu tienda.
            </p>
            <Link href="/admin/products/new">
                <Button>Crear mi primer producto</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
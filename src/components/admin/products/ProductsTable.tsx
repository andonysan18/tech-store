'use client'

import Link from "next/link"
import Image from "next/image"
import { Pencil, Trash2, Star, ImageOff, Search, AlertTriangle } from "lucide-react" // 🔥 Agregué AlertTriangle para el aviso
import { toast } from "sonner" 
import { deleteProduct } from "@/src/actions/admin/delete-product"

interface Product {
  id: number
  name: string
  price: number
  stock: number
  isFeatured: boolean
  images: string[]
  category: { name: string }
  brand: { name: string }
  slug: string
}

interface Props {
  products: Product[]
}

export function ProductsTable({ products }: Props) {
  
  // 🔥 Lógica de Borrado Moderna
  const handleDelete = (productId: number, productName: string) => {
    
    // En lugar de alert(), lanzamos un toast especial
    toast("¿Estás seguro de eliminar este producto?", {
        description: `Esta acción no se puede deshacer: ${productName}`,
        // Icono de advertencia
        icon: <AlertTriangle className="w-4 h-4 text-orange-500" />, 
        duration: 5000, // Damos 5 segundos para decidir
        
        // Botón de Acción (Confirmar)
        action: {
            label: "Eliminar",
            onClick: () => {
                // Aquí ejecutamos la promesa de borrado que ya teníamos
                toast.promise(deleteProduct(productId), {
                    loading: 'Eliminando...',
                    success: (data) => {
                        if (data.error) throw new Error(data.error);
                        return `${productName} eliminado correctamente`;
                    },
                    error: (err) => `Error: ${err.message}`
                });
            }
        },
        
        // Botón de Cancelar
        cancel: {
            label: "Cancelar",
            onClick: () => console.log("Cancelado"),
        },
    });
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="px-6 py-4 font-medium text-gray-500">Producto</th>
            <th className="px-6 py-4 font-medium text-gray-500">Info</th>
            <th className="px-6 py-4 font-medium text-gray-500">Precio</th>
            <th className="px-6 py-4 font-medium text-gray-500">Stock</th>
            <th className="px-6 py-4 font-medium text-gray-500 text-center">Destacado</th>
            <th className="px-6 py-4 font-medium text-gray-500 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
              
              {/* 1. IMAGEN Y NOMBRE */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 shrink-0">
                    {product.images[0] ? (
                        <Image 
                            src={product.images[0]} 
                            alt={product.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <ImageOff className="w-5 h-5" />
                        </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 line-clamp-1">{product.name}</p>
                    <p className="text-xs text-gray-400 font-mono">ID: {product.id}</p>
                  </div>
                </div>
              </td>

              {/* 2. INFO */}
              <td className="px-6 py-4 text-gray-600">
                 <div className="flex flex-col gap-1">
                    <span className="text-xs bg-gray-100 border px-2 py-0.5 rounded w-fit">
                        {product.category?.name || 'S/C'}
                    </span>
                    <span className="text-xs text-gray-400">
                        {product.brand?.name || 'S/M'}
                    </span>
                 </div>
              </td>

              {/* 3. PRECIO */}
              <td className="px-6 py-4 font-medium text-gray-900">
                ${product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </td>

              {/* 4. STOCK */}
              <td className="px-6 py-4">
                {product.stock === 0 ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"/>
                        Agotado
                    </span>
                ) : product.stock < 5 ? (
                    <span className="text-orange-600 font-medium text-xs flex items-center gap-1">
                        ¡Bajo Stock! ({product.stock})
                    </span>
                ) : (
                    <span className="text-gray-600 font-medium">
                        {product.stock} u.
                    </span>
                )}
              </td>

              {/* 5. DESTACADO */}
              <td className="px-6 py-4">
                <div className="flex justify-center">
                    {product.isFeatured ? (
                        <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 shadow-sm" title="Producto Destacado">
                            <Star className="w-4 h-4 fill-yellow-600" />
                        </div>
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                            <Star className="w-4 h-4" />
                        </div>
                    )}
                </div>
              </td>

              {/* 6. ACCIONES */}
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link 
                    href={`/admin/products/${product.slug}`}
                    className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 hover:bg-white hover:text-black hover:border-black transition-all shadow-sm"
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  
                  <button 
                    className="p-2 bg-white border border-red-100 rounded-lg text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors shadow-sm"
                    title="Eliminar"
                    onClick={() => handleDelete(product.id, product.name)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Empty State */}
      {products.length === 0 && (
        <div className="text-center py-20">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No se encontraron productos</h3>
            <p className="text-gray-500">Intenta ajustar tu búsqueda o crea uno nuevo.</p>
        </div>
      )}
    </div>
  )
}
import { getProducts } from "@/src/actions/admin/get-products"
import { ProductsTable } from "@/src/components/admin/products/ProductsTable"
import { Plus, Search } from "lucide-react"
import Link from "next/link"

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>
}) {
  // Obtenemos los parámetros de la URL (Next.js 15 requiere await)
  const params = await searchParams
  const query = params.query || ""
  const page = Number(params.page) || 1

  // Llamada a la base de datos
  const { products, metadata } = await getProducts({ query, page })

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
          <p className="text-gray-500">Gestiona tu inventario ({metadata.total} total)</p>
        </div>
        <Link 
          href="/admin/products/create" 
          className="inline-flex items-center justify-center gap-2 bg-black text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo Producto
        </Link>
      </div>

      {/* Barra de Búsqueda (Visual por ahora, preparada para recibir valores) */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input 
          type="text" 
          placeholder="Buscar por nombre, marca o categoría..." 
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
          defaultValue={query}
        />
      </div>

      {/* Tabla de Productos */}
      <ProductsTable products={products as any} />

      {/* Paginación Funcional */}
      <div className="flex items-center justify-end gap-2">
        
        {/* Botón Anterior */}
        <Link
          href={`/admin/products?page=${page - 1}&query=${query}`}
          className={`px-3 py-1 text-sm border rounded transition-colors flex items-center justify-center ${
            !metadata.hasPrevPage 
              ? 'pointer-events-none opacity-50 bg-gray-50 text-gray-400' 
              : 'hover:bg-gray-50 bg-white text-gray-700'
          }`}
          aria-disabled={!metadata.hasPrevPage}
          tabIndex={!metadata.hasPrevPage ? -1 : undefined}
        >
          Anterior
        </Link>

        <span className="text-sm text-gray-500">
          Página {metadata.page} de {metadata.totalPages || 1}
        </span>

        {/* Botón Siguiente */}
        <Link
          href={`/admin/products?page=${page + 1}&query=${query}`}
          className={`px-3 py-1 text-sm border rounded transition-colors flex items-center justify-center ${
            !metadata.hasNextPage 
              ? 'pointer-events-none opacity-50 bg-gray-50 text-gray-400' 
              : 'hover:bg-gray-50 bg-white text-gray-700'
          }`}
          aria-disabled={!metadata.hasNextPage}
          tabIndex={!metadata.hasNextPage ? -1 : undefined}
        >
          Siguiente
        </Link>
      </div>
    </div>
  )
}
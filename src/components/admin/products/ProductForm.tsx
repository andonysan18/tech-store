'use client'

import { createProduct } from "@/src/actions/admin/create-product"
import { updateProduct } from "@/src/actions/admin/update-product"
import { Save, Loader2, ArrowLeft, Star } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation" // ✅ Importamos useRouter
import ImageUpload from "./ImageUpload"

// Interfaces
interface ProductData {
  id: number
  name: string
  slug: string
  description: string | null
  price: number
  stock: number
  categoryId: number
  brandId: number
  images: string[]
  condition: "NEW" | "USED" | "REFURBISHED"
  discount: number
  isFeatured: boolean
}

interface Props {
  categories: { id: number; name: string }[]
  brands: { id: number; name: string }[]
  product?: ProductData | null 
}

export function ProductForm({ categories, brands, product }: Props) {
  const router = useRouter() // ✅ Instanciamos el router
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<string[]>(product?.images || [])
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured || false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    
    if (images.length === 0) {
        toast.error("Debes subir al menos una imagen");
        setLoading(false);
        return;
    }

    const formData = new FormData(event.currentTarget)
    
    // Lógica para crear o actualizar
    let result;
    if (product) {
        formData.append("id", product.id.toString())
        result = await updateProduct(formData)
    } else {
        result = await createProduct(formData)
    }

    if (!result || result.error) {
      toast.error(result?.error || "Error desconocido")
      setLoading(false)
    } else {
      // ✅ ÉXITO: Mostramos Toast Y luego Redirigimos
      toast.success(product ? "Producto actualizado correctamente" : "Producto creado correctamente")
      
      // Esperamos un poquito para que se vea la animación del check verde (opcional pero recomendado)
      setTimeout(() => {
          router.push("/admin/products")
          router.refresh() // Forzamos actualización de los datos
      }, 500) 
      // Nota: Si quieres que sea instantáneo, quita el setTimeout y deja solo router.push
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {product ? `Editar: ${product.name}` : "Crear Nuevo Producto"}
          </h1>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50 transition-all"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {product ? "Guardar Cambios" : "Crear Producto"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-900">Detalles Generales</h3>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto</label>
                <input required name="name" type="text" defaultValue={product?.name} placeholder="Ej: iPhone 15 Pro" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black/5 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                <input required name="slug" type="text" defaultValue={product?.slug} placeholder="ej: iphone-15-pro" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black/5 outline-none font-mono text-sm bg-gray-50" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea name="description" rows={4} defaultValue={product?.description || ""} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black/5 outline-none resize-none" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-900">Inventario y Precios</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio ($)</label>
                <input required name="price" type="number" step="0.01" min="0" defaultValue={product?.price} placeholder="0.00" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black/5 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descuento (%)</label>
                <input name="discount" type="number" min="0" max="100" defaultValue={product?.discount || 0} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black/5 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input required name="stock" type="number" min="0" defaultValue={product?.stock} placeholder="0" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black/5 outline-none" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Condición</label>
                <select name="condition" defaultValue={product?.condition || "NEW"} className="w-full px-4 py-2 border rounded-lg outline-none bg-white">
                  <option value="NEW">Nuevo</option>
                  <option value="USED">Usado</option>
                  <option value="REFURBISHED">Reacondicionado</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha */}
        <div className="space-y-6">
            
          {/* Switch de Destacado */}
          <div className={`p-6 rounded-xl border shadow-sm flex items-center justify-between transition-all duration-300 ${isFeatured ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-100'}`}>
             <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors duration-300 ${isFeatured ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'}`}>
                   <Star className={`w-5 h-5 transition-all ${isFeatured ? 'fill-yellow-600' : ''}`} />
                </div>
                <div>
                   <p className={`font-medium transition-colors ${isFeatured ? 'text-yellow-800' : 'text-gray-900'}`}>
                       {isFeatured ? '¡Producto Destacado!' : 'Producto Destacado'}
                   </p>
                   <p className="text-xs text-gray-500">
                       Aparecerá en el inicio
                   </p>
                </div>
             </div>
             <label className="relative inline-flex items-center cursor-pointer">
                <input 
                    type="checkbox" 
                    name="isFeatured" 
                    checked={isFeatured}
                    onChange={(e) => {
                        const checked = e.target.checked;
                        setIsFeatured(checked);
                        if(checked) {
                            toast.message("Marcado como destacado", {
                                description: "Recuerda guardar los cambios para aplicar."
                            })
                        }
                    }}
                    className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
             </label>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-900">Organización</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
              <select required name="brandId" defaultValue={product?.brandId} className="w-full px-4 py-2 border rounded-lg outline-none bg-white">
                <option value="">Seleccionar...</option>
                {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select required name="categoryId" defaultValue={product?.categoryId} className="w-full px-4 py-2 border rounded-lg outline-none bg-white">
                <option value="">Seleccionar...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-900">Galería de Imágenes</h3>
            
            <ImageUpload 
                value={images} 
                onChange={(url) => setImages((prev) => [...prev, url])}
                onRemove={(url) => setImages((prev) => prev.filter((i) => i !== url))}
            />

            {images.map((url, index) => (
                <input key={index} type="hidden" name="images" value={url} />
            ))}
          </div>
        </div>
      </div>
    </form>
  )
}
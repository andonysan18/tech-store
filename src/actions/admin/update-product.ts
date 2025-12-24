'use server'

import { prisma } from "@/src/lib/db"
import { z } from "zod"
import { revalidatePath } from "next/cache"
// Nota: Ya no importamos redirect

const productSchema = z.object({
  id: z.coerce.number(),
  name: z.string().min(3, "El nombre debe tener al menos 3 letras"),
  slug: z.string().min(3, "El slug es obligatorio"),
  description: z.string().optional(),
  price: z.coerce.number().min(0.01, "El precio debe ser mayor a 0"),
  stock: z.coerce.number().int().min(0, "El stock no puede ser negativo"),
  categoryId: z.coerce.number().min(1, "Selecciona una categoría"),
  brandId: z.coerce.number().min(1, "Selecciona una marca"),
  images: z.array(z.string()).optional(),
  condition: z.enum(["NEW", "USED", "REFURBISHED"]),
  discount: z.coerce.number().int().min(0).max(100),
  isFeatured: z.boolean().optional(),
})

export async function updateProduct(formData: FormData) {
  const data = {
    id: formData.get("id"),
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    categoryId: formData.get("categoryId"),
    brandId: formData.get("brandId"),
    images: formData.getAll("images"),
    condition: formData.get("condition"),
    discount: formData.get("discount"),
    isFeatured: formData.get("isFeatured") === "on",
  }

  const result = productSchema.safeParse(data)

  if (!result.success) {
    return { success: false, error: result.error.issues[0].message }
  }

  try {
    await prisma.product.update({
      where: { id: result.data.id },
      data: {
        name: result.data.name,
        slug: result.data.slug,
        description: result.data.description || "",
        price: result.data.price,
        stock: result.data.stock,
        categoryId: result.data.categoryId,
        brandId: result.data.brandId,
        images: result.data.images || [],
        condition: result.data.condition,
        discount: result.data.discount,
        isFeatured: result.data.isFeatured || false,
      },
    })

    revalidatePath("/admin/products")
    revalidatePath(`/admin/products/${result.data.slug}`)
    
    // ✅ CAMBIO: Retornamos éxito en lugar de redirigir aquí
    return { success: true }

  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: "El Slug ya está en uso." }
    }
    console.error(error)
    return { success: false, error: "Error al actualizar." }
  }
}
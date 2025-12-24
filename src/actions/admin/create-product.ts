'use server'

import { prisma } from "@/src/lib/db"
import { z } from "zod"
import { revalidatePath } from "next/cache"
// Nota: Ya no importamos redirect porque lo haremos en el cliente

const productSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 letras"),
  slug: z.string().min(3, "El slug es obligatorio"),
  description: z.string().optional(),
  price: z.coerce.number().min(0.01, "El precio debe ser mayor a 0"),
  stock: z.coerce.number().int().min(0, "El stock no puede ser negativo"),
  categoryId: z.coerce.number().min(1, "Selecciona una categoría"),
  brandId: z.coerce.number().min(1, "Selecciona una marca"),
  images: z.array(z.string()).optional(),
  condition: z.enum(["NEW", "USED", "REFURBISHED"]),
  discount: z.coerce.number().int().min(0).max(100).default(0),
  isFeatured: z.boolean().optional(),
})

export async function createProduct(formData: FormData) {
  const data = {
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
    await prisma.product.create({
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

    // Revalidamos para que la lista se actualice
    revalidatePath("/admin/products")
    
    // ✅ CAMBIO: Retornamos éxito en lugar de redirigir aquí
    return { success: true }

  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: "Ya existe un producto con ese Slug." }
    }
    console.error(error)
    return { success: false, error: "Error al guardar en base de datos." }
  }
}
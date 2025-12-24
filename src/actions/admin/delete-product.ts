'use server'

import {prisma} from "@/src/lib/db"
import { revalidatePath } from "next/cache"

export async function deleteProduct(id: number) {
  try {
    await prisma.product.delete({
      where: { id }
    })
    
    // Esto hace que la tabla se actualice sola después de borrar
    revalidatePath("/admin/products")
    
    return { success: true }
  } catch (error) {
    return { error: "No se pudo eliminar el producto, puede que tenga ventas asociadas." }
  }
}
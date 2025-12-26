"use server";

import { prisma } from "@/src/lib/prisma"; // Ajusta tu import de prisma
import { revalidatePath } from "next/cache";

export async function deleteProductAction(productId: number) {
  try {
    // 1. VERIFICACIÓN DE SEGURIDAD: ¿Tiene ventas?
    // Buscamos si existe al menos un item de orden asociado a alguna variante de este producto
    const hasSales = await prisma.orderItem.findFirst({
      where: {
        variant: {
          productId: productId
        }
      }
    });

    if (hasSales) {
      return { 
        success: false, 
        message: "⛔ No se puede eliminar: Este producto tiene ventas registradas. Te sugerimos desactivarlo o cambiarle el stock a 0 para mantener el historial." 
      };
    }

    // 2. LIMPIEZA EN CASCADA MANUAL (Por seguridad)
    // Como Prisma a veces se queja si no tienes "Cascade" en la DB, borramos en orden:
    
    await prisma.$transaction(async (tx) => {
      // A. Borrar items de carritos activos (esto no afecta historial importante)
      await tx.cartItem.deleteMany({
        where: { variant: { productId: productId } }
      });

      // B. Borrar reseñas
      await tx.review.deleteMany({
        where: { productId: productId }
      });

      // C. Borrar variantes
      await tx.productVariant.deleteMany({
        where: { productId: productId }
      });

      // D. Finalmente, borrar el producto padre
      await tx.product.delete({
        where: { id: productId }
      });
    });

    // 3. Actualizar la lista
    revalidatePath("/admin/products");
    return { success: true, message: "Producto eliminado correctamente." };

  } catch (error) {
    console.error("Error eliminando producto:", error);
    return { success: false, message: "Error técnico al intentar eliminar." };
  }
}
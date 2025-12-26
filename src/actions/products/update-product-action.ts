"use server";

import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProductAction(data: any) {
  const { id, variantsToDelete, ...productData } = data;

  try {
    await prisma.$transaction(async (tx) => {
      
      // A. Eliminar variantes marcadas para borrar
      if (variantsToDelete && variantsToDelete.length > 0) {
        await tx.productVariant.deleteMany({
          where: { id: { in: variantsToDelete } }
        });
      }

      // B. Actualizar el producto principal
      await tx.product.update({
        where: { id: Number(id) },
        data: {
          name: productData.name,
          slug: productData.slug,
          description: productData.description,
          brandId: Number(productData.brandId),
          categoryId: Number(productData.categoryId),
          isFeatured: productData.isFeatured,
          discount: productData.discount,
          // 🔥 FIX: Convertimos el objeto a un JSON estándar para que Prisma no se queje
          specs: productData.specs 
            ? JSON.parse(JSON.stringify(Object.fromEntries(productData.specs.map((s: any) => [s.key, s.value])))) 
            : {}, 
        }
      });

      // C. Upsert de Variantes (Crear nuevas o Actualizar existentes)
      if (productData.variants && Array.isArray(productData.variants)) {
        for (const variant of productData.variants) {
          
          // Preparamos los datos
          const variantData = {
            sku: variant.sku,
            price: variant.price,
            stock: variant.stock,
            color: variant.color,
            storage: variant.storage,
            // 🔥 FIX: Tu lógica actual maneja 1 foto, así que la metemos en un array para la DB
            images: variant.image ? [variant.image] : [], 
          };

          if (variant.id) {
            // Actualizar existente
            await tx.productVariant.update({
              where: { id: variant.id },
              data: variantData,
            });
          } else {
            // Crear nueva
            await tx.productVariant.create({
              data: {
                ...variantData,
                productId: Number(id),
              }
            });
          }
        }
      }
    });

    // Revalidamos la caché
    revalidatePath("/admin/products");
    
    // 🔥 IMPORTANTE: Retornamos success para que el componente sepa redirigir
    return { success: true, message: "Producto actualizado correctamente" };

  } catch (error) {
    console.error("Error en updateProductAction:", error);
    return { success: false, message: "Error al actualizar el producto" };
  }
}
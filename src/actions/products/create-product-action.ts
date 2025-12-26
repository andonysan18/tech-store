"use server";

import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface ProductData {
  name: string;
  slug: string;
  description: string;
  brandId: string;
  categoryId: string;
  isFeatured: boolean;
  discount: number;
  specs: { key: string; value: string }[];
  variants: {
    sku: string;
    price: number;
    stock: number;
    color: string;
    storage: string;
    image: string;
  }[];
}

export async function createProductAction(data: ProductData) {
  try {
    // 1. Validaciones básicas
    if (!data.name || !data.brandId || !data.categoryId || data.variants.length === 0) {
      return { success: false, message: "Faltan datos obligatorios o variantes." };
    }

    // Convertir specs a objeto
    const specsJson = data.specs.reduce((acc, current) => {
      if (current.key && current.value) {
        acc[current.key] = current.value;
      }
      return acc;
    }, {} as Record<string, string>);

    // 2. Intentar crear en la DB
    await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        brandId: parseInt(data.brandId),
        categoryId: parseInt(data.categoryId),
        isFeatured: data.isFeatured,
        discount: data.discount,
        specs: specsJson,
        
        variants: {
          create: data.variants.map((variant) => ({
            sku: variant.sku,
            price: variant.price,
            stock: variant.stock,
            color: variant.color,
            storage: variant.storage,
            condition: "NEW",
            images: variant.image ? [variant.image] : ["/placeholder.png"]
          }))
        }
      }
    });

    revalidatePath("/admin/products");
    revalidatePath("/admin");

  } catch (error: any) {
    console.error("Error al crear producto:", error);

    // 🔥 MANEJO DE ERRORES DE PRISMA (P2002 = Violación de campo único)
    if (error.code === 'P2002') {
        const target = error.meta?.target;
        
        if (target && target.includes('slug')) {
            return { success: false, message: `El nombre del producto ya existe (Slug: ${data.slug} ocupado). Intenta cambiar el nombre.` };
        }
        
        // El error de SKU a veces viene anidado diferente, pero por si acaso:
        return { success: false, message: "Ya existe un producto con ese Nombre o SKU." };
    }

    return { success: false, message: "Error desconocido al guardar en base de datos." };
  }

  // 3. Redirigir si todo salió bien
  redirect("/admin/products");
}
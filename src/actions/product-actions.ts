// src/actions/product-actions.ts
"use server";

import { z } from "zod";
import { prisma } from "@/src/lib/db"; // Asegúrate que la ruta sea correcta según tu tsconfig
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const productSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 letras"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "El precio no puede ser negativo"),
  stock: z.coerce.number().int().min(0),
  categoryId: z.coerce.number().int(),
  brandId: z.coerce.number().int(),
});

// Definimos el tipo de estado que vamos a devolver
export type State = {
  errors?: {
    name?: string[];
    price?: string[];
    stock?: string[];
    categoryId?: string[];
    brandId?: string[];
  };
  message?: string | null;
};

// 🔥 CAMBIO: Agregamos 'prevState' como primer argumento
export async function createProduct(prevState: State, formData: FormData) {
  
  const validatedFields = productSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    categoryId: formData.get("categoryId"),
    brandId: formData.get("brandId"),
  });

  // Si falla la validación, devolvemos los errores al frontend
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Faltan campos requeridos. Revisa el formulario.",
    };
  }

  try {
    await prisma.product.create({
      data: {
        name: validatedFields.data.name,
        description: validatedFields.data.description,
        price: validatedFields.data.price,
        stock: validatedFields.data.stock,
        categoryId: validatedFields.data.categoryId,
        brandId: validatedFields.data.brandId,
        images: [],
        specs: {},
      },
    });

    revalidatePath("/admin/products");

  } catch (error) {
    return {
      message: "Error de base de datos: No se pudo crear el producto.",
    };
  }
  
  // Si todo sale bien, redirigimos
  redirect("/admin/products");
}
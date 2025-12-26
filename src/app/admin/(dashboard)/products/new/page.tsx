import { prisma } from "@/src/lib/prisma";
import { ProductForm } from "@/src/components/admin/products/product-form"; // 👈 Importamos el form

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  
  // 1. Obtenemos los datos necesarios para llenar los selectores
  // Usamos Promise.all para que sea rápido (paralelo)
  const [brands, categories] = await Promise.all([
    prisma.brand.findMany({ orderBy: { name: 'asc' } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } })
  ]);

  return (
    <div>
      {/* Renderizamos el formulario cliente pasándole los datos */}
      <ProductForm brands={brands} categories={categories} />
    </div>
  );
}
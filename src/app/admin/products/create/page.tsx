import { ProductForm } from "@/src/components/admin/products/ProductForm"
import { prisma } from "@/src/lib/db"

export default async function CreateProductPage() {
  // Buscamos datos necesarios para el formulario
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.brand.findMany({ orderBy: { name: 'asc' } }),
  ])

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <ProductForm categories={categories} brands={brands} />
    </div>
  )
}
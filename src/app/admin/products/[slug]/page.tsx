import { ProductForm } from "@/src/components/admin/products/ProductForm"
import { prisma } from "@/src/lib/db"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{
    slug: string
  }>
}

export default async function EditProductPage({ params }: Props) {
  const { slug } = await params

  const [product, categories, brands] = await Promise.all([
    prisma.product.findUnique({ where: { slug } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.brand.findMany({ orderBy: { name: 'asc' } }),
  ])

  if (!product) {
    notFound()
  }

  const productFormatted = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price.toNumber(),
    stock: product.stock,
    categoryId: product.categoryId,
    brandId: product.brandId,
    images: product.images,
    // 🔥 NUEVOS CAMPOS MAPEADOS
    condition: product.condition, // Ya viene como "NEW", "USED", etc
    discount: product.discount,
    isFeatured: product.isFeatured,
  }

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <ProductForm 
        categories={categories} 
        brands={brands} 
        product={productFormatted} 
      />
    </div>
  )
}
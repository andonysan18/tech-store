import { notFound } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import { ProductForm } from "@/src/components/admin/products/product-form";

interface EditProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { slug } = await params;

  // 1. Buscamos el producto en la DB
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { variants: true } 
  });

  // 2. Buscamos marcas y categorías
  const [brands, categories] = await Promise.all([
    prisma.brand.findMany({ orderBy: { name: 'asc' } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } })
  ]);

  if (!product) {
    return notFound();
  }

  // 🔥🔥🔥 EL FIX ESTÁ AQUÍ 🔥🔥🔥
  // Creamos una copia "limpia" del producto donde convertimos
  // los precios (Decimal) a números normales de JS.
  const productJson = {
    ...product,
    variants: product.variants.map((variant) => ({
      ...variant,
      price: Number(variant.price) // 👈 Esto soluciona el error
    }))
  };

  return (
    <div>
      <ProductForm 
        brands={brands} 
        categories={categories} 
        product={productJson} // 👈 Pasamos la versión limpia
      />
    </div>
  );
}
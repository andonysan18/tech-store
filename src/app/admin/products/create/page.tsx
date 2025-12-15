import { prisma } from "@/src/lib/db";
import { CreateProductForm } from "@/src/components/products/product-form"; // Importamos el componente nuevo
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

export default async function CreateProductPage() {
  // Buscamos datos en el servidor
  const categories = await prisma.category.findMany();
  const brands = await prisma.brand.findMany();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Nuevo Producto</CardTitle>
          <CardDescription>Agrega un nuevo ítem a tu inventario.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Renderizamos el componente cliente pasándole los datos */}
          <CreateProductForm categories={categories} brands={brands} />
        </CardContent>
      </Card>
    </div>
  );
}
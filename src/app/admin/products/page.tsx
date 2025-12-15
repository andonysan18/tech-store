import Link from "next/link";
import { prisma } from "@/src/lib/db";
import { Button } from "@/src/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Badge } from "@/src/components/ui/badge";
import { PlusCircle, Edit, Trash2 } from "lucide-react"; // Iconos bonitos

export default async function AdminProductsPage() {
  // 1. Buscamos TODOS los productos incluyendo su Marca y Categoría
  const products = await prisma.product.findMany({
    include: {
      brand: true,
      category: true,
    },
    orderBy: {
      createdAt: "desc", // Los más nuevos primero
    },
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Encabezado con botón de Crear */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Inventario</h1>
        <Link href="/admin/products/create">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Nuevo Producto
          </Button>
        </Link>
      </div>

      {/* La Tabla de Datos */}
      <div className="border rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Categoría / Marca</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                {/* Nombre */}
                <TableCell className="font-medium">
                  {product.name}
                  <div className="text-sm text-gray-500 truncate max-w-[200px]">
                    {product.description}
                  </div>
                </TableCell>

                {/* Info Extra */}
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{product.category.name}</span>
                    <span className="text-xs text-gray-500">{product.brand.name}</span>
                  </div>
                </TableCell>

                {/* Precio (Formateado bonito) */}
                <TableCell>
                  ${Number(product.price).toFixed(2)}
                </TableCell>

                {/* Stock con lógica de colores */}
                <TableCell>
                  <Badge variant={product.stock > 0 ? "secondary" : "destructive"}>
                    {product.stock} u.
                  </Badge>
                </TableCell>

                {/* Botones de Acción (Editar/Borrar) */}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {/* Estado vacío por si no hay nada */}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-gray-500">
                  No hay productos registrados. ¡Crea el primero!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
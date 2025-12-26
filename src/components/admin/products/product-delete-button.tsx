"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { deleteProductAction } from "@/src/actions/products/delete-product-action";
import { useRouter } from "next/navigation";

interface Props {
  productId: number;
  productName: string;
}

export function ProductDeleteButton({ productId, productName }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    // 1. Confirmación del usuario
    const confirmed = window.confirm(
      `¿Estás seguro de que quieres eliminar "${productName}"?\n\nEsta acción no se puede deshacer y borrará sus variantes y reseñas.`
    );

    if (!confirmed) return;

    setIsDeleting(true);

    // 2. Llamada al Server Action
    const result = await deleteProductAction(productId);

    if (result.success) {
      // Éxito
      alert("✅ Producto eliminado.");
      router.refresh(); // Refresca la tabla
    } else {
      // Error (ej: tiene ventas)
      alert(result.message);
    }

    setIsDeleting(false);
  };

  return (
    <Button 
      variant="outline" 
      size="icon" 
      className="h-8 w-8 text-slate-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
      onClick={handleDelete}
      disabled={isDeleting}
      title="Eliminar producto"
    >
      {isDeleting ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <Trash2 size={14} />
      )}
    </Button>
  );
}
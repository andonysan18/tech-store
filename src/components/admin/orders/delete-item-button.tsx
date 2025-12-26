"use client";

import { Trash2 } from "lucide-react";
// import { removeOrderItem } from "@/src/actions/orders";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { removeOrderItem } from "@/src/actions/order/orders";

interface Props {
  itemId: number;
  orderId: number;
}

export function DeleteItemButton({ itemId, orderId }: Props) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const confirm = window.confirm("¿Quitar producto? (Si es el último, se eliminará el pedido completo)");
    if (!confirm) return;

    setIsPending(true);
    
    const res = await removeOrderItem(orderId, itemId);
    
    if (res.success) {
      if (res.action === "order_deleted") {
        // 🚀 REDIRECCIÓN: Vamos a la lista porque el pedido ya no existe
        router.push("/admin/orders");
        router.refresh(); 
      }
      // Si solo se borró el item, no hacemos nada, la UI se actualiza sola
    } else {
      alert("Error al eliminar");
    }

    setIsPending(false);
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
      title="Eliminar producto"
    >
      {isPending ? (
        <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      ) : (
        <Trash2 size={18} />
      )}
    </button>
  );
}
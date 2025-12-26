"use client";

import { updateOrderStatus } from "@/src/actions/order/orders";
import { OrderStatus } from "@prisma/client";
import { useState } from "react";
// import { updateOrderStatus } from "@/src/actions/orders"; 

const statuses = Object.keys(OrderStatus) as OrderStatus[];

interface Props {
  currentStatus: OrderStatus;
  orderId: number;
}

export function OrderStatusSelector({ currentStatus, orderId }: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as OrderStatus;
    
    // ⚠️ ALERTA DE SEGURIDAD
    // Si van a cancelar, pedimos confirmación extra
    if (newStatus === "CANCELADO") {
      const confirm = window.confirm("¿Seguro que quieres cancelar este pedido? \n\nEsto devolverá automáticamente los productos al stock.");
      if (!confirm) {
        // Si dice que no, volvemos a poner el select como estaba antes
        e.target.value = status; 
        return;
      }
    }

    setLoading(true);

    const result = await updateOrderStatus(orderId, newStatus);
    
    if (result.success) {
      setStatus(newStatus);
    } else {
      alert("Error: " + result.message);
      // Revertir visualmente si falló
      e.target.value = status;
    }
    
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-700">Actualizar Estado</label>
      <div className="relative">
        <select 
          value={status} 
          onChange={handleChange}
          disabled={loading}
          className={`w-full p-2.5 border rounded-lg outline-none transition appearance-none cursor-pointer font-medium
            ${status === 'CANCELADO' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-slate-50 border-slate-300 text-slate-800 focus:ring-2 focus:ring-blue-500'}
          `}
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
        {loading && (
          <div className="absolute right-3 top-3">
             <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      
      {/* Mensaje dinámico según el estado */}
      <p className="text-xs text-slate-500 mt-1">
        {status === 'CANCELADO' 
          ? "⚠️ Este pedido está cancelado y el stock ha sido devuelto."
          : "El cliente verá el cambio reflejado en su perfil."
        }
      </p>
    </div>
  );
}
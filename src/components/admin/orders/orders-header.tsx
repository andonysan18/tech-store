"use client";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/src/lib/utils";

export function OrdersHeader({ totalOrders }: { totalOrders: number }) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh(); // 👈 Esto recarga los datos del servidor sin recargar la página completa
    
    // Simulo un pequeño delay visual para que se note que giró
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Pedidos</h1>
        <p className="text-slate-500">Gestión de ventas y despachos</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="bg-white px-4 py-2 rounded-lg border shadow-sm text-sm font-medium">
          Total: {totalOrders}
        </div>
        <button 
          onClick={handleRefresh}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
          title="Recargar lista"
        >
          <RefreshCw size={20} className={cn(isRefreshing && "animate-spin")} />
        </button>
      </div>
    </div>
  );
}
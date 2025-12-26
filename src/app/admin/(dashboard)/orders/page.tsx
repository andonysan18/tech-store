import { OrdersHeader } from "@/src/components/admin/orders/orders-header";
import { prisma } from "@/src/lib/prisma";
import { formatPrice, formatDate } from "@/src/lib/utils";
import { Eye, Package } from "lucide-react";
import Link from "next/link";
// import { OrdersHeader } from "./components/orders-header"; // 👇 Importamos el componente cliente

// Helper de colores (Mantenemos esto aquí)
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    PENDIENTE_PAGO: "bg-yellow-100 text-yellow-700 border-yellow-200",
    PAGADO: "bg-green-100 text-green-700 border-green-200",
    ENVIADO: "bg-blue-100 text-blue-700 border-blue-200",
    ENTREGADO: "bg-purple-100 text-purple-700 border-purple-200",
    CANCELADO: "bg-red-100 text-red-700 border-red-200",
  };
  return colors[status] || "bg-gray-100 text-gray-700";
};

export default async function AdminOrdersPage() {
  // Obtenemos los datos (Server Side)
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      _count: { select: { items: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 space-y-6">
      
      {/* 👇 Usamos el componente cliente para tener el botón de refrescar */}
      <OrdersHeader totalOrders={orders.length} />

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Cliente</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4">Fecha</th>
              <th className="px-6 py-4">Items</th>
              <th className="px-6 py-4 text-right">Total</th>
              <th className="px-6 py-4 text-center">Ver</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => {
              const addressData = order.shippingAddress as any;
              
              return (
                <tr key={order.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-mono text-slate-500">
                    #{order.id.toString().padStart(4, '0')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">
                      {order.user ? order.user.name : "Invitado"}
                    </div>
                    <div className="text-xs text-slate-400">
                      {addressData?.city || "Sin ubicación"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                      {order.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Package size={16} /> {order._count.items}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-800">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link 
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 hover:bg-blue-600 text-slate-500 hover:text-white transition"
                    >
                      <Eye size={18} />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
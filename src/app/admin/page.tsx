import { prisma } from "@/src/lib/db";
import { DollarSign, ShoppingCart, Wrench, Users } from "lucide-react";

export default async function AdminDashboard() {
  // Consultas en paralelo para llenar las tarjetas
  const [ordersCount, repairsCount, productsCount, totalRevenue] = await Promise.all([
    prisma.order.count(),
    prisma.repairTicket.count({ where: { status: { not: "ENTREGADO" } } }), // Solo activas
    prisma.productVariant.aggregate({ _sum: { stock: true } }),
    prisma.order.aggregate({ _sum: { total: true } }) // Total vendido histórico
  ]);

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-800 mb-8">Panel de Control</h2>
      
      {/* TARJETAS DE RESUMEN */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <ShoppingCart size={24} />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">+12%</span>
          </div>
          <p className="text-slate-500 text-sm">Pedidos Totales</p>
          <h3 className="text-2xl font-bold text-slate-900">{ordersCount}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <DollarSign size={24} />
            </div>
          </div>
          <p className="text-slate-500 text-sm">Ingresos Totales</p>
          <h3 className="text-2xl font-bold text-slate-900">
            ${Number(totalRevenue._sum.total || 0).toLocaleString("es-AR")}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <Wrench size={24} />
            </div>
            <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">Activos</span>
          </div>
          <p className="text-slate-500 text-sm">Reparaciones en Curso</p>
          <h3 className="text-2xl font-bold text-slate-900">{repairsCount}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
              <Users size={24} />
            </div>
          </div>
          <p className="text-slate-500 text-sm">Stock Total (Unidades)</p>
          <h3 className="text-2xl font-bold text-slate-900">{productsCount._sum.stock || 0}</h3>
        </div>

      </div>

      {/* AQUÍ PONDREMOS UNA TABLA DE ÚLTIMOS PEDIDOS DESPUÉS */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center h-64">
        <p className="text-slate-400">Gráficos de ventas próximamente...</p>
      </div>

    </div>
  );
}
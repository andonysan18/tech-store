import { getDashboardStats, getGraphRevenue, getRecentOrders } from "@/src/actions/admin/get-dashboard-stats";
import { SalesChart } from "@/src/components/admin/dashboard/SalesChart";
import { DollarSign, ShoppingBag, Wrench, AlertTriangle, User } from "lucide-react";

// --- Subcomponente Rápido para KPIs (Mismo de antes) ---
function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold mt-1 text-gray-900">{value}</h3>
      </div>
      <div className={`p-3 rounded-full ${color} bg-opacity-10`}> {/* Agregué opacidad para mejor look */}
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
    </div>
  );
}

export default async function AdminDashboardPage() {
  // 1. Obtenemos TODOS los datos en paralelo
  const [stats, graphData, recentOrders] = await Promise.all([
    getDashboardStats(),
    getGraphRevenue(),
    getRecentOrders()
  ]);

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-2">Visión general de tu tienda tech.</p>
      </div>

      {/* 1. KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Ingresos Totales" value={`$${stats.revenue.toLocaleString()}`} icon={DollarSign} color="bg-green-500" />
        <StatCard title="Ventas Totales" value={stats.salesCount} icon={ShoppingBag} color="bg-blue-500" />
        <StatCard title="Reparaciones Activas" value={stats.activeRepairs} icon={Wrench} color="bg-orange-500" />
        <StatCard title="Stock Bajo" value={stats.lowStockProducts} icon={AlertTriangle} color="bg-red-500" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* 2. Gráfico de Ventas (Ocupa 4 columnas) */}
        <div className="col-span-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingresos por Mes</h3>
          <div className="h-[350px]">
            <SalesChart data={graphData} />
          </div>
        </div>

        {/* 3. Últimas Ventas (Ocupa 3 columnas) */}
        <div className="col-span-3 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ventas Recientes</h3>
          <div className="space-y-6">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{order.user.name || "Cliente"}</p>
                    <p className="text-xs text-gray-500">{order.user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">+${Number(order.total).toLocaleString()}</p>
                  <p className="text-xs text-gray-500 capitalize">{order.status.toLowerCase().replace('_', ' ')}</p>
                </div>
              </div>
            ))}
            {recentOrders.length === 0 && (
              <p className="text-gray-500 text-sm">No hay ventas recientes.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
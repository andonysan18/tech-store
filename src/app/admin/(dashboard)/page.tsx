import { prisma } from "@/src/lib/prisma"; // Asegúrate de importar desde TU ruta correcta
import { DollarSign, ShoppingCart, Wrench, Users } from "lucide-react";
import { DashboardCard } from "@/src/components/admin/dashboard/dashboard-card";

// Esto fuerza a que la página se regenere en cada visita (datos frescos)
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  
  // 1. Consultas a la DB
  const [ordersCount, repairsCount, productsCount, totalRevenue] = await Promise.all([
    prisma.order.count(),
    prisma.repairTicket.count({ where: { status: { not: "ENTREGADO" } } }),
    prisma.productVariant.aggregate({ _sum: { stock: true } }),
    prisma.order.aggregate({ _sum: { total: true } })
  ]);

  // Formateo de moneda
  const revenueFormatted = Number(totalRevenue._sum.total || 0).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  });

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-800 mb-8 tracking-tight">Panel de Control</h2>
      
      {/* GRID DE TARJETAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        <DashboardCard 
          title="Pedidos Totales" 
          value={ordersCount} 
          icon={ShoppingCart} 
          color="blue"
          subValue="+12%" // Esto podrías calcularlo real más adelante
        />

        <DashboardCard 
          title="Ingresos Totales" 
          value={revenueFormatted} 
          icon={DollarSign} 
          color="green"
        />

        <DashboardCard 
          title="Reparaciones Activas" 
          value={repairsCount} 
          icon={Wrench} 
          color="purple"
          subValue="En taller"
        />

        <DashboardCard 
          title="Stock Total" 
          value={productsCount._sum.stock || 0} 
          icon={Users} 
          color="orange"
          subValue="Unidades"
        />

      </div>

      {/* SECCIÓN VACÍA (Placeholder) */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center h-64 text-center">
        <div className="bg-slate-50 p-4 rounded-full mb-3">
            <span className="text-4xl">📊</span>
        </div>
        <h3 className="text-lg font-bold text-slate-700">Análisis de Ventas</h3>
        <p className="text-slate-400 text-sm">Los gráficos estadísticos estarán disponibles próximamente.</p>
      </div>

    </div>
  );
}
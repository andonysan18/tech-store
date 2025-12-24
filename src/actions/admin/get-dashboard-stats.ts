'use server'

import { prisma } from "@/src/lib/db"
import { OrderStatus, RepairStatus } from "@prisma/client"

// 1. KPIs Generales (Ya lo tenías)
export async function getDashboardStats() {
  const [revenueData, salesCount, activeRepairs, lowStockProducts] = await Promise.all([
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { in: [OrderStatus.PAGADO, OrderStatus.ENVIADO, OrderStatus.ENTREGADO] } },
    }),
    prisma.order.count({ where: { status: { not: OrderStatus.CANCELADO } } }),
    prisma.repairTicket.count({
      where: { status: { in: [RepairStatus.PENDIENTE, RepairStatus.EN_DIAGNOSTICO, RepairStatus.EN_REPARACION] } },
    }),
    prisma.product.count({ where: { stock: { lt: 5 } } }),
  ])

  return {
    revenue: revenueData._sum.total ? Number(revenueData._sum.total) : 0,
    salesCount,
    activeRepairs,
    lowStockProducts,
  }
}

// 2. Datos para el Gráfico (NUEVO)
export async function getGraphRevenue() {
  const paidOrders = await prisma.order.findMany({
    where: { status: { in: [OrderStatus.PAGADO, OrderStatus.ENVIADO, OrderStatus.ENTREGADO] } },
    orderBy: { createdAt: 'asc' },
  });

  const monthlyRevenue: { [key: string]: number } = {};

  for (const order of paidOrders) {
    const month = order.createdAt.toLocaleString('es-ES', { month: 'short' }); // Ej: "ene", "feb"
    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + Number(order.total);
  }

  // Convertimos el objeto a array para Recharts: [{ name: 'ene', total: 100 }, ...]
  return Object.keys(monthlyRevenue).map((month) => ({
    name: month.charAt(0).toUpperCase() + month.slice(1), // Capitalizar: "Ene"
    total: monthlyRevenue[month],
  }));
}

// 3. Últimas Órdenes (NUEVO)
export async function getRecentOrders() {
  return await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } }, // Traemos datos del cliente
    },
  })
}
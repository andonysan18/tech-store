import { prisma } from "@/src/lib/prisma";
import { formatDate } from "@/src/lib/utils"; // Usamos tu helper de fechas
import { Eye, Wrench, Search } from "lucide-react";
import Link from "next/link";
import { RepairStatus } from "@prisma/client";

// Helper de colores para estados de reparación
const getStatusColor = (status: RepairStatus) => {
  const colors = {
    PENDIENTE: "bg-red-100 text-red-700 border-red-200",
    EN_DIAGNOSTICO: "bg-orange-100 text-orange-700 border-orange-200",
    ESPERANDO_REPUESTO: "bg-yellow-100 text-yellow-700 border-yellow-200",
    EN_REPARACION: "bg-blue-100 text-blue-700 border-blue-200",
    LISTO: "bg-green-100 text-green-700 border-green-200",
    ENTREGADO: "bg-slate-100 text-slate-700 border-slate-200",
    CANCELADO: "bg-gray-100 text-gray-500 border-gray-200",
  };
  return colors[status] || "bg-gray-100 text-gray-700";
};

export default async function RepairsPage() {
  const tickets = await prisma.repairTicket.findMany({
    include: {
      user: true, // Para ver quién es el dueño
    },
    orderBy: { updatedAt: "desc" }, // Lo que se movió último aparece primero
  });

  return (
    <div className="p-6 md:p-8 space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Reparaciones</h1>
          <p className="text-slate-500">Gestión de servicio técnico (SAT)</p>
        </div>
        
        <Link 
            href="/admin/repairs/new" 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-sm"
        >
            <Wrench size={18} /> Nuevo Ticket
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                <tr>
                <th className="px-6 py-4">Código</th>
                <th className="px-6 py-4">Dispositivo</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Ingreso</th>
                <th className="px-6 py-4 text-center">Acciones</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-mono text-slate-500 font-bold">
                        {ticket.trackingCode}
                    </td>
                    <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{ticket.deviceModel}</div>
                        <div className="text-xs text-slate-400">S/N: {ticket.serialNumber || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="font-medium text-slate-700">
                            {ticket.user ? ticket.user.name : "Invitado"}
                        </div>
                        <div className="text-xs text-slate-400">
                            {ticket.contactPhone || ticket.user?.phone || "-"}
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(ticket.status)}`}>
                            {ticket.status.replace(/_/g, " ")}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                        {formatDate(ticket.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-center">
                        <Link 
                            href={`/admin/repairs/${ticket.id}`}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 hover:bg-blue-600 text-slate-500 hover:text-white transition shadow-sm"
                        >
                            <Eye size={16} />
                        </Link>
                    </td>
                </tr>
                ))}
                
                {tickets.length === 0 && (
                <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        No hay reparaciones en curso.
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
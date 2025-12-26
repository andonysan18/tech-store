import { prisma } from "@/src/lib/prisma";
import { formatDate, formatDateTime, formatPrice } from "@/src/lib/utils";
import { ArrowLeft, User, Smartphone, History, FileText } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RepairConsole } from "@/src/components/admin/repairs/repair-console";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function RepairDetailPage(props: Props) {
  const params = await props.params;
  const ticketId = params.id; // En tu schema el ID es String (UUID), así que no usamos parseInt

  const ticket = await prisma.repairTicket.findUnique({
    where: { id: ticketId },
    include: {
      user: true,
      logs: {
        orderBy: { createdAt: "desc" } // Historial más reciente arriba
      }
    }
  });

  if (!ticket) return notFound();

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="mb-6">
        <Link 
            href="/admin/repairs" 
            className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 transition gap-2 mb-4"
        >
            <ArrowLeft size={16} /> Volver a reparaciones
        </Link>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                    Ticket: {ticket.trackingCode}
                </h1>
                <p className="text-slate-500 text-sm">Ingresado el: {formatDate(ticket.createdAt)}</p>
            </div>
            <div className={`px-4 py-2 rounded-full font-bold border text-sm
                ${ticket.status === 'LISTO' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-slate-100 text-slate-700 border-slate-200'}
            `}>
                {ticket.status.replace(/_/g, " ")}
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMNA IZQUIERDA: Detalles del Equipo y Problema */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Tarjeta del Problema */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                    <Smartphone className="text-blue-600" size={20}/> {ticket.deviceModel}
                </h2>
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="p-3 bg-slate-50 rounded-lg">
                        <span className="block text-slate-400 text-xs uppercase">Número de Serie</span>
                        <span className="font-medium text-slate-800">{ticket.serialNumber || "No especificado"}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                        <span className="block text-slate-400 text-xs uppercase">Costo Final</span>
                        <span className="font-bold text-green-700">
                            {ticket.finalCost ? formatPrice(ticket.finalCost) : "A confirmar"}
                        </span>
                    </div>
                </div>
                <div>
                    <span className="block text-slate-500 text-sm font-medium mb-1">Descripción del Problema:</span>
                    <p className="p-4 bg-red-50 text-red-800 rounded-lg text-sm border border-red-100">
                        {ticket.issueDescription}
                    </p>
                </div>
            </div>

            {/* Historial (Logs) */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
                    <History className="text-slate-500" size={18} />
                    <h3 className="font-semibold text-slate-700">Historial de Actividad</h3>
                </div>
                <div className="divide-y divide-slate-100">
                    {ticket.logs.map((log) => (
                        <div key={log.id} className="p-4 hover:bg-slate-50 transition">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                                    {log.status.replace(/_/g, " ")}
                                </span>
                                <span className="text-xs text-slate-400">
                                    {formatDateTime(log.createdAt)}
                                </span>
                            </div>
                            <p className="text-sm text-slate-600 mt-2">
                                {log.note}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* COLUMNA DERECHA: Datos Cliente y Consola */}
        <div className="space-y-6">
            
            {/* Consola de Técnico */}
            <RepairConsole 
                ticketId={ticket.id} 
                currentStatus={ticket.status} 
                currentCost={ticket.finalCost ? Number(ticket.finalCost) : null}
            />

            {/* Cliente */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <User size={18} className="text-blue-600"/> Datos del Cliente
                </h3>
                <div className="space-y-3 text-sm">
                    <p><span className="text-slate-400 block text-xs">Nombre</span> {ticket.user?.name || "Cliente Mostrador"}</p>
                    <p><span className="text-slate-400 block text-xs">Contacto</span> {ticket.contactPhone || ticket.user?.phone || "-"}</p>
                    <p><span className="text-slate-400 block text-xs">Email</span> {ticket.user?.email || ticket.internalNotes}</p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
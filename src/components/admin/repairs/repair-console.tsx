"use client";

import { RepairStatus } from "@prisma/client";
import { useState } from "react";
// import { updateRepairStatus } from "@/src/actions/repairs";
import { Save } from "lucide-react";
import { updateRepairStatus } from "@/src/actions/repair/repairs";

const statuses = Object.keys(RepairStatus) as RepairStatus[];

interface Props {
  ticketId: string;
  currentStatus: RepairStatus;
  currentCost: number | null;
}

export function RepairConsole({ ticketId, currentStatus, currentCost }: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [note, setNote] = useState("");
  const [cost, setCost] = useState<string>(currentCost?.toString() || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!note.trim()) {
        alert("Por favor, escribe una nota interna sobre el cambio.");
        return;
    }

    setLoading(true);
    const costNumber = cost ? parseFloat(cost) : undefined;

    const res = await updateRepairStatus(ticketId, status, note, costNumber);

    if (res.success) {
        setNote(""); // Limpiamos la nota
        alert("Actualizado con éxito");
    } else {
        alert("Error al actualizar");
    }
    setLoading(false);
  };

  return (
    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
        <h4 className="font-semibold text-slate-800 border-b border-slate-200 pb-2">Zona de Técnico</h4>
        
        {/* Selector de Estado */}
        <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Nuevo Estado</label>
            <select 
                value={status}
                onChange={(e) => setStatus(e.target.value as RepairStatus)}
                className="w-full p-2 rounded border border-slate-300 bg-white"
            >
                {statuses.map(s => (
                    <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                ))}
            </select>
        </div>

        {/* Costo (Opcional) */}
        <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Costo Final (ARS)</label>
            <input 
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="0.00"
                className="w-full p-2 rounded border border-slate-300 bg-white"
            />
        </div>

        {/* Nota Interna */}
        <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Nota del proceso (Requerido)</label>
            <textarea 
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ej: Se realizó cambio de pasta térmica..."
                className="w-full p-2 rounded border border-slate-300 bg-white h-24 text-sm"
            />
        </div>

        <button 
            onClick={handleUpdate}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
            {loading ? "Guardando..." : <><Save size={16} /> Actualizar Ticket</>}
        </button>
    </div>
  );
}
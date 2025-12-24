"use client";

import { useState, useEffect, useCallback, Suspense } from "react"; // Agregamos Suspense
import { useSearchParams } from "next/navigation";
import { Search, Wrench, CheckCircle2, Clock, AlertCircle, Package, Truck, XCircle } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { getRepairStatus } from "@/src/actions/repair/repair-actions";
import { toast } from "sonner";

// --- UTILIDADES ---
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const cleanText = (text: string) => {
  return text.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "LISTO": return <CheckCircle2 size={18} className="text-green-600" />;
    case "ENTREGADO": return <Package size={18} className="text-blue-600" />;
    case "CANCELADO": return <XCircle size={18} className="text-red-600" />;
    case "EN_REPARACION": return <Wrench size={18} className="text-purple-600" />;
    default: return <Clock size={18} className="text-slate-400" />;
  }
};

// --- COMPONENTE CON LA LÓGICA ---
function TrackingContent() {
  const searchParams = useSearchParams();
  const codeFromUrl = searchParams.get("code");

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const fetchTicket = useCallback(async (codeToSearch: string) => {
    setLoading(true);
    setResult(null);
    const response = await getRepairStatus(codeToSearch);
    
    if (!response.success) {
      toast.error(response.message);
    } else {
      setResult(response.ticket);
      if (!codeFromUrl) toast.success("Estado encontrado");
    }
    setLoading(false);
  }, [codeFromUrl]);

  useEffect(() => {
    if (codeFromUrl) {
      setCode(codeFromUrl);
      fetchTicket(codeFromUrl);
    }
  }, [codeFromUrl, fetchTicket]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    fetchTicket(code);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-4 animate-in fade-in zoom-in duration-500">
        <div className="inline-flex items-center justify-center p-4 bg-white rounded-full text-blue-600 mb-2 shadow-sm border border-slate-100">
          <Wrench size={32} />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Seguimiento de Equipo
        </h1>
        <p className="text-slate-500 max-w-md mx-auto">
          Consulta el estado de tu reparación en tiempo real con tu código único.
        </p>
      </div>

      <div className="bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 relative z-10 max-w-xl mx-auto">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <Input 
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="REP-XXXXX" 
              className="pl-12 h-14 text-lg uppercase tracking-widest font-mono border-0 bg-slate-50 focus-visible:ring-0 rounded-xl"
            />
          </div>
          <button type="submit" disabled={loading} className="h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 rounded-xl shadow-lg flex items-center justify-center disabled:opacity-50">
            {loading ? <Clock className="animate-spin" /> : "Buscar"}
          </button>
        </form>
      </div>

      {result && (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden animate-in slide-in-from-bottom duration-500">
          <div className="bg-slate-50/50 p-6 md:p-8 border-b border-slate-100">
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                      <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                          Ticket #{result.trackingCode}
                      </span>
                      <span className="text-xs text-slate-400">
                          {formatDate(result.createdAt)}
                      </span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">{result.deviceModel}</h3>
                  <p className="text-slate-500 text-sm mt-1">{result.issueDescription}</p>
                </div>
                
                <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 ${
                    result.status === 'LISTO' ? 'bg-green-50 border-green-200 text-green-700' :
                    result.status === 'ENTREGADO' ? 'bg-slate-100 border-slate-200 text-slate-700' :
                    'bg-blue-50 border-blue-200 text-blue-700'
                }`}>
                    {getStatusIcon(result.status)}
                    <span className="font-bold text-sm uppercase">{cleanText(result.status)}</span>
                </div>
            </div>

            <div className="relative pt-4 pb-2">
               <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                      style={{ width: 
                          result.status === 'PENDIENTE' ? '10%' :
                          result.status === 'EN_DIAGNOSTICO' ? '30%' :
                          result.status === 'EN_REPARACION' ? '60%' :
                          result.status === 'LISTO' ? '90%' :
                          result.status === 'ENTREGADO' ? '100%' : '0%'
                      }}
                  ></div>
               </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Bitácora</h4>
            <div className="space-y-0 relative border-l-2 border-slate-100 ml-3">
              {result.logs.map((log: any) => (
                <div key={log.id} className="relative pl-8 pb-8 last:pb-0">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white bg-blue-500"></div>
                  <div className="flex justify-between mb-1">
                      <span className="font-bold text-slate-800 text-sm">{cleanText(log.status)}</span>
                      <span className="text-xs text-slate-400">{formatDate(log.createdAt)}</span>
                  </div>
                  <p className="text-slate-600 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                      {log.note || "Actualización de estado."}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- COMPONENTE PRINCIPAL EXPORTADO ---
export default function RepairTrackingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <Suspense fallback={
        <div className="max-w-3xl mx-auto text-center py-20">
          <Clock className="animate-spin mx-auto text-slate-300 mb-4" size={40} />
          <p className="text-slate-400">Cargando buscador...</p>
        </div>
      }>
        <TrackingContent />
      </Suspense>
    </div>
  );
}
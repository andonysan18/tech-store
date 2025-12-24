"use client";

import { useState } from "react";
import Link from "next/link";
import { Wrench, Smartphone, Laptop, Gamepad2, ArrowRight, Loader2, CheckCircle2, Copy, X, MessageCircle, Mail } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { toast } from "sonner";
import { createRepairTicket } from "@/src/actions/repair/create-ticket";

export default function NewRepairPage() {
  const [loading, setLoading] = useState(false);
  
  // Estado para controlar el Modal y los datos del ticket creado
  const [ticketSuccess, setTicketSuccess] = useState<{ code: string; device: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
        deviceModel: formData.get("deviceModel") as string,
        issueDescription: formData.get("issueDescription") as string,
        contactPhone: formData.get("contactPhone") as string,
        // 🔥 Agregamos el email (asegurate de recibirlo en tu server action o guardarlo en notas)
        email: formData.get("email") as string, 
    };

    const result = await createRepairTicket(data);

    if (result.success) {
        toast.success("¡Solicitud creada con éxito!");
        setTicketSuccess({ 
            code: result.trackingCode || "ERROR", 
            device: data.deviceModel 
        });
        // Opcional: Resetear form
        // (e.target as HTMLFormElement).reset();
    } else {
        toast.error("Hubo un error. Intenta nuevamente.");
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    if (ticketSuccess?.code) {
        navigator.clipboard.writeText(ticketSuccess.code);
        toast.success("Código copiado");
    }
  };

  // 🔥 Generador de Link de WhatsApp Dinámico
  const getWhatsAppLink = () => {
    if (!ticketSuccess) return "#";
    const phone = "5491162198405"; // ⚠️ PON TU NÚMERO AQUÍ
    const text = `Hola TechStore! 👋 Acabo de generar la solicitud de reparación *${ticketSuccess.code}* para mi *${ticketSuccess.device}*. ¿En qué horarios puedo acercarme a dejar el equipo?`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 relative">
      
      {/* --- MODAL DE ÉXITO (TICKET) --- */}
      {ticketSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300 relative">
                
                <button 
                    onClick={() => setTicketSuccess(null)}
                    className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition"
                >
                    <X size={20} />
                </button>

                <div className="bg-green-50 p-8 text-center border-b border-green-100">
                    <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center text-green-600 mb-4 shadow-sm animate-bounce">
                        <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-green-800">¡Solicitud Recibida!</h3>
                    <p className="text-green-700 text-sm mt-1">Tu equipo ya está en nuestro sistema.</p>
                </div>

                <div className="p-8 space-y-6">
                    <div className="text-center">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">TU CÓDIGO DE SEGUIMIENTO</p>
                        <div 
                            onClick={copyToClipboard}
                            className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl p-4 flex items-center justify-center gap-3 cursor-pointer hover:bg-slate-200 transition group"
                        >
                            <span className="text-3xl font-mono font-bold text-slate-800 tracking-wider">
                                {ticketSuccess.code}
                            </span>
                            <Copy size={20} className="text-slate-400 group-hover:text-slate-600" />
                        </div>
                        <p className="text-xs text-slate-400 mt-2">Haz clic para copiar</p>
                    </div>

                    {/* 🔥 SECCIÓN DE ACCIÓN WHATSAPP */}
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800 text-center">
                        <p className="mb-3">Para coordinar la entrega de tu equipo, envíanos este código por WhatsApp:</p>
                        <a 
                            href={getWhatsAppLink()} 
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-10 shadow-lg shadow-green-200 gap-2">
                                <MessageCircle size={18} /> Avisar por WhatsApp
                            </Button>
                        </a>
                    </div>

                    <div className="grid gap-3">
                        <Link href={`/repair/tracking?code=${ticketSuccess.code}`} className="w-full">
                            <Button variant="outline" className="w-full border-slate-300 hover:bg-slate-50 text-slate-700 font-bold h-12 rounded-xl">
                                Ver Estado del Trámite
                            </Button>
                        </Link>
                        <Button 
                            variant="ghost" 
                            onClick={() => setTicketSuccess(null)}
                            className="w-full text-slate-400 hover:text-slate-600"
                        >
                            Cerrar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* --- FORMULARIO PRINCIPAL --- */}
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        
        {/* Lado Izquierdo: Info */}
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
                    Revivimos tu <br/> <span className="text-blue-600">tecnología</span>.
                </h1>
                <p className="text-slate-500 text-lg">
                    Completa el formulario para iniciar una orden de reparación. Te daremos un código para que sigas el proceso en tiempo real.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center text-center gap-2">
                    <Smartphone className="text-blue-500" size={32} />
                    <span className="font-bold text-slate-700">Celulares</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center text-center gap-2">
                    <Laptop className="text-purple-500" size={32} />
                    <span className="font-bold text-slate-700">Notebooks</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center text-center gap-2">
                    <Gamepad2 className="text-red-500" size={32} />
                    <span className="font-bold text-slate-700">Consolas</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center text-center gap-2">
                    <Wrench className="text-green-500" size={32} />
                    <span className="font-bold text-slate-700">Mantenimiento</span>
                </div>
            </div>
        </div>

        {/* Lado Derecho: Formulario */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Iniciar Solicitud</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="deviceModel">Modelo del Equipo</Label>
                    <Input id="deviceModel" name="deviceModel" placeholder="Ej: iPhone 11, PS4 Slim..." required className="bg-slate-50 h-12" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="issueDescription">¿Qué falla tiene?</Label>
                    <Textarea id="issueDescription" name="issueDescription" placeholder="Ej: Se cayó y no prende la pantalla..." required className="bg-slate-50 min-h-[100px] resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="contactPhone">WhatsApp / Teléfono</Label>
                        <Input id="contactPhone" name="contactPhone" type="tel" placeholder="11 5555 6666" required className="bg-slate-50 h-12" />
                    </div>
                    {/* 🔥 Input de Email Nuevo */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email (Respaldo)</Label>
                        <Input id="email" name="email" type="email" placeholder="tu@email.com" required className="bg-slate-50 h-12" />
                    </div>
                </div>

                <Button type="submit" size="lg" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6 font-bold shadow-lg shadow-blue-200 rounded-xl transition-all hover:scale-[1.02]">
                    {loading ? <Loader2 className="animate-spin" /> : <>Generar Ticket <ArrowRight className="ml-2" /></>}
                </Button>
            </form>
        </div>

      </div>
    </div>
  );
}
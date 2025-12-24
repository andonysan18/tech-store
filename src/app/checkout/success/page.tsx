"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation"; 
import { CheckCircle2, MessageCircle, Copy, MapPin, Store, Wallet } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useCartStore } from "@/src/store/cart-store";
import { toast } from "sonner";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  
  // 1. LEEMOS EL ID REAL Y EL TIPO DE PAGO DE LA URL
  const type = searchParams.get("type"); 
  const orderIdFromUrl = searchParams.get("orderId"); // <--- AQUÍ ESTÁ EL ID REAL DE LA DB

  const clearCart = useCartStore((state) => state.clearCart);
  
  // 2. Vaciamos el carrito apenas carga
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  const isTransfer = type === "transfer";
  const phone = "5491162198405"; 
  
  // 3. Usamos el ID real en el mensaje. Si no viene, ponemos "Pendiente".
  const displayId = orderIdFromUrl ? `#${orderIdFromUrl}` : "N/A";

  const message = isTransfer
    ? `Hola TechStore! 👋 Hice el pedido ${displayId}. Adjunto el comprobante de transferencia.`
    : `Hola TechStore! 👋 Hice el pedido ${displayId}. Paso a retirar y pagar en el local.`;

  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado");
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 px-4 py-12 text-center">
      
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100 max-w-lg w-full animate-in zoom-in duration-500">
        
        <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full text-green-600 animate-bounce">
                <CheckCircle2 size={64} />
            </div>
        </div>
        
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">¡Pedido Recibido!</h1>
        <p className="text-slate-500 mb-6">
            Tu orden <span className="font-mono font-bold text-slate-800 text-xl">{displayId}</span> ha sido registrada.
        </p>

        {/* --- DATOS DE PAGO --- */}
        <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl mb-8 text-left">
            {isTransfer ? (
                <>
                    <div className="flex items-center gap-2 mb-4 text-blue-700 font-bold border-b border-slate-200 pb-2">
                        <Wallet size={20} /> Datos para Transferir
                    </div>
                    <div className="space-y-3 text-sm text-slate-600 font-mono">
                        <div className="flex justify-between items-center bg-white p-2 rounded border border-slate-100">
                            <span>Alias:</span>
                            <div className="flex items-center gap-2">
                                <strong className="text-slate-900">TECH.STORE.PAGO</strong>
                                <button onClick={() => copyToClipboard("TECH.STORE.PAGO")}><Copy size={14} className="text-blue-500 hover:scale-110 transition"/></button>
                            </div>
                        </div>
                        <div className="flex justify-between items-center bg-white p-2 rounded border border-slate-100">
                            <span>CBU:</span>
                            <div className="flex items-center gap-2">
                                <strong className="text-slate-900">000000310004488</strong>
                                <button onClick={() => copyToClipboard("000000310004488")}><Copy size={14} className="text-blue-500 hover:scale-110 transition"/></button>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold border-b border-slate-200 pb-2">
                        <Store size={20} /> Retiro en Local
                    </div>
                    <div className="flex items-start gap-3">
                        <MapPin className="text-red-500 mt-1 flex-shrink-0" />
                        <div>
                            <p className="font-bold text-slate-800 text-sm">Av. Siempre Viva 742</p>
                            <p className="text-xs text-slate-500">Springfield, Buenos Aires</p>
                        </div>
                    </div>
                </>
            )}
        </div>

        <div className="space-y-3">
            <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
            >
                <Button className={`w-full font-bold py-6 text-lg shadow-lg transition-all ${isTransfer ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}>
                    <MessageCircle className="mr-2" /> 
                    {isTransfer ? "Enviar Comprobante" : "Confirmar Retiro"}
                </Button>
            </a>
            
            <Link href="/" className="block w-full">
                <Button variant="ghost" className="w-full text-slate-500 hover:text-slate-900">
                    Volver a la Tienda
                </Button>
            </Link>
        </div>
      </div>

    </div>
  );
}
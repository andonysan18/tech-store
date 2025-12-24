"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/src/store/cart-store";
import { Button } from "@/src/components/ui/button";
import { Check, Printer, ArrowRight, ShoppingBag } from "lucide-react";
// import { Confetti } from "@/src/components/ui/confetti"; // (Opcional, si tuviéramos confetti, pero usaremos CSS simple)

export default function SuccessPage() {
  const clearCart = useCartStore((state) => state.clearCart);
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    // 1. Generamos un ID de orden falso para simular
    const randomId = Math.floor(100000 + Math.random() * 900000).toString();
    setOrderId(randomId);

    // 2. 🔥 VACIAR EL CARRITO AUTOMÁTICAMENTE
    // Es importante hacerlo aquí para que el usuario empiece de cero
    clearCart();
  }, [clearCart]);

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-xl border border-gray-100 p-8 text-center relative overflow-hidden">
        
        {/* Decoración de fondo */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

        {/* Icono de Éxito Animado */}
        <div className="mb-6 flex justify-center">
            <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center shadow-inner animate-in zoom-in duration-500">
                <Check size={48} className="text-green-600 drop-shadow-sm" strokeWidth={3} />
            </div>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">¡Pago Exitoso!</h1>
        <p className="text-slate-500 mb-6">
            Muchas gracias por tu compra. Tu pedido ha sido procesado correctamente.
        </p>

        {/* Tarjeta de Orden */}
        <div className="bg-slate-50 rounded-xl p-4 mb-8 border border-slate-100">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Número de Orden</p>
            <p className="text-2xl font-mono font-bold text-slate-800 tracking-widest">
                #{orderId || "..."}
            </p>
        </div>

        {/* Pasos a seguir */}
        <div className="text-left space-y-3 mb-8 text-sm text-slate-600">
            <div className="flex gap-3">
                <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">1</span>
                <p>Recibirás un email de confirmación en breve.</p>
            </div>
            <div className="flex gap-3">
                <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">2</span>
                <p>Te notificaremos por WhatsApp cuando el pedido sea despachado.</p>
            </div>
        </div>

        {/* Botones de Acción */}
        <div className="space-y-3">
            <Link href="/" className="block">
                <Button size="lg" className="w-full h-12 bg-slate-900 hover:bg-blue-600 font-bold shadow-lg transition-all">
                    Seguir Comprando <ArrowRight className="ml-2" size={18} />
                </Button>
            </Link>
            
            <Button variant="outline" className="w-full border-slate-200 text-slate-600 hover:bg-slate-50">
                <Printer className="mr-2" size={16} /> Descargar Comprobante
            </Button>
        </div>

      </div>
    </div>
  );
}
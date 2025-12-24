"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 
import { useCartStore } from "@/src/store/cart-store";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { 
  ArrowRight, Lock, MessageCircle, User, Loader2 
} from "lucide-react"; 
import Link from "next/link";
import Image from "next/image";

export default function CheckoutPage() {
  const { items, getTotalPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Solo pedimos el nombre para ser amables en el chat
  const [clientName, setClientName] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleConfirmOrder = () => {
    setIsProcessing(true); 

    // 1. Armamos el mensaje
    const intro = clientName ? `Hola, soy ${clientName}.` : "Hola!";
    
    const message = `${intro} Quiero confirmar mi pedido:%0A%0A` +
      items.map(i => `• ${i.name} x${i.quantity} - $${(i.price * i.quantity).toLocaleString("es-AR")}`).join('%0A') +
      `%0A%0A💰 *Total Final: $${getTotalPrice().toLocaleString("es-AR")}*` +
      `%0A%0A(Quedo a la espera para coordinar el pago y envío)`;

    // 2. ⚠️ TU NÚMERO
    const phoneNumber = "5491122334455"; 

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    setTimeout(() => {
      setIsProcessing(false);
      window.open(whatsappUrl, '_blank');
      router.push("/checkout/success"); 
    }, 1500);
  };

  if (!mounted) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-4xl"> {/* Hice el contenedor más chico */}
        
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-slate-500 text-sm">
            <Link href="/cart" className="hover:text-blue-600 transition">Carrito</Link>
            <span>/</span>
            <span className="font-medium text-slate-900">Confirmación</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* === COLUMNA 1: DATOS MÍNIMOS === */}
          <div className="flex flex-col gap-6">
             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <User className="text-blue-600"/> Tus Datos
                </h2>
                <p className="text-sm text-slate-500 mb-4">
                    Completa tu nombre para agilizar la atención por WhatsApp. El resto lo coordinamos por el chat.
                </p>
                <div className="grid gap-2">
                    <Label htmlFor="name">Tu Nombre (Opcional)</Label>
                    <Input 
                        id="name" 
                        placeholder="Ej: Juan Pérez" 
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                    />
                </div>
             </div>

             <div className="bg-green-50 p-6 rounded-2xl border border-green-100 shadow-sm flex gap-4 items-start">
                <div className="bg-green-100 p-2 rounded-full text-green-700 shrink-0">
                    <MessageCircle size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-green-800">Finalizar por WhatsApp</h3>
                    <p className="text-sm text-green-700 mt-1">
                        Al confirmar, se abrirá un chat con nuestro equipo para coordinar el pago (Transferencia/Efectivo) y el envío.
                    </p>
                </div>
             </div>
          </div>

          {/* === COLUMNA 2: RESUMEN Y BOTÓN === */}
          <div className="flex flex-col gap-6">
             <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-lg">
                <h3 className="font-bold text-slate-900 mb-4">Resumen del Pedido</h3>
                
                {/* Lista Mini */}
                <div className="max-h-[250px] overflow-y-auto space-y-3 pr-2 mb-4 scrollbar-thin">
                    {items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                            <span className="text-slate-600 truncate max-w-[180px]">
                                {item.quantity}x {item.name}
                            </span>
                            <span className="font-medium text-slate-900">
                                ${(item.price * item.quantity).toLocaleString("es-AR")}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-100 my-4 pt-4 flex justify-between items-end">
                    <span className="text-lg font-bold text-slate-900">Total</span>
                    <span className="text-2xl font-extrabold text-slate-900">
                        ${getTotalPrice().toLocaleString("es-AR")}
                    </span>
                </div>

                <Button 
                    onClick={handleConfirmOrder}
                    disabled={isProcessing}
                    size="lg" 
                    className="w-full h-14 bg-green-600 hover:bg-green-700 text-white text-lg font-bold shadow-xl shadow-green-200 transition-all mb-4"
                >
                    {isProcessing ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="animate-spin" /> Abriendo WhatsApp...
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            Finalizar Compra <ArrowRight />
                        </div>
                    )}
                </Button>

                <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                    <Lock size={12} />
                    <span>Compra segura y directa.</span>
                </div>

             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
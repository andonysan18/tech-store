import Image from "next/image";
import { Separator } from "@/src/components/ui/separator";
import { Button } from "@/src/components/ui/button";
import { Loader2, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/src/store/cart-store";

interface OrderSummaryProps {
  isProcessing: boolean;
  paymentMethod: "transfer" | "cash";
  onCheckout: () => void; // Recibimos la función del padre
}

export function OrderSummary({ 
  isProcessing, 
  paymentMethod,
  onCheckout 
}: OrderSummaryProps) {
  const cart = useCartStore((state) => state.cart);
  const total = useCartStore((state) => state.getTotalPrice());

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg sticky top-24">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Resumen del Pedido</h3>

      <div className="space-y-4 max-h-60 overflow-auto pr-2 mb-6 custom-scrollbar">
        {cart.map((item) => (
          <div key={item.id} className="flex gap-3 items-center">
            <div className="relative w-12 h-12 bg-slate-50 rounded-lg overflow-hidden border border-slate-100 flex-shrink-0">
              <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">{item.name}</p>
              <p className="text-xs text-slate-500">x{item.quantity}</p>
            </div>
            <p className="text-sm font-bold text-slate-700">
              ${(item.price * item.quantity).toLocaleString("es-AR")}
            </p>
          </div>
        ))}
      </div>

      <Separator className="my-4" />

      <div className="space-y-2 text-sm text-slate-600 mb-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${total.toLocaleString("es-AR")}</span>
        </div>
        {paymentMethod === "transfer" && (
          <div className="flex justify-between text-green-600 font-medium">
            <span>Descuento Transferencia (5%)</span>
            <span>-${(total * 0.05).toLocaleString("es-AR")}</span>
          </div>
        )}
        <div className="flex justify-between text-blue-600 font-medium">
          <span>Envío</span>
          <span>A coordinar</span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6 pt-2 border-t border-slate-100">
        <span className="text-lg font-bold text-slate-900">Total Final</span>
        <span className="text-2xl font-extrabold text-blue-600">
          ${(paymentMethod === "transfer" ? total * 0.95 : total).toLocaleString("es-AR")}
        </span>
      </div>

      {/* 🔥 Botón corregido: Llama a onCheckout directamente */}
      <Button
        onClick={onCheckout}
        disabled={isProcessing}
        size="lg"
        className={`w-full font-bold text-md rounded-xl py-6 shadow-lg transition-all ${
          paymentMethod === "transfer"
            ? "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
            : "bg-slate-900 hover:bg-slate-800 shadow-slate-300"
        }`}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...
          </>
        ) : paymentMethod === "transfer" ? (
          "Confirmar y Ver Datos"
        ) : (
          "Confirmar Reserva"
        )}
      </Button>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
        <ShieldCheck size={14} /> Tus datos están protegidos.
      </div>
    </div>
  );
}
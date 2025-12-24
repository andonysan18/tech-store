"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/src/store/cart-store";
import { createOrder } from "@/src/actions/order/order-actions"; // 🔥 Importamos la acción real

// Importamos los componentes
import { CheckoutForm } from "@/src/components/checkout/checkout-form";
import { PaymentSelector } from "@/src/components/checkout/payment-selector";
import { OrderSummary } from "@/src/components/checkout/order-summary";

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Estados para datos
  const [paymentMethod, setPaymentMethod] = useState<"transfer" | "cash">("transfer");
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    phone: "",
    email: ""
  });

  const cart = useCartStore((state) => state.cart);
  const total = useCartStore((state) => state.getTotalPrice());

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && cart.length === 0) {
      router.push("/cart");
    }
  }, [mounted, cart, router]);

  if (!mounted || cart.length === 0) return null;

  // Manejo de cambios en el formulario
  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Función PRINCIPAL de compra
  const handleCheckout = async () => {
    // 1. Validaciones
    if (!formData.name || !formData.lastname || !formData.phone) {
        toast.error("Por favor completa los datos obligatorios (Nombre, Apellido, Teléfono)");
        return;
    }

    setIsProcessing(true);

    try {
        // 2. Calculamos total con descuento si aplica
        const finalTotal = paymentMethod === "transfer" ? total * 0.95 : total;
        
        // 3. Llamada a la BASE DE DATOS REAL
        const result = await createOrder({
            ...formData,
            paymentMethod,
            total: finalTotal,
            cart: cart.map(item => ({ 
                id: item.id, 
                quantity: item.quantity, 
                price: item.price 
            }))
        });

        if (!result.success) {
            toast.error(result.message); // Ej: "Sin stock"
            setIsProcessing(false);
            return;
        }

        toast.success("¡Pedido guardado con éxito!");
        
        // 4. Redirección con ID REAL y TIPO DE PAGO
        router.push(`/checkout/success?type=${paymentMethod}&orderId=${result.orderId}`);

    } catch (error) {
        console.error(error);
        toast.error("Ocurrió un error inesperado.");
        setIsProcessing(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        
        <div className="flex items-center gap-2 mb-8 text-slate-500 hover:text-slate-800 transition w-fit">
            <Link href="/cart" className="flex items-center gap-1 text-sm font-medium">
                <ArrowLeft size={16} /> Volver al Carrito
            </Link>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
            {/* COLUMNA IZQUIERDA */}
            <div className="lg:col-span-3 space-y-6">
                <CheckoutForm 
                    formData={formData} 
                    onChange={handleFormChange} 
                />
                <PaymentSelector 
                    selectedMethod={paymentMethod} 
                    onMethodChange={setPaymentMethod} 
                />
            </div>

            {/* COLUMNA DERECHA */}
            <div className="lg:col-span-2">
                <OrderSummary 
                    isProcessing={isProcessing} 
                    paymentMethod={paymentMethod}
                    onCheckout={handleCheckout} 
                />
            </div>
        </div>
      </div>
    </div>
  );
}
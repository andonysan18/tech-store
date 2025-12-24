"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft } from "lucide-react";

import { useCartStore } from "@/src/store/cart-store";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  
  // Conectamos con el Store
  const cart = useCartStore((state) => state.cart);
  // 🔥 CORRECCIÓN: Usamos 'removeItem' que es como se llama en el store
  const removeItem = useCartStore((state) => state.removeItem); 
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Evita error de hidratación

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        
        <h1 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-2">
          <ShoppingBag className="text-blue-600" /> Tu Carrito
        </h1>

        {cart.length === 0 ? (
          /* --- ESTADO VACÍO --- */
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm flex flex-col items-center">
            <div className="bg-slate-50 p-6 rounded-full mb-4">
               <ShoppingBag size={64} className="text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Tu carrito está vacío</h2>
            <p className="text-slate-500 mb-8 max-w-md">Parece que aún no has agregado productos. Explora nuestra tienda para encontrar lo mejor en tecnología.</p>
            <Link href="/search">
              <Button size="lg" className="rounded-full font-bold px-8">
                Ir a la Tienda
              </Button>
            </Link>
          </div>
        ) : (
          /* --- CARRO CON PRODUCTOS --- */
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* COLUMNA IZQUIERDA: LISTA DE ITEMS */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-4 md:gap-6 items-center">
                  
                  {/* Imagen */}
                  <div className="relative w-24 h-24 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100">
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      fill 
                      className="object-contain p-2 mix-blend-multiply" 
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 text-lg truncate">{item.name}</h3>
                    <p className="text-sm text-slate-500 mb-2">Precio unitario: ${item.price.toLocaleString("es-AR")}</p>
                    
                    <div className="flex items-center gap-4">
                       {/* Controles de Cantidad */}
                       <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                          <button 
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="p-2 hover:bg-white hover:text-blue-600 rounded-l-lg transition"
                            disabled={item.quantity <= 1}
                          >
                             <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                          <button 
                             onClick={() => updateQuantity(item.id, Math.min(item.stock, item.quantity + 1))}
                             className="p-2 hover:bg-white hover:text-blue-600 rounded-r-lg transition"
                             disabled={item.quantity >= item.stock}
                          >
                             <Plus size={14} />
                          </button>
                       </div>

                       {/* Botón Eliminar */}
                       {/* 🔥 CORRECCIÓN: Usamos removeItem(item.id) */}
                       <button 
                         onClick={() => removeItem(item.id)}
                         className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition"
                         title="Eliminar producto"
                       >
                         <Trash2 size={18} />
                       </button>
                    </div>
                  </div>

                  {/* Subtotal Item */}
                  <div className="text-right hidden sm:block">
                     <p className="font-bold text-lg text-slate-900">
                       ${(item.price * item.quantity).toLocaleString("es-AR")}
                     </p>
                  </div>

                </div>
              ))}

              <div className="mt-4">
                <Link href="/search" className="text-blue-600 font-medium hover:underline flex items-center gap-2">
                   <ArrowLeft size={16} /> Seguir comprando
                </Link>
              </div>
            </div>

            {/* COLUMNA DERECHA: RESUMEN DE PAGO */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg sticky top-24">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Resumen de compra</h3>
                
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${getTotalPrice().toLocaleString("es-AR")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío</span>
                    <span className="text-green-600 font-medium">Gratis</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Impuestos (Estimado)</span>
                    <span>$0</span>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="flex justify-between items-end mb-6">
                  <span className="text-lg font-bold text-slate-900">Total</span>
                  <span className="text-3xl font-extrabold text-blue-600">
                    ${getTotalPrice().toLocaleString("es-AR")}
                  </span>
                </div>

                <Link href="/checkout">
                  <Button size="lg" className="w-full rounded-xl font-bold text-md py-6 shadow-blue-200 shadow-lg hover:shadow-xl transition-all">
                    Iniciar Compra <ArrowRight className="ml-2" />
                  </Button>
                </Link>
                
                <p className="text-xs text-center text-slate-400 mt-4">
                  Pagos seguros encriptados con SSL.
                </p>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
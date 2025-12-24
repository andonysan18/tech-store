"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/src/store/cart-store";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Separator } from "@/src/components/ui/separator"; // Asegúrate de tener este componente instalado, si no, usa <hr className="my-4"/>
import {
    Trash2, Plus, Minus, ArrowRight, ShoppingBag,
    ArrowLeft, ShieldCheck, CreditCard
} from "lucide-react";

export default function CartPage() {
    // Conectamos con Zustand
    const {
        items,
        removeItem,
        updateQuantity,
        getTotalPrice
    } = useCartStore();

    // Truco de hidratación (para evitar error entre servidor/cliente)
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null; // Esperamos a que cargue en el cliente

    // ESTADO VACÍO
    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 min-h-[60vh] flex flex-col items-center justify-center text-center">
                <div className="bg-slate-50 p-6 rounded-full mb-6">
                    <ShoppingBag size={64} className="text-slate-300" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Tu carrito está vacío</h2>
                <p className="text-slate-500 mb-8 max-w-md">
                    Parece que aún no has agregado productos. Explora nuestra tienda y encuentra la mejor tecnología.
                </p>
                <Link href="/">
                    <Button size="lg" className="h-12 px-8 font-semibold bg-blue-600 hover:bg-blue-700">
                        Volver a la tienda
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20">

            {/* Encabezado Simple */}
            <div className="bg-white border-b border-gray-200 py-8 mb-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
                        Tu Carrito
                        <span className="text-lg font-normal text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                            {items.length} productos
                        </span>
                    </h1>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* === LISTA DE PRODUCTOS (Izquierda) === */}
                    <div className="lg:col-span-8 flex flex-col gap-4">
                        {items.map((item) => (
                            <div key={item.id} className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-6 items-center sm:items-start group transition-all hover:border-blue-100">

                                {/* Imagen */}
                                <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                                    {item.image ? (
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-contain p-2"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <ShoppingBag size={24} />
                                        </div>
                                    )}
                                </div>

                                {/* Info y Controles */}
                                <div className="flex-1 w-full flex flex-col sm:flex-row justify-between gap-4">
                                    <div className="flex-1 space-y-1 text-center sm:text-left">
                                        <h3 className="font-bold text-slate-900 text-lg leading-tight">{item.name}</h3>
                                        <p className="text-slate-500 text-sm">Disponibles: {item.maxStock}</p>
                                        <p className="text-blue-600 font-bold text-xl sm:hidden">
                                            ${(item.price * item.quantity).toLocaleString("es-AR")}
                                        </p>
                                    </div>

                                    {/* Controles de Cantidad */}
                                    <div className="flex flex-col items-center sm:items-end gap-4">
                                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-200">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-white hover:shadow-sm"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus size={14} />
                                            </Button>
                                            <span className="w-8 text-center font-semibold text-slate-900">{item.quantity}</span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-white hover:shadow-sm"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                disabled={item.quantity >= item.maxStock}
                                            >
                                                <Plus size={14} />
                                            </Button>
                                        </div>

                                        <Button
                                            variant="ghost"
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50 h-auto p-2 text-xs font-medium flex items-center gap-1"
                                            onClick={() => removeItem(item.id)}
                                        >
                                            <Trash2 size={14} /> Eliminar
                                        </Button>
                                    </div>

                                    {/* Precio (Desktop) */}
                                    <div className="hidden sm:block text-right min-w-[100px]">
                                        <p className="text-xl font-extrabold text-slate-900">
                                            ${(item.price * item.quantity).toLocaleString("es-AR")}
                                        </p>
                                        {item.quantity > 1 && (
                                            <p className="text-xs text-slate-400">
                                                ${item.price.toLocaleString("es-AR")} c/u
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <Link href="/" className="inline-flex items-center gap-2 text-blue-600 font-medium hover:underline mt-4 pl-2">
                            <ArrowLeft size={16} /> Continuar comprando
                        </Link>
                    </div>

                    {/* === RESUMEN DE COMPRA (Derecha Sticky) === */}
                    <div className="lg:col-span-4">
                        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-lg shadow-gray-200/50 sticky top-24">
                            <h2 className="text-xl font-bold text-slate-900 mb-6">Resumen del pedido</h2>

                            <div className="space-y-4 text-sm text-slate-600">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-slate-900">${getTotalPrice().toLocaleString("es-AR")}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Envío</span>
                                    <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded-full">GRATIS</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Impuestos estimados</span>
                                    <span>-</span>
                                </div>
                            </div>

                            <div className="my-6 border-t border-gray-100"></div>

                            <div className="flex justify-between items-end mb-6">
                                <span className="text-lg font-bold text-slate-900">Total</span>
                                <span className="text-3xl font-extrabold text-slate-900">
                                    ${getTotalPrice().toLocaleString("es-AR")}
                                </span>
                            </div>

                            <Link href="/checkout" className="w-full">
                                <Button size="lg" className="w-full h-14 text-lg font-bold bg-slate-900 hover:bg-blue-600 shadow-lg transition-all duration-300 gap-2 mb-4">
                                    Finalizar Compra <ArrowRight size={20} />
                                </Button>
                            </Link>

                            {/* Cupón (Visual) */}
                            <div className="flex gap-2">
                                <Input placeholder="Código de descuento" className="bg-gray-50 border-gray-200" />
                                <Button variant="outline" className="border-gray-200">Aplicar</Button>
                            </div>

                            {/* Seguridad */}
                            <div className="mt-8 flex flex-col gap-3">
                                <div className="flex items-center gap-3 text-xs text-slate-500 bg-gray-50 p-3 rounded-lg">
                                    <ShieldCheck className="text-green-600" size={20} />
                                    <span>Compra protegida SSL. Tus datos están seguros.</span>
                                </div>
                                <div className="flex justify-center gap-2 text-slate-300">
                                    <CreditCard size={24} />
                                    {/* Aquí podrías poner iconos de Visa, Master, etc */}
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
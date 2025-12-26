import { prisma } from "@/src/lib/prisma";
import { formatPrice, formatDate } from "@/src/lib/utils";
import { ArrowLeft, MapPin, User, Box, CreditCard } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderStatusSelector } from "@/src/components/admin/orders/status-selector";
import { DeleteItemButton } from "@/src/components/admin/orders/delete-item-button";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function OrderDetailPage(props: Props) {
  // 1. Resolver params (Next.js 15)
  const params = await props.params;
  const orderId = parseInt(params.id);

  // 2. Validación ID
  if (isNaN(orderId)) return notFound();

  // 3. Consulta BD
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: true,
      items: {
        include: {
          variant: {
            include: { product: true }
          }
        }
      }
    }
  });

  // 4. Si no existe (porque se borró o nunca existió), mostramos 404 sin errores en consola
  if (!order) {
    return notFound();
  }

  const shipping = order.shippingAddress as any;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="mb-6">
        <Link 
          href="/admin/orders" 
          className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 transition gap-2 mb-4"
        >
          <ArrowLeft size={16} /> Volver al listado
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            Pedido #{order.id}
            <span className="text-sm font-normal text-slate-400 px-3 py-1 bg-slate-100 rounded-full">
              {formatDate(order.createdAt)}
            </span>
          </h1>
          <div className="text-2xl font-bold text-blue-600">
            {formatPrice(order.total)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMNA IZQUIERDA: PRODUCTOS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
               <Box className="text-blue-600" size={18} />
               <h2 className="font-semibold text-slate-800">Detalle de Productos</h2>
            </div>
            
            <div className="divide-y divide-slate-100">
              {order.items.map((item) => {
                 const img = item.variant.images && item.variant.images.length > 0 
                    ? item.variant.images[0] 
                    : "https://placehold.co/100x100/png?text=Sin+Imagen";
                 
                 return (
                  <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center group">
                    <div className="w-16 h-16 bg-slate-100 rounded-lg relative overflow-hidden flex-shrink-0 border border-slate-200">
                      <img src={img} alt={item.variant.product.name} className="object-cover w-full h-full" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900">{item.variant.product.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                        {item.variant.color && <span className="px-2 py-0.5 bg-slate-100 rounded text-xs">{item.variant.color}</span>}
                        {item.variant.storage && <span className="px-2 py-0.5 bg-slate-100 rounded text-xs">{item.variant.storage}</span>}
                        <span className="text-xs border border-slate-200 px-2 py-0.5 rounded">{item.variant.condition}</span>
                      </div>
                    </div>

                    {/* Precio y Botón Eliminar */}
                    <div className="text-right w-full sm:w-auto mt-2 sm:mt-0 flex items-center justify-between sm:justify-end gap-4">
                      <div>
                        <p className="font-medium text-slate-600 text-sm sm:text-base">
                            {item.quantity} x {formatPrice(item.price)}
                        </p>
                        <p className="font-bold text-slate-900 sm:mt-1">
                          {formatPrice(Number(item.price) * item.quantity)}
                        </p>
                      </div>

                      <DeleteItemButton itemId={item.id} orderId={order.id} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: INFO */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <CreditCard size={18} className="text-blue-600"/> Estado
            </h3>
            <OrderStatusSelector currentStatus={order.status} orderId={order.id} />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold border-b border-slate-100 pb-2">
                <User size={18} className="text-blue-600" />
                <h3>Cliente</h3>
            </div>
            <div className="space-y-3 text-sm">
                <div>
                  <span className="text-slate-400 text-xs block uppercase tracking-wider mb-0.5">Nombre</span>
                  <span className="font-medium text-slate-700">{order.user?.name || "Invitado"}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block uppercase tracking-wider mb-0.5">Email</span>
                  <span className="font-medium text-slate-700">{order.user?.email || "No registrado"}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block uppercase tracking-wider mb-0.5">Teléfono</span>
                  <span className="font-medium text-slate-700">{order.user?.phone || "-"}</span>
                </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold border-b border-slate-100 pb-2">
                <MapPin size={18} className="text-blue-600" />
                <h3>Envío</h3>
            </div>
            <div className="text-sm text-slate-600 space-y-1">
                <p className="font-medium text-slate-800">{shipping?.street || "Sin calle"}</p>
                <p>{shipping?.city || ""}, {shipping?.state || ""}</p>
                <p>CP: {shipping?.zipCode || ""}</p>
                {shipping?.country && (
                  <p className="mt-2 inline-block px-2 py-1 bg-slate-100 rounded text-xs font-semibold text-slate-700">
                    {shipping.country}
                  </p>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
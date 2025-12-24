"use server";

import { prisma } from "@/src/lib/db";

// Tipos de datos
interface CartItem {
  id: number; // es el variantId
  quantity: number;
  price: number;
}

interface CheckoutData {
  name: string;
  lastname: string;
  phone: string;
  email?: string;
  paymentMethod: "transfer" | "cash";
  total: number;
  cart: CartItem[];
}

export async function createOrder(data: CheckoutData) {
  try {
    // 1. Iniciamos una TRANSACCIÓN (Atomicidad)
    // Esto asegura que se cree la orden Y se descuente el stock al mismo tiempo.
    // Si falla uno, se cancela todo.
    const result = await prisma.$transaction(async (tx) => {
      
      // A. Validar Stock (Paso crítico)
      for (const item of data.cart) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.id },
        });

        if (!variant) {
          throw new Error(`El producto con ID ${item.id} no existe.`);
        }

        if (variant.stock < item.quantity) {
          throw new Error(`Stock insuficiente para el producto (ID: ${item.id}). Solo quedan ${variant.stock}.`);
        }
      }

      // B. Crear la Orden
      const order = await tx.order.create({
        data: {
          total: data.total,
          status: "PENDIENTE_PAGO",
          
          // userId es opcional. Si tuviéramos auth, aquí iría el ID del usuario.
          // Por ahora va null porque son invitados.
          
          // Guardamos los datos de envío/contacto en el JSON
          shippingAddress: {
            name: data.name,
            lastname: data.lastname,
            phone: data.phone,
            email: data.email || "",
            method: data.paymentMethod
          },

          // C. Crear los Renglones (Items)
          items: {
            create: data.cart.map((item) => ({
              variantId: item.id,
              quantity: item.quantity,
              price: item.price, 
            })),
          },
        },
      });

      // D. Descontar el Stock
      for (const item of data.cart) {
        await tx.productVariant.update({
          where: { id: item.id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return order;
    });

    // Éxito: Devolvemos el ID real de la base de datos
    return { success: true, orderId: result.id };

  } catch (error: any) {
    console.error("Error al crear orden:", error);
    return { 
      success: false, 
      message: error.message || "Hubo un error al procesar el pedido." 
    };
  }
}
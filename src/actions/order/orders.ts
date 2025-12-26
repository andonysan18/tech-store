"use server";

import { prisma } from "@/src/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

// --- Actualizar Estado ---
export async function updateOrderStatus(orderId: number, newStatus: OrderStatus) {
  try {
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true }
      });

      if (!order) throw new Error("Pedido no encontrado");

      // Si se cancela, devolvemos stock
      if (newStatus === OrderStatus.CANCELADO && order.status !== OrderStatus.CANCELADO) {
        for (const item of order.items) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { increment: item.quantity } }
          });
        }
      }

      // Si se reactiva (de cancelado a otro), quitamos stock
      if (order.status === OrderStatus.CANCELADO && newStatus !== OrderStatus.CANCELADO) {
         for (const item of order.items) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } }
          });
        }
      }

      await tx.order.update({
        where: { id: orderId },
        data: { status: newStatus },
      });
    });

    revalidatePath("/admin/orders"); 
    revalidatePath(`/admin/orders/${orderId}`);
    
    return { success: true, message: "Estado actualizado" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error al actualizar" };
  }
}

// --- Eliminar Item (Con limpieza automática de pedido) ---
export async function removeOrderItem(orderId: number, itemId: number) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Datos del item
      const item = await tx.orderItem.findUnique({
        where: { id: itemId },
      });

      if (!item) throw new Error("El item no existe");

      // 2. Devolver Stock
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { increment: item.quantity } }
      });

      // 3. Borrar Item
      await tx.orderItem.delete({
        where: { id: itemId }
      });

      // 4. VERIFICAR SI QUEDAN ITEMS
      const remainingItems = await tx.orderItem.count({
        where: { orderId: orderId }
      });

      if (remainingItems === 0) {
        // SI NO QUEDA NADA -> ELIMINAR PEDIDO
        await tx.order.delete({
          where: { id: orderId }
        });
        return { action: "order_deleted" };
      } else {
        // SI QUEDAN COSAS -> ACTUALIZAR TOTAL
        const amountToSubtract = Number(item.price) * item.quantity;
        await tx.order.update({
          where: { id: orderId },
          data: { total: { decrement: amountToSubtract } }
        });
        return { action: "item_deleted" };
      }
    });

    revalidatePath("/admin/orders");
    
    // Solo revalidamos el detalle si el pedido sigue vivo
    if (result.action === "item_deleted") {
      revalidatePath(`/admin/orders/${orderId}`);
    }

    return { success: true, action: result.action };

  } catch (error) {
    console.error(error);
    return { success: false, message: "Error al eliminar" };
  }
}
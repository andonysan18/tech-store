"use server";

import { prisma } from "@/src/lib/prisma";
import { RepairStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateRepairStatus(
  ticketId: string, 
  newStatus: RepairStatus, 
  note: string,
  newCost?: number
) {
  try {
    await prisma.$transaction(async (tx) => {
      // 1. Actualizamos el Ticket Principal
      await tx.repairTicket.update({
        where: { id: ticketId },
        data: { 
            status: newStatus,
            // Si mandamos costo, actualizamos el costo final o estimado
            ...(newCost !== undefined && { finalCost: newCost })
        },
      });

      // 2. Creamos el LOG (Historial)
      await tx.repairLog.create({
        data: {
            ticketId: ticketId,
            status: newStatus,
            note: note || `Cambio de estado a ${newStatus.replace(/_/g, " ")}`
        }
      });
    });

    revalidatePath("/admin/repairs");
    revalidatePath(`/admin/repairs/${ticketId}`);
    
    return { success: true, message: "Ticket actualizado correctamente" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error al actualizar ticket" };
  }
}
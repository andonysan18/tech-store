"use server";

import { prisma } from "@/src/lib/db";

export async function getRepairStatus(trackingCode: string) {
  try {
    if (!trackingCode) return { success: false, message: "Ingresa un código" };

    const ticket = await prisma.repairTicket.findUnique({
      where: { trackingCode: trackingCode.trim() },
      include: {
        logs: {
          orderBy: { createdAt: 'desc' } // Traemos el historial ordenado
        }
      }
    });

    if (!ticket) {
      return { success: false, message: "No encontramos una reparación con ese código." };
    }

    return { success: true, ticket };

  } catch (error) {
    console.error(error);
    return { success: false, message: "Error al buscar el estado." };
  }
}
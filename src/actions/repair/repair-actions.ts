"use server";

// ⚠️ Asegúrate que esta ruta sea correcta. Antes usabas "@/src/lib/prisma"
// Si tu archivo se llama db.ts, déjalo así. Si es prisma.ts, cámbialo.
import { prisma } from "@/src/lib/db"; 

export async function getRepairStatus(trackingCode: string) {
  try {
    if (!trackingCode) return { success: false, message: "Ingresa un código" };

    // 1. Buscamos el ticket "crudo" (Raw) de la base de datos
    const ticketRaw = await prisma.repairTicket.findUnique({
      where: { trackingCode: trackingCode.trim() },
      include: {
        logs: {
          orderBy: { createdAt: 'desc' } // Traemos el historial ordenado
        }
      }
    });

    if (!ticketRaw) {
      return { success: false, message: "No encontramos una reparación con ese código." };
    }

    // 2. 🛡️ CORRECCIÓN AQUÍ: "Aplanamos" los objetos Decimal
    // Convertimos estimatedCost y finalCost a números de JavaScript
    const ticket = {
      ...ticketRaw,
      estimatedCost: ticketRaw.estimatedCost?.toNumber() ?? null,
      finalCost: ticketRaw.finalCost?.toNumber() ?? null,
    };

    // 3. Devolvemos el ticket limpio
    return { success: true, ticket };

  } catch (error) {
    console.error(error);
    return { success: false, message: "Error al buscar el estado." };
  }
}
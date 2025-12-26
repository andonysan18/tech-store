"use server";

import { prisma } from "@/src/lib/db";

// Función auxiliar para generar códigos cortos y legibles
// Evitamos letras confusas como O, 0, I, 1
function generateTrackingCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; 
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `REP-${result}`; // Ej: REP-X9J2M4
}

export async function createRepairTicket(data: {
  deviceModel: string;
  issueDescription: string;
  contactPhone: string;
  email?: string; // Recibimos el email opcional
}) {
  try {
    // Generamos el código nosotros mismos
    const code = generateTrackingCode();

    const ticket = await prisma.repairTicket.create({
      data: {
        trackingCode: code,
        deviceModel: data.deviceModel,
        issueDescription: data.issueDescription,
        contactPhone: data.contactPhone,
        
        // 🔥 CAMBIO AGREGADO: Guardamos el email en las notas internas
        // Si hay email, lo guardamos. Si no, queda null.
        internalNotes: data.email ? `${data.email}` : null,

        status: "PENDIENTE",
        logs: {
            create: {
                status: "PENDIENTE",
                note: "Solicitud de reparación creada vía web."
            }
        }
      },
    });

    return { success: true, trackingCode: ticket.trackingCode };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error al crear la solicitud." };
  }
}
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// 1. Tu utilidad original para clases (Tailwind)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 2. NUEVO: Formateador de Precio (ARS, USD, PEN, etc.)
export function formatPrice(amount: number | string | object) {
  // Prisma a veces devuelve objetos Decimal o strings, aseguramos que sea número
  const price = Number(amount); 

  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS", // 👈 Cambia a "USD" o "PEN" si lo necesitas
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

// 3. NUEVO: Formateador de Fecha corta
export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }); // Devuelve: 25/12/2023
}

// 4. NUEVO: Formateador de Fecha con Hora (útil para Logs de reparaciones)
export function formatDateTime(date: Date | string) {
  return new Date(date).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }); // Devuelve: 25/12/2023 14:30
}
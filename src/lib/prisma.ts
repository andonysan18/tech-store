import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // 👇 Esto es opcional: si quieres ver las consultas SQL en tu terminal, descomenta la línea de abajo
    // log: ['query'], 
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
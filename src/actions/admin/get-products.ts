'use server'

import { prisma } from "@/src/lib/db"
import { Prisma } from "@prisma/client"

export async function getProducts({
  query = '',
  page = 1,
  limit = 10
}: {
  query?: string
  page?: number
  limit?: number
}) {
  const skip = (page - 1) * limit

  // Filtro de búsqueda
  const where: Prisma.ProductWhereInput = query
    ? {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { brand: { name: { contains: query, mode: 'insensitive' } } },
          { category: { name: { contains: query, mode: 'insensitive' } } },
        ],
      }
    : {}

  try {
    // 1. Ejecutamos consultas en paralelo (Raw Data + Total)
    const [rawProducts, total] = await Promise.all([
      prisma.product.findMany({
        where,
        take: limit,
        skip,
        include: {
          brand: true,
          category: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ])

    // 2. 🔥 CONVERSIÓN CRÍTICA: Decimal -> Number
    // Esto evita el error de "Decimal objects are not supported"
    const products = rawProducts.map((product) => ({
      ...product,
      price: product.price.toNumber(), 
    }))

    return {
      products,
      metadata: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    }
  } catch (error) {
    console.error("Error obteniendo productos:", error)
    return { products: [], metadata: { total: 0, page: 1, totalPages: 0 } }
  }
}
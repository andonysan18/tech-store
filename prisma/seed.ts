// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando el seed...')

  // 1. Limpiar la base de datos (opcional, para no duplicar si corres el seed varias veces)
  // OJO: Esto borra datos, úsalo con cuidado en producción.
  // await prisma.orderItem.deleteMany()
  // await prisma.order.deleteMany()
  // await prisma.product.deleteMany()
  // await prisma.brand.deleteMany()
  // await prisma.category.deleteMany()

  // 2. Crear CATEGORÍAS
  const categorias = [
    { name: 'Celulares', slug: 'celulares', imageUrl: 'https://placehold.co/400x400/png' },
    { name: 'Consolas', slug: 'consolas', imageUrl: 'https://placehold.co/400x400/png' },
    { name: 'Laptops', slug: 'laptops', imageUrl: 'https://placehold.co/400x400/png' },
    { name: 'Accesorios', slug: 'accesorios', imageUrl: 'https://placehold.co/400x400/png' },
    { name: 'Audio', slug: 'audio', imageUrl: 'https://placehold.co/400x400/png' },
  ]

  for (const cat of categorias) {
    // upsert crea si no existe, o actualiza si ya existe (basado en el campo único 'slug')
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }

  // 3. Crear MARCAS
  const marcas = [
    { name: 'Apple', slug: 'apple', imageUrl: 'https://placehold.co/200x200/png' },
    { name: 'Samsung', slug: 'samsung', imageUrl: 'https://placehold.co/200x200/png' },
    { name: 'Sony', slug: 'sony', imageUrl: 'https://placehold.co/200x200/png' },
    { name: 'Xiaomi', slug: 'xiaomi', imageUrl: 'https://placehold.co/200x200/png' },
    { name: 'Nintendo', slug: 'nintendo', imageUrl: 'https://placehold.co/200x200/png' },
  ]

  for (const brand of marcas) {
    await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: {},
      create: brand,
    })
  }

  // 4. Crear un USUARIO ADMIN (Tú)
  // Nota: En un caso real, la contraseña debería estar hasheada (encriptada).
  // Para este seed inicial de desarrollo, la pondremos simple, pero recuerda esto.
  await prisma.user.upsert({
    where: { email: 'admin@techstore.com' },
    update: {},
    create: {
      email: 'admin@techstore.com',
      name: 'Admin Principal',
      password: 'password123', // ⚠️ CAMBIAR POR HASH EN PRODUCCIÓN
      role: 'ADMIN',
    },
  })

  console.log('✅ Seed completado con éxito.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
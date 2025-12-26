// Archivo: prisma/seed.ts

import { PrismaClient, Role, ProductCondition, OrderStatus, RepairStatus } from '@prisma/client'
import bcrypt from 'bcryptjs' // Asegúrate de tener instalado bcryptjs

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando el seed de la base de datos...')

  // ----------------------------------------------------------------------
  // 1. LIMPIEZA DE BASE DE DATOS (Orden Importante)
  // ----------------------------------------------------------------------
  await prisma.repairLog.deleteMany()
  await prisma.repairTicket.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.cart.deleteMany()
  await prisma.review.deleteMany()
  
  await prisma.productVariant.deleteMany()
  await prisma.product.deleteMany()
  
  await prisma.category.deleteMany()
  await prisma.brand.deleteMany()
  await prisma.address.deleteMany()
  await prisma.user.deleteMany()

  console.log('🗑️ Base de datos limpiada.')

  // ----------------------------------------------------------------------
  // 2. CREAR USUARIOS (ADMIN PRINCIPAL)
  // ----------------------------------------------------------------------
  
  // 🔥 Contraseña común para todos
  const passwordRaw = "admin123";
  const passwordHash = await bcrypt.hash(passwordRaw, 10);

  // ADMIN PRINCIPAL
  const admin = await prisma.user.create({
    data: {
      email: 'admin@techstore.com', // 👈 ESTE ES TU USUARIO ADMIN
      name: 'Super Admin',
      password: passwordHash,       // 👈 LA CONTRASEÑA ES "admin123"
      role: Role.ADMIN,
    },
  })

  // CLIENTE DE PRUEBA
  const client = await prisma.user.create({
    data: {
      email: 'cliente@gmail.com',
      name: 'Juan Pérez',
      password: passwordHash,       // También usa "admin123"
      role: Role.CLIENT,
      phone: '11-5555-6666',
      addresses: {
        create: {
          street: 'Av. Siempre Viva 742',
          city: 'Springfield',
          state: 'Buenos Aires',
          zipCode: '1663',
          country: 'Argentina',
          isDefault: true
        }
      }
    },
    include: { addresses: true }
  })

  console.log('👤 Usuarios creados.')

  // ----------------------------------------------------------------------
  // 3. MARCAS Y CATEGORÍAS
  // ----------------------------------------------------------------------
  // Nota: Agregamos /png a las marcas también por seguridad
  const apple = await prisma.brand.create({ data: { name: 'Apple', slug: 'apple', imageUrl: 'https://placehold.co/100x100/png?text=Apple' } })
  const samsung = await prisma.brand.create({ data: { name: 'Samsung', slug: 'samsung', imageUrl: 'https://placehold.co/100x100/png?text=Samsung' } })
  const sony = await prisma.brand.create({ data: { name: 'Sony', slug: 'sony', imageUrl: 'https://placehold.co/100x100/png?text=Sony' } })
  const nintendo = await prisma.brand.create({ data: { name: 'Nintendo', slug: 'nintendo', imageUrl: 'https://placehold.co/100x100/png?text=Nintendo' } })
  const dell = await prisma.brand.create({ data: { name: 'Dell', slug: 'dell', imageUrl: 'https://placehold.co/100x100/png?text=Dell' } })
  const logitech = await prisma.brand.create({ data: { name: 'Logitech', slug: 'logitech', imageUrl: 'https://placehold.co/100x100/png?text=Logitech' } })
  const kingston = await prisma.brand.create({ data: { name: 'Kingston', slug: 'kingston', imageUrl: 'https://placehold.co/100x100/png?text=Kingston' } })
  const jbl = await prisma.brand.create({ data: { name: 'JBL', slug: 'jbl', imageUrl: 'https://placehold.co/100x100/png?text=JBL' } })
  const asus = await prisma.brand.create({ data: { name: 'Asus', slug: 'asus', imageUrl: 'https://placehold.co/100x100/png?text=Asus' } })

  const catCelulares = await prisma.category.create({ data: { name: 'Celulares', slug: 'celulares' } })
  const catConsolas = await prisma.category.create({ data: { name: 'Consolas', slug: 'consolas' } })
  const catAudio = await prisma.category.create({ data: { name: 'Audio', slug: 'audio' } })
  const catComputacion = await prisma.category.create({ data: { name: 'Computación', slug: 'computacion' } })
  const catPerifericos = await prisma.category.create({ data: { name: 'Periféricos', slug: 'perifericos' } })
  const catAlmacenamiento = await prisma.category.create({ data: { name: 'Almacenamiento', slug: 'almacenamiento' } })
  const catComponentes = await prisma.category.create({ data: { name: 'Componentes PC', slug: 'componentes-pc' } })

  // ----------------------------------------------------------------------
  // 4. PRODUCTOS (Con arreglo de imágenes)
  // ----------------------------------------------------------------------
  
  const productsData = [
    // --- CELULARES ---
    {
      name: 'iPhone 14 Pro Max',
      slug: 'iphone-14-pro-max',
      description: 'El iPhone más potente con chip A16 Bionic.',
      brandId: apple.id,
      categoryId: catCelulares.id,
      isFeatured: true,
      discount: 5,
      specs: { screen: '6.7 OLED', camera: '48MP', cpu: 'A16' },
      variants: [
        { sku: 'IP14PM-PUR-256', price: 1200, stock: 10, color: 'Deep Purple', storage: '256GB', condition: ProductCondition.NEW },
        { sku: 'IP14PM-BLK-512', price: 1400, stock: 5, color: 'Space Black', storage: '512GB', condition: ProductCondition.NEW }
      ]
    },
    {
      name: 'Samsung Galaxy S23 Ultra',
      slug: 'samsung-s23-ultra',
      description: 'Cámara épica de 200MP y S-Pen integrado.',
      brandId: samsung.id,
      categoryId: catCelulares.id,
      isFeatured: true,
      specs: { screen: '6.8 AMOLED', camera: '200MP', cpu: 'Snapdragon 8 Gen 2' },
      variants: [
        { sku: 'S23U-GRN-512', price: 1150, stock: 8, color: 'Green', storage: '512GB', condition: ProductCondition.NEW },
        { sku: 'S23U-BLK-256', price: 1000, stock: 12, color: 'Phantom Black', storage: '256GB', condition: ProductCondition.NEW }
      ]
    },
    {
      name: 'iPhone 11 (Reacondicionado)',
      slug: 'iphone-11-refurb',
      description: 'Clásico, funcional y económico. Batería al 90%.',
      brandId: apple.id,
      categoryId: catCelulares.id,
      isFeatured: false,
      discount: 25,
      specs: { screen: '6.1 LCD', camera: '12MP' },
      variants: [
        { sku: 'IP11-RED-64-REF', price: 350, stock: 4, color: 'Product Red', storage: '64GB', condition: ProductCondition.REFURBISHED },
        { sku: 'IP11-WHT-128-REF', price: 390, stock: 2, color: 'White', storage: '128GB', condition: ProductCondition.REFURBISHED }
      ]
    },
    {
      name: 'Samsung Galaxy A54 5G',
      slug: 'samsung-a54',
      description: 'La mejor gama media del mercado con resistencia al agua.',
      brandId: samsung.id,
      categoryId: catCelulares.id,
      isFeatured: false,
      discount: 10,
      specs: { screen: '6.4 Super AMOLED', camera: '50MP' },
      variants: [
        { sku: 'SAM-A54-LIME', price: 450, stock: 20, color: 'Awesome Lime', storage: '128GB', condition: ProductCondition.NEW }
      ]
    },

    // --- COMPUTACIÓN ---
    {
      name: 'MacBook Air M2',
      slug: 'macbook-air-m2',
      description: 'Super delgada. Super rápida. Silenciosa.',
      brandId: apple.id,
      categoryId: catComputacion.id,
      isFeatured: true,
      specs: { screen: '13.6 Liquid Retina', cpu: 'M2', ram: '8GB' },
      variants: [
        { sku: 'MBA-M2-MID', price: 1199, stock: 7, color: 'Midnight', storage: '256GB', condition: ProductCondition.NEW },
        { sku: 'MBA-M2-SIL', price: 1199, stock: 5, color: 'Silver', storage: '256GB', condition: ProductCondition.NEW }
      ]
    },
    {
      name: 'Dell XPS 13 Plus',
      slug: 'dell-xps-13-plus',
      description: 'Potencia y elegancia en Windows con pantalla OLED.',
      brandId: dell.id,
      categoryId: catComputacion.id,
      isFeatured: false,
      specs: { screen: '13.4 OLED', cpu: 'i7 12th Gen', ram: '16GB' },
      variants: [
        { sku: 'DELL-XPS13-BLK', price: 1450, stock: 3, color: 'Graphite', storage: '512GB', condition: ProductCondition.NEW }
      ]
    },

    // --- CONSOLAS ---
    {
      name: 'PlayStation 5 Standard',
      slug: 'ps5-standard',
      description: 'Juega sin límites. Edición con lector de discos.',
      brandId: sony.id,
      categoryId: catConsolas.id,
      isFeatured: true,
      discount: 15,
      specs: { resolution: '4K', fps: '120Hz' },
      variants: [
        { sku: 'SONY-PS5-STD', price: 799, stock: 15, color: 'White', condition: ProductCondition.NEW }
      ]
    },
    {
      name: 'Nintendo Switch OLED',
      slug: 'nintendo-switch-oled',
      description: 'Pantalla OLED vibrante de 7 pulgadas.',
      brandId: nintendo.id,
      categoryId: catConsolas.id,
      isFeatured: true,
      specs: { screen: '7 OLED', mode: 'Handheld/TV' },
      variants: [
        { sku: 'NSW-OLED-WHT', price: 349, stock: 25, color: 'White Joy-Con', storage: '64GB', condition: ProductCondition.NEW },
        { sku: 'NSW-OLED-NEON', price: 349, stock: 10, color: 'Neon Red/Blue', storage: '64GB', condition: ProductCondition.NEW }
      ]
    },

    // --- AUDIO ---
    {
      name: 'Sony WH-1000XM5',
      slug: 'sony-wh1000xm5',
      description: 'La mejor cancelación de ruido del mercado.',
      brandId: sony.id,
      categoryId: catAudio.id,
      isFeatured: true,
      discount: 20,
      specs: { type: 'Over-Ear', battery: '30h' },
      variants: [
        { sku: 'SONY-XM5-BLK', price: 399, stock: 10, color: 'Black', condition: ProductCondition.NEW },
        { sku: 'SONY-XM5-SIL', price: 399, stock: 8, color: 'Silver', condition: ProductCondition.NEW }
      ]
    },
    {
      name: 'AirPods Pro (2da Gen)',
      slug: 'apple-airpods-pro-2',
      description: 'Audio espacial y cancelación activa.',
      brandId: apple.id,
      categoryId: catAudio.id,
      isFeatured: false,
      specs: { type: 'In-Ear', chip: 'H2' },
      variants: [
        { sku: 'APP2-WHT', price: 249, stock: 30, color: 'White', condition: ProductCondition.NEW }
      ]
    },

    // --- PERIFÉRICOS ---
    {
      name: 'Logitech MX Master 3S',
      slug: 'logitech-mx-master-3s',
      description: 'El mouse definitivo para productividad y creadores.',
      brandId: logitech.id,
      categoryId: catPerifericos.id,
      isFeatured: true,
      discount: 10,
      specs: { dpi: '8000', connectivity: 'Bluetooth/Bolt' },
      variants: [
        { sku: 'LOG-MX3S-GRPH', price: 99, stock: 20, color: 'Graphite', condition: ProductCondition.NEW }
      ]
    },
    {
      name: 'Teclado Mecánico Logitech G Pro',
      slug: 'logitech-g-pro-keyboard',
      description: 'Teclado TKL compacto para eSports.',
      brandId: logitech.id,
      categoryId: catPerifericos.id,
      isFeatured: false,
      specs: { switch: 'GX Blue Clicky', rgb: 'Lightsync' },
      variants: [
        { sku: 'LOG-GPRO-KB', price: 129, stock: 8, color: 'Black', condition: ProductCondition.NEW }
      ]
    },
    // --- COMPONENTES ---
    {
      name: 'SSD Kingston A400',
      slug: 'kingston-ssd-a400',
      description: 'Revive tu PC vieja con velocidad SSD.',
      brandId: kingston.id,
      categoryId: catAlmacenamiento.id,
      isFeatured: false,
      specs: { interface: 'SATA 3', speed: '500MB/s' },
      variants: [
        { sku: 'KNG-SSD-240', price: 25, stock: 50, storage: '240GB', condition: ProductCondition.NEW },
        { sku: 'KNG-SSD-480', price: 35, stock: 40, storage: '480GB', condition: ProductCondition.NEW },
        { sku: 'KNG-SSD-960', price: 60, stock: 20, storage: '960GB', condition: ProductCondition.NEW }
      ]
    },
    {
      name: 'Asus GeForce RTX 4060',
      slug: 'asus-rtx-4060',
      description: 'La tarjeta gráfica ideal para jugar en 1080p.',
      brandId: asus.id,
      categoryId: catComponentes.id,
      isFeatured: true,
      discount: 5,
      specs: { vram: '8GB GDDR6', dlss: '3.0' },
      variants: [
        { sku: 'ASUS-4060-DUAL', price: 320, stock: 4, condition: ProductCondition.NEW }
      ]
    }
  ]

  // --- BUCLE DE CREACIÓN ---
  for (const product of productsData) {
    const { variants, ...productInfo } = product
    
    await prisma.product.create({
      data: {
        ...productInfo,
        variants: {
          create: variants.map(v => ({
            ...v,
            // 🔥 SOLUCIÓN DE IMÁGENES: Agregamos /png para evitar error SVG
            images: [`https://placehold.co/600x400/png?text=${productInfo.name.replace(/ /g, '+')}`]
          }))
        }
      }
    })
  }

  console.log(`🔥 Se han cargado ${productsData.length} productos base al catálogo.`)

  // ----------------------------------------------------------------------
  // 6. ORDER DE PRUEBA
  // ----------------------------------------------------------------------
  const variantToBuy = await prisma.productVariant.findUnique({
    where: { sku: 'IP14PM-PUR-256' }
  })

  if (variantToBuy && client.addresses.length > 0) {
    const address = client.addresses[0]

    await prisma.order.create({
      data: {
        userId: client.id,
        total: variantToBuy.price,
        status: OrderStatus.PAGADO,
        shippingAddress: {
          street: address.street,
          city: address.city,
          zip: address.zipCode,
          country: address.country
        },
        items: {
          create: [
            {
              variantId: variantToBuy.id,
              quantity: 1,
              price: variantToBuy.price
            }
          ]
        }
      }
    })
    console.log('🛒 Orden de prueba creada.')
  }

  // ----------------------------------------------------------------------
  // 7. TICKET DE REPARACIÓN
  // ----------------------------------------------------------------------
  const ticket = await prisma.repairTicket.create({
    data: {
      deviceModel: 'Samsung S20 FE',
      issueDescription: 'Pantalla rota, no da imagen',
      userId: client.id,
      status: RepairStatus.EN_DIAGNOSTICO,
      serialNumber: 'S20-XYZ-123',
      logs: {
        create: [
          { status: RepairStatus.PENDIENTE, note: 'Equipo recibido en mostrador' },
          { status: RepairStatus.EN_DIAGNOSTICO, note: 'Técnico asignado: Pedro' }
        ]
      }
    }
  })
  
  console.log(`🔧 Ticket creado: ${ticket.trackingCode}`)
  console.log('------------------------------------------------')
  console.log('✅ Seed finalizado con éxito.')
  console.log('🔑 CREDENCIALES ADMIN:')
  console.log('   Email:    admin@techstore.com')
  console.log('   Pass:     admin123')
  console.log('------------------------------------------------')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
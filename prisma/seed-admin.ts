const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // 1. Configura aquí los datos de tu admin
  const email = 'admin@techstore.com';
  const password = 'admin123'; // La contraseña que usarás para entrar
  const name = 'Super Admin';

  // 2. Encriptamos la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Crear o Actualizar el usuario (Upsert)
  const user = await prisma.user.upsert({
    where: { email },
    update: {}, // Si existe, no hace nada
    create: {
      email,
      name,
      password: hashedPassword,
      role: 'ADMIN', // 🔥 Importante: Rol ADMIN
    },
  });

  console.log(`✅ Usuario Admin creado: ${user.email} / Pass: ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
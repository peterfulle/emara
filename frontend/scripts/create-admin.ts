import { prisma } from '../lib/prisma';
import { hashPassword } from '../lib/auth/server';

async function main() {
  console.log('🔐 Creando usuario administrador...');

  const email = 'admin@emara.cl';
  const password = 'Admin123!';
  const name = 'Administrador';

  // Verificar si ya existe
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    console.log('❌ El usuario ya existe');
    return;
  }

  // Crear usuario
  const hashedPassword = await hashPassword(password);
  
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: 'superadmin',
      active: true
    }
  });

  console.log('✅ Usuario creado exitosamente:');
  console.log('   Email:', email);
  console.log('   Password:', password);
  console.log('   ID:', user.id);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

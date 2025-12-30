import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  {
    sku: 'POLO-BLK-001',
    name: 'Polera Básica Negra',
    description: 'Polera de algodón 100% premium. Corte clásico y cómodo, perfecta para el día a día. Cuello redondo y manga corta.',
    price: 19990,
    salePrice: 14990,
    stock: 50,
    category: 'Poleras',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80'
    ]),
    sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL', 'XXL']),
    colors: JSON.stringify(['Negro', 'Blanco', 'Gris']),
    active: true,
    featured: true
  },
  {
    sku: 'JEAN-BLU-001',
    name: 'Jeans Clásicos Azul',
    description: 'Jeans de mezclilla 100% algodón. Corte recto, cintura media. Diseño atemporal y versátil.',
    price: 39990,
    salePrice: 29990,
    stock: 35,
    category: 'Pantalones',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
      'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=800&q=80',
      'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800&q=80'
    ]),
    sizes: JSON.stringify(['28', '30', '32', '34', '36', '38']),
    colors: JSON.stringify(['Azul Oscuro', 'Azul Claro', 'Negro']),
    active: true,
    featured: true
  },
  {
    sku: 'SWTR-GRY-001',
    name: 'Sweater Oversize Gris',
    description: 'Sweater de lana suave con corte oversize. Perfecto para los días fríos. Cuello redondo.',
    price: 34990,
    salePrice: null,
    stock: 28,
    category: 'Sweaters',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80'
    ]),
    sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
    colors: JSON.stringify(['Gris', 'Beige', 'Negro', 'Crema']),
    active: true,
    featured: true
  },
  {
    sku: 'VEST-BLK-001',
    name: 'Vestido Negro Elegante',
    description: 'Vestido midi de tela suave. Corte ajustado en la cintura. Ideal para ocasiones especiales o uso casual elegante.',
    price: 49990,
    salePrice: 39990,
    stock: 20,
    category: 'Vestidos',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80',
      'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80'
    ]),
    sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']),
    colors: JSON.stringify(['Negro', 'Azul Marino', 'Vino']),
    active: true,
    featured: true
  },
  {
    sku: 'JCKT-DNM-001',
    name: 'Chaqueta Denim Clásica',
    description: 'Chaqueta de mezclilla con lavado vintage. Corte clásico con bolsillos frontales. Un básico imprescindible.',
    price: 44990,
    salePrice: null,
    stock: 25,
    category: 'Chaquetas',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
      'https://images.unsplash.com/photo-1601333144130-8cbb312386b6?w=800&q=80',
      'https://images.unsplash.com/photo-1543076659-9380cdf10613?w=800&q=80'
    ]),
    sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
    colors: JSON.stringify(['Azul Denim', 'Negro', 'Azul Claro']),
    active: true,
    featured: false
  },
  {
    sku: 'BLUS-WHT-001',
    name: 'Blusa Blanca Elegante',
    description: 'Blusa de seda sintética premium. Manga larga con puños. Perfecta para looks formales o casual chic.',
    price: 29990,
    salePrice: 24990,
    stock: 32,
    category: 'Blusas',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1564257577226-cd88f9df8e93?w=800&q=80',
      'https://images.unsplash.com/photo-1623119082392-3e6e9d8b9a3e?w=800&q=80',
      'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&q=80'
    ]),
    sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']),
    colors: JSON.stringify(['Blanco', 'Negro', 'Beige', 'Azul']),
    active: true,
    featured: false
  },
  {
    sku: 'PANT-CHN-001',
    name: 'Pantalones Chinos Beige',
    description: 'Pantalones chinos de algodón premium. Corte slim fit. Versátiles y cómodos para cualquier ocasión.',
    price: 32990,
    salePrice: null,
    stock: 40,
    category: 'Pantalones',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80',
      'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80',
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80'
    ]),
    sizes: JSON.stringify(['28', '30', '32', '34', '36', '38']),
    colors: JSON.stringify(['Beige', 'Negro', 'Azul Marino', 'Gris']),
    active: true,
    featured: false
  },
  {
    sku: 'HDIE-BLK-001',
    name: 'Hoodie Negro Premium',
    description: 'Sudadera con capucha de algodón premium. Interior afelpado súper suave. Ajuste cómodo y urbano.',
    price: 39990,
    salePrice: 34990,
    stock: 45,
    category: 'Sweaters',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
      'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=800&q=80',
      'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=800&q=80'
    ]),
    sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
    colors: JSON.stringify(['Negro', 'Gris', 'Azul Marino', 'Crema']),
    active: true,
    featured: true
  },
  {
    sku: 'SKRT-PLT-001',
    name: 'Falda Plisada Midi',
    description: 'Falda midi plisada de poliéster suave. Cintura alta elástica. Elegante y femenina.',
    price: 27990,
    salePrice: 22990,
    stock: 18,
    category: 'Faldas',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=80',
      'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&q=80',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80'
    ]),
    sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']),
    colors: JSON.stringify(['Negro', 'Beige', 'Vino', 'Verde Oliva']),
    active: true,
    featured: false
  },
  {
    sku: 'COAT-WNT-001',
    name: 'Abrigo Largo Camel',
    description: 'Abrigo largo de lana blend. Corte elegante y atemporal. Perfecto para el invierno con mucho estilo.',
    price: 79990,
    salePrice: 59990,
    stock: 15,
    category: 'Abrigos',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80',
      'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=800&q=80',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80'
    ]),
    sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
    colors: JSON.stringify(['Camel', 'Negro', 'Gris']),
    active: true,
    featured: true
  },
  {
    sku: 'POLO-STR-001',
    name: 'Polera Rayas Marinera',
    description: 'Polera de algodón con rayas horizontales. Estilo francés atemporal. Cuello redondo.',
    price: 24990,
    salePrice: null,
    stock: 38,
    category: 'Poleras',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80',
      'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80'
    ]),
    sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']),
    colors: JSON.stringify(['Navy/Blanco', 'Negro/Blanco', 'Rojo/Blanco']),
    active: true,
    featured: false
  },
  {
    sku: 'SHRT-LNN-001',
    name: 'Camisa Lino Blanca',
    description: 'Camisa de lino 100% natural. Transpirable y fresca. Perfecta para el verano. Corte relajado.',
    price: 36990,
    salePrice: 29990,
    stock: 22,
    category: 'Camisas',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80',
      'https://images.unsplash.com/photo-1598032895397-b9c37c4b8f4d?w=800&q=80'
    ]),
    sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
    colors: JSON.stringify(['Blanco', 'Beige', 'Azul Cielo']),
    active: true,
    featured: true
  }
];

async function seed() {
  console.log('🌱 Sembrando productos...');

  for (const product of products) {
    try {
      await prisma.product.create({
        data: product
      });
      console.log(`✅ Producto creado: ${product.name} (${product.sku})`);
    } catch (error: any) {
      if (error.code === 'P2002') {
        console.log(`⚠️  Producto ya existe: ${product.sku}`);
      } else {
        console.error(`❌ Error creando ${product.sku}:`, error.message);
      }
    }
  }

  console.log('\n✨ Proceso completado!');
  console.log(`📦 Total de productos en la base de datos: ${await prisma.product.count()}`);
}

seed()
  .catch((e) => {
    console.error('❌ Error en el proceso de seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

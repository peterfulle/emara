import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth/server';

// Helper para verificar autenticación
async function checkAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  const payload = await verifyToken(token);
  
  if (!payload) {
    return null;
  }
  
  return payload;
}

// GET - Listar todos los productos
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const active = searchParams.get('active');

    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { sku: { contains: search } },
        { description: { contains: search } }
      ];
    }
    
    if (category) {
      where.category = category;
    }
    
    if (active !== null && active !== undefined) {
      where.active = active === 'true';
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    );
  }
}

// POST - Crear producto
export async function POST(request: NextRequest) {
  try {
    const auth = await checkAuth(request);
    if (!auth) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const data = await request.json();

    // Validaciones
    if (!data.sku || !data.name || !data.price || !data.category) {
      return NextResponse.json(
        { error: 'Campos requeridos: sku, name, price, category' },
        { status: 400 }
      );
    }

    // Verificar SKU único
    const existingSku = await prisma.product.findUnique({
      where: { sku: data.sku }
    });

    if (existingSku) {
      return NextResponse.json(
        { error: 'El SKU ya existe' },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        sku: data.sku,
        name: data.name,
        description: data.description || null,
        price: parseFloat(data.price),
        salePrice: data.salePrice ? parseFloat(data.salePrice) : null,
        stock: parseInt(data.stock) || 0,
        images: JSON.stringify(data.images || []),
        category: data.category,
        sizes: data.sizes ? JSON.stringify(data.sizes) : null,
        colors: data.colors ? JSON.stringify(data.colors) : null,
        active: data.active !== undefined ? data.active : true,
        featured: data.featured || false
      }
    });

    // Log de actividad
    await prisma.activityLog.create({
      data: {
        userId: auth.userId as string,
        action: 'create',
        entity: 'product',
        entityId: product.id,
        description: `Producto ${product.name} creado`,
        metadata: JSON.stringify({ sku: product.sku })
      }
    });

    return NextResponse.json({
      success: true,
      product
    }, { status: 201 });

  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Error al crear producto' },
      { status: 500 }
    );
  }
}

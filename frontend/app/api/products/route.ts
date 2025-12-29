import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');

    const where: any = {
      active: true, // Solo productos activos
    };

    if (featured === 'true') {
      where.featured = true;
    }

    if (category) {
      where.category = category;
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: [
        { featured: 'desc' }, // Destacados primero
        { createdAt: 'desc' } // Más recientes después
      ],
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json({ products });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Error al obtener productos', details: error.message },
      { status: 500 }
    );
  }
}

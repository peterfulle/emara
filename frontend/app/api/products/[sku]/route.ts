import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sku: string }> }
) {
  try {
    const { sku: skuParam } = await params;
    const sku = skuParam.toUpperCase();

    const product = await prisma.product.findFirst({
      where: {
        sku: sku,
        active: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (error: any) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Error al obtener producto', details: error.message },
      { status: 500 }
    );
  }
}

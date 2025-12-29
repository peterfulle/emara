import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth/server';

async function checkAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7);
  return await verifyToken(token);
}

// GET - Obtener un producto
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product
    });

  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json(
      { error: 'Error al obtener producto' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar producto
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await checkAuth(request);
    if (!auth) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const data = await request.json();

    // Verificar que existe
    const existing = await prisma.product.findUnique({
      where: { id }
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    // Si se cambia el SKU, verificar que no exista
    if (data.sku && data.sku !== existing.sku) {
      const existingSku = await prisma.product.findUnique({
        where: { sku: data.sku }
      });

      if (existingSku) {
        return NextResponse.json(
          { error: 'El SKU ya existe' },
          { status: 400 }
        );
      }
    }

    const updateData: any = {};
    
    if (data.sku) updateData.sku = data.sku;
    if (data.name) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price) updateData.price = parseFloat(data.price);
    if (data.salePrice !== undefined) {
      updateData.salePrice = data.salePrice ? parseFloat(data.salePrice) : null;
    }
    if (data.stock !== undefined) updateData.stock = parseInt(data.stock);
    if (data.images) updateData.images = JSON.stringify(data.images);
    if (data.category) updateData.category = data.category;
    if (data.sizes !== undefined) {
      updateData.sizes = data.sizes ? JSON.stringify(data.sizes) : null;
    }
    if (data.colors !== undefined) {
      updateData.colors = data.colors ? JSON.stringify(data.colors) : null;
    }
    if (data.active !== undefined) updateData.active = data.active;
    if (data.featured !== undefined) updateData.featured = data.featured;

    const product = await prisma.product.update({
      where: { id },
      data: updateData
    });

    // Log de actividad
    await prisma.activityLog.create({
      data: {
        userId: auth.userId as string,
        action: 'update',
        entity: 'product',
        entityId: product.id,
        description: `Producto ${product.name} actualizado`,
        metadata: JSON.stringify({ changes: Object.keys(updateData) })
      }
    });

    return NextResponse.json({
      success: true,
      product
    });

  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { error: 'Error al actualizar producto' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar producto
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await checkAuth(request);
    if (!auth) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    await prisma.product.delete({
      where: { id }
    });

    // Log de actividad
    await prisma.activityLog.create({
      data: {
        userId: auth.userId as string,
        action: 'delete',
        entity: 'product',
        entityId: id,
        description: `Producto ${product.name} eliminado`,
        metadata: JSON.stringify({ sku: product.sku })
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Producto eliminado'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { error: 'Error al eliminar producto' },
      { status: 500 }
    );
  }
}

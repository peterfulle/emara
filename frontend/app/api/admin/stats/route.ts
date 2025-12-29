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

export async function GET(request: NextRequest) {
  try {
    const auth = await checkAuth(request);
    if (!auth) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Obtener estadísticas en paralelo
    const [
      totalProducts,
      activeProducts,
      totalOrders,
      pendingOrders,
      totalCustomers,
      totalRevenue,
      recentOrders
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { active: true } }),
      prisma.order.count(),
      prisma.order.count({ where: { status: 'pending' } }),
      prisma.customer.count(),
      prisma.order.aggregate({
        _sum: {
          total: true
        }
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: true
        }
      })
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        products: {
          total: totalProducts,
          active: activeProducts,
          inactive: totalProducts - activeProducts
        },
        orders: {
          total: totalOrders,
          pending: pendingOrders
        },
        customers: totalCustomers,
        revenue: totalRevenue._sum.total || 0
      },
      recentOrders
    });

  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    );
  }
}

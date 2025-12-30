import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'all';

    let whereCondition: any = {};

    if (status !== 'all') {
      whereCondition.paymentStatus = status;
    }

    const orders = await prisma.order.findMany({
      where: whereCondition,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        customer: {
          select: {
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    // Format orders to match frontend expectations
    const formattedOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerEmail: order.customer.email,
      customerFirstName: order.customer.firstName,
      customerLastName: order.customer.lastName,
      total: order.total,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt
    }));

    return NextResponse.json({ orders: formattedOrders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Error al obtener órdenes' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      orderNumber,
      authorizationCode,
      transactionDate,
      cardNumber,
      responseCode,
      paymentStatus,
      status
    } = body;

    if (!orderNumber) {
      return NextResponse.json(
        { error: 'Order number es requerido' },
        { status: 400 }
      );
    }

    // Buscar la orden por orderNumber
    const order = await prisma.order.findUnique({
      where: { orderNumber }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Orden no encontrada' },
        { status: 404 }
      );
    }

    // Actualizar la orden con los datos de la transacción
    const updatedOrder = await prisma.order.update({
      where: { orderNumber },
      data: {
        authorizationCode,
        transactionDate: transactionDate ? new Date(transactionDate) : null,
        cardNumber,
        responseCode,
        paymentStatus: paymentStatus || order.paymentStatus,
        status: status || order.status,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      order: updatedOrder
    });

  } catch (error) {
    console.error('Update transaction error:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la transacción' },
      { status: 500 }
    );
  }
}

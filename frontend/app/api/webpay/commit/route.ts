import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      token, 
      responseCode, 
      authorizationCode, 
      amount, 
      buyOrder,
      cardNumber,
      transactionDate,
      paymentTypeCode 
    } = body;

    console.log('Webpay commit received:', { 
      token, 
      responseCode, 
      authorizationCode, 
      amount, 
      buyOrder 
    });

    // Buscar la orden por orderNumber
    const order = await prisma.order.findFirst({
      where: { orderNumber: buyOrder }
    });

    if (!order) {
      console.error('Order not found:', buyOrder);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Actualizar la orden con los datos de Webpay
    const paymentStatus = responseCode === 0 ? 'paid' : 'failed';
    const paymentMethod = paymentTypeCode === 'VD' ? 'Redcompra (Débito)' : 
                         paymentTypeCode === 'VN' ? 'Crédito' : 
                         'Webpay Plus';

    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus,
        paymentMethod,
        authorizationCode,
        transactionDate: transactionDate ? new Date(transactionDate) : new Date(),
        cardNumber: cardNumber || null,
        responseCode: responseCode.toString(),
      }
    });

    console.log('Order updated successfully:', {
      orderId: order.id,
      orderNumber: buyOrder,
      paymentStatus,
      authorizationCode
    });

    return NextResponse.json({
      success: true,
      paymentStatus,
      authorizationCode,
      orderId: order.id
    });

  } catch (error: any) {
    console.error('Error in webpay commit:', error);
    return NextResponse.json(
      { error: error.message || 'Error processing payment' },
      { status: 500 }
    );
  }
}

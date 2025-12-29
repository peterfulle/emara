import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Webhook de Mercado Pago recibido:', body);

    // Mercado Pago envía el tipo de notificación
    if (body.type === 'payment') {
      const paymentId = body.data.id;
      
      // Consultar el estado del pago
      const MERCADOPAGO_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;
      
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`
        }
      });

      const payment = await response.json();
      
      // Actualizar orden con el external_reference (orderId)
      if (payment.external_reference) {
        const order = await prisma.order.findUnique({
          where: { id: payment.external_reference }
        });

        if (order) {
          let paymentStatus = 'pending';
          let orderStatus = 'pending';

          if (payment.status === 'approved') {
            paymentStatus = 'paid';
            orderStatus = 'processing';
          } else if (payment.status === 'rejected') {
            paymentStatus = 'failed';
            orderStatus = 'cancelled';
          }

          await prisma.order.update({
            where: { id: order.id },
            data: {
              paymentStatus,
              status: orderStatus,
              metadata: JSON.stringify({
                ...JSON.parse(order.metadata as string || '{}'),
                mercadoPagoPaymentId: paymentId,
                mercadoPagoStatus: payment.status,
                updatedAt: new Date().toISOString()
              })
            }
          });

          console.log(`✅ Orden ${order.orderNumber} actualizada: ${orderStatus}`);
        }
      }
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Error procesando webhook', details: error.message },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, orderNumber, total, items } = body;

    const MERCADOPAGO_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;

    if (!MERCADOPAGO_ACCESS_TOKEN) {
      throw new Error('MERCADOPAGO_ACCESS_TOKEN no configurado');
    }

    // Crear preferencia de pago en Mercado Pago
    const preference = {
      items: items.map((item: any) => ({
        title: item.name,
        description: item.sku,
        quantity: item.quantity,
        unit_price: item.price,
        currency_id: 'CLP'
      })),
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/checkout/success?order=${orderNumber}`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/checkout/failure`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/checkout/pending`
      },
      auto_return: 'approved',
      external_reference: orderId,
      notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mercadopago/webhook`,
      statement_descriptor: 'EMARA',
      payer: {
        email: body.customerEmail || 'customer@emara.cl'
      }
    };

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`
      },
      body: JSON.stringify(preference)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error de Mercado Pago:', errorData);
      throw new Error('Error al crear preferencia de pago');
    }

    const data = await response.json();

    return NextResponse.json({
      preferenceId: data.id,
      initPoint: data.init_point,
      sandboxInitPoint: data.sandbox_init_point
    });

  } catch (error: any) {
    console.error('Error creating MercadoPago preference:', error);
    return NextResponse.json(
      { error: 'Error al crear preferencia de pago', details: error.message },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('Fetching order with ID:', id);
    
    const order = await prisma.order.findUnique({
      where: {
        id
      },
      include: {
        customer: true,
        orderItems: true
      }
    });

    console.log('Order found:', order ? 'Yes' : 'No');
    
    if (!order) {
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
    }

    // Parse shipping address if it's JSON
    let shippingAddressData: any = {};
    try {
      shippingAddressData = JSON.parse(order.shippingAddress);
    } catch (e) {
      console.error('Error parsing shipping address:', e);
    }

    // Format response to match frontend expectations
    const formattedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      customerEmail: order.customer.email,
      customerFirstName: order.customer.firstName,
      customerLastName: order.customer.lastName,
      customerPhone: order.customer.phone || '',
      shippingAddress: shippingAddressData.street || shippingAddressData.address || '',
      shippingCity: shippingAddressData.city || '',
      shippingRegion: shippingAddressData.region || '',
      shippingPostalCode: shippingAddressData.postalCode || '',
      subtotal: order.subtotal,
      shippingCost: order.shipping,
      total: order.total,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      authorizationCode: order.authorizationCode,
      transactionDate: order.transactionDate,
      cardNumber: order.cardNumber,
      responseCode: order.responseCode?.toString(),
      createdAt: order.createdAt,
      items: order.orderItems.map((item: any) => ({
        id: item.id,
        productName: item.name,
        sku: item.sku,
        quantity: item.quantity,
        price: item.price,
        total: item.subtotal
      }))
    };

    return NextResponse.json({ order: formattedOrder });
  } catch (error) {
    console.error('Error fetching order detail:', error);
    return NextResponse.json({ error: 'Error al obtener detalle de orden' }, { status: 500 });
  }
}

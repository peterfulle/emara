import { NextResponse } from 'next/server';
import { getOrdersByEmail, convertMagentoOrderToOrderData } from '@/lib/magento/orders';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    console.log(`📦 API: Fetching orders for email: ${email}`);

    // Obtener órdenes desde Magento con autenticación
    const magentoOrders = await getOrdersByEmail(email);
    
    console.log(`✅ API: Found ${magentoOrders.length} orders in Magento`);

    // Convertir a nuestro formato
    const orders = magentoOrders.map(convertMagentoOrderToOrderData);

    return NextResponse.json({
      success: true,
      orders,
      count: orders.length,
    });
  } catch (error: any) {
    console.error('❌ Error in orders API route:', error);
    
    // Proporcionar más contexto sobre el error
    let errorMessage = 'Failed to fetch orders';
    let statusCode = 500;

    if (error.message.includes('credentials not configured')) {
      errorMessage = 'Server configuration error';
      statusCode = 503;
    } else if (error.message.includes('Failed to get Magento admin token')) {
      errorMessage = 'Authentication failed with Magento';
      statusCode = 503;
    } else if (error.message.includes('Failed to fetch orders')) {
      errorMessage = 'Error connecting to Magento';
      statusCode = 502;
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: statusCode }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      customerData, 
      shippingAddress, 
      billingAddress, 
      items, 
      subtotal, 
      shipping, 
      tax, 
      total 
    } = body;

    // Crear o encontrar cliente
    let customer = await prisma.customer.findUnique({
      where: { email: customerData.email }
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          email: customerData.email,
          phone: customerData.phone || '',
          firstName: customerData.firstName,
          lastName: customerData.lastName,
          rut: customerData.rut || null,
        }
      });
    }

    // Crear dirección de envío
    const shippingAddr = await prisma.address.create({
      data: {
        customerId: customer.id,
        street: shippingAddress.street,
        city: shippingAddress.city,
        region: shippingAddress.region,
        postalCode: shippingAddress.postalCode || '',
        country: shippingAddress.country || 'CL',
        isDefault: false,
      }
    });

    // Generar número de orden
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Crear orden
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod: 'mercadopago',
        subtotal,
        shipping,
        tax,
        total,
        shippingAddress: JSON.stringify(shippingAddress),
        billingAddress: JSON.stringify(billingAddress),
        metadata: JSON.stringify({
          createdAt: new Date().toISOString(),
          ip: request.headers.get('x-forwarded-for') || 'unknown'
        }),
        orderItems: {
          create: items.map((item: any) => ({
            productId: item.productId,
            sku: item.sku,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size || null,
            color: item.color || null,
            subtotal: item.price * item.quantity,
          }))
        }
      },
      include: {
        orderItems: true,
        customer: true,
      }
    });

    return NextResponse.json({ 
      success: true, 
      order,
      orderNumber 
    });

  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Error al crear orden', details: error.message },
      { status: 500 }
    );
  }
}

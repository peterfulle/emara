import { NextResponse } from 'next/server';
import { getOrdersByEmail, convertMagentoOrderToOrderData } from '@/lib/magento/orders';

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

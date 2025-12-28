import { NextRequest, NextResponse } from 'next/server';
import { createMagentoOrder, type CartItem, type CartAddress } from '@/lib/magento/checkout';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, items, shippingAddress, billingAddress } = body;

    // Validar datos requeridos
    if (!email || !items || !shippingAddress || !billingAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Crear orden en Magento
    const order = await createMagentoOrder(
      email,
      items as CartItem[],
      shippingAddress as CartAddress,
      billingAddress as CartAddress
    );

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error: any) {
    console.error('Error in checkout API route:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create order',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

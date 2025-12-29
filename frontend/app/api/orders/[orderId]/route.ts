import { NextRequest, NextResponse } from 'next/server';

const MAGENTO_URL = process.env.NEXT_PUBLIC_MAGENTO_URL || 'http://192.168.100.186';
const MAGENTO_TOKEN = process.env.MAGENTO_ADMIN_TOKEN;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    if (!MAGENTO_TOKEN) {
      return NextResponse.json(
        { error: 'Magento token not configured' },
        { status: 500 }
      );
    }

    // Obtener detalles de la orden desde Magento
    const response = await fetch(`${MAGENTO_URL}/rest/V1/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MAGENTO_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error fetching order');
    }

    const order = await response.json();

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error: any) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch order',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const body = await request.json();
    const { status, state } = body;

    if (!MAGENTO_TOKEN) {
      return NextResponse.json(
        { error: 'Magento token not configured' },
        { status: 500 }
      );
    }

    // Actualizar estado de la orden en Magento
    const response = await fetch(`${MAGENTO_URL}/rest/V1/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MAGENTO_TOKEN}`,
      },
      body: JSON.stringify({
        entity: {
          entity_id: orderId,
          status: status || 'processing',
          state: state || 'processing',
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error updating order');
    }

    const order = await response.json();

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update order',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

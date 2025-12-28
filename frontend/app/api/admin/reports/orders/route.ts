import { NextRequest, NextResponse } from 'next/server';

const MAGENTO_URL = process.env.NEXT_PUBLIC_MAGENTO_URL || 'http://192.168.100.186';
const MAGENTO_TOKEN = process.env.MAGENTO_ADMIN_TOKEN;

export async function GET(request: NextRequest) {
  try {
    if (!MAGENTO_TOKEN) {
      return NextResponse.json(
        { error: 'Magento token not configured' },
        { status: 500 }
      );
    }

    // Obtener todas las órdenes de Magento (últimas 100)
    const searchCriteria = {
      searchCriteria: {
        sortOrders: [
          {
            field: 'created_at',
            direction: 'DESC'
          }
        ],
        pageSize: 100,
        currentPage: 1
      }
    };

    const queryString = new URLSearchParams();
    queryString.append('searchCriteria[sortOrders][0][field]', 'created_at');
    queryString.append('searchCriteria[sortOrders][0][direction]', 'DESC');
    queryString.append('searchCriteria[pageSize]', '100');
    queryString.append('searchCriteria[currentPage]', '1');

    const response = await fetch(`${MAGENTO_URL}/rest/V1/orders?${queryString.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MAGENTO_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Magento API error:', errorText);
      throw new Error('Error fetching orders from Magento');
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      orders: data.items || [],
      total: data.total_count || 0,
    });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch orders',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { WebpayPlus, Options, IntegrationCommerceCodes, IntegrationApiKeys, Environment } from 'transbank-sdk';

const COMMERCE_CODE = '597055555532';
const API_KEY = '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, amount, buyOrder, returnUrl } = body;

    // Validar datos requeridos
    if (!orderId || !amount || !buyOrder) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Crear la transacción con el ambiente de integración
    const tx = new WebpayPlus.Transaction(new Options(COMMERCE_CODE, API_KEY, Environment.Integration));
    
    const sessionId = `session_${orderId}_${Date.now()}`;
    const finalReturnUrl = returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/checkout/webpay/return`;
    
    console.log('Creating Webpay transaction:', {
      buyOrder,
      sessionId,
      amount,
      returnUrl: finalReturnUrl
    });

    const createResponse = await tx.create(
      buyOrder,
      sessionId,
      amount,
      finalReturnUrl
    );

    console.log('Webpay transaction created:', createResponse);

    return NextResponse.json({
      success: true,
      url: createResponse.url,
      token: createResponse.token,
    });
  } catch (error: any) {
    console.error('Error creating Webpay transaction:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create Webpay transaction',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

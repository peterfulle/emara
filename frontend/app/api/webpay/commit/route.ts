import { NextRequest, NextResponse } from 'next/server';
import { WebpayPlus, Options, IntegrationCommerceCodes, IntegrationApiKeys, Environment } from 'transbank-sdk';

const COMMERCE_CODE = '597055555532';
const API_KEY = '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C';
const MAGENTO_URL = process.env.NEXT_PUBLIC_MAGENTO_URL || 'http://192.168.100.186';
const MAGENTO_TOKEN = process.env.MAGENTO_ADMIN_TOKEN;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Crear transacción con el ambiente de integración
    const tx = new WebpayPlus.Transaction(new Options(COMMERCE_CODE, API_KEY, Environment.Integration));

    // Confirmar la transacción con Transbank
    console.log('Committing Webpay transaction with token:', token);
    
    const commitResponse = await tx.commit(token);
    
    console.log('Webpay transaction committed:', commitResponse);

    // Si el pago fue exitoso, actualizar la orden en Magento
    if (commitResponse.response_code === 0) {
      try {
        // Extraer el order ID del buy_order (increment_id)
        const orderNumber = commitResponse.buy_order;
        
        console.log('Payment successful, updating order:', orderNumber);
        
        // Actualizar el estado de la orden en Magento usando el endpoint de comentarios
        if (MAGENTO_TOKEN) {
          // Primero buscar la orden por increment_id para obtener el entity_id
          const searchResponse = await fetch(
            `${MAGENTO_URL}/rest/V1/orders?searchCriteria[filterGroups][0][filters][0][field]=increment_id&searchCriteria[filterGroups][0][filters][0][value]=${orderNumber}&searchCriteria[filterGroups][0][filters][0][conditionType]=eq`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MAGENTO_TOKEN}`,
              },
            }
          );

          if (searchResponse.ok) {
            const searchData = await searchResponse.json();
            if (searchData.items && searchData.items.length > 0) {
              const order = searchData.items[0];
              const entityId = order.entity_id;

              // Agregar comentario de pago exitoso
              await fetch(`${MAGENTO_URL}/rest/V1/orders/${entityId}/comments`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${MAGENTO_TOKEN}`,
                },
                body: JSON.stringify({
                  statusHistory: {
                    comment: `Pago con Webpay Plus exitoso. Código de autorización: ${commitResponse.authorization_code}. Monto: $${commitResponse.amount} CLP`,
                    parent_id: entityId,
                    is_customer_notified: 1,
                    is_visible_on_front: 1,
                    status: 'processing'
                  }
                }),
              });

              console.log('Order updated successfully in Magento');
            }
          }
        }
      } catch (updateError) {
        console.error('Error updating order in Magento:', updateError);
        // No lanzar error, la transacción ya fue exitosa
      }
    } else {
      // Si el pago falló, agregar comentario en Magento
      try {
        const orderNumber = commitResponse.buy_order;
        
        if (MAGENTO_TOKEN) {
          const searchResponse = await fetch(
            `${MAGENTO_URL}/rest/V1/orders?searchCriteria[filterGroups][0][filters][0][field]=increment_id&searchCriteria[filterGroups][0][filters][0][value]=${orderNumber}&searchCriteria[filterGroups][0][filters][0][conditionType]=eq`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MAGENTO_TOKEN}`,
              },
            }
          );

          if (searchResponse.ok) {
            const searchData = await searchResponse.json();
            if (searchData.items && searchData.items.length > 0) {
              const order = searchData.items[0];
              const entityId = order.entity_id;

              await fetch(`${MAGENTO_URL}/rest/V1/orders/${entityId}/comments`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${MAGENTO_TOKEN}`,
                },
                body: JSON.stringify({
                  statusHistory: {
                    comment: `Pago con Webpay Plus rechazado. Código de respuesta: ${commitResponse.response_code}`,
                    parent_id: entityId,
                    is_customer_notified: 0,
                    is_visible_on_front: 0,
                    status: 'canceled'
                  }
                }),
              });
            }
          }
        }
      } catch (updateError) {
        console.error('Error updating failed order in Magento:', updateError);
      }
    }

    return NextResponse.json({
      success: commitResponse.response_code === 0,
      transaction: commitResponse,
    });
  } catch (error: any) {
    console.error('Error confirming Webpay transaction:', error);
    return NextResponse.json(
      { 
        error: 'Failed to confirm Webpay transaction',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

import { magentoClient } from './client';
import { magentoAuthenticatedFetch } from './auth';

interface MagentoOrderItem {
  product_name: string;
  product_sku: string;
  qty_ordered: number;
  price: number;
  row_total: number;
  product_option?: {
    extension_attributes?: {
      custom_options?: Array<{
        option_id: string;
        option_value: string;
      }>;
    };
  };
}

interface MagentoOrder {
  entity_id: string;
  increment_id: string;
  created_at: string;
  status: string;
  state: string;
  grand_total: number;
  subtotal: number;
  shipping_amount: number;
  customer_email: string;
  customer_firstname: string;
  customer_lastname: string;
  billing_address?: {
    firstname: string;
    lastname: string;
    street: string[];
    city: string;
    region: string;
    postcode: string;
    country_id: string;
    telephone: string;
  };
  items: MagentoOrderItem[];
}

/**
 * Obtener órdenes de un usuario por email usando Magento REST API
 * Usa autenticación de admin con token Bearer
 */
export async function getOrdersByEmail(email: string): Promise<MagentoOrder[]> {
  try {
    console.log(`🔍 Fetching orders for email: ${email}`);
    
    // Construir los parámetros de búsqueda
    const searchParams = new URLSearchParams({
      'searchCriteria[filter_groups][0][filters][0][field]': 'customer_email',
      'searchCriteria[filter_groups][0][filters][0][value]': email,
      'searchCriteria[filter_groups][0][filters][0][condition_type]': 'eq',
      'searchCriteria[sortOrders][0][field]': 'created_at',
      'searchCriteria[sortOrders][0][direction]': 'DESC',
    });

    // Hacer petición autenticada
    const response = await magentoAuthenticatedFetch(
      `/rest/V1/orders?${searchParams}`,
      { method: 'GET' }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error fetching orders from Magento:', response.status, errorText);
      throw new Error(`Failed to fetch orders: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Found ${data.items?.length || 0} orders for ${email}`);
    
    return data.items || [];
  } catch (error) {
    console.error('❌ Error getting orders by email:', error);
    throw error;
  }
}

/**
 * Obtener detalles de una orden por su ID usando GraphQL
 */
export async function getOrderById(orderId: string) {
  const query = `
    query {
      customer {
        orders(filter: { number: { eq: "${orderId}" } }) {
          items {
            number
            id
            order_date
            status
            total {
              grand_total {
                value
                currency
              }
              subtotal {
                value
              }
              total_shipping {
                value
              }
            }
            items {
              product_name
              product_sku
              quantity_ordered
              product_sale_price {
                value
              }
              selected_options {
                label
                value
              }
            }
            billing_address {
              firstname
              lastname
              street
              city
              region
              postcode
              country_code
              telephone
            }
            shipping_address {
              firstname
              lastname
              street
              city
              region
              postcode
              country_code
              telephone
            }
          }
        }
      }
    }
  `;

  try {
    const data: any = await magentoClient.request(query);
    return data.customer?.orders?.items?.[0] || null;
  } catch (error) {
    console.error('Error getting order by ID:', error);
    return null;
  }
}

/**
 * Mapear estado de Magento a nuestro formato
 */
export function mapMagentoStatus(status: string): 'pending' | 'processing' | 'completed' | 'cancelled' {
  const statusMap: Record<string, 'pending' | 'processing' | 'completed' | 'cancelled'> = {
    'pending': 'pending',
    'pending_payment': 'pending',
    'processing': 'processing',
    'complete': 'completed',
    'closed': 'completed',
    'canceled': 'cancelled',
    'holded': 'pending',
  };

  return statusMap[status.toLowerCase()] || 'pending';
}

/**
 * Convertir orden de Magento a nuestro formato OrderData
 */
export function convertMagentoOrderToOrderData(magentoOrder: MagentoOrder) {
  return {
    id: magentoOrder.entity_id,
    orderNumber: magentoOrder.increment_id,
    date: magentoOrder.created_at,
    status: mapMagentoStatus(magentoOrder.status),
    items: magentoOrder.items.map(item => ({
      sku: item.product_sku,
      name: item.product_name,
      price: item.price,
      quantity: item.qty_ordered,
      selectedSize: undefined, // Extraer de product_option si está disponible
      selectedColor: undefined,
      image: undefined,
    })),
    subtotal: magentoOrder.subtotal,
    shipping: magentoOrder.shipping_amount,
    total: magentoOrder.grand_total,
    shippingAddress: {
      firstName: magentoOrder.billing_address?.firstname || magentoOrder.customer_firstname,
      lastName: magentoOrder.billing_address?.lastname || magentoOrder.customer_lastname,
      phone: magentoOrder.billing_address?.telephone || '',
      address: magentoOrder.billing_address?.street?.[0] || '',
      city: magentoOrder.billing_address?.city || '',
      state: magentoOrder.billing_address?.region || '',
      zipCode: magentoOrder.billing_address?.postcode || '',
      country: magentoOrder.billing_address?.country_id || 'CL',
    },
  };
}

import { magentoClient } from './client';

// Tipos para el checkout de Magento
export interface CartAddress {
  firstname: string;
  lastname: string;
  street: string[];
  city: string;
  region?: string;
  region_id?: number;
  postcode: string;
  country_code: string;
  telephone: string;
}

export interface CartItem {
  sku: string;
  quantity: number;
  selected_options?: string[];
}

// Función para obtener el region_id de Chile
export async function getChileRegionId(regionName: string): Promise<{id: number, name: string} | null> {
  const query = `
    query {
      country(id: "CL") {
        id
        full_name_locale
        available_regions {
          id
          code
          name
        }
      }
    }
  `;

  try {
    const data: any = await magentoClient.request(query);
    console.log('🇨🇱 Chile regions from Magento:', JSON.stringify(data, null, 2));
    
    const regions = data.country?.available_regions || [];
    console.log(`📍 Total regions found for Chile: ${regions.length}`);
    
    // Si Chile no tiene regiones predefinidas, retornar null
    if (regions.length === 0) {
      console.log('❌ No predefined regions found for Chile');
      return null;
    }
    
    // Log all available regions
    console.log('📋 Available regions:');
    regions.forEach((r: any) => {
      console.log(`  - ${r.name} (code: ${r.code}, id: ${r.id})`);
    });
    
    // Buscar la región por nombre (case insensitive)
    const region = regions.find((r: any) => 
      r.name.toLowerCase() === regionName.toLowerCase() ||
      r.code.toLowerCase() === regionName.toLowerCase()
    );
    
    if (region) {
      console.log(`✅ Found matching region: ${region.name} (ID: ${region.id})`);
      return { id: parseInt(region.id), name: region.name };
    }
    
    console.log(`⚠️ Region "${regionName}" not found in available regions`);
    console.log(`💡 Trying fuzzy match...`);
    
    // Try fuzzy matching
    const fuzzyMatch = regions.find((r: any) => 
      r.name.toLowerCase().includes(regionName.toLowerCase()) ||
      regionName.toLowerCase().includes(r.name.toLowerCase())
    );
    
    if (fuzzyMatch) {
      console.log(`✅ Found fuzzy match: ${fuzzyMatch.name} (ID: ${fuzzyMatch.id})`);
      return { id: parseInt(fuzzyMatch.id), name: fuzzyMatch.name };
    }
    
    console.log(`❌ No match found for "${regionName}"`);
    return null;
  } catch (error) {
    console.error('❌ Error getting Chile regions:', error);
    return null;
  }
}

// 1. Crear un carrito vacío
export async function createEmptyCart(): Promise<string> {
  const mutation = `
    mutation {
      createEmptyCart
    }
  `;
  
  try {
    const data = await magentoClient.request<{ createEmptyCart: string }>(mutation);
    return data.createEmptyCart;
  } catch (error) {
    console.error('Error creating cart:', error);
    throw error;
  }
}

// 2. Agregar items al carrito
export async function addItemsToCart(cartId: string, items: CartItem[]) {
  const mutation = `
    mutation($cartId: String!, $cartItems: [CartItemInput!]!) {
      addProductsToCart(
        cartId: $cartId
        cartItems: $cartItems
      ) {
        cart {
          id
          items {
            id
            product {
              name
              sku
            }
            quantity
          }
        }
        user_errors {
          code
          message
        }
      }
    }
  `;

  try {
    const data = await magentoClient.request(mutation, {
      cartId,
      cartItems: items,
    });
    return data;
  } catch (error) {
    console.error('Error adding items to cart:', error);
    throw error;
  }
}

// 3. Configurar dirección de envío
export async function setShippingAddress(cartId: string, address: CartAddress) {
  const mutation = `
    mutation($cartId: String!, $address: CartAddressInput!) {
      setShippingAddressesOnCart(
        input: {
          cart_id: $cartId
          shipping_addresses: [{
            address: $address
          }]
        }
      ) {
        cart {
          id
          shipping_addresses {
            firstname
            lastname
            street
            city
            region {
              code
              label
            }
            postcode
            telephone
            country {
              code
              label
            }
            available_shipping_methods {
              carrier_code
              method_code
              carrier_title
              method_title
              amount {
                value
                currency
              }
            }
          }
        }
      }
    }
  `;

  try {
    const data = await magentoClient.request(mutation, {
      cartId,
      address,
    });
    return data;
  } catch (error) {
    console.error('Error setting shipping address:', error);
    throw error;
  }
}

// 4. Configurar método de envío
export async function setShippingMethod(cartId: string, carrierCode: string = 'flatrate', methodCode: string = 'flatrate') {
  const mutation = `
    mutation($cartId: String!, $carrierCode: String!, $methodCode: String!) {
      setShippingMethodsOnCart(
        input: {
          cart_id: $cartId
          shipping_methods: [{
            carrier_code: $carrierCode
            method_code: $methodCode
          }]
        }
      ) {
        cart {
          id
          shipping_addresses {
            selected_shipping_method {
              carrier_code
              method_code
              carrier_title
              method_title
              amount {
                value
                currency
              }
            }
          }
        }
      }
    }
  `;

  try {
    const data = await magentoClient.request(mutation, {
      cartId,
      carrierCode,
      methodCode,
    });
    return data;
  } catch (error) {
    console.error('Error setting shipping method:', error);
    throw error;
  }
}

// 5. Configurar dirección de facturación
export async function setBillingAddress(cartId: string, address: CartAddress) {
  const mutation = `
    mutation($cartId: String!, $address: CartAddressInput!) {
      setBillingAddressOnCart(
        input: {
          cart_id: $cartId
          billing_address: {
            address: $address
          }
        }
      ) {
        cart {
          id
          billing_address {
            firstname
            lastname
            street
            city
            postcode
            telephone
          }
        }
      }
    }
  `;

  try {
    const data = await magentoClient.request(mutation, {
      cartId,
      address,
    });
    return data;
  } catch (error) {
    console.error('Error setting billing address:', error);
    throw error;
  }
}

// 6. Configurar método de pago
export async function setPaymentMethod(cartId: string, paymentMethod: string = 'transbank_webpay') {
  const mutation = `
    mutation($cartId: String!, $paymentMethod: String!) {
      setPaymentMethodOnCart(
        input: {
          cart_id: $cartId
          payment_method: {
            code: $paymentMethod
          }
        }
      ) {
        cart {
          id
          selected_payment_method {
            code
            title
          }
        }
      }
    }
  `;

  try {
    const data = await magentoClient.request(mutation, {
      cartId,
      paymentMethod,
    });
    return data;
  } catch (error) {
    console.error('Error setting payment method:', error);
    throw error;
  }
}

// 7. Crear la orden
export async function placeOrder(cartId: string) {
  const mutation = `
    mutation($cartId: String!) {
      placeOrder(input: { cart_id: $cartId }) {
        order {
          order_number
          order_id
        }
      }
    }
  `;

  try {
    const data = await magentoClient.request<{
      placeOrder: {
        order: {
          order_number: string;
          order_id: string;
        };
      };
    }>(mutation, {
      cartId,
    });
    return data.placeOrder.order;
  } catch (error) {
    console.error('Error placing order:', error);
    throw error;
  }
}

// 8. Configurar email en el carrito (para guest checkout)
export async function setGuestEmailOnCart(cartId: string, email: string) {
  const mutation = `
    mutation($cartId: String!, $email: String!) {
      setGuestEmailOnCart(
        input: {
          cart_id: $cartId
          email: $email
        }
      ) {
        cart {
          id
          email
        }
      }
    }
  `;

  try {
    const data = await magentoClient.request(mutation, {
      cartId,
      email,
    });
    return data;
  } catch (error) {
    console.error('Error setting guest email:', error);
    throw error;
  }
}

// Función completa para crear una orden desde el checkout
export async function createMagentoOrder(
  email: string,
  items: CartItem[],
  shippingAddress: CartAddress,
  billingAddress: CartAddress
) {
  try {
    // 0. Obtener region_id si es necesario
    if (shippingAddress.country_code === 'CL' && shippingAddress.region) {
      console.log('0. 🇨🇱 Checking Chile region configuration...');
      const regionData = await getChileRegionId(shippingAddress.region);
      if (regionData !== null) {
        // Cuando hay region_id, Magento NO quiere el campo region
        // Solo se debe enviar region_id
        shippingAddress.region_id = regionData.id;
        delete shippingAddress.region; // IMPORTANTE: Eliminar region cuando hay region_id
        billingAddress.region_id = regionData.id;
        delete billingAddress.region; // IMPORTANTE: Eliminar region cuando hay region_id
        console.log(`✅ Using region_id: ${regionData.id} (${regionData.name})`);
      } else {
        // Chile no tiene regiones predefinidas o no se encontró match
        // En este caso, usar solo el nombre de región, sin region_id
        delete shippingAddress.region_id;
        delete billingAddress.region_id;
        console.log('⚠️ No valid region_id found, will use region name only');
      }
    }

    // 1. Crear carrito vacío
    console.log('\n1. Creating empty cart...');
    const cartId = await createEmptyCart();
    console.log('✅ Cart ID:', cartId);

    // 2. Configurar email del guest
    console.log('2. Setting guest email...');
    await setGuestEmailOnCart(cartId, email);

    // 3. Agregar items al carrito
    console.log('3. Adding items to cart...');
    await addItemsToCart(cartId, items);

    // 4. Configurar dirección de envío
    console.log('4. Setting shipping address...');
    await setShippingAddress(cartId, shippingAddress);

    // 5. Configurar método de envío (flatrate)
    console.log('5. Setting shipping method...');
    await setShippingMethod(cartId, 'flatrate', 'flatrate');

    // 6. Configurar dirección de facturación
    console.log('6. Setting billing address...');
    await setBillingAddress(cartId, billingAddress);

    // 7. Configurar método de pago (check/money order)
    console.log('7. Setting payment method...');
    await setPaymentMethod(cartId, 'checkmo');

    // 8. Crear la orden
    console.log('8. Placing order...');
    const order = await placeOrder(cartId);
    console.log('Order created:', order);

    return order;
  } catch (error) {
    console.error('Error in createMagentoOrder:', error);
    throw error;
  }
}

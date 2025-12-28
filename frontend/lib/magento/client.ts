import { GraphQLClient } from 'graphql-request';

// URL del GraphQL de Magento
const MAGENTO_GRAPHQL_URL = process.env.NEXT_PUBLIC_MAGENTO_GRAPHQL_URL || 'http://localhost/graphql';

// Cliente GraphQL configurado para Magento
export const magentoClient = new GraphQLClient(MAGENTO_GRAPHQL_URL, {
  headers: {
    'Content-Type': 'application/json',
    'Store': 'default',
  },
});

// Tipo para configuración de la tienda
export interface StoreConfig {
  store_code: string;
  store_name: string;
  base_url: string;
  locale: string;
  base_currency_code: string;
}

// Tipo para productos
export interface Product {
  id: string;
  name: string;
  sku: string;
  price_range: {
    minimum_price: {
      regular_price: {
        value: number;
        currency: string;
      };
      final_price: {
        value: number;
        currency: string;
      };
    };
  };
  image: {
    url: string;
    label: string;
  };
  url_key: string;
  small_image: {
    url: string;
  };
}

export interface ProductsResponse {
  products: {
    items: Product[];
    total_count: number;
  };
}

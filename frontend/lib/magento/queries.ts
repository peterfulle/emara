import { gql } from 'graphql-request';

// Query para obtener la configuración de la tienda
export const GET_STORE_CONFIG = gql`
  query GetStoreConfig {
    storeConfig {
      store_code
      store_name
      base_url
      locale
      base_currency_code
    }
  }
`;

// Query para obtener productos (con filtro vacío que es requerido)
export const GET_PRODUCTS = gql`
  query GetProducts($pageSize: Int = 12, $currentPage: Int = 1) {
    products(
      filter: {}
      pageSize: $pageSize
      currentPage: $currentPage
    ) {
      total_count
      items {
        id
        name
        sku
        url_key
        price_range {
          minimum_price {
            regular_price {
              value
              currency
            }
            final_price {
              value
              currency
            }
          }
        }
        small_image {
          url
          label
        }
        image {
          url
          label
        }
      }
    }
  }
`;

// Query para obtener categorías
export const GET_CATEGORIES = gql`
  query GetCategories {
    categories(filters: { ids: { eq: "2" } }) {
      items {
        id
        name
        url_path
        children {
          id
          name
          url_path
          image
          product_count
        }
      }
    }
  }
`;

// Query para obtener un producto específico
export const GET_PRODUCT_BY_SKU = gql`
  query GetProductBySku($sku: String!) {
    products(filter: { sku: { eq: $sku } }) {
      items {
        id
        name
        sku
        url_key
        description {
          html
        }
        short_description {
          html
        }
        price_range {
          minimum_price {
            regular_price {
              value
              currency
            }
            final_price {
              value
              currency
            }
          }
        }
        media_gallery {
          url
          label
        }
        image {
          url
          label
        }
      }
    }
  }
`;


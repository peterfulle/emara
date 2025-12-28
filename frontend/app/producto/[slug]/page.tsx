import { magentoClient } from '@/lib/magento/client';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductDisplay from '@/components/ProductDisplay';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getProductByUrlKey(urlKey: string) {
  try {
    const query = `
      query GetProduct($urlKey: String!) {
        products(filter: { url_key: { eq: $urlKey } }) {
          items {
            __typename
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
            description {
              html
            }
            short_description {
              html
            }
            image {
              url
              label
            }
            media_gallery {
              url
              label
            }
            # Atributos personalizados importantes para moda
            material
            activity
            pattern
            climate
            style_bottom
            eco_collection
            performance_fabric
            erin_recommends
            new
            sale
            ... on ConfigurableProduct {
              configurable_options {
                attribute_code
                label
                values {
                  value_index
                  label
                }
              }
              variants {
                attributes {
                  code
                  value_index
                  label
                }
                product {
                  id
                  name
                  sku
                  price_range {
                    minimum_price {
                      final_price {
                        value
                        currency
                      }
                    }
                  }
                  image {
                    url
                  }
                  media_gallery {
                    url
                  }
                }
              }
            }
          }
        }
      }
    `;
    
    const data: any = await magentoClient.request(query, { urlKey });
    const product = data.products.items[0];
    
    return product || null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductByUrlKey(slug);

  if (!product) {
    notFound();
  }

  const price = product.price_range.minimum_price.final_price.value;
  const currency = product.price_range.minimum_price.final_price.currency;
  const regularPrice = product.price_range.minimum_price.regular_price.value;
  const hasDiscount = price < regularPrice;
  const discount = hasDiscount ? Math.round(((regularPrice - price) / regularPrice) * 100) : 0;
  
  const isConfigurable = product.__typename === 'ConfigurableProduct' && product.variants && product.variants.length > 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb minimalista */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav>
            <ol className="flex items-center space-x-2 text-xs tracking-wider uppercase">
              <li>
                <Link href="/" className="text-gray-400 hover:text-black transition-colors">
                  Inicio
                </Link>
              </li>
              <li className="text-gray-300">/</li>
              <li className="text-gray-900">{product.name}</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <ProductDisplay 
            product={product}
            isConfigurable={isConfigurable}
            hasDiscount={hasDiscount}
            discount={discount}
          />
        </div>

        {/* Descripción Completa */}
        {product.description?.html && (
          <div className="mt-24 max-w-3xl">
            <h2 className="text-2xl font-light mb-8 tracking-tight">Detalles del Producto</h2>
            <div 
              className="prose prose-gray max-w-none text-gray-600 font-light leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.description.html }}
            />
          </div>
        )}

        {/* Navegación */}
        <div className="mt-16 pt-8 border-t border-gray-100">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm uppercase tracking-wider hover:opacity-60 transition-opacity"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  );
}

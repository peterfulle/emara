'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/magento/client';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const price = product.price_range.minimum_price.final_price.value;
  const currency = product.price_range.minimum_price.final_price.currency;
  const regularPrice = product.price_range.minimum_price.regular_price.value;
  const hasDiscount = price < regularPrice;
  
  // Obtener URL de imagen de manera segura
  const imageUrl = product.small_image?.url || product.image?.url;

  return (
    <Link href={`/producto/${product.url_key}`} className="group">
      <div className="bg-white overflow-hidden transition-all duration-300">
        <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden mb-3">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, 25vw"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-gray-300 text-4xl">📦</span>
            </div>
          )}
          {hasDiscount && (
            <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 text-xs font-bold">
              SALE
            </div>
          )}
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
        </div>
        <div className="px-1">
          <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 min-h-[40px]">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                ${regularPrice.toLocaleString('es-CL')}
              </span>
            )}
            <span className="text-base font-bold text-gray-900">
              ${price.toLocaleString('es-CL')}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

interface ProductGridProps {
  products: Product[];
  title?: string;
}

export default function ProductGrid({ products, title = 'Nuestros Productos' }: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-light text-gray-900 mb-12">{title}</h2>
          <p className="text-center text-gray-600">No hay productos disponibles en este momento.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-16">
          <h2 className="text-5xl font-light text-gray-900 tracking-tight">{title}</h2>
          <Link href="/productos" className="text-sm uppercase tracking-wider hover:opacity-60 transition-opacity border-b border-black pb-1">
            Ver todo
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

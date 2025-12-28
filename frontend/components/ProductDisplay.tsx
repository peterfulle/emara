'use client';

import { useState } from 'react';
import Image from 'next/image';
import ConfigurableProductSelector from './ConfigurableProductSelector';
import AddToCartButton from './AddToCartButton';

interface ProductDisplayProps {
  product: any;
  isConfigurable: boolean;
  hasDiscount: boolean;
  discount: number;
}

export default function ProductDisplay({ product, isConfigurable, hasDiscount, discount }: ProductDisplayProps) {
  const [currentImage, setCurrentImage] = useState(product.image?.url);

  const handleVariantChange = (newImage: string | undefined) => {
    if (newImage) {
      setCurrentImage(newImage);
    }
  };

  return (
    <>
      {/* Imagen del Producto */}
      <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
        {currentImage ? (
          <Image
            key={currentImage}
            src={currentImage}
            alt={product.name}
            fill
            className="object-cover transition-opacity duration-300"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-300 text-6xl">📦</span>
          </div>
        )}
        {hasDiscount && (
          <div className="absolute top-4 right-4 bg-black text-white px-4 py-1 text-xs tracking-wider uppercase">
            -{discount}% OFF
          </div>
        )}
      </div>

      {/* Información del Producto */}
      <div className="flex flex-col justify-center">
        <p className="text-xs tracking-[0.3em] uppercase text-gray-500 mb-4">
          SKU: {product.sku}
        </p>
        
        <h1 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6 tracking-tight">
          {product.name}
        </h1>

        {/* Precio */}
        <div className="mb-8 pb-8 border-b border-gray-100">
          <div className="flex items-baseline gap-4">
            <span className="text-3xl font-light text-gray-900">
              ${product.price_range.minimum_price.final_price.value.toLocaleString('es-CL')}
            </span>
            {hasDiscount && (
              <span className="text-xl text-gray-400 line-through font-light">
                ${product.price_range.minimum_price.regular_price.value.toLocaleString('es-CL')}
              </span>
            )}
          </div>
        </div>

        {/* Descripción Corta */}
        {product.short_description?.html && (
          <div 
            className="prose prose-sm text-gray-600 mb-8 font-light leading-relaxed"
            dangerouslySetInnerHTML={{ __html: product.short_description.html }}
          />
        )}

        {/* Características del Producto */}
        {(product.material || product.activity || product.pattern || product.climate || product.style_bottom) && (
          <div className="mb-8 pb-8 border-b border-gray-100">
            <h3 className="text-xs tracking-[0.3em] uppercase text-gray-500 mb-4">
              Características
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {product.material && (
                <div className="flex items-start gap-2">
                  <span className="text-gray-400">Material:</span>
                  <span className="text-gray-900 font-light">{product.material}</span>
                </div>
              )}
              {product.activity && (
                <div className="flex items-start gap-2">
                  <span className="text-gray-400">Actividad:</span>
                  <span className="text-gray-900 font-light">{product.activity}</span>
                </div>
              )}
              {product.pattern && (
                <div className="flex items-start gap-2">
                  <span className="text-gray-400">Patrón:</span>
                  <span className="text-gray-900 font-light">{product.pattern}</span>
                </div>
              )}
              {product.climate && (
                <div className="flex items-start gap-2">
                  <span className="text-gray-400">Clima:</span>
                  <span className="text-gray-900 font-light">{product.climate}</span>
                </div>
              )}
              {product.style_bottom && (
                <div className="flex items-start gap-2">
                  <span className="text-gray-400">Estilo:</span>
                  <span className="text-gray-900 font-light">{product.style_bottom}</span>
                </div>
              )}
            </div>
            
            {/* Badges especiales */}
            <div className="flex flex-wrap gap-2 mt-4">
              {product.eco_collection && (
                <span className="px-3 py-1 bg-green-50 text-green-800 text-xs tracking-wider uppercase border border-green-100">
                  Eco-Friendly
                </span>
              )}
              {product.performance_fabric && (
                <span className="px-3 py-1 bg-blue-50 text-blue-800 text-xs tracking-wider uppercase border border-blue-100">
                  Performance
                </span>
              )}
              {product.new && (
                <span className="px-3 py-1 bg-gray-900 text-white text-xs tracking-wider uppercase">
                  Nuevo
                </span>
              )}
            </div>
          </div>
        )}

        {/* Selector de producto configurable o botón simple */}
        {isConfigurable ? (
          <ConfigurableProductSelector 
            product={product}
            onVariantChange={handleVariantChange}
          />
        ) : (
          <div className="space-y-4 mb-12">
            <AddToCartButton 
              product={{
                id: product.id.toString(),
                name: product.name,
                sku: product.sku,
                price: product.price_range.minimum_price.final_price.value,
                currency: product.price_range.minimum_price.final_price.currency,
                image: currentImage,
              }}
            />
            <button className="w-full border border-black py-4 text-sm tracking-wider uppercase hover:bg-black hover:text-white transition-all duration-300">
              Agregar a favoritos
            </button>
          </div>
        )}

        {/* Características minimalistas */}
        <div className="space-y-6 text-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900 mb-1">Envío Gratuito</p>
              <p className="text-gray-600 font-light">En compras sobre $50.000 CLP</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900 mb-1">Devoluciones Simples</p>
              <p className="text-gray-600 font-light">30 días para cambios y devoluciones</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900 mb-1">Pago Seguro</p>
              <p className="text-gray-600 font-light">Transacciones 100% protegidas</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

'use client';

import { useState } from 'react';
import Image from 'next/image';
import AddToCartButton from './AddToCartButton';

interface Product {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  price: number;
  salePrice: number | null;
  stock: number;
  images: string[];
  category: string;
  sizes: string[];
  colors: string[];
  active: boolean;
  featured: boolean;
}

interface ProductDisplayProps {
  product: Product;
}

export default function ProductDisplay({ product }: ProductDisplayProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discount = hasDiscount 
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;
  const finalPrice = product.salePrice || product.price;

  const currentImage = product.images[currentImageIndex] || '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Galería de Imágenes */}
        <div className="space-y-4">
          {/* Imagen Principal */}
          <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
            {currentImage ? (
              <Image
                key={currentImage}
                src={currentImage}
                alt={product.name}
                fill
                className="object-cover"
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
            {product.featured && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-1 text-xs tracking-wider uppercase">
                DESTACADO
              </div>
            )}
          </div>

          {/* Miniaturas */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative aspect-square bg-gray-50 overflow-hidden border-2 transition-all ${
                    currentImageIndex === index
                      ? 'border-black'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Información del Producto */}
        <div className="flex flex-col justify-start space-y-6">
          {/* Categoría */}
          <div className="text-sm text-gray-500 uppercase tracking-wider">
            {product.category}
          </div>

          {/* Nombre */}
          <h1 className="text-4xl font-light text-gray-900 tracking-tight">
            {product.name}
          </h1>

          {/* Precio */}
          <div className="flex items-baseline gap-4">
            {hasDiscount && (
              <span className="text-2xl text-gray-400 line-through">
                ${product.price.toLocaleString('es-CL')}
              </span>
            )}
            <span className="text-3xl font-bold text-gray-900">
              ${finalPrice.toLocaleString('es-CL')}
            </span>
          </div>

          {/* Descripción */}
          {product.description && (
            <div className="prose prose-sm text-gray-600 leading-relaxed">
              <p>{product.description}</p>
            </div>
          )}

          {/* Selector de Talla */}
          {product.sizes.length > 0 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-900 uppercase tracking-wide">
                Talla
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 border-2 text-sm font-medium transition-all ${
                      selectedSize === size
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selector de Color */}
          {product.colors.length > 0 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-900 uppercase tracking-wide">
                Color
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-6 py-3 border-2 text-sm font-medium transition-all ${
                      selectedColor === color
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock */}
          <div className="text-sm">
            {product.stock > 0 ? (
              <span className="text-green-600 font-medium">
                ✓ {product.stock} unidades disponibles
              </span>
            ) : (
              <span className="text-red-600 font-medium">
                Agotado
              </span>
            )}
          </div>

          {/* Botón Agregar al Carrito */}
          <div className="pt-4">
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                price: finalPrice,
                sku: product.sku,
                image: currentImage,
                size: selectedSize,
                color: selectedColor,
              }}
              disabled={
                product.stock === 0 ||
                (product.sizes.length > 0 && !selectedSize) ||
                (product.colors.length > 0 && !selectedColor)
              }
            />
          </div>

          {/* Información Adicional */}
          <div className="pt-6 border-t border-gray-200 space-y-4 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <div>
                <p className="font-medium text-gray-900">Envío Gratis</p>
                <p className="text-xs">En compras sobre $50.000</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <div>
                <p className="font-medium text-gray-900">Devoluciones</p>
                <p className="text-xs">30 días para cambios y devoluciones</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <p className="font-medium text-gray-900">Compra Segura</p>
                <p className="text-xs">Pago protegido y encriptado</p>
              </div>
            </div>
          </div>

          {/* SKU */}
          <div className="text-xs text-gray-400 pt-4">
            SKU: {product.sku}
          </div>
        </div>
      </div>
    </div>
  );
}

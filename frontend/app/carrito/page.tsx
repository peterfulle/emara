'use client';

import { useCart } from '@/lib/cart/CartContext';
import Image from 'next/image';
import Link from 'next/link';

export default function CarritoPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-light text-gray-900 mb-4 tracking-tight">
              Tu carrito está vacío
            </h1>
            <p className="text-gray-600 mb-12 font-light">
              Descubre nuestra colección y encuentra tu estilo perfecto
            </p>
            <Link
              href="/"
              className="inline-block bg-black text-white px-12 py-4 text-sm tracking-wider uppercase hover:bg-gray-800 transition-all duration-300"
            >
              Explorar tienda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 pb-8 border-b border-gray-100">
          <p className="text-xs tracking-[0.3em] uppercase text-gray-500 mb-2">Tu selección</p>
          <h1 className="text-4xl font-light text-gray-900 tracking-tight">
            Carrito de Compras
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-8">
            {items.map((item, index) => (
              <div
                key={`${item.sku}-${item.selectedSize || ''}-${item.selectedColor || ''}-${index}`}
                className="border-b border-gray-100 pb-8 flex flex-col sm:flex-row gap-6"
              >
                {/* Imagen */}
                <div className="relative h-40 w-32 flex-shrink-0 bg-gray-50">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl text-gray-300">📦</span>
                    </div>
                  )}
                </div>

                {/* Información */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-light text-gray-900 mb-2">
                      {item.name}
                    </h3>
                    <div className="text-xs tracking-wider uppercase text-gray-400 space-y-1">
                      <p>SKU: {item.sku}</p>
                      {item.selectedSize && <p>Talla: {item.selectedSize}</p>}
                      {item.selectedColor && <p>Color: {item.selectedColor}</p>}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => updateQuantity(item.sku, item.quantity - 1, item.selectedSize, item.selectedColor)}
                        className="w-10 h-10 border border-gray-200 hover:border-black flex items-center justify-center transition-colors"
                      >
                        <span className="text-sm">−</span>
                      </button>
                      <span className="w-12 text-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.sku, item.quantity + 1, item.selectedSize, item.selectedColor)}
                        className="w-10 h-10 border border-gray-200 hover:border-black flex items-center justify-center transition-colors"
                      >
                        <span className="text-sm">+</span>
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-light text-gray-900">
                        ${(item.price * item.quantity).toFixed(0)}
                      </p>
                      <p className="text-xs text-gray-400">
                        ${item.price.toFixed(0)} c/u
                      </p>
                    </div>
                  </div>
                </div>

                {/* Botón eliminar */}
                <button
                  onClick={() => removeFromCart(item.sku, item.selectedSize, item.selectedColor)}
                  className="text-gray-400 hover:text-black transition-colors self-start"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}

            {/* Botón limpiar carrito */}
            <button
              onClick={clearCart}
              className="text-sm uppercase tracking-wider text-gray-500 hover:text-black transition-colors border-b border-transparent hover:border-black pb-1"
            >
              Vaciar carrito
            </button>
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-8 sticky top-24">
              <h2 className="text-xl font-light text-gray-900 mb-8 tracking-tight">
                Resumen
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm text-gray-600 font-light">
                  <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>${totalPrice.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 font-light">
                  <span>Envío</span>
                  <span className={totalPrice >= 50 ? 'text-green-600' : ''}>
                    {totalPrice >= 50 ? 'Gratis' : '$5'}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-light text-gray-900">
                    <span>Total</span>
                    <span>
                      ${(totalPrice >= 50 ? totalPrice : totalPrice + 5).toFixed(0)} CLP
                    </span>
                  </div>
                </div>
              </div>

              {totalPrice < 50 && (
                <div className="bg-white border border-gray-200 p-4 mb-8">
                  <p className="text-xs text-gray-600 font-light">
                    Agrega ${(50 - totalPrice).toFixed(0)} más para envío gratuito
                  </p>
                </div>
              )}

              <Link
                href="/checkout"
                className="block w-full bg-black text-white text-center py-5 text-sm tracking-wider uppercase hover:bg-gray-800 transition-all mb-4"
              >
                Ir al checkout
              </Link>

              <Link
                href="/"
                className="block w-full border border-black text-center py-5 text-sm tracking-wider uppercase hover:bg-black hover:text-white transition-all"
              >
                Seguir comprando
              </Link>

              {/* Características */}
              <div className="mt-8 space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-1">Pago Seguro</p>
                    <p className="text-gray-600 font-light">Transacciones 100% protegidas</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-1">Devoluciones</p>
                    <p className="text-gray-600 font-light">30 días para cambios</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-1">Envío Rápido</p>
                    <p className="text-gray-600 font-light">Entrega en 24-48 horas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

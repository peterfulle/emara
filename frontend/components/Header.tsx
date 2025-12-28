'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart/CartContext';
import { useUser } from '@/lib/auth/UserContext';
import { useState, useEffect, useRef } from 'react';

export default function Header() {
  const { items, totalItems, totalPrice, removeFromCart } = useCart();
  const { isAuthenticated } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);

  // Close cart when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setCartOpen(false);
      }
    }

    if (cartOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [cartOpen]);

  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold tracking-tight text-black hover:text-gray-700 transition-colors">
            EMARA
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/productos" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
              NUEVA COLECCIÓN
            </Link>
            <Link href="/categoria/vestidos" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
              VESTIDOS
            </Link>
            <Link href="/categoria/tops-blusas" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
              TOPS
            </Link>
            <Link href="/categoria/pantalones" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
              PANTALONES
            </Link>
            <Link href="/ofertas" className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
              REBAJAS
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-6">
            <button className="text-gray-700 hover:text-black transition-colors hidden md:block">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            <Link 
              href={isAuthenticated ? "/cuenta/pedidos" : "/checkout"} 
              className="text-gray-700 hover:text-black transition-colors hidden md:block"
              title={isAuthenticated ? "Mis Pedidos" : "Mi Cuenta"}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>

            <div className="relative" ref={cartRef}>
              <button 
                onClick={() => setCartOpen(!cartOpen)}
                className="relative text-gray-700 hover:text-black transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mini Cart Dropdown */}
              {cartOpen && (
                <div className="absolute right-0 mt-6 w-96 bg-white border border-gray-200 shadow-2xl z-50 max-h-[80vh] flex flex-col">
                  {/* Header */}
                  <div className="border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-light tracking-wider uppercase">Tu Bolsa</h3>
                      <button 
                        onClick={() => setCartOpen(false)}
                        className="text-gray-400 hover:text-black transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 tracking-wide">
                      {totalItems} {totalItems === 1 ? 'artículo' : 'artículos'}
                    </p>
                  </div>

                  {/* Cart Items */}
                  {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-6">
                      <div className="w-16 h-16 border border-gray-200 flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-500 tracking-wide">Tu bolsa está vacía</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 overflow-y-auto px-6 py-4">
                        <div className="space-y-4">
                          {items.map((item) => (
                            <div key={`${item.sku}-${item.selectedSize || ''}-${item.selectedColor || ''}`} className="flex gap-4 pb-4 border-b border-gray-100">
                              {/* Image */}
                              <div className="w-20 h-28 bg-gray-50 flex-shrink-0 overflow-hidden">
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                )}
                              </div>

                              {/* Info */}
                              <div className="flex-1 flex flex-col justify-between min-w-0">
                                <div>
                                  <h4 className="text-xs font-light text-gray-900 tracking-wide truncate">
                                    {item.name}
                                  </h4>
                                  <div className="mt-1 text-xs text-gray-500 space-y-0.5">
                                    {item.selectedSize && (
                                      <p>Talla: {item.selectedSize}</p>
                                    )}
                                    {item.selectedColor && (
                                      <p>Color: {item.selectedColor}</p>
                                    )}
                                    <p>Cant: {item.quantity}</p>
                                  </div>
                                </div>

                                <div className="flex items-end justify-between mt-2">
                                  <p className="text-sm font-light text-gray-900">
                                    ${(item.price * item.quantity).toFixed(0)}
                                  </p>
                                  <button
                                    onClick={() => removeFromCart(item.sku, item.selectedSize, item.selectedColor)}
                                    className="text-gray-400 hover:text-black transition-colors"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-sm font-light tracking-wider uppercase">Subtotal</span>
                          <span className="text-lg font-light text-gray-900">${totalPrice.toFixed(0)}</span>
                        </div>
                        
                        <Link
                          href="/carrito"
                          onClick={() => setCartOpen(false)}
                          className="block w-full bg-black text-white text-center py-3 text-sm font-light tracking-wider uppercase hover:bg-gray-800 transition-colors"
                        >
                          Ir a Checkout
                        </Link>
                        
                        <button
                          onClick={() => setCartOpen(false)}
                          className="block w-full mt-2 text-center py-3 text-xs text-gray-600 hover:text-black transition-colors tracking-wide"
                        >
                          Continuar comprando
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <button 
              className="md:hidden text-gray-700"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link href="/productos" className="text-sm font-medium text-gray-700 hover:text-black">
                NUEVA COLECCIÓN
              </Link>
              <Link href="/categoria/vestidos" className="text-sm font-medium text-gray-700 hover:text-black">
                VESTIDOS
              </Link>
              <Link href="/categoria/tops-blusas" className="text-sm font-medium text-gray-700 hover:text-black">
                TOPS
              </Link>
              <Link href="/categoria/pantalones" className="text-sm font-medium text-gray-700 hover:text-black">
                PANTALONES
              </Link>
              <Link href="/ofertas" className="text-sm font-medium text-red-600">
                REBAJAS
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

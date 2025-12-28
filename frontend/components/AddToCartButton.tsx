'use client';

import { useCart } from '@/lib/cart/CartContext';
import { useState } from 'react';

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    sku: string;
    price: number;
    currency: string;
    image?: string;
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    
    // Agregar al carrito
    addItem(product);
    
    // Mostrar animación de éxito
    setTimeout(() => {
      setIsAdding(false);
      setShowSuccess(true);
      
      // Ocultar mensaje después de 2 segundos
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    }, 300);
  };

  return (
    <div className="flex-1 relative">
      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        className={`w-full bg-purple-600 text-white py-4 px-8 rounded-lg font-semibold hover:bg-purple-700 transition-all text-lg ${
          isAdding ? 'scale-95 opacity-80' : ''
        } ${showSuccess ? 'bg-green-600 hover:bg-green-600' : ''}`}
      >
        {isAdding ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Agregando...
          </span>
        ) : showSuccess ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            ¡Agregado!
          </span>
        ) : (
          'Agregar al Carrito'
        )}
      </button>
      
      {showSuccess && (
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce">
          ¡Producto agregado al carrito! 🎉
        </div>
      )}
    </div>
  );
}

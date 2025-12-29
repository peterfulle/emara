'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams?.get('order');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Limpiar carrito del localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart');
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Procesando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* Icono de éxito */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Título */}
          <h1 className="mt-6 text-3xl font-light text-gray-900">
            ¡Pago Exitoso!
          </h1>

          {/* Mensaje */}
          <p className="mt-4 text-gray-600">
            Tu orden ha sido procesada correctamente
          </p>

          {/* Número de orden */}
          {orderNumber && (
            <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-6">
              <p className="text-sm text-gray-500 uppercase tracking-wider">Número de Orden</p>
              <p className="mt-2 text-2xl font-mono text-gray-900">{orderNumber}</p>
            </div>
          )}

          {/* Información adicional */}
          <div className="mt-8 text-left bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-medium text-gray-900">¿Qué sigue?</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Recibirás un correo de confirmación con los detalles de tu orden
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Tu orden será procesada y enviada en 24-48 horas hábiles
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Recibirás un código de seguimiento cuando tu orden sea despachada
              </li>
            </ul>
          </div>

          {/* Botones de acción */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-3 bg-black text-white text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors"
            >
              Volver al Inicio
            </Link>
            <Link
              href="/cuenta"
              className="px-8 py-3 border border-black text-black text-sm uppercase tracking-wider hover:bg-gray-50 transition-colors"
            >
              Ver Mis Órdenes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

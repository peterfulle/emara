'use client';

import Link from 'next/link';

export default function CheckoutFailurePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* Icono de error */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          {/* Título */}
          <h1 className="mt-6 text-3xl font-light text-gray-900">
            Pago Rechazado
          </h1>

          {/* Mensaje */}
          <p className="mt-4 text-gray-600">
            No pudimos procesar tu pago. Por favor, intenta nuevamente con otro método de pago.
          </p>

          {/* Botones de acción */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/checkout"
              className="px-8 py-3 bg-black text-white text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors"
            >
              Intentar Nuevamente
            </Link>
            <Link
              href="/carrito"
              className="px-8 py-3 border border-black text-black text-sm uppercase tracking-wider hover:bg-gray-50 transition-colors"
            >
              Volver al Carrito
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

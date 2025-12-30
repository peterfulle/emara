'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function WebpayReturnContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed' | 'cancelled'>('loading');
  const [transactionData, setTransactionData] = useState<any>(null);

  useEffect(() => {
    const token_ws = searchParams.get('token_ws');
    const TBK_TOKEN = searchParams.get('TBK_TOKEN');
    const TBK_ORDEN_COMPRA = searchParams.get('TBK_ORDEN_COMPRA');
    const TBK_ID_SESION = searchParams.get('TBK_ID_SESION');

    // Si es una transacción cancelada por el usuario
    if (TBK_TOKEN || TBK_ORDEN_COMPRA || TBK_ID_SESION) {
      setStatus('cancelled');
      return;
    }

    // Si hay un token, confirmar la transacción
    if (token_ws) {
      confirmTransaction(token_ws);
    } else {
      setStatus('failed');
    }
  }, [searchParams]);

  const confirmTransaction = async (token: string) => {
    try {
      // 1. Confirmar con Transbank mediante el servidor Python
      const webpayUrl = process.env.NEXT_PUBLIC_WEBPAY_URL || 'http://localhost:5001';
      const response = await fetch(`${webpayUrl}/webpay/commit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      // 2. Actualizar la orden en la base de datos
      await fetch('/api/webpay/commit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          responseCode: data.responseCode,
          authorizationCode: data.authorizationCode,
          amount: data.amount,
          buyOrder: data.buyOrder,
          cardNumber: data.cardDetail?.cardNumber,
          transactionDate: data.transactionDate,
          paymentTypeCode: data.paymentTypeCode
        }),
      });

      if (data.success) {
        setStatus('success');
        setTransactionData(data);
        
        // Limpiar el carrito
        sessionStorage.removeItem('webpay_order');
        sessionStorage.removeItem('orderInfo');
      } else {
        setStatus('failed');
        setTransactionData(data);
      }
    } catch (error) {
      console.error('Error confirming transaction:', error);
      setStatus('failed');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          <p className="mt-4 text-gray-600 font-light">Confirmando tu pago...</p>
        </div>
      </div>
    );
  }

  if (status === 'cancelled') {
    return (
      <div className="min-h-screen bg-white py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-6">
              <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-3xl font-light text-gray-900 mb-4 tracking-tight">
              Pago Cancelado
            </h1>
            <p className="text-gray-600 mb-8 font-light">
              Has cancelado el proceso de pago. Tu orden no ha sido procesada.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/checkout"
                className="inline-block bg-black text-white px-8 py-3 text-sm tracking-wider uppercase hover:bg-gray-800 transition-colors"
              >
                Volver al Checkout
              </Link>
              <Link
                href="/"
                className="inline-block border border-black text-black px-8 py-3 text-sm tracking-wider uppercase hover:bg-gray-50 transition-colors"
              >
                Ir a la Tienda
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="min-h-screen bg-white py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
              <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-3xl font-light text-gray-900 mb-4 tracking-tight">
              Pago Rechazado
            </h1>
            <p className="text-gray-600 mb-4 font-light">
              Lo sentimos, tu pago no pudo ser procesado.
            </p>
            {transactionData && (
              <div className="bg-red-50 border border-red-200 rounded p-4 mb-8 text-left">
                <p className="text-sm text-red-800">
                  <strong>Código de respuesta:</strong> {transactionData.responseCode}
                </p>
                {transactionData.authorizationCode && (
                  <p className="text-sm text-red-800">
                    <strong>Código de autorización:</strong> {transactionData.authorizationCode}
                  </p>
                )}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/checkout"
                className="inline-block bg-black text-white px-8 py-3 text-sm tracking-wider uppercase hover:bg-gray-800 transition-colors"
              >
                Intentar Nuevamente
              </Link>
              <Link
                href="/cuenta"
                className="inline-block border border-black text-black px-8 py-3 text-sm tracking-wider uppercase hover:bg-gray-50 transition-colors"
              >
                Ver Mis Pedidos
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success
  return (
    <div className="min-h-screen bg-white py-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-light text-gray-900 mb-4 tracking-tight">
            ¡Pago Exitoso!
          </h1>
          <p className="text-gray-600 mb-8 font-light">
            Tu pedido ha sido confirmado y será procesado pronto.
          </p>

          {transactionData && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8 text-left">
              <h2 className="text-sm tracking-wider uppercase text-gray-900 mb-4">
                Detalles de la Transacción
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Orden de Compra:</span>
                  <span className="font-medium">{transactionData.buyOrder}</span>
                </div>
                {transactionData.authorizationCode && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Código de Autorización:</span>
                    <span className="font-medium">{transactionData.authorizationCode}</span>
                  </div>
                )}
                {transactionData.cardDetail?.cardNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tarjeta:</span>
                    <span className="font-medium">**** **** **** {transactionData.cardDetail.cardNumber}</span>
                  </div>
                )}
                {transactionData.amount && (
                  <div className="flex justify-between border-t border-gray-200 pt-3">
                    <span className="text-gray-600">Monto Total:</span>
                    <span className="font-medium text-lg">${transactionData.amount.toLocaleString('es-CL')} CLP</span>
                  </div>
                )}
                {transactionData.transactionDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fecha:</span>
                    <span className="font-medium">{new Date(transactionData.transactionDate).toLocaleString('es-CL')}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-blue-800 font-light">
              Recibirás un email de confirmación con los detalles de tu pedido y el número de seguimiento.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cuenta"
              className="inline-block bg-black text-white px-8 py-3 text-sm tracking-wider uppercase hover:bg-gray-800 transition-colors"
            >
              Ver Mis Pedidos
            </Link>
            <Link
              href="/"
              className="inline-block border border-black text-black px-8 py-3 text-sm tracking-wider uppercase hover:bg-gray-50 transition-colors"
            >
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WebpayReturnPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          <p className="mt-4 text-gray-600 font-light">Cargando...</p>
        </div>
      </div>
    }>
      <WebpayReturnContent />
    </Suspense>
  );
}

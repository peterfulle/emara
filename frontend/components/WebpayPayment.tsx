'use client';

import { useState } from 'react';
import Image from 'next/image';

interface WebpayPaymentProps {
  onPaymentInitiated: (url: string, token: string) => void;
  isProcessing: boolean;
}

export default function WebpayPayment({ onPaymentInitiated, isProcessing }: WebpayPaymentProps) {
  const [selectedMethod, setSelectedMethod] = useState<'webpay' | 'oneclick'>('webpay');

  return (
    <div className="space-y-4">
      {/* Webpay Plus */}
      <div 
        className={`border ${selectedMethod === 'webpay' ? 'border-black' : 'border-gray-200'} p-6 cursor-pointer transition-colors`}
        onClick={() => setSelectedMethod('webpay')}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <input
              type="radio"
              id="webpay"
              name="payment"
              checked={selectedMethod === 'webpay'}
              onChange={() => setSelectedMethod('webpay')}
              className="w-4 h-4"
            />
            <label htmlFor="webpay" className="text-sm font-light cursor-pointer">
              Webpay Plus
            </label>
          </div>
          <div className="flex items-center gap-2">
            <svg width="80" height="30" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="120" height="40" rx="4" fill="#0066CC"/>
              <text x="60" y="26" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="white" textAnchor="middle">
                Webpay
              </text>
            </svg>
          </div>
        </div>
        <div className="pl-7 text-xs text-gray-500 font-light">
          Paga de forma segura con tarjetas de crédito o débito. Serás redirigido a la plataforma de Transbank.
        </div>
        <div className="pl-7 mt-3 flex flex-wrap gap-2">
          <div className="text-xs text-gray-400 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 11V7h4v4H8z"/>
            </svg>
            Visa
          </div>
          <div className="text-xs text-gray-400 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 11V7h4v4H8z"/>
            </svg>
            Mastercard
          </div>
          <div className="text-xs text-gray-400 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 11V7h4v4H8z"/>
            </svg>
            Redcompra
          </div>
        </div>
      </div>

      {/* Información de seguridad */}
      <div className="bg-blue-50 border border-blue-100 p-4 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-blue-900 mb-1">Pago 100% Seguro</p>
            <p className="text-xs text-blue-700 font-light">
              Tu información está protegida por Transbank con tecnología de encriptación de última generación.
            </p>
          </div>
        </div>
      </div>

      {/* Información adicional */}
      {!isProcessing && (
        <div className="text-xs text-gray-500 font-light space-y-2">
          <p>• Serás redirigido a la plataforma de Transbank para completar el pago</p>
          <p>• Recibirás una confirmación por email una vez procesado el pago</p>
          <p>• Puedes pagar con cualquier tarjeta de crédito o débito</p>
        </div>
      )}
    </div>
  );
}

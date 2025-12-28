'use client';

import { useState, useRef, useEffect } from 'react';

interface OTPInputProps {
  email: string;
  onVerify: () => void;
  onCancel: () => void;
}

export default function OTPInput({ email, onVerify, onCancel }: OTPInputProps) {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Declarar todos los refs primero
  const inputRef0 = useRef<HTMLInputElement>(null);
  const inputRef1 = useRef<HTMLInputElement>(null);
  const inputRef2 = useRef<HTMLInputElement>(null);
  const inputRef3 = useRef<HTMLInputElement>(null);
  const inputRefs = [inputRef0, inputRef1, inputRef2, inputRef3];

  useEffect(() => {
    // Focus en el primer input al montar
    inputRefs[0].current?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Solo permitir números
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus al siguiente input
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    // Verificar automáticamente si se completaron los 4 dígitos
    if (newOtp.every(digit => digit !== '')) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 4);
    
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split('').concat(['', '', '', '']).slice(0, 4);
    setOtp(newOtp);

    // Focus al último input lleno o al siguiente vacío
    const nextEmptyIndex = newOtp.findIndex(digit => !digit);
    if (nextEmptyIndex !== -1) {
      inputRefs[nextEmptyIndex].current?.focus();
    } else {
      inputRefs[3].current?.focus();
      handleVerify(newOtp.join(''));
    }
  };

  const handleVerify = async (code: string) => {
    setIsVerifying(true);
    
    // Simular verificación (OTP correcto: 1234)
    await new Promise(resolve => setTimeout(resolve, 500));

    if (code === '1234') {
      onVerify();
    } else {
      setError('Código incorrecto. Intenta nuevamente.');
      setOtp(['', '', '', '']);
      inputRefs[0].current?.focus();
    }
    
    setIsVerifying(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white max-w-md w-full p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-light text-gray-900 mb-2 tracking-tight">
            Verificar Email
          </h2>
          <p className="text-sm text-gray-600 font-light">
            Hemos enviado un código de verificación a
          </p>
          <p className="text-sm font-medium text-gray-900 mt-1">{email}</p>
        </div>

        <div className="mb-6">
          <label className="block text-xs tracking-wider uppercase text-gray-700 mb-4">
            Código de Verificación
          </label>
          <div className="flex gap-3 justify-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                disabled={isVerifying}
                className="w-14 h-14 text-center text-2xl font-light border-b-2 border-gray-200 focus:border-black outline-none transition-colors disabled:opacity-50"
              />
            ))}
          </div>
          {error && (
            <p className="text-xs text-red-600 mt-3 text-center">{error}</p>
          )}
        </div>

        <div className="text-center mb-6">
          <p className="text-xs text-gray-500 mb-2">
            Código de prueba: <span className="font-mono font-medium">1234</span>
          </p>
          <button
            type="button"
            className="text-xs tracking-wider uppercase text-gray-600 hover:text-black transition-colors"
          >
            Reenviar código
          </button>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isVerifying}
            className="flex-1 border border-gray-200 py-3 text-sm tracking-wider uppercase hover:border-black transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => handleVerify(otp.join(''))}
            disabled={otp.some(digit => !digit) || isVerifying}
            className="flex-1 bg-black text-white py-3 text-sm tracking-wider uppercase hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifying ? 'Verificando...' : 'Verificar'}
          </button>
        </div>
      </div>
    </div>
  );
}

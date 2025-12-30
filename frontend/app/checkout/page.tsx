'use client';

import { useCart } from '@/lib/cart/CartContext';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '+56',
    rut: '',
    street: '',
    city: '',
    region: 'Región Metropolitana',
    postalCode: '',
    country: 'Chile',
  });

  const [shippingOption, setShippingOption] = useState<'standard' | 'pickup'>('standard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const chileanRegions = [
    'Región de Arica y Parinacota',
    'Región de Tarapacá',
    'Región de Antofagasta',
    'Región de Atacama',
    'Región de Coquimbo',
    'Región de Valparaíso',
    'Región Metropolitana',
    'Región del Libertador General Bernardo O\'Higgins',
    'Región del Maule',
    'Región de Ñuble',
    'Región del Biobío',
    'Región de La Araucanía',
    'Región de Los Ríos',
    'Región de Los Lagos',
    'Región de Aysén',
    'Región de Magallanes'
  ];

  const shippingCost = shippingOption === 'standard' ? 3990 : 0;
  const tax = Math.round(totalPrice * 0.19); // IVA 19%
  const finalTotal = totalPrice + shippingCost + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);

    try {
      // 1. Crear orden
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerData: {
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            rut: formData.rut,
          },
          shippingAddress: {
            street: formData.street,
            city: formData.city,
            region: formData.region,
            postalCode: formData.postalCode,
            country: formData.country,
          },
          billingAddress: {
            street: formData.street,
            city: formData.city,
            region: formData.region,
            postalCode: formData.postalCode,
            country: formData.country,
          },
          items: items.map(item => ({
            productId: item.id,
            sku: item.sku,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size || null,
            color: item.color || null,
          })),
          subtotal: totalPrice,
          shipping: shippingCost,
          tax,
          total: finalTotal,
        })
      });

      if (!orderResponse.ok) {
        throw new Error('Error al crear orden');
      }

      const { order, orderNumber } = await orderResponse.json();

      // 2. Crear transacción de Webpay Plus
      const webpayUrl = process.env.NEXT_PUBLIC_WEBPAY_URL || 'http://localhost:5001';
      const webpayResponse = await fetch(`${webpayUrl}/webpay/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          amount: finalTotal,
          buyOrder: orderNumber,
          returnUrl: `${window.location.origin}/checkout/webpay/return`,
        })
      });

      if (!webpayResponse.ok) {
        const errorData = await webpayResponse.json();
        throw new Error(errorData.error || 'Error al crear transacción de pago');
      }

      const { url, token } = await webpayResponse.json();

      // 3. Guardar información de la orden en sessionStorage para recuperarla después
      sessionStorage.setItem('webpay_order', JSON.stringify({
        orderId: order.id,
        orderNumber,
        total: finalTotal,
      }));

      // 4. Crear formulario y redirigir a Webpay
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = url;
      
      const tokenInput = document.createElement('input');
      tokenInput.type = 'hidden';
      tokenInput.name = 'token_ws';
      tokenInput.value = token;
      
      form.appendChild(tokenInput);
      document.body.appendChild(form);
      form.submit();

    } catch (err: any) {
      setError(err.message || 'Error al procesar el pago');
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-light text-gray-900 mb-4">Tu carrito está vacío</h2>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Continuar Comprando
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-light text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Formulario */}
          <div className="bg-white p-8 shadow-sm">
            <h2 className="text-xl font-light mb-6">Información de Envío</h2>

            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Nombre y Apellido */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              {/* Teléfono y RUT */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label htmlFor="rut" className="block text-sm font-medium text-gray-700 mb-2">
                    RUT (Opcional)
                  </label>
                  <input
                    id="rut"
                    type="text"
                    value={formData.rut}
                    onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="12.345.678-9"
                  />
                </div>
              </div>

              {/* Dirección */}
              <div>
                <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección <span className="text-red-500">*</span>
                </label>
                <input
                  id="street"
                  type="text"
                  required
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Ciudad y Región */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="city"
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
                    Región <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="region"
                    required
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    {chileanRegions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Código Postal */}
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Código Postal (Opcional)
                </label>
                <input
                  id="postalCode"
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Opciones de Envío */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Método de Envío <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-4 border-2 border-gray-300 cursor-pointer hover:border-black transition-colors">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="shipping"
                        value="standard"
                        checked={shippingOption === 'standard'}
                        onChange={() => setShippingOption('standard')}
                        className="w-4 h-4 text-black focus:ring-black"
                      />
                      <span className="ml-3 text-sm text-gray-900">Envío Estándar</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">$3.990</span>
                  </label>
                  
                  <label className="flex items-center justify-between p-4 border-2 border-gray-300 cursor-pointer hover:border-black transition-colors">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="shipping"
                        value="pickup"
                        checked={shippingOption === 'pickup'}
                        onChange={() => setShippingOption('pickup')}
                        className="w-4 h-4 text-black focus:ring-black"
                      />
                      <span className="ml-3 text-sm text-gray-900">Envío por Pagar</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">$0</span>
                  </label>
                </div>
              </div>

              {/* Botón de envío */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-black text-white py-4 text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Procesando...' : 'Pagar con Webpay Plus'}
              </button>
            </form>
          </div>

          {/* Resumen de Orden */}
          <div>
            <div className="bg-white p-8 shadow-sm sticky top-4">
              <h2 className="text-xl font-light mb-6">Resumen de Orden</h2>

              {/* Productos */}
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4">
                    <div className="relative w-20 h-20 bg-gray-100 flex-shrink-0">
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
                          <span className="text-gray-300">📦</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                      {item.size && <p className="text-xs text-gray-500">Talla: {item.size}</p>}
                      {item.color && <p className="text-xs text-gray-500">Color: {item.color}</p>}
                      <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                      <p className="text-sm font-medium text-gray-900">
                        ${(item.price * item.quantity).toLocaleString('es-CL')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totales */}
              <div className="border-t border-gray-200 pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">${totalPrice.toLocaleString('es-CL')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Envío</span>
                  <span className="text-gray-900">${shippingCost.toLocaleString('es-CL')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">IVA (19%)</span>
                  <span className="text-gray-900">${tax.toLocaleString('es-CL')}</span>
                </div>
                <div className="flex justify-between text-lg font-medium border-t border-gray-200 pt-3">
                  <span>Total</span>
                  <span>${finalTotal.toLocaleString('es-CL')}</span>
                </div>
              </div>

              {/* Logos de pago */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center mb-3">Pago 100% seguro con</p>
                <div className="flex flex-col items-center gap-2">
                  <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="120" height="40" rx="4" fill="#0066CC"/>
                    <text x="60" y="26" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="white" textAnchor="middle">
                      Webpay Plus
                    </text>
                  </svg>
                  <div className="flex gap-2 items-center text-xs text-gray-400">
                    <span>Visa</span>
                    <span>•</span>
                    <span>Mastercard</span>
                    <span>•</span>
                    <span>Redcompra</span>
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

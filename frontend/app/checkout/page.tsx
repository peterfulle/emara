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

  const shippingCost = 3990;
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

      // 2. Crear preferencia de Mercado Pago
      const mpResponse = await fetch('/api/mercadopago/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          orderNumber,
          total: finalTotal,
          customerEmail: formData.email,
          items: items.map(item => ({
            name: item.name,
            sku: item.sku,
            price: item.price,
            quantity: item.quantity,
          })),
        })
      });

      if (!mpResponse.ok) {
        throw new Error('Error al crear preferencia de pago');
      }

      const { initPoint, sandboxInitPoint } = await mpResponse.json();

      // 3. Redirigir a Mercado Pago
      // Usar sandboxInitPoint para pruebas, initPoint para producción
      const paymentUrl = process.env.NODE_ENV === 'production' ? initPoint : sandboxInitPoint;
      window.location.href = paymentUrl;

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

              {/* Botón de envío */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-black text-white py-4 text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Procesando...' : 'Ir a Pagar con Mercado Pago'}
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
                <p className="text-xs text-gray-500 text-center mb-3">Pago seguro con</p>
                <div className="flex justify-center">
                  <div className="text-2xl font-bold text-blue-500">Mercado Pago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

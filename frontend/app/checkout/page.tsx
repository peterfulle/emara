'use client';

import { useCart } from '@/lib/cart/CartContext';
import { useUser } from '@/lib/auth/UserContext';
import type { OrderData } from '@/lib/auth/UserContext';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import OTPInput from '@/components/OTPInput';
import ChileFlagIcon from '@/components/ChileFlagIcon';
import WebpayPayment from '@/components/WebpayPayment';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated, login, logout, updateUser, addOrder } = useUser();
  
  // Estados del formulario
  const [email, setEmail] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showLoginOption, setShowLoginOption] = useState(false);
  
  // Estados del formulario de datos
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '+56',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Chile',
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  // Estados de validación de campos
  const [fieldValidation, setFieldValidation] = useState({
    email: false,
    firstName: false,
    lastName: false,
    phone: false,
    address: false,
    city: false,
    state: false,
    zipCode: false,
  });

  // Si el usuario ya está autenticado, pre-llenar el formulario
  useEffect(() => {
    if (isAuthenticated && user) {
      setEmail(user.email);
      setIsEmailVerified(true);
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone || '+56',
        address: user.address,
        city: user.city,
        state: user.state,
        zipCode: user.zipCode,
        country: user.country,
      });
    }
  }, [isAuthenticated, user]);

  const shippingCost = totalPrice >= 50000 ? 0 : 5000;
  const finalTotal = totalPrice + shippingCost;

  const handleEmailBlur = () => {
    if (email && !isEmailVerified) {
      // Verificar si el usuario ya existe
      const existingUser = localStorage.getItem(`emara-user-${email}`);
      if (existingUser) {
        setShowLoginOption(true);
      }
    }
  };

  const handleRequestOTP = () => {
    if (!email) return;
    setShowOTP(true);
  };

  const handleOTPVerified = () => {
    setShowOTP(false);
    setIsEmailVerified(true);
    setFieldValidation(prev => ({ ...prev, email: true }));
    
    // Si el usuario ya existe, cargar sus datos
    const existingUserData = localStorage.getItem(`emara-user-${email}`);
    if (existingUserData) {
      const userData = JSON.parse(existingUserData);
      login(email, userData);
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phone: userData.phone || '',
        address: userData.address || '',
        city: userData.city || '',
        state: userData.state || '',
        zipCode: userData.zipCode || '',
        country: userData.country || 'Chile',
      });
      
      // Validar campos cargados
      setFieldValidation(prev => ({
        ...prev,
        firstName: !!userData.firstName,
        lastName: !!userData.lastName,
        phone: userData.phone?.length === 12, // +569 12345678
        address: !!userData.address,
        city: !!userData.city,
        state: !!userData.state,
        zipCode: !!userData.zipCode,
      }));
    } else {
      // Usuario nuevo
      login(email);
    }
  };

  const handleChangeEmail = () => {
    setIsEmailVerified(false);
    setEmail('');
    setFieldValidation(prev => ({ ...prev, email: false }));
    logout();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validar el campo
    if (value.trim().length > 0) {
      setFieldValidation(prev => ({ ...prev, [name]: true }));
    } else {
      setFieldValidation(prev => ({ ...prev, [name]: false }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Eliminar todo excepto números
    value = value.replace(/\D/g, '');
    
    // Si empieza con 56, quitarlo (ya está en el prefijo)
    if (value.startsWith('56')) {
      value = value.slice(2);
    }
    
    // Si empieza con 9, dejar como está
    // Si no empieza con 9, agregar 9 al inicio si hay dígitos
    if (value.length > 0 && !value.startsWith('9')) {
      value = '9' + value;
    }
    
    // Limitar a 9 dígitos (9 + 8 dígitos)
    value = value.slice(0, 9);
    
    // Formatear: +569 12345678
    let formatted = '+56';
    if (value.length > 0) {
      formatted += value.charAt(0); // El 9
      if (value.length > 1) {
        formatted += ' ' + value.slice(1, 9); // Los 8 dígitos restantes
      }
    }
    
    setFormData(prev => ({ ...prev, phone: formatted }));
    
    // Validar teléfono (debe tener 9 dígitos)
    if (value.length === 9) {
      setFieldValidation(prev => ({ ...prev, phone: true }));
    } else {
      setFieldValidation(prev => ({ ...prev, phone: false }));
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Guardar/actualizar datos del usuario
      updateUser(formData);
      localStorage.setItem(`emara-user-${email}`, JSON.stringify(formData));

      // Preparar items para Magento
      const magentoItems = items.map(item => ({
        sku: item.sku,
        quantity: item.quantity,
      }));

      // Preparar dirección para Magento
      const magentoAddress = {
        firstname: formData.firstName,
        lastname: formData.lastName,
        street: [formData.address],
        city: formData.city,
        region: formData.state,
        postcode: formData.zipCode,
        country_code: 'CL', // Chile
        telephone: formData.phone,
      };

      // Crear orden en Magento a través del API route
      console.log('Creating order in Magento...');
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          items: magentoItems,
          shippingAddress: magentoAddress,
          billingAddress: magentoAddress,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Error creating order');
      }

      const { order: magentoOrder } = await response.json();
      console.log('Magento order created:', magentoOrder);

      // Crear el pedido local para el historial del usuario
      const shippingCost = 5000;
      const subtotal = totalPrice;
      const total = subtotal + shippingCost;

      const newOrder: OrderData = {
        id: magentoOrder.order_id,
        orderNumber: magentoOrder.order_number,
        date: new Date().toISOString(),
        status: 'pending',
        items: items.map(item => ({
          sku: item.sku,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
          image: item.image,
        })),
        subtotal,
        shipping: shippingCost,
        total,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
      };

      // Guardar en el historial local del usuario
      addOrder(newOrder);

      // Iniciar pago con Webpay
      console.log('Initiating Webpay payment...');
      const webpayResponse = await fetch('/api/webpay/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: magentoOrder.order_id,
          amount: Math.round(total),
          buyOrder: magentoOrder.order_number,
          returnUrl: `${window.location.origin}/checkout/webpay/return`,
        }),
      });

      if (!webpayResponse.ok) {
        const errorData = await webpayResponse.json();
        throw new Error(errorData.details || 'Error creating Webpay transaction');
      }

      const { url, token } = await webpayResponse.json();
      console.log('Webpay transaction created, redirecting...');

      // Redirigir a Webpay
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

    } catch (error) {
      console.error('Error creating order:', error);
      alert('Hubo un error al procesar tu pedido. Por favor intenta nuevamente.');
      setIsProcessing(false);
    }
  };

  // Pantalla de carrito vacío
  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-light text-gray-900 mb-4 tracking-tight">
              Tu carrito está vacío
            </h1>
            <p className="text-gray-600 mb-12 font-light">
              Agrega productos para continuar con tu compra
            </p>
            <Link
              href="/"
              className="inline-block bg-black text-white px-12 py-4 text-sm tracking-wider uppercase hover:bg-gray-800 transition-all duration-300"
            >
              Ir a la tienda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla de orden completada
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-white py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <svg className="w-20 h-20 mx-auto text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-light text-gray-900 mb-4 tracking-tight">
            ¡Orden Confirmada!
          </h1>
          <p className="text-gray-600 mb-2 font-light">
            Gracias por tu compra, {user?.firstName || 'cliente'}. Recibirás un email de confirmación pronto.
          </p>
          <p className="text-sm text-gray-500 mb-12">
            Tu pedido ha sido registrado exitosamente
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-black text-white px-12 py-4 text-sm tracking-wider uppercase hover:bg-gray-800 transition-all"
            >
              Volver a la tienda
            </Link>
            <Link
              href="/cuenta/pedidos"
              className="border border-black px-12 py-4 text-sm tracking-wider uppercase hover:bg-black hover:text-white transition-all"
            >
              Ver mis pedidos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      {showOTP && (
        <OTPInput
          email={email}
          onVerify={handleOTPVerified}
          onCancel={() => setShowOTP(false)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-gray-500 mb-2">Paso final</p>
          <h1 className="text-4xl font-light text-gray-900 tracking-tight">Checkout</h1>
          {isAuthenticated && user && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Conectado como <span className="font-medium">{user.email}</span>
              </p>
              <button
                onClick={logout}
                className="text-xs tracking-wider uppercase text-gray-500 hover:text-black transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Formulario */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmitOrder} className="space-y-8">
              {/* Sección de Email con OTP */}
              <div className="pb-8 border-b border-gray-100">
                <h2 className="text-sm tracking-wider uppercase text-gray-900 mb-6">
                  1. Email
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs tracking-wider uppercase text-gray-700 mb-2">
                      Email *
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={handleEmailBlur}
                        disabled={isEmailVerified}
                        required
                        className="flex-1 border-b border-gray-200 py-3 focus:border-black outline-none transition-colors font-light disabled:opacity-50 disabled:bg-gray-50"
                        placeholder="tu@email.com"
                      />
                      {!isEmailVerified && email && (
                        <button
                          type="button"
                          onClick={handleRequestOTP}
                          className="px-6 py-3 bg-black text-white text-xs tracking-wider uppercase hover:bg-gray-800 transition-colors"
                        >
                          Verificar
                        </button>
                      )}
                      {isEmailVerified && (
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 px-4">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-xs text-green-600 tracking-wider uppercase">Verificado</span>
                          </div>
                          <button
                            type="button"
                            onClick={handleChangeEmail}
                            className="text-xs text-gray-500 hover:text-black transition-colors underline"
                          >
                            Cambiar
                          </button>
                        </div>
                      )}
                    </div>
                    {showLoginOption && !isEmailVerified && (
                      <p className="mt-2 text-xs text-gray-600">
                        Este email ya está registrado. Verifica tu identidad para continuar.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Información Personal - Solo visible después de verificar email */}
              {isEmailVerified && (
                <>
                  <div className="pb-8 border-b border-gray-100">
                    <h2 className="text-sm tracking-wider uppercase text-gray-900 mb-6">
                      2. Información Personal
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs tracking-wider uppercase text-gray-700 mb-2">
                          Nombre *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                            className="w-full border-b border-gray-200 py-3 pr-8 focus:border-black outline-none transition-colors font-light"
                          />
                          {fieldValidation.firstName && (
                            <div className="absolute right-0 top-3">
                              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs tracking-wider uppercase text-gray-700 mb-2">
                          Apellido *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                            className="w-full border-b border-gray-200 py-3 pr-8 focus:border-black outline-none transition-colors font-light"
                          />
                          {fieldValidation.lastName && (
                            <div className="absolute right-0 top-3">
                              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs tracking-wider uppercase text-gray-700 mb-2">
                          Teléfono *
                        </label>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 px-3 py-3 border-b border-gray-200 bg-gray-50">
                            <ChileFlagIcon className="w-6 h-4" />
                            <span className="text-sm text-gray-600">+56</span>
                          </div>
                          <div className="flex-1 relative">
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone.replace('+56', '')}
                              onChange={handlePhoneChange}
                              required
                              placeholder="9 12345678"
                              maxLength={10}
                              className="w-full border-b border-gray-200 py-3 pr-8 focus:border-black outline-none transition-colors font-light"
                            />
                            {fieldValidation.phone && (
                              <div className="absolute right-0 top-3">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Formato: +569 12345678</p>
                      </div>
                    </div>
                  </div>

                  {/* Dirección de Envío */}
                  <div className="pb-8 border-b border-gray-100">
                    <h2 className="text-sm tracking-wider uppercase text-gray-900 mb-6">
                      3. Dirección de Envío
                    </h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs tracking-wider uppercase text-gray-700 mb-2">
                          Dirección *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                            className="w-full border-b border-gray-200 py-3 pr-8 focus:border-black outline-none transition-colors font-light"
                          />
                          {fieldValidation.address && (
                            <div className="absolute right-0 top-3">
                              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs tracking-wider uppercase text-gray-700 mb-2">
                            Ciudad *
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              required
                              className="w-full border-b border-gray-200 py-3 pr-8 focus:border-black outline-none transition-colors font-light"
                            />
                            {fieldValidation.city && (
                              <div className="absolute right-0 top-3">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs tracking-wider uppercase text-gray-700 mb-2">
                            Región/Estado *
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="state"
                              value={formData.state}
                              onChange={handleInputChange}
                              required
                              className="w-full border-b border-gray-200 py-3 pr-8 focus:border-black outline-none transition-colors font-light"
                            />
                            {fieldValidation.state && (
                              <div className="absolute right-0 top-3">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs tracking-wider uppercase text-gray-700 mb-2">
                            Código Postal *
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="zipCode"
                              value={formData.zipCode}
                              onChange={handleInputChange}
                              required
                              className="w-full border-b border-gray-200 py-3 pr-8 focus:border-black outline-none transition-colors font-light"
                            />
                            {fieldValidation.zipCode && (
                              <div className="absolute right-0 top-3">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs tracking-wider uppercase text-gray-700 mb-2">
                            País *
                          </label>
                          <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            required
                            className="w-full border-b border-gray-200 py-3 focus:border-black outline-none transition-colors font-light"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Método de Pago */}
                  <div>
                    <h2 className="text-sm tracking-wider uppercase text-gray-900 mb-6">
                      4. Método de Pago
                    </h2>
                    <WebpayPayment
                      onPaymentInitiated={(url, token) => {
                        console.log('Payment initiated', url, token);
                      }}
                      isProcessing={isProcessing}
                    />
                  </div>

                  {/* Botón de Envío */}
                  <div className="pt-6">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full bg-black text-white py-4 text-sm tracking-wider uppercase hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                      {isProcessing ? 'Procesando...' : `Realizar Pedido - $${finalTotal.toFixed(0)}`}
                    </button>
                  </div>
                </>
              )}

              {/* Mensaje si no ha verificado email */}
              {!isEmailVerified && email && (
                <div className="text-center py-12">
                  <p className="text-gray-600 font-light">
                    Verifica tu email para continuar con el checkout
                  </p>
                </div>
              )}
            </form>
          </div>

          {/* Resumen del Pedido */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 sticky top-6">
              <h2 className="text-sm tracking-wider uppercase text-gray-900 mb-6">
                Resumen del Pedido
              </h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item, index) => (
                  <div key={`${item.sku}-${index}`} className="flex gap-4">
                    <div className="relative w-16 h-20 bg-gray-200 flex-shrink-0">
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
                          <span className="text-2xl text-gray-400">📦</span>
                        </div>
                      )}
                      <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-light text-gray-900 mb-1">{item.name}</p>
                      {item.selectedSize && (
                        <p className="text-xs text-gray-500">Talla: {item.selectedSize}</p>
                      )}
                      {item.selectedColor && (
                        <p className="text-xs text-gray-500">Color: {item.selectedColor}</p>
                      )}
                      <p className="text-sm font-light text-gray-900 mt-1">
                        ${(item.price * item.quantity).toFixed(0)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-light">${totalPrice.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Envío</span>
                  <span className="font-light">
                    {shippingCost === 0 ? 'Gratis' : `$${shippingCost.toFixed(0)}`}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-light border-t border-gray-200 pt-3">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(0)} CLP</span>
                </div>
              </div>

              {totalPrice < 50000 && (
                <div className="mt-4 p-3 bg-white border border-gray-200">
                  <p className="text-xs text-gray-600">
                    Agrega ${(50000 - totalPrice).toFixed(0)} más para envío gratis
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

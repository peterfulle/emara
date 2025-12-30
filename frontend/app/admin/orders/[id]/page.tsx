'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface OrderDetail {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: any;
  authorizationCode: string | null;
  transactionDate: string | null;
  cardNumber: string | null;
  responseCode: number | null;
  createdAt: string;
  updatedAt: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
  };
  orderItems: Array<{
    id: string;
    name: string;
    sku: string;
    price: number;
    quantity: number;
    size: string | null;
    color: string | null;
    subtotal: number;
  }>;
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadOrder();
  }, [params.id]);

  const loadOrder = async () => {
    const token = localStorage.getItem('admin_token');
    
    if (!token) {
      router.push('/admin/login');
      return;
    }

    try {
      const response = await fetch(`/api/admin/orders/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Orden no encontrada');
      }

      const data = await response.json();
      setOrder(data.order);
      setLoading(false);
    } catch (error) {
      console.error('Error loading order:', error);
      router.push('/admin/orders');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'paid':
        return 'Pagado';
      case 'failed':
        return 'Fallido';
      case 'refunded':
        return 'Reembolsado';
      default:
        return status;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'processing':
        return 'Procesando';
      case 'completed':
        return 'Exitoso';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          <p className="mt-4 text-gray-600">Cargando orden...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/admin/dashboard" className="text-2xl font-light tracking-tight text-black">
                EMARA ADMIN
              </Link>
              <nav className="flex gap-6">
                <Link href="/admin/dashboard" className="text-sm text-gray-700 hover:text-black transition-colors">
                  Dashboard
                </Link>
                <Link href="/admin/products" className="text-sm text-gray-700 hover:text-black transition-colors">
                  Productos
                </Link>
                <Link href="/admin/orders" className="text-sm text-black font-medium">
                  Órdenes
                </Link>
                <Link href="/admin/customers" className="text-sm text-gray-700 hover:text-black transition-colors">
                  Clientes
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/admin/orders" className="text-sm text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Volver a órdenes
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-light text-gray-900 tracking-tight">
              Orden #{order.orderNumber}
            </h1>
            <div className="flex gap-3">
              <span className={`px-4 py-2 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                {getStatusLabel(order.status)}
              </span>
              <span className={`px-4 py-2 text-sm font-medium rounded-full ${
                order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {getPaymentStatusLabel(order.paymentStatus)}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Creada el {formatDate(order.createdAt)}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <div className="bg-white border border-gray-200 p-6">
              <h2 className="text-lg font-light text-gray-900 mb-4">Productos</h2>
              <div className="space-y-4">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-gray-200 last:border-0">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">SKU: {item.sku}</p>
                      {item.size && (
                        <p className="text-xs text-gray-500">Talla: {item.size}</p>
                      )}
                      {item.color && (
                        <p className="text-xs text-gray-500">Color: {item.color}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-900">${item.price.toLocaleString('es-CL')} × {item.quantity}</p>
                      <p className="text-sm font-medium text-gray-900">${item.subtotal.toLocaleString('es-CL')}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">${order.subtotal.toLocaleString('es-CL')}</span>
                </div>
                {order.shipping > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Envío</span>
                    <span className="text-gray-900">${order.shipping.toLocaleString('es-CL')}</span>
                  </div>
                )}
                {order.tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">IVA</span>
                    <span className="text-gray-900">${order.tax.toLocaleString('es-CL')}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-medium pt-2 border-t border-gray-200">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">${order.total.toLocaleString('es-CL')} CLP</span>
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            {order.authorizationCode && (
              <div className="bg-white border border-gray-200 p-6">
                <h2 className="text-lg font-light text-gray-900 mb-4">Detalles de Transacción</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Código de Autorización:</span>
                    <span className="font-medium text-gray-900">{order.authorizationCode}</span>
                  </div>
                  {order.cardNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tarjeta:</span>
                      <span className="font-medium text-gray-900">**** **** **** {order.cardNumber}</span>
                    </div>
                  )}
                  {order.responseCode !== null && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Código de Respuesta:</span>
                      <span className="font-medium text-gray-900">{order.responseCode}</span>
                    </div>
                  )}
                  {order.transactionDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fecha de Transacción:</span>
                      <span className="font-medium text-gray-900">{formatDate(order.transactionDate)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Método de Pago:</span>
                    <span className="font-medium text-gray-900 uppercase">{order.paymentMethod}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Customer Info */}
          <div className="space-y-6">
            {/* Customer */}
            <div className="bg-white border border-gray-200 p-6">
              <h2 className="text-lg font-light text-gray-900 mb-4">Cliente</h2>
              <div className="space-y-2 text-sm">
                <p className="font-medium text-gray-900">
                  {order.customer.firstName} {order.customer.lastName}
                </p>
                <p className="text-gray-600">{order.customer.email}</p>
                {order.customer.phone && (
                  <p className="text-gray-600">{order.customer.phone}</p>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white border border-gray-200 p-6">
              <h2 className="text-lg font-light text-gray-900 mb-4">Dirección de Envío</h2>
              <div className="text-sm text-gray-600">
                <p>{order.shippingAddress.street} {order.shippingAddress.number}</p>
                {order.shippingAddress.apartment && (
                  <p>Dpto/Casa: {order.shippingAddress.apartment}</p>
                )}
                <p>{order.shippingAddress.city}, {order.shippingAddress.region}</p>
                {order.shippingAddress.zipCode && (
                  <p>{order.shippingAddress.zipCode}</p>
                )}
                <p>{order.shippingAddress.country || 'Chile'}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface OrderItem {
  id: string;
  productName: string;
  sku: string;
  quantity: number;
  price: number;
  total: number;
}

interface OrderDetail {
  id: string;
  orderNumber: string;
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingRegion: string;
  shippingPostalCode: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentStatus: string;
  paymentMethod: string | null;
  authorizationCode: string | null;
  transactionDate: string | null;
  cardNumber: string | null;
  responseCode: string | null;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [shippingStatus, setShippingStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchOrderDetail();
  }, [params.id]);

  useEffect(() => {
    if (order) {
      setShippingStatus(order.status || 'pending');
    }
  }, [order]);

  const fetchOrderDetail = async () => {
    try {
      const response = await fetch(`/api/admin/orders/${params.id}`);
      const data = await response.json();
      if (response.ok) {
        setOrder(data.order);
      } else {
        console.error('Error fetching order detail:', data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateShippingStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/admin/orders/${params.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        setShippingStatus(newStatus);
        if (order) {
          setOrder({ ...order, status: newStatus });
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const getPaymentStatusStyle = (status: string) => {
    if (status === 'paid') return 'bg-black text-white';
    if (status === 'pending') return 'bg-gray-300 text-gray-700';
    return 'bg-red-100 text-red-800';
  };

  const getShippingStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      'pending': 'bg-gray-100 text-gray-800 border-gray-300',
      'processing': 'bg-blue-50 text-blue-800 border-blue-300',
      'shipped': 'bg-green-50 text-green-800 border-green-300',
      'delivered': 'bg-black text-white border-black'
    };
    return styles[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const shippingStatusOptions = [
    { value: 'pending', label: 'En Preparación' },
    { value: 'processing', label: 'Procesando' },
    { value: 'shipped', label: 'Despachado' },
    { value: 'delivered', label: 'Entregado' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-light text-gray-900 mb-4">Orden no encontrada</h2>
          <Link href="/admin/orders" className="text-black hover:text-gray-700 border-b border-black">
            ← Volver a órdenes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Compacto */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/admin/orders" className="inline-flex items-center text-xs text-gray-500 hover:text-black mb-3">
            <span className="mr-1">←</span> Volver
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-light tracking-tight">Orden #{order.orderNumber}</h1>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(order.createdAt).toLocaleDateString('es-CL', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Estados en una sola fila */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Estado de Pago */}
          <div className="border border-gray-200 p-4">
            <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Estado de Pago</div>
            <div className={`inline-flex items-center px-3 py-1.5 text-xs font-medium ${getPaymentStatusStyle(order.paymentStatus)}`}>
              {order.paymentStatus === 'paid' && '✓ Pagado'}
              {order.paymentStatus === 'pending' && '○ Pendiente'}
              {order.paymentStatus === 'failed' && '✕ Fallido'}
            </div>
          </div>

          {/* Estado de Envío */}
          <div className="border border-gray-200 p-4">
            <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Estado de Envío</div>
            <select
              value={shippingStatus}
              onChange={(e) => updateShippingStatus(e.target.value)}
              disabled={updating}
              className={`w-full px-3 py-1.5 text-xs font-medium border ${getShippingStatusStyle(shippingStatus)} ${updating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-black'} transition-colors`}
            >
              {shippingStatusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid Principal: 2 columnas */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Columna Izquierda: Productos */}
          <div className="lg:col-span-2">
            <div className="border border-gray-200">
              <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
                <h3 className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Productos</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {order.items.map((item) => (
                  <div key={item.id} className="px-4 py-3 flex items-start justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 mb-0.5">{item.productName}</div>
                      <div className="text-xs text-gray-400">SKU: {item.sku}</div>
                    </div>
                    <div className="flex items-center gap-6 ml-4 text-xs flex-shrink-0">
                      <div className="text-gray-500 text-right min-w-[60px]">
                        ${item.price.toLocaleString('es-CL')}
                      </div>
                      <div className="text-gray-400">× {item.quantity}</div>
                      <div className="font-medium text-gray-900 min-w-[70px] text-right">
                        ${item.total.toLocaleString('es-CL')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totales */}
              <div className="border-t-2 border-gray-900 bg-gray-50 px-4 py-3">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal productos</span>
                    <span className="text-gray-900 font-medium">${order.subtotal.toLocaleString('es-CL')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Costo de envío</span>
                    <span className="text-gray-900 font-medium">
                      {order.shippingCost === 0 ? 'Por Pagar' : `$${order.shippingCost.toLocaleString('es-CL')}`}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-300 mt-2">
                    <span className="font-semibold text-gray-900 text-sm">Total</span>
                    <span className="text-lg font-bold text-gray-900">${order.total.toLocaleString('es-CL')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Info compacta */}
          <div className="space-y-4">
            {/* Cliente */}
            <div className="border border-gray-200">
              <div className="border-b border-gray-200 px-4 py-2.5 bg-gray-50">
                <h3 className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Cliente</h3>
              </div>
              <div className="px-4 py-3 space-y-2">
                <div className="text-sm font-medium text-gray-900">
                  {order.customerFirstName} {order.customerLastName}
                </div>
                <div className="space-y-0.5 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{order.customerEmail}</span>
                  </div>
                  {order.customerPhone && (
                    <div className="flex items-center gap-2">
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{order.customerPhone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Dirección de Envío */}
            <div className="border border-gray-200">
              <div className="border-b border-gray-200 px-4 py-2.5 bg-gray-50">
                <h3 className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Dirección de Envío</h3>
              </div>
              <div className="px-4 py-3">
                <div className="space-y-1 text-xs text-gray-700 leading-relaxed">
                  <div className="font-medium text-gray-900">{order.shippingAddress}</div>
                  <div className="text-gray-600">
                    {order.shippingCity}
                    {order.shippingRegion && `, ${order.shippingRegion}`}
                  </div>
                  {order.shippingPostalCode && (
                    <div className="text-gray-500">CP: {order.shippingPostalCode}</div>
                  )}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Costo de envío</span>
                    <span className="font-semibold text-gray-900">
                      {order.shippingCost === 0 ? (
                        <span className="text-orange-600">Por Pagar</span>
                      ) : (
                        `$${order.shippingCost.toLocaleString('es-CL')}`
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detalles de Pago */}
            {order.paymentStatus === 'paid' && (
              <div className="border border-gray-200">
                <div className="border-b border-gray-200 px-4 py-2.5 bg-gray-50">
                  <h3 className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Transacción</h3>
                </div>
                <div className="px-4 py-3 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">Método de pago</span>
                    <span className="text-gray-900 font-medium text-right">{order.paymentMethod}</span>
                  </div>
                  {order.authorizationCode && (
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500">Autorización</span>
                      <span className="text-gray-900 font-mono text-[11px]">{order.authorizationCode}</span>
                    </div>
                  )}
                  {order.cardNumber && (
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500">Tarjeta</span>
                      <span className="text-gray-900">**** {order.cardNumber}</span>
                    </div>
                  )}
                  {order.transactionDate && (
                    <div className="flex justify-between items-center text-xs pt-2 border-t border-gray-100">
                      <span className="text-gray-500">Fecha transacción</span>
                      <span className="text-gray-900 text-[11px]">
                        {new Date(order.transactionDate).toLocaleDateString('es-CL', {
                          day: '2-digit',
                          month: '2-digit',
                          year: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

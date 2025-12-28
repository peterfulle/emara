'use client';

import { useUser, OrderData } from '@/lib/auth/UserContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PedidosPage() {
  const { user, isAuthenticated } = useUser();
  const router = useRouter();
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/checkout');
      return;
    }

    // Cargar órdenes desde Magento
    const fetchOrders = async () => {
      if (!user?.email) return;

      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching orders for:', user.email);
        const response = await fetch(`/api/orders?email=${encodeURIComponent(user.email)}`);
        
        if (!response.ok) {
          throw new Error('Error al cargar pedidos');
        }

        const data = await response.json();
        
        if (data.success) {
          console.log('Orders loaded from Magento:', data.orders.length);
          setOrders(data.orders);
        } else {
          throw new Error(data.error || 'Error desconocido');
        }
      } catch (err: any) {
        console.error('Error loading orders:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, user?.email, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            <p className="mt-4 text-gray-600">Cargando tus pedidos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-20">
            <p className="text-red-600 mb-4">Error al cargar pedidos: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-block bg-black text-white px-8 py-3 hover:bg-gray-800 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: 'Pendiente',
      processing: 'En Proceso',
      completed: 'Completado',
      cancelled: 'Cancelado',
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'text-yellow-600',
      processing: 'text-blue-600',
      completed: 'text-green-600',
      cancelled: 'text-red-600',
    };
    return colors[status as keyof typeof colors] || 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <Link href="/" className="text-sm text-gray-600 hover:text-black transition-colors">
            ← Volver a la tienda
          </Link>
        </div>

        <div className="mb-12">
          <h1 className="text-3xl tracking-tight font-light mb-2">Mis Pedidos</h1>
          <p className="text-gray-600">
            {user.firstName} {user.lastName} ({user.email})
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-20 h-20 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <p className="text-gray-600 mb-6">No tienes pedidos aún</p>
            <Link
              href="/"
              className="inline-block bg-black text-white px-8 py-3 hover:bg-gray-800 transition-colors"
            >
              Ir a Comprar
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 hover:border-gray-300 transition-colors"
              >
                {/* Header de la orden */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-lg tracking-tight">
                        Pedido #{order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(order.date).toLocaleDateString('es-CL', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                      <span className="text-lg font-light">
                        ${order.total.toLocaleString('es-CL')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Items del pedido */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={`${item.sku}-${index}`} className="flex gap-4">
                        {item.image && (
                          <div className="w-20 h-20 bg-gray-100 flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-light tracking-tight mb-1">{item.name}</h4>
                          <div className="text-sm text-gray-600 space-y-1">
                            {item.selectedSize && (
                              <p>Talla: {item.selectedSize}</p>
                            )}
                            {item.selectedColor && (
                              <p>Color: {item.selectedColor}</p>
                            )}
                            <p>Cantidad: {item.quantity}</p>
                            <p className="font-medium text-black">
                              ${item.price.toLocaleString('es-CL')} c/u
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            ${(item.price * item.quantity).toLocaleString('es-CL')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Resumen de la orden */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-6">
                      {/* Dirección de envío */}
                      <div className="text-sm">
                        <h4 className="font-medium mb-2">Dirección de Envío</h4>
                        <div className="text-gray-600 space-y-1">
                          <p>
                            {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                          </p>
                          <p>{order.shippingAddress.phone}</p>
                          <p>{order.shippingAddress.address}</p>
                          <p>
                            {order.shippingAddress.city}, {order.shippingAddress.state}
                          </p>
                          <p>
                            {order.shippingAddress.zipCode}, {order.shippingAddress.country}
                          </p>
                        </div>
                      </div>

                      {/* Totales */}
                      <div className="text-sm space-y-2 sm:text-right min-w-[200px]">
                        <div className="flex justify-between sm:justify-end gap-8">
                          <span className="text-gray-600">Subtotal:</span>
                          <span>${order.subtotal.toLocaleString('es-CL')}</span>
                        </div>
                        <div className="flex justify-between sm:justify-end gap-8">
                          <span className="text-gray-600">Envío:</span>
                          <span>${order.shipping.toLocaleString('es-CL')}</span>
                        </div>
                        <div className="flex justify-between sm:justify-end gap-8 pt-2 border-t border-gray-200 font-medium text-base">
                          <span>Total:</span>
                          <span>${order.total.toLocaleString('es-CL')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface MagentoOrder {
  entity_id: string;
  increment_id: string;
  created_at: string;
  status: string;
  state: string;
  grand_total: number;
  customer_email: string;
  customer_firstname: string;
  customer_lastname: string;
  items: any[];
  billing_address: any;
  payment: any;
}

interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  complete: number;
  totalRevenue: number;
}

export default function ReportsPage() {
  const [orders, setOrders] = useState<MagentoOrder[]>([]);
  const [stats, setStats] = useState<OrderStats>({
    total: 0,
    pending: 0,
    processing: 0,
    complete: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/reports/orders');
      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
        calculateStats(data.orders);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ordersList: MagentoOrder[]) => {
    const stats = {
      total: ordersList.length,
      pending: ordersList.filter(o => o.status === 'pending').length,
      processing: ordersList.filter(o => o.status === 'processing').length,
      complete: ordersList.filter(o => o.status === 'complete').length,
      totalRevenue: ordersList.reduce((sum, o) => sum + o.grand_total, 0),
    };
    setStats(stats);
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'complete':
        return 'bg-green-100 text-green-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            <p className="mt-4 text-gray-600">Cargando reportes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-light text-gray-900 tracking-tight">
                Reportes de Ventas
              </h1>
              <p className="mt-2 text-gray-600 font-light">
                Panel de administración de órdenes
              </p>
            </div>
            <Link
              href="/"
              className="border border-black px-6 py-2 text-sm tracking-wider uppercase hover:bg-black hover:text-white transition-colors"
            >
              Volver a la Tienda
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 border border-gray-200">
            <div className="text-sm text-gray-600 uppercase tracking-wider mb-2">
              Total Órdenes
            </div>
            <div className="text-3xl font-light text-gray-900">
              {stats.total}
            </div>
          </div>
          
          <div className="bg-white p-6 border border-gray-200">
            <div className="text-sm text-yellow-600 uppercase tracking-wider mb-2">
              Pendientes
            </div>
            <div className="text-3xl font-light text-gray-900">
              {stats.pending}
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-200">
            <div className="text-sm text-blue-600 uppercase tracking-wider mb-2">
              Procesando
            </div>
            <div className="text-3xl font-light text-gray-900">
              {stats.processing}
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-200">
            <div className="text-sm text-green-600 uppercase tracking-wider mb-2">
              Completadas
            </div>
            <div className="text-3xl font-light text-gray-900">
              {stats.complete}
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-200">
            <div className="text-sm text-gray-600 uppercase tracking-wider mb-2">
              Ingresos
            </div>
            <div className="text-3xl font-light text-gray-900">
              ${stats.totalRevenue.toLocaleString('es-CL')}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 p-4 mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-sm tracking-wider uppercase transition-colors ${
                filter === 'all'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 text-sm tracking-wider uppercase transition-colors ${
                filter === 'pending'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setFilter('processing')}
              className={`px-4 py-2 text-sm tracking-wider uppercase transition-colors ${
                filter === 'processing'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Procesando
            </button>
            <button
              onClick={() => setFilter('complete')}
              className={`px-4 py-2 text-sm tracking-wider uppercase transition-colors ${
                filter === 'complete'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completadas
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orden
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Método de Pago
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.entity_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.increment_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.customer_firstname} {order.customer_lastname}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.customer_email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${order.grand_total.toLocaleString('es-CL')} CLP
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.payment?.method === 'transbank_webpay' ? 'Webpay Plus' : order.payment?.method || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No hay órdenes para mostrar
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

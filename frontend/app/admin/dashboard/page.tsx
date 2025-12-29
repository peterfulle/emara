'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface Stats {
  products: {
    total: number;
    active: number;
    inactive: number;
  };
  orders: {
    total: number;
    pending: number;
  };
  customers: number;
  revenue: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('admin_token');
    
    if (!token) {
      router.push('/admin/login');
      return;
    }

    try {
      const response = await fetch('/api/admin/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Token inválido');
      }

      const data = await response.json();
      setUser(data.user);
      await loadStats(token);
      setLoading(false);

    } catch (error) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      router.push('/admin/login');
    }
  };

  const loadStats = async (token: string) => {
    try {
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setRecentOrders(data.recentOrders || []);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.push('/admin/login');
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
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
                <Link href="/admin/orders" className="text-sm text-gray-700 hover:text-black transition-colors">
                  Órdenes
                </Link>
                <Link href="/admin/customers" className="text-sm text-gray-700 hover:text-black transition-colors">
                  Clientes
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="text-sm text-gray-600 hover:text-black transition-colors"
                target="_blank"
              >
                Ver Tienda →
              </Link>
              <div className="border-l border-gray-300 pl-4">
                <span className="text-sm text-gray-600">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="ml-4 text-sm text-gray-600 hover:text-black transition-colors"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900 tracking-tight">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Bienvenido al panel de administración de Emara
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-600 uppercase tracking-wider">
                Productos
              </div>
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="text-4xl font-light text-gray-900 mb-2">
              {stats?.products.total || 0}
            </div>
            <div className="text-xs text-gray-500 mb-3">
              {stats?.products.active || 0} activos · {stats?.products.inactive || 0} inactivos
            </div>
            <Link href="/admin/products" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Ver todos →
            </Link>
          </div>

          <div className="bg-white border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-600 uppercase tracking-wider">
                Órdenes
              </div>
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div className="text-4xl font-light text-gray-900 mb-2">
              {stats?.orders.total || 0}
            </div>
            <div className="text-xs text-gray-500 mb-3">
              {stats?.orders.pending || 0} pendientes
            </div>
            <Link href="/admin/orders" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Ver todas →
            </Link>
          </div>

          <div className="bg-white border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-600 uppercase tracking-wider">
                Clientes
              </div>
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="text-4xl font-light text-gray-900 mb-2">
              {stats?.customers || 0}
            </div>
            <div className="text-xs text-gray-500 mb-3">
              Registrados en la plataforma
            </div>
            <Link href="/admin/customers" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Ver todos →
            </Link>
          </div>

          <div className="bg-white border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-600 uppercase tracking-wider">
                Ingresos
              </div>
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-4xl font-light text-gray-900 mb-2">
              ${stats?.revenue.toLocaleString('es-CL') || 0}
            </div>
            <div className="text-xs text-gray-500 mb-3">
              Total de ventas
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Link
            href="/admin/products/new"
            className="bg-white border-2 border-dashed border-gray-300 p-8 hover:border-black hover:bg-gray-50 transition-all text-center group"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 group-hover:bg-black transition-colors flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-lg font-light text-gray-700 group-hover:text-black">Nuevo Producto</span>
            <p className="text-sm text-gray-500 mt-2">Agregar producto al catálogo</p>
          </Link>

          <Link
            href="/admin/orders"
            className="bg-white border-2 border-dashed border-gray-300 p-8 hover:border-black hover:bg-gray-50 transition-all text-center group"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 group-hover:bg-black transition-colors flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="text-lg font-light text-gray-700 group-hover:text-black">Gestionar Órdenes</span>
            <p className="text-sm text-gray-500 mt-2">Ver y procesar órdenes</p>
          </Link>

          <Link
            href="/admin/customers"
            className="bg-white border-2 border-dashed border-gray-300 p-8 hover:border-black hover:bg-gray-50 transition-all text-center group"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 group-hover:bg-black transition-colors flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="text-lg font-light text-gray-700 group-hover:text-black">Ver Clientes</span>
            <p className="text-sm text-gray-500 mt-2">Administrar base de clientes</p>
          </Link>
        </div>

        {/* Recent Orders */}
        {recentOrders.length > 0 && (
          <div className="bg-white border border-gray-200">
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-light text-gray-900">Órdenes Recientes</h2>
                <Link href="/admin/orders" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Ver todas →
                </Link>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orden
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href={`/admin/orders/${order.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                          #{order.orderNumber}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.customer.firstName} {order.customer.lastName}</div>
                        <div className="text-xs text-gray-500">{order.customer.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${order.total.toLocaleString('es-CL')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

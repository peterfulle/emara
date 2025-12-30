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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 sticky top-0 z-40 bg-white">
        <div className="max-w-7xl mx-auto px-8 lg:px-12">
          <div className="flex items-center justify-between h-24">
            <div>
              <h1 className="text-3xl font-light tracking-tight text-black">Dashboard</h1>
              <p className="text-sm text-gray-400 mt-1">Bienvenido, {user?.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-medium text-black">{user?.name}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">{user?.role}</div>
              </div>
              <div className="w-11 h-11 rounded-full bg-black flex items-center justify-center text-white text-sm font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 lg:px-12 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100 mb-16">
          {/* Revenue Card */}
          <div className="bg-white p-8 hover:bg-gray-50 transition-colors group">
            <div className="mb-8">
              <div className="text-xs uppercase tracking-widest text-gray-400 mb-4 font-medium">Ingresos</div>
              <div className="text-4xl font-light text-black mb-2 tracking-tight">
                ${stats?.revenue.toLocaleString('es-CL') || 0}
              </div>
              <div className="text-xs text-gray-400">Total de ventas</div>
            </div>
            <div className="w-8 h-0.5 bg-black group-hover:w-16 transition-all duration-300"></div>
          </div>

          {/* Orders Card */}
          <Link href="/admin/orders" className="bg-white p-8 hover:bg-gray-50 transition-colors group block">
            <div className="mb-8">
              <div className="text-xs uppercase tracking-widest text-gray-400 mb-4 font-medium">Órdenes</div>
              <div className="text-4xl font-light text-black mb-2 tracking-tight">
                {stats?.orders.total || 0}
              </div>
              <div className="text-xs text-gray-400">
                {stats?.orders.pending || 0} pendientes
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-8 h-0.5 bg-black group-hover:w-16 transition-all duration-300"></div>
              <svg className="w-4 h-4 text-black opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Products Card */}
          <Link href="/admin/products" className="bg-white p-8 hover:bg-gray-50 transition-colors group block">
            <div className="mb-8">
              <div className="text-xs uppercase tracking-widest text-gray-400 mb-4 font-medium">Productos</div>
              <div className="text-4xl font-light text-black mb-2 tracking-tight">
                {stats?.products.total || 0}
              </div>
              <div className="text-xs text-gray-400">
                {stats?.products.active || 0} activos · {stats?.products.inactive || 0} inactivos
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-8 h-0.5 bg-black group-hover:w-16 transition-all duration-300"></div>
              <svg className="w-4 h-4 text-black opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Customers Card */}
          <Link href="/admin/customers" className="bg-white p-8 hover:bg-gray-50 transition-colors group block">
            <div className="mb-8">
              <div className="text-xs uppercase tracking-widest text-gray-400 mb-4 font-medium">Clientes</div>
              <div className="text-4xl font-light text-black mb-2 tracking-tight">
                {stats?.customers || 0}
              </div>
              <div className="text-xs text-gray-400">Registrados</div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-8 h-0.5 bg-black group-hover:w-16 transition-all duration-300"></div>
              <svg className="w-4 h-4 text-black opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="mb-16">
          <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-8 font-medium">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-100">
            <Link
              href="/admin/products/new"
              className="bg-white p-8 hover:bg-black hover:text-white transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-base font-medium mb-2">Nuevo Producto</div>
                  <div className="text-sm text-gray-400 group-hover:text-gray-300">Agregar al catálogo</div>
                </div>
                <svg className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </Link>

            <Link
              href="/admin/orders"
              className="bg-white p-8 hover:bg-black hover:text-white transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-base font-medium mb-2">Gestionar Órdenes</div>
                  <div className="text-sm text-gray-400 group-hover:text-gray-300">Ver y procesar</div>
                </div>
                <svg className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </Link>

            <Link
              href="/admin/reportes"
              className="bg-white p-8 hover:bg-black hover:text-white transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-base font-medium mb-2">Ver Reportes</div>
                  <div className="text-sm text-gray-400 group-hover:text-gray-300">Análisis y métricas</div>
                </div>
                <svg className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        {recentOrders.length > 0 && (
          <div className="border border-gray-100">
            <div className="border-b border-gray-100 px-8 py-6 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">Órdenes Recientes</h2>
                  <p className="text-sm text-gray-600">Últimas transacciones</p>
                </div>
                <Link 
                  href="/admin/orders" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-xs uppercase tracking-wider hover:bg-gray-800 transition-colors font-medium"
                >
                  Ver todas
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-4 text-left text-xs uppercase tracking-widest text-gray-400 font-medium">
                      Orden
                    </th>
                    <th className="px-8 py-4 text-left text-xs uppercase tracking-widest text-gray-400 font-medium">
                      Cliente
                    </th>
                    <th className="px-8 py-4 text-left text-xs uppercase tracking-widest text-gray-400 font-medium">
                      Estado
                    </th>
                    <th className="px-8 py-4 text-left text-xs uppercase tracking-widest text-gray-400 font-medium">
                      Total
                    </th>
                    <th className="px-8 py-4 text-left text-xs uppercase tracking-widest text-gray-400 font-medium">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-8 py-5 whitespace-nowrap">
                        <Link href={`/admin/orders/${order.id}`} className="text-sm font-medium text-black hover:underline">
                          #{order.orderNumber}
                        </Link>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-black rounded-full flex items-center justify-center text-white text-xs font-medium">
                            {order.customer.firstName.charAt(0)}{order.customer.lastName.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-black">{order.customer.firstName} {order.customer.lastName}</div>
                            <div className="text-xs text-gray-400">{order.customer.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs font-medium uppercase tracking-wider ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="text-sm font-medium text-black">
                          ${order.total.toLocaleString('es-CL')}
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-400">
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

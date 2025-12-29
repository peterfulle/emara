'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminCustomersPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
    }
  }, []);

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
                <Link href="/admin/customers" className="text-sm text-black font-medium border-b-2 border-black pb-4">
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
                <button
                  onClick={() => {
                    localStorage.removeItem('admin_token');
                    router.push('/admin/login');
                  }}
                  className="text-sm text-gray-600 hover:text-black transition-colors"
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
            Clientes
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Administra la base de clientes de tu tienda
          </p>
        </div>

        <div className="bg-white border border-gray-200 p-12 text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="text-lg font-light text-gray-900 mb-2">No hay clientes registrados</h3>
          <p className="text-sm text-gray-500">Los clientes aparecerán aquí cuando se registren en la tienda</p>
        </div>
      </main>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  salePrice: number | null;
  stock: number;
  category: string;
  active: boolean;
  featured: boolean;
  images: string;
  createdAt: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'price' | 'stock' | 'active'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  const categories = ['Camisas', 'Pantalones', 'Accesorios', 'Calzado', 'Chaquetas'];

  const handleSort = (column: 'name' | 'category' | 'price' | 'stock' | 'active') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const getSortedProducts = (productsToSort: Product[]) => {
    const sorted = [...productsToSort].sort((a, b) => {
      let compareA: any = a[sortBy];
      let compareB: any = b[sortBy];

      // Handle active (boolean)
      if (sortBy === 'active') {
        compareA = a.active ? 1 : 0;
        compareB = b.active ? 1 : 0;
      }

      // Handle string comparison
      if (typeof compareA === 'string') {
        compareA = compareA.toLowerCase();
        compareB = compareB.toLowerCase();
      }

      if (compareA < compareB) return sortOrder === 'asc' ? -1 : 1;
      if (compareA > compareB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  };

  useEffect(() => {
    checkAuth();
  }, [page, search, categoryFilter, statusFilter, stockFilter]);

  const checkAuth = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    try {
      const response = await fetch('/api/admin/auth/verify', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('No autorizado');
      
      await loadProducts(token);
    } catch (error) {
      router.push('/admin/login');
    }
  };

  const loadProducts = async (token: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(search && { search }),
        ...(categoryFilter !== 'all' && { category: categoryFilter }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(stockFilter !== 'all' && { stock: stockFilter })
      });

      const response = await fetch(`/api/admin/products?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Aplicar filtros en el cliente si la API no los soporta completamente
        let filteredProducts = data.products;
        
        if (statusFilter === 'active') {
          filteredProducts = filteredProducts.filter((p: Product) => p.active);
        } else if (statusFilter === 'inactive') {
          filteredProducts = filteredProducts.filter((p: Product) => !p.active);
        }
        
        if (stockFilter === 'low') {
          filteredProducts = filteredProducts.filter((p: Product) => p.stock > 0 && p.stock <= 10);
        } else if (stockFilter === 'out') {
          filteredProducts = filteredProducts.filter((p: Product) => p.stock === 0);
        } else if (stockFilter === 'available') {
          filteredProducts = filteredProducts.filter((p: Product) => p.stock > 10);
        }
        
        setProducts(filteredProducts);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Compacto */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/admin/dashboard" className="text-xl font-light tracking-tight">
                EMARA
              </Link>
              <nav className="flex gap-6 text-xs">
                <Link href="/admin/dashboard" className="text-gray-500 hover:text-black transition-colors">
                  Dashboard
                </Link>
                <Link href="/admin/products" className="text-black border-b border-black pb-3">
                  Productos
                </Link>
                <Link href="/admin/orders" className="text-gray-500 hover:text-black transition-colors">
                  Órdenes
                </Link>
              </nav>
            </div>
            <Link
              href="/admin/products/new"
              className="bg-black text-white px-4 py-2 text-xs font-medium hover:bg-gray-800 transition-colors"
            >
              + Nuevo
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Header & Stats */}
        <div className="mb-6">
          <h1 className="text-2xl font-light tracking-tight mb-1">Productos</h1>
          <p className="text-xs text-gray-500">{products.length} productos en catálogo</p>
        </div>

        {/* Filtros Compactos */}
        <div className="mb-4 space-y-3">
          {/* Búsqueda */}
          <input
            type="text"
            placeholder="Buscar por nombre o SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:border-black transition-colors"
          />

          {/* Filtros en Fila */}
          <div className="flex gap-2 items-center">
            {/* Categoría */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-gray-300 focus:outline-none focus:border-black cursor-pointer bg-white"
            >
              <option value="all">Todas las categorías</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Estado */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-gray-300 focus:outline-none focus:border-black cursor-pointer bg-white"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>

            {/* Stock */}
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-gray-300 focus:outline-none focus:border-black cursor-pointer bg-white"
            >
              <option value="all">Todo el stock</option>
              <option value="available">Stock alto (&gt;10)</option>
              <option value="low">Stock bajo (1-10)</option>
              <option value="out">Sin stock</option>
            </select>

            {/* Limpiar Filtros */}
            {(categoryFilter !== 'all' || statusFilter !== 'all' || stockFilter !== 'all' || search) && (
              <button
                onClick={() => {
                  setCategoryFilter('all');
                  setStatusFilter('all');
                  setStockFilter('all');
                  setSearch('');
                }}
                className="px-3 py-2 text-xs text-gray-500 hover:text-black border border-gray-300 hover:border-black transition-colors"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Products Table */}
        {products.length === 0 ? (
          <div className="border border-gray-200 p-12 text-center">
            <div className="text-4xl mb-3">📦</div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">No hay productos</h3>
            <p className="text-xs text-gray-500 mb-4">Ajusta los filtros o crea un nuevo producto</p>
            <Link
              href="/admin/products/new"
              className="inline-block bg-black text-white px-4 py-2 text-xs font-medium hover:bg-gray-800 transition-colors"
            >
              + Crear Producto
            </Link>
          </div>
        ) : (
          <div className="border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th 
                    onClick={() => handleSort('name')}
                    className="px-4 py-2.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-widest cursor-pointer hover:text-black transition-colors select-none group"
                  >
                    <div className="flex items-center gap-1">
                      Producto
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                        {sortBy !== 'name' && '↕'}
                      </span>
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('category')}
                    className="px-4 py-2.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-widest cursor-pointer hover:text-black transition-colors select-none group"
                  >
                    <div className="flex items-center gap-1">
                      Categoría
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        {sortBy === 'category' && (sortOrder === 'asc' ? '↑' : '↓')}
                        {sortBy !== 'category' && '↕'}
                      </span>
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('price')}
                    className="px-4 py-2.5 text-right text-[10px] font-medium text-gray-500 uppercase tracking-widest cursor-pointer hover:text-black transition-colors select-none group"
                  >
                    <div className="flex items-center justify-end gap-1">
                      Precio
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
                        {sortBy !== 'price' && '↕'}
                      </span>
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('stock')}
                    className="px-4 py-2.5 text-center text-[10px] font-medium text-gray-500 uppercase tracking-widest cursor-pointer hover:text-black transition-colors select-none group"
                  >
                    <div className="flex items-center justify-center gap-1">
                      Stock
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        {sortBy === 'stock' && (sortOrder === 'asc' ? '↑' : '↓')}
                        {sortBy !== 'stock' && '↕'}
                      </span>
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('active')}
                    className="px-4 py-2.5 text-center text-[10px] font-medium text-gray-500 uppercase tracking-widest cursor-pointer hover:text-black transition-colors select-none group"
                  >
                    <div className="flex items-center justify-center gap-1">
                      Estado
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        {sortBy === 'active' && (sortOrder === 'asc' ? '↑' : '↓')}
                        {sortBy !== 'active' && '↕'}
                      </span>
                    </div>
                  </th>
                  <th className="px-4 py-2.5 text-right text-[10px] font-medium text-gray-500 uppercase tracking-widest">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {getSortedProducts(products).map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 flex-shrink-0 border border-gray-200"></div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">{product.name}</div>
                          <div className="text-xs text-gray-400 font-mono">{product.sku}</div>
                          {product.featured && (
                            <span className="inline-flex items-center text-[10px] text-yellow-600 mt-0.5">
                              ⭐ Destacado
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-600">{product.category}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="text-sm font-medium text-gray-900">
                        ${product.price.toLocaleString('es-CL')}
                      </div>
                      {product.salePrice && (
                        <div className="text-xs text-green-600">
                          ${product.salePrice.toLocaleString('es-CL')}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 text-xs font-medium ${
                        product.stock > 10 
                          ? 'text-gray-900' 
                          : product.stock > 0 
                          ? 'text-yellow-600' 
                          : 'text-red-600'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block w-2 h-2 rounded-full ${
                        product.active ? 'bg-black' : 'bg-gray-300'
                      }`}></span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="text-xs text-gray-400 hover:text-black transition-colors"
                      >
                        Editar →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Minimalista */}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between text-xs">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-2 border border-gray-300 hover:border-black hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ← Anterior
            </button>
            <span className="text-gray-500">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-2 border border-gray-300 hover:border-black hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

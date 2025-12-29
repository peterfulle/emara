'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    description: '',
    price: '',
    salePrice: '',
    stock: '0',
    category: 'vestidos',
    active: true,
    featured: false,
    images: [''],
    sizes: [] as string[],
    colors: [] as string[],
  });

  const categories = [
    'vestidos',
    'tops-blusas',
    'pantalones',
    'faldas',
    'accesorios',
    'calzado',
    'deportivo'
  ];

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const availableColors = ['Negro', 'Blanco', 'Azul', 'Rojo', 'Verde', 'Amarillo', 'Rosa', 'Gris'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    try {
      // Validaciones
      if (!formData.sku || !formData.name || !formData.price) {
        throw new Error('SKU, Nombre y Precio son requeridos');
      }

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
          stock: parseInt(formData.stock),
          images: formData.images.filter(img => img.trim() !== ''),
          sizes: formData.sizes.length > 0 ? formData.sizes : null,
          colors: formData.colors.length > 0 ? formData.colors : null,
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear producto');
      }

      // Redirigir a la lista de productos
      router.push('/admin/products');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const removeImageField = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const toggleSize = (size: string) => {
    if (formData.sizes.includes(size)) {
      setFormData({ ...formData, sizes: formData.sizes.filter(s => s !== size) });
    } else {
      setFormData({ ...formData, sizes: [...formData.sizes, size] });
    }
  };

  const toggleColor = (color: string) => {
    if (formData.colors.includes(color)) {
      setFormData({ ...formData, colors: formData.colors.filter(c => c !== color) });
    } else {
      setFormData({ ...formData, colors: [...formData.colors, color] });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
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
                <Link href="/admin/products" className="text-sm text-black font-medium border-b-2 border-black pb-4">
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
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/admin/products" className="text-sm text-blue-600 hover:text-blue-800 mb-2 inline-flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver a Productos
            </Link>
            <h1 className="text-3xl font-light text-gray-900 tracking-tight">
              Nuevo Producto
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Completa la información del producto para agregarlo al catálogo
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información General */}
          <div className="bg-white border border-gray-200 shadow-sm">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h2 className="text-lg font-light text-gray-900">Información General</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-2">
                    SKU <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="sku"
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="PROD-001"
                  />
                  <p className="mt-1 text-xs text-gray-500">Código único del producto</p>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Producto <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Vestido Elegante Negro"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Describe las características del producto..."
                />
              </div>
            </div>
          </div>

          {/* Precios e Inventario */}
          <div className="bg-white border border-gray-200 shadow-sm">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h2 className="text-lg font-light text-gray-900">Precios e Inventario</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Precio Regular <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-2 text-gray-500">$</span>
                    <input
                      id="price"
                      type="number"
                      required
                      min="0"
                      step="1"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="49990"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="salePrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Precio de Oferta
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-2 text-gray-500">$</span>
                    <input
                      id="salePrice"
                      type="number"
                      min="0"
                      step="1"
                      value={formData.salePrice}
                      onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="39990"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Opcional</p>
                </div>

                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                    Stock
                  </label>
                  <input
                    id="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Variantes */}
          <div className="bg-white border border-gray-200 shadow-sm">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h2 className="text-lg font-light text-gray-900">Variantes del Producto</h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Tallas Disponibles</label>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`px-4 py-2 border-2 text-sm font-medium transition-all ${
                        formData.sizes.includes(size)
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Colores Disponibles</label>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => toggleColor(color)}
                      className={`px-4 py-2 border-2 text-sm font-medium transition-all ${
                        formData.colors.includes(color)
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Imágenes */}
          <div className="bg-white border border-gray-200 shadow-sm">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h2 className="text-lg font-light text-gray-900">Imágenes del Producto</h2>
            </div>
            <div className="p-6 space-y-4">
              {formData.images.map((image, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                  {formData.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      className="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addImageField}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                + Agregar otra imagen
              </button>
            </div>
          </div>

          {/* Configuración */}
          <div className="bg-white border border-gray-200 shadow-sm">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h2 className="text-lg font-light text-gray-900">Configuración</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center">
                <input
                  id="active"
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                />
                <label htmlFor="active" className="ml-3 text-sm text-gray-700">
                  Producto Activo (visible en la tienda)
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="featured"
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                />
                <label htmlFor="featured" className="ml-3 text-sm text-gray-700">
                  Producto Destacado (aparece en home)
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
            <Link
              href="/admin/products"
              className="px-6 py-3 border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Creando...' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

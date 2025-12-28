'use client';

import Link from 'next/link';

const categories = [
  { 
    name: 'Vestidos', 
    slug: 'vestidos',
    count: '156 productos',
    bg: 'bg-gradient-to-br from-rose-200 to-pink-300'
  },
  { 
    name: 'Tops', 
    slug: 'tops-blusas',
    count: '203 productos',
    bg: 'bg-gradient-to-br from-purple-200 to-indigo-300'
  },
  { 
    name: 'Denim', 
    slug: 'pantalones',
    count: '98 productos',
    bg: 'bg-gradient-to-br from-blue-200 to-cyan-300'
  },
  { 
    name: 'Accesorios', 
    slug: 'accesorios',
    count: '124 productos',
    bg: 'bg-gradient-to-br from-amber-200 to-orange-300'
  },
];

export default function CategoryGrid() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-5xl font-light text-gray-900 mb-3 tracking-tight">Comprar por categoría</h2>
          <p className="text-gray-500 text-lg">Encuentra tu estilo perfecto</p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categoria/${category.slug}`}
              className="group"
            >
              <div className={`${category.bg} aspect-[3/4] flex flex-col justify-end p-6 transition-all duration-500 group-hover:scale-[0.98]`}>
                <div className="transform transition-transform duration-300 group-hover:translate-y-[-8px]">
                  <h3 className="text-white text-3xl font-light mb-2">{category.name}</h3>
                  <p className="text-white/80 text-sm">{category.count}</p>
                  <div className="mt-4 w-12 h-px bg-white transform origin-left transition-transform duration-300 group-hover:scale-x-150"></div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import Link from 'next/link';

const lookbooks = [
  {
    title: 'Esenciales',
    subtitle: 'Primavera 2025',
    image: 'bg-gradient-to-br from-rose-100 to-pink-200',
    link: '/coleccion/primavera'
  },
  {
    title: 'Elegancia',
    subtitle: 'Office Edit',
    image: 'bg-gradient-to-br from-gray-100 to-slate-200',
    link: '/coleccion/office'
  },
  {
    title: 'Weekend',
    subtitle: 'Casual Chic',
    image: 'bg-gradient-to-br from-amber-100 to-orange-200',
    link: '/coleccion/weekend'
  }
];

export default function LookbookSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-light text-gray-900 mb-3 tracking-tight">Lookbooks</h2>
          <p className="text-gray-500 text-lg">Inspiración para cada ocasión</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {lookbooks.map((lookbook, index) => (
            <Link
              key={index}
              href={lookbook.link}
              className="group relative h-[500px] overflow-hidden"
            >
              <div className={`absolute inset-0 ${lookbook.image} transition-transform duration-700 group-hover:scale-105`}>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300"></div>
              </div>
              <div className="relative h-full flex flex-col justify-end p-8">
                <p className="text-sm uppercase tracking-widest text-gray-700 mb-2">{lookbook.subtitle}</p>
                <h3 className="text-3xl font-light text-gray-900 mb-4">{lookbook.title}</h3>
                <div className="text-gray-900 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2">
                  Explorar <span className="text-xl">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

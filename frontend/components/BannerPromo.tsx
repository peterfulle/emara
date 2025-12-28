'use client';

import Link from 'next/link';

export default function BannerPromo() {
  return (
    <section className="py-16 bg-gradient-to-r from-pink-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            <div className="p-12 text-white">
              <span className="inline-block bg-white/20 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                Oferta Limitada
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Hasta 50% OFF
              </h2>
              <p className="text-xl mb-8 text-white/90">
                En toda la colección de verano. No te lo pierdas.
              </p>
              <Link
                href="/ofertas"
                className="inline-block bg-white text-pink-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
              >
                Ver Ofertas
              </Link>
            </div>
            <div className="h-64 lg:h-96 bg-white/10 flex items-center justify-center">
              <div className="text-white text-6xl">✨</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import Link from 'next/link';

const trends = [
  {
    title: 'Blazers Oversize',
    tag: 'TENDENCIA',
    color: 'bg-rose-50'
  },
  {
    title: 'Vestidos Midi',
    tag: 'MUST HAVE',
    color: 'bg-purple-50'
  },
  {
    title: 'Denim Total',
    tag: 'ESTILO',
    color: 'bg-blue-50'
  },
  {
    title: 'Lino Natural',
    tag: 'VERANO',
    color: 'bg-amber-50'
  }
];

export default function TrendingSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-4xl font-light text-gray-900">Tendencias</h2>
          <Link href="/tendencias" className="text-sm underline hover:no-underline">
            Ver todas
          </Link>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {trends.map((trend, index) => (
            <Link
              key={index}
              href={`/tendencias/${trend.title.toLowerCase().replace(/ /g, '-')}`}
              className="group"
            >
              <div className={`${trend.color} aspect-square flex flex-col items-center justify-center p-6 transition-all duration-300 group-hover:scale-95`}>
                <span className="text-xs tracking-widest text-gray-600 mb-3">{trend.tag}</span>
                <h3 className="text-2xl font-light text-center text-gray-900">{trend.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import CategoryGrid from '@/components/CategoryGrid';
import LookbookSection from '@/components/LookbookSection';
import TrendingSection from '@/components/TrendingSection';
import Newsletter from '@/components/Newsletter';
import { prisma } from '@/lib/prisma';

export default async function Home() {
  let products: any[] = [];
  
  try {
    // Obtener productos directamente de la base de datos
    products = await prisma.product.findMany({
      where: { active: true },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' }
      ],
      take: 8
    });
    
    console.log('=== PRODUCTOS CARGADOS EN HOME ===');
    console.log('Total productos:', products.length);
    products.forEach(p => {
      console.log(`- ${p.name} (${p.sku}): images=${p.images}`);
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    products = [];
  }

  return (
    <div className="min-h-screen bg-white">
      <Hero />
      
      {/* Barra de servicios minimalista */}
      <section className="border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center text-xs uppercase tracking-wider text-gray-600">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <span>Envío Gratis +$50.000</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <span>Devoluciones 30 días</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span>Pago Seguro</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span>Envío Express</span>
            </div>
          </div>
        </div>
      </section>

      <CategoryGrid />
      
      <ProductGrid products={products} title="Nuevos Ingresos" />
      
      <TrendingSection />
      
      <LookbookSection />
      
      {/* Banner editorial */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs tracking-[0.3em] uppercase mb-6 opacity-70">EMARA MAGAZINE</p>
            <h2 className="text-5xl md:text-6xl font-light mb-6 leading-tight">
              Estilo que trasciende <br />el tiempo
            </h2>
            <p className="text-lg text-gray-400 mb-10 font-light">
              Descubre las historias detrás de cada colección y encuentra inspiración
              para crear tu guardarropa perfecto
            </p>
            <button className="border border-white px-10 py-4 text-sm tracking-wider uppercase hover:bg-white hover:text-black transition-all duration-300">
              Leer Más
            </button>
          </div>
        </div>
      </section>
      
      {/* Valores de marca */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="text-center">
              <div className="w-1 h-20 bg-gray-200 mx-auto mb-8"></div>
              <h3 className="text-xl font-light mb-4 tracking-wide">SOSTENIBILIDAD</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Comprometidas con el planeta. Materiales certificados y producción ética.
              </p>
            </div>
            <div className="text-center">
              <div className="w-1 h-20 bg-gray-200 mx-auto mb-8"></div>
              <h3 className="text-xl font-light mb-4 tracking-wide">CALIDAD</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Cada pieza es cuidadosamente diseñada para durar más allá de las tendencias.
              </p>
            </div>
            <div className="text-center">
              <div className="w-1 h-20 bg-gray-200 mx-auto mb-8"></div>
              <h3 className="text-xl font-light mb-4 tracking-wide">DISEÑO</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Minimalismo contemporáneo con un toque de elegancia atemporal.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Newsletter />
    </div>
  );
}

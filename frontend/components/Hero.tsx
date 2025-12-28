'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const slides = [
  {
    title: 'Nueva Colección',
    subtitle: 'PRIMAVERA/VERANO 2025',
    description: 'Diseños exclusivos para la mujer contemporánea',
    cta: 'Descubrir',
    bg: 'from-rose-50 via-pink-50 to-white',
    textColor: 'text-gray-900'
  },
  {
    title: 'Elegancia Minimalista',
    subtitle: 'ESSENTIAL EDIT',
    description: 'Piezas atemporales que nunca pasan de moda',
    cta: 'Ver colección',
    bg: 'from-gray-100 via-slate-100 to-zinc-100',
    textColor: 'text-gray-900'
  },
  {
    title: 'Rebajas',
    subtitle: 'HASTA 50% OFF',
    description: 'En una selección de artículos de temporada',
    cta: 'Comprar ahora',
    bg: 'from-black via-gray-900 to-black',
    textColor: 'text-white'
  }
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[85vh] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${slide.bg}`}></div>
          
          <div className={`relative h-full flex items-center px-4 ${slide.textColor}`}>
            <div className="max-w-7xl mx-auto w-full">
              <div className="max-w-2xl">
                <p className="text-xs tracking-[0.3em] uppercase mb-4 opacity-70">
                  {slide.subtitle}
                </p>
                <h1 className="text-6xl md:text-8xl font-light mb-6 tracking-tight leading-none">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl mb-10 font-light opacity-80 max-w-lg">
                  {slide.description}
                </p>
                <Link
                  href="/productos"
                  className={`inline-block border-2 ${
                    slide.textColor === 'text-white' 
                      ? 'border-white hover:bg-white hover:text-black' 
                      : 'border-black hover:bg-black hover:text-white'
                  } px-10 py-4 text-sm tracking-wider uppercase font-medium transition-all duration-300`}
                >
                  {slide.cta}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Indicadores */}
      <div className="absolute bottom-12 right-12 flex flex-col gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-1 transition-all duration-300 ${
              index === currentSlide 
                ? 'h-16 bg-gray-900' 
                : 'h-8 bg-gray-400'
            }`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-12 hidden md:flex flex-col items-center gap-2 text-xs tracking-wider opacity-60">
        <span className="rotate-90 text-gray-600">SCROLL</span>
        <div className="w-px h-16 bg-gray-400"></div>
      </div>
    </section>
  );
}

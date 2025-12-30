import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ofertas y Rebajas - EMARA',
  description: 'Descubre nuestras mejores ofertas',
};

export default function OfertasPage() {
  return (
    <div className="min-h-screen bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-light text-gray-900 mb-8">Rebajas</h1>
        <p className="text-gray-600">Página en construcción...</p>
      </div>
    </div>
  );
}

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos y Condiciones - EMARA',
  description: 'Términos y condiciones de uso',
};

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-white py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-light text-gray-900 mb-8">Términos y Condiciones</h1>
        <p className="text-gray-600">Página en construcción...</p>
      </div>
    </div>
  );
}

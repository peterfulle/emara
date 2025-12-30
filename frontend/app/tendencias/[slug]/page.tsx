import { Metadata } from 'next';
import { notFound } from 'next/navigation';

const tendencias = ['denim-total', 'lino-natural', 'blazers-oversize', 'vestidos-midi'];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  
  return {
    title: `${title} - Tendencias EMARA`,
    description: `Descubre la tendencia ${title.toLowerCase()}`,
  };
}

export default async function TendenciaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  if (!tendencias.includes(slug)) {
    notFound();
  }

  const title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <div className="min-h-screen bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-light text-gray-900 mb-8">{title}</h1>
        <p className="text-gray-600">Página en construcción...</p>
      </div>
    </div>
  );
}

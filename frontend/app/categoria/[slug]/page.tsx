import { Metadata } from 'next';
import { notFound } from 'next/navigation';

const categories = ['vestidos', 'tops-blusas', 'pantalones', 'accesorios'];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  
  return {
    title: `${title} - EMARA`,
    description: `Descubre nuestra colección de ${title.toLowerCase()}`,
  };
}

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  if (!categories.includes(slug)) {
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

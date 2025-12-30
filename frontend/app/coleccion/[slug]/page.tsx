import { Metadata } from 'next';
import { notFound } from 'next/navigation';

const colecciones = ['weekend', 'primavera', 'office'];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.charAt(0).toUpperCase() + slug.slice(1);
  
  return {
    title: `Colección ${title} - EMARA`,
    description: `Descubre nuestra colección ${title.toLowerCase()}`,
  };
}

export default async function ColeccionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  if (!colecciones.includes(slug)) {
    notFound();
  }

  const title = slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <div className="min-h-screen bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-light text-gray-900 mb-8">Colección {title}</h1>
        <p className="text-gray-600">Página en construcción...</p>
      </div>
    </div>
  );
}

import { notFound } from 'next/navigation';
import ProductDisplay from '@/components/ProductDisplay';

interface Product {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  price: number;
  salePrice: number | null;
  stock: number;
  images: string | null;
  category: string;
  sizes: string | null;
  colors: string | null;
  active: boolean;
  featured: boolean;
}

async function getProduct(sku: string): Promise<Product | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
    const response = await fetch(`${baseUrl}/api/products/${sku}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ sku: string }>;
}) {
  const { sku } = await params;
  const product = await getProduct(sku);

  if (!product) {
    notFound();
  }

  // Parsear datos JSON
  let images: string[] = [];
  let sizes: string[] = [];
  let colors: string[] = [];

  try {
    if (product.images) images = JSON.parse(product.images);
    if (product.sizes) sizes = JSON.parse(product.sizes);
    if (product.colors) colors = JSON.parse(product.colors);
  } catch (e) {
    console.error('Error parsing product data:', e);
  }

  const productData = {
    ...product,
    images,
    sizes,
    colors,
  };

  return (
    <div className="min-h-screen bg-white">
      <ProductDisplay product={productData} />
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sku: string }>;
}) {
  const { sku } = await params;
  const product = await getProduct(sku);

  if (!product) {
    return {
      title: 'Producto no encontrado | EMARA',
    };
  }

  return {
    title: `${product.name} | EMARA`,
    description: product.description || `Compra ${product.name} en EMARA`,
  };
}

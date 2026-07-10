import type { Metadata } from 'next';
import './products.css';
import { fetchProductServer } from '@/app/data/product/products';
import ProductDetailClient from './ProductDetailClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProductServer(Number(id));

  if (!product) {
    return { title: '상품을 찾을 수 없어요' };
  }

  return {
    title: product.name,
    description: product.desc,
    openGraph: {
      title: product.name,
      description: product.desc,
      images: [product.image],
    },
  };
}

export default async function ProductDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetchProductServer(Number(id));

  if (!product) {
    return <p className="error">상품을 찾을 수 없어요.</p>;
  }

  return <ProductDetailClient product={product} />;
}

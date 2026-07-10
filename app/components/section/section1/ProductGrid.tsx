"use client";

import Image from "next/image"
import Link from "next/link"
import { useSearchStore } from '@/app/store/useSearchStore';
import ProductActions from './ProductActions'
import StarRating from '@/app/components/review/StarRating'
import type { ProductType } from "@/app/data/product/products";

export default function ProductGrid({ products }: { products: ProductType[] }) {
  const keyword = useSearchStore((state) => state.keyword);

  const filtered = products.filter(
    (product) =>
      keyword === "" ||
      product.name.includes(keyword) ||
      product.desc.includes(keyword) ||
      product.category.includes(keyword) ||
      String(product.price).includes(keyword)
  );

  if (filtered.length === 0) {
    return <p className="empty_msg">검색 결과가 없어요.</p>;
  }

  return (
    <ul>
      {filtered.map((product) => (
        <li key={product.id}>
          <Link href={`/products/${product.id}`}>
            <div className="img_wrap">
              <Image src={product.image} alt={product.name} fill />
            </div>
            <h2>{product.name}</h2>
            <p>{product.desc}</p>
            <div className="rating_row">
              <StarRating rating={Math.round(product.rating_avg)} size={16} />
              <span className="review_count">({product.rating_count})</span>
            </div>
            <strong><b>{product.price.toLocaleString()}</b>원</strong>
          </Link>
          <ProductActions productId={product.id} productLike={product.liked} />
        </li>
      ))}
    </ul>
  );
}

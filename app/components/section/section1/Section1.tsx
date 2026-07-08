"use client";

import React, { memo } from 'react'
import "./Section1.css"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from 'next/navigation'
import { useSearchStore } from '@/app/store/useSearchStore';
import {useProducts} from '../../../hooks/useProducts'
import ProductActions from './ProductActions'
import StarRating from '@/app/components/review/StarRating'
function Section1() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'all';
  const keyword = useSearchStore((state) => state.keyword);
  const {data : products, isLoading, isError} = useProducts();

  if (isLoading) return <p className="loading">로딩중...</p>;
  if (isError) return <p className="error">상품을 불러오지 못했어요.</p>;

const filtered = (products ?? [])
  .filter((product) => category === "all" || product.category === category)
  .filter((product) =>
    keyword === "" ||
    product.name.includes(keyword) ||
    product.desc.includes(keyword) ||
    product.category.includes(keyword) ||
    String(product.price).includes(keyword)
  );


  return (
    <section id="section1">
      <div className="inner">
        {filtered.length === 0 ? (
          <p className="empty_msg">검색 결과가 없어요.</p>
        ) : (
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
        )}
      </div>
    </section>
  );
}

export default memo(Section1);
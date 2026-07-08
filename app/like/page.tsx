"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useProducts } from "@/app/hooks/useProducts";
import { useProductAction } from "@/app/hooks/useProductAction";
import RequireLogin from "@/app/components/auth/RequireLogin";
import Pagination from "@/app/components/pagination/Pagination";
import "./like.css";

const PAGE_SIZE = 3;

export default function LikePage() {
  return (
    <RequireLogin>
      <LikeContent />
    </RequireLogin>
  );
}

function LikeContent() {
  const { data: products, isLoading, isError } = useProducts();
  const { mutate: toggleLike, isPending } = useProductAction();
  const [page, setPage] = useState(1);

  if (isLoading) return <p className="loading">로딩중...</p>;
  if (isError) return <p className="error">상품을 불러오지 못했어요.</p>;

  const liked = (products ?? []).filter((p) => p.liked);
  const paged = liked.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="like_wrap">
      <div className="inner">
        <div className="title_wrap">
          <h2>찜</h2>
        </div>

        {liked.length === 0 ? (
          <div className="empty_box">
            <p className="empty_msg">찜한 상품이 없어요.</p>
            <Link href="/" className="go_shop">
              쇼핑하러 가기
            </Link>
          </div>
        ) : (
          <>
          <ul className="like_list">
            {paged.map((product) => (
              <li key={product.id} className="like_item">
                <Link href={`/products/${product.id}`} className="item_link">
                  <div className="img_box">
                    <Image src={product.image} width={120} height={120} alt={product.name} />
                  </div>
                  <div className="item_info">
                    <h3 className="item_name">{product.name}</h3>
                    <p className="item_desc">{product.desc}</p>
                    <p className="item_like">♥ {product.like_count}</p>
                  </div>
                </Link>

                <div className="item_right">
                  <strong className="item_price">
                    {product.price.toLocaleString()}
                    <em>원</em>
                  </strong>
                  <button
                    type="button"
                    className="unlike_btn"
                    onClick={() => toggleLike(product.id)}
                    disabled={isPending}
                    aria-label="찜 취소"
                  >
                    ♥ 찜 취소
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <Pagination page={page} total={liked.length} pageSize={PAGE_SIZE} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}

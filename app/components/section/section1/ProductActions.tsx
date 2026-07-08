"use client";

import { useProductAction } from "@/app/hooks/useProductAction";
import Link from "next/link";
import { memo } from "react";

function ProductActions({
  productId,
  productLike,
}: {
  productId: number;
  productLike: boolean;
}) {
  const { mutate: like, isPending } = useProductAction();

  return (
    <div className="btn_wrap">
      <button
        className={`heart ${productLike ? "active" : ""}`}
        aria-label="찜하기"
        onClick={() => like(productId)}
        disabled={isPending}
      >
        {productLike ? "♥" : "♡"}
      </button>
      <Link href={`/products/${productId}`} className="detail">
        상세보기
      </Link>
    </div>
  );
}

export default memo(ProductActions);

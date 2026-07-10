"use client";

import { useProductAction } from "@/app/hooks/useProductAction";
import Link from "next/link";
import { memo } from "react";
import { useRouter } from "next/navigation";

function ProductActions({
  productId,
  productLike,
}: {
  productId: number;
  productLike: boolean;
}) {
  const { mutate: like, isPending } = useProductAction();
  const router = useRouter();

  const handleLike = () => {
    like(productId, {
      // 이 목록은 서버 컴포넌트가 내려준 데이터라 react-query 캐시가 아님 →
      // 서버 컴포넌트를 다시 실행시켜 최신 liked 값을 다시 받아옴
      onSuccess: () => router.refresh(),
    });
  };

  return (
    <div className="btn_wrap">
      <button
        className={`heart ${productLike ? "active" : ""}`}
        aria-label="찜하기"
        onClick={handleLike}
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

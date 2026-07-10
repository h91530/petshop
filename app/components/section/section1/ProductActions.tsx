"use client";

import { useProductAction } from "@/app/hooks/useProductAction";
import Link from "next/link";
import { memo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";

function ProductActions({
  productId,
  productLike,
}: {
  productId: number;
  productLike: boolean;
}) {
  const { mutate: like, isPending } = useProductAction();
  const router = useRouter();
  const isLoggedIn = useAuthStore((s) => !!s.user);

  // 서버가 내려준 값으로 화면을 먼저 그리고, 클릭하면 응답 기다리지 않고 바로 반영(낙관적 업데이트)
  const [optimisticLike, setOptimisticLike] = useState(productLike);

  // 서버 컴포넌트가 다시 렌더링돼서 최신 productLike가 내려오면 그 값으로 동기화
  useEffect(() => {
    setOptimisticLike(productLike);
  }, [productLike]);

  // 로그아웃은 setUser(null)이 즉시(동기적으로) 반영되니까,
  // router.refresh()의 서버 왕복을 기다리지 않고 로그인 스토어 기준으로 바로 하트를 꺼줌
  const displayLike = isLoggedIn && optimisticLike;

  const handleLike = () => {
    const next = !optimisticLike;
    setOptimisticLike(next); // 서버 응답 기다리지 않고 바로 화면에 반영

    like(productId, {
      // 진짜 소스(서버 컴포넌트)도 다음 렌더링 때 맞춰지도록 갱신
      onSuccess: () => router.refresh(),
      // 실패하면 원래 상태로 되돌림
      onError: () => setOptimisticLike(!next),
    });
  };

  return (
    <div className="btn_wrap">
      <button
        className={`heart ${displayLike ? "active" : ""}`}
        aria-label="찜하기"
        onClick={handleLike}
        disabled={isPending}
      >
        {displayLike ? "♥" : "♡"}
      </button>
      <Link href={`/products/${productId}`} className="detail">
        상세보기
      </Link>
    </div>
  );
}

export default memo(ProductActions);

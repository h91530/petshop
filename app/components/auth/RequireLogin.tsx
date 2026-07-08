"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthCheck from "@/app/hooks/useAuthCheck";
import { useModalStore } from "@/app/store/modalStore";

export default function RequireLogin({ children }: { children: React.ReactNode }) {
  const { isSuccess: isLoggedIn, isFetched } = useAuthCheck();
  const openModal = useModalStore((s) => s.openLoginModal);
  const router = useRouter();

  // 인증 확인이 끝났고 로그인 안 됐으면 → 루트로 이동 + 로그인 모달
  useEffect(() => {
    if (isFetched && !isLoggedIn) {
      router.replace("/");
      openModal();
    }
  }, [isFetched, isLoggedIn, router, openModal]);

  // 확인 전 or 리다이렉트 대기 중엔 내용 노출 안 함
  if (!isFetched || !isLoggedIn) {
    return <p className="loading">로딩중...</p>;
  }

  return <>{children}</>;
}

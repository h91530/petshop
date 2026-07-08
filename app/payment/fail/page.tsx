"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import "../payment.css";

export default function PaymentFailPage() {
  return (
    <Suspense fallback={<p className="loading">로딩중...</p>}>
      <FailContent />
    </Suspense>
  );
}

function FailContent() {
  const params = useSearchParams();
  const code = params.get("code");
  const message = params.get("message");
  const orderId = params.get("orderId");
  const canceled = useRef(false);

  // 결제 취소/실패 → 결제대기(READY) 주문 정리 (1회만)
  useEffect(() => {
    if (canceled.current || !orderId) return;
    canceled.current = true;
    fetch(`https://yangti.shop/searching/orders/${orderId}/cancel`, {
      method: "POST",
      credentials: "include",
    }).catch(() => {});
  }, [orderId]);

  return (
    <div className="payment_wrap">
      <div className="inner" style={{ textAlign: "center" }}>
        <div className="title_wrap">
          <h2>결제 실패</h2>
        </div>
        <p style={{ fontSize: 18, marginBottom: 8 }}>
          {message ?? "결제가 취소되었거나 실패했어요."}
        </p>
        {code && <p style={{ color: "#888", marginBottom: 32 }}>에러 코드: {code}</p>}
        <Link
          href="/cart"
          className="pay_btn"
          style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 240, textDecoration: "none" }}
        >
          장바구니로 돌아가기
        </Link>
      </div>
    </div>
  );
}

"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { usePaymentConfirm } from "@/app/hooks/usePaymentConfirm";
import "../payment.css";

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<p className="loading">로딩중...</p>}>
      <SuccessContent />
    </Suspense>
  );
}

function SuccessContent() {
  const params = useSearchParams();
  const paymentKey = params.get("paymentKey");
  const orderId = params.get("orderId");
  const amount = Number(params.get("amount"));

  const { mutate, isPending, isSuccess, isError, error } = usePaymentConfirm();
  const called = useRef(false);

  // 마운트 시 1회만 승인 요청 (StrictMode 중복 방지)
  useEffect(() => {
    if (called.current) return;
    if (!paymentKey || !orderId || !amount) return;
    called.current = true;
    mutate({ paymentKey, orderId, amount });
  }, [paymentKey, orderId, amount, mutate]);

  return (
    <div className="payment_wrap">
      <div className="inner" style={{ textAlign: "center" }}>
        {(isPending || (!isSuccess && !isError)) && (
          <p className="loading">결제 승인 중...</p>
        )}

        {isSuccess && (
          <>
            <div className="title_wrap">
              <h2>결제 완료</h2>
            </div>
            <p style={{ fontSize: 18, marginBottom: 8 }}>
              {amount.toLocaleString()}원 결제가 완료되었어요.
            </p>
            <p style={{ color: "#888", marginBottom: 32 }}>주문번호: {orderId}</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <Link href="/orders" className="pay_btn" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 200, textDecoration: "none" }}>
                주문내역 보기
              </Link>
              <Link href="/" className="pay_btn" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 200, background: "#fff", color: "#C87E5A", border: "1.5px solid #C87E5A", boxShadow: "none", textDecoration: "none" }}>
                쇼핑 계속하기
              </Link>
            </div>
          </>
        )}

        {isError && (
          <>
            <div className="title_wrap">
              <h2>결제 승인 실패</h2>
            </div>
            <p className="error" style={{ margin: "20px 0 32px" }}>
              {error instanceof Error ? error.message : "결제 승인에 실패했어요."}
            </p>
            <Link href="/cart" className="pay_btn" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 240, textDecoration: "none" }}>
              장바구니로 돌아가기
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

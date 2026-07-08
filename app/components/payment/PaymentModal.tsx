"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { useCartCount } from "@/app/hooks/useCart";
import { useTestConfirm } from "@/app/hooks/useTestConfirm";
import { useAuthStore } from "@/app/store/authStore";
import { useToastStore } from "@/app/store/toastStore";
import { registerDirectOrder } from "@/app/data/order/directOrder";
import "./PaymentModal.css";

const CLIENT_KEY =
  process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ?? "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";

export interface DirectOrder {
  productId: number;
  optionId: number;
  quantity: number;
  amount: number;
  orderName: string;
}

export default function PaymentModal({
  onClose,
  direct,
}: {
  onClose: () => void;
  direct?: DirectOrder;
}) {
  const { data: cart } = useCartCount();
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const showToast = useToastStore((s) => s.showToast);
  const { mutate: testPay, isPending: testPaying } = useTestConfirm();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const widgetsRef = useRef<any>(null);
  const initialized = useRef(false);
  const [ready, setReady] = useState(false);

  // 직구매면 direct.amount, 아니면 장바구니 총액
  const amount = direct ? direct.amount : cart?.total_price ?? 0;
  const items = cart?.data ?? [];
  const orderName = direct
    ? direct.orderName
    : items.length > 1
    ? `${items[0]?.name} 외 ${items.length - 1}건`
    : items[0]?.name ?? "주문";

  useEffect(() => {
    if (initialized.current || amount <= 0) return;
    initialized.current = true;

    (async () => {
      const tossPayments = await loadTossPayments(CLIENT_KEY);
      const widgets = tossPayments.widgets({
        customerKey: user ? `customer_${user.id}` : "ANONYMOUS",
      });

      await widgets.setAmount({ currency: "KRW", value: amount });
      await Promise.all([
        widgets.renderPaymentMethods({ selector: "#payment-method", variantKey: "DEFAULT" }),
        widgets.renderAgreement({ selector: "#agreement", variantKey: "AGREEMENT" }),
      ]);

      widgetsRef.current = widgets;
      setReady(true);
    })();
  }, [amount, user]);

  const handlePay = async () => {
    const widgets = widgetsRef.current;
    if (!widgets) return;

    const orderId = crypto.randomUUID();

    if (direct) {
      // 결제 전 단일상품 주문을 서버에 등록 → 서버가 계산한 금액을 그대로 사용
      const order = await registerDirectOrder({
        orderId,
        productId: direct.productId,
        optionId: direct.optionId,
        quantity: direct.quantity,
      });

      // ★ 서버가 준 금액으로 보정 (프론트 계산값을 신뢰하지 않음)
      await widgets.setAmount({ currency: "KRW", value: order.amount });

      await widgets.requestPayment({
        orderId: order.orderId ?? orderId,
        orderName: order.orderName ?? orderName,
        successUrl: window.location.origin + "/payment/success",
        failUrl: window.location.origin + "/payment/fail",
        customerName: user?.name,
      });
      return;
    }

    // 장바구니 결제: confirm 이 카트로 금액 재계산하므로 그대로 진행
    await widgets.requestPayment({
      orderId,
      orderName,
      successUrl: window.location.origin + "/payment/success",
      failUrl: window.location.origin + "/payment/fail",
      customerName: user?.name,
    });
  };

  const handleTestPay = () => {
    const payload = direct
      ? {
          type: "direct" as const,
          productId: direct.productId,
          optionId: direct.optionId,
          quantity: direct.quantity,
        }
      : { type: "cart" as const };

    testPay(payload, {
      onSuccess: () => {
        showToast("테스트 결제가 완료되었어요.");
        onClose();
        router.push("/orders");
      },
      onError: (err: Error) => {
        showToast(err.message);
      },
    });
  };

  return (
    <div className="pay_overlay" onClick={onClose}>
      {!ready && <div className="pay_loading">결제창을 불러오는 중...</div>}

      <div
        className={`pay_modal ${ready ? "" : "is_loading"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pay_head">
          <h2>결제하기</h2>
          <button type="button" className="pay_close" onClick={onClose} aria-label="닫기">
            ×
          </button>
        </div>

        <div className="pay_body">
          <div id="payment-method" />
          <div id="agreement" />
        </div>

        <button type="button" className="pay_test" onClick={handleTestPay} disabled={testPaying}>
          {testPaying ? "처리 중..." : "테스트 결제하기"}
        </button>
        <button type="button" className="pay_submit" onClick={handlePay} disabled={!ready}>
          {amount.toLocaleString()}원 결제하기
        </button>
      </div>
    </div>
  );
}

export interface DirectOrderPayload {
  orderId: string;
  productId: number;
  optionId: number;
  quantity: number;
}

// 결제 전 단일상품 주문을 서버에 등록 (confirm 이 이 주문 기준으로 금액 검증)
import { apiFetch } from "@/app/lib/apiClient";

export async function registerDirectOrder(payload: DirectOrderPayload) {
  const res = await apiFetch("/orders/direct", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (res.status === 401) {
    throw new Error("로그인이 필요합니다");
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? "주문 생성에 실패했습니다.");
  }

  return res.json();
}

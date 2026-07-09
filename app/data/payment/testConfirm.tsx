interface CartTestPayload {
  type: "cart";
  amount?: number; // 지정 시 그 금액으로 결제 (0원 테스트용)
}
interface DirectTestPayload {
  type: "direct";
  productId: number;
  optionId: number;
  quantity: number;
  amount?: number; // 지정 시 그 금액으로 결제 (0원 테스트용)
}
export type TestConfirmPayload = CartTestPayload | DirectTestPayload;

import { apiFetch } from "@/app/lib/apiClient";

export async function testConfirm(payload: TestConfirmPayload) {
  const res = await apiFetch("/payments/test-confirm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? "테스트 결제에 실패했습니다.");
  }

  return res.json(); // { success, message, orderId, amount }
}

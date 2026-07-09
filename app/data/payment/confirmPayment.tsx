export interface ConfirmPayload {
  paymentKey: string;
  orderId: string;
  amount: number;
}

import { apiFetch } from "@/app/lib/apiClient";

export async function confirmPayment({ paymentKey, orderId, amount }: ConfirmPayload) {
  const res = await apiFetch("/payments/confirm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? "결제 승인에 실패했습니다.");
  }

  return res.json(); // 승인된 Payment 객체
}

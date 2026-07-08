export interface ConfirmPayload {
  paymentKey: string;
  orderId: string;
  amount: number;
}

export async function confirmPayment({ paymentKey, orderId, amount }: ConfirmPayload) {
  const res = await fetch("https://yangti.shop/searching/payments/confirm", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? "결제 승인에 실패했습니다.");
  }

  return res.json(); // 승인된 Payment 객체
}

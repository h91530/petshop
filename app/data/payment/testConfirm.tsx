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

export async function testConfirm(payload: TestConfirmPayload) {
  const res = await fetch("https://yangti.shop/searching/payments/test-confirm", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? "테스트 결제에 실패했습니다.");
  }

  return res.json(); // { success, message, orderId, amount }
}

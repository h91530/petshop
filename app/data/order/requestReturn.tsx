import { apiFetch } from "@/app/lib/apiClient";

export interface ReturnPayload {
  orderId: string;
  reason: string;
}

export async function requestReturn({ orderId, reason }: ReturnPayload) {
  const res = await apiFetch(`/orders/${orderId}/return`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason }),
  });

  if (res.status === 401) {
    throw new Error("로그인이 필요합니다");
  }
  if (res.status === 409) {
    throw new Error("이미 반품 신청된 주문입니다.");
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? "반품 신청에 실패했습니다.");
  }

  return res.json();
}

export interface QtyPayload {
  cartId: number;
  quantity: number;
}

import { apiFetch } from "@/app/lib/apiClient";

export async function plusMinus({ cartId, quantity }: QtyPayload) {
  const res = await apiFetch(`/cart/item/${cartId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity }),
  });

  if (res.status === 401) {
    throw new Error("로그인이 필요합니다");
  }

  if (!res.ok) {
    throw new Error("수량 변경에 실패하였습니다.");
  }

  return res.json(); // { success, cart_count }
}

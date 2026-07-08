export interface AddCartPayload {
  productId: number;
  optionId: number;
  quantity?: number;
}

export async function addCart({ productId, optionId, quantity = 1 }: AddCartPayload) {
  const res = await fetch(`https://yangti.shop/searching/cart/${productId}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ option_id: optionId, quantity }),
  });

  if (res.status === 401) {
    throw new Error("로그인이 필요합니다");
  }

  if (res.status === 409) {
    throw new Error("이미 담겨있는 상품입니다.");
  }

  if (!res.ok) {
    throw new Error("장바구니 담기에 실패하였습니다.");
  }

  return res.json();
}

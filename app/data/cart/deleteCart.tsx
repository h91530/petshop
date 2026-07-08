// 한 개든 여러 개든 배열로 받아서 /cart/items 로 보냄
export async function deleteCart(cartIds: number | number[]) {
  const ids = Array.isArray(cartIds) ? cartIds : [cartIds]; // 단건이면 배열로 감싸기

  const res = await fetch(`https://yangti.shop/searching/cart/items`, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cart_ids: ids }),
  });

  if (res.status === 401) {
    throw new Error("로그인이 필요합니다");
  }

  if (!res.ok) {
    throw new Error("장바구니 삭제에 실패하였습니다.");
  }

  return res.json(); // { success, message }
}

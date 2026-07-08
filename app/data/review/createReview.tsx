export interface CreateReviewPayload {
  orderId: string;
  productId: number;
  rating: number;
  content: string;
}

export async function createReview({ orderId, productId, rating, content }: CreateReviewPayload) {
  const res = await fetch("https://yangti.shop/searching/reviews", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId, productId, rating, content }),
  });

  if (res.status === 401) {
    throw new Error("로그인이 필요합니다");
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? "리뷰 등록에 실패했습니다.");
  }

  return res.json(); // { success, message }
}

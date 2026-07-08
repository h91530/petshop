export interface MyReview {
  id: number;
  order_id: string;
  product_id: number;
  product_name: string;
  image_url: string;
  rating: number;
  content: string;
  created_at: string;
}

export interface MyReviewsResponse {
  success: boolean;
  count: number;
  data: MyReview[];
}

export async function fetchMyReviews(): Promise<MyReviewsResponse> {
  const res = await fetch("https://yangti.shop/searching/reviews/me", {
    credentials: "include",
  });

  if (res.status === 401) {
    throw new Error("로그인이 필요합니다");
  }
  if (!res.ok) {
    throw new Error("리뷰내역을 불러오지 못했습니다.");
  }

  return res.json();
}

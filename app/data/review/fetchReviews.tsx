export interface Review {
  user_name: string;
  rating: number;
  content: string;
  created_at: string;
}

export interface ReviewsResponse {
  success: boolean;
  data: Review[];
  rating_avg: number;
  rating_count: number;
}

import { apiFetch } from "@/app/lib/apiClient";

export async function fetchReviews(productId: number): Promise<ReviewsResponse> {
  const res = await apiFetch(`/reviews?productId=${productId}`);

  if (!res.ok) {
    throw new Error("리뷰를 불러오지 못했습니다.");
  }

  return res.json();
}

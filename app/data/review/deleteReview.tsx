import { apiFetch } from "@/app/lib/apiClient";

export async function deleteReview(reviewId: number) {
  const res = await apiFetch(`/reviews/${reviewId}`, {
    method: "DELETE",
  });

  if (res.status === 401) {
    throw new Error("로그인이 필요합니다");
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? "리뷰 삭제에 실패했습니다.");
  }

  return res.json(); // { success, message }
}

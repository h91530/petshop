"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchReviews } from "@/app/data/review/fetchReviews";

export function useReviews(productId: number) {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => fetchReviews(productId),
    enabled: !!productId,
  });
}

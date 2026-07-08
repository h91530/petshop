"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMyReviews } from "@/app/data/review/fetchMyReviews";

export function useMyReviews() {
  return useQuery({
    queryKey: ["myReviews"],
    queryFn: fetchMyReviews,
    retry: false,
  });
}

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReview } from "@/app/data/review/createReview";

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      // 주문내역 갱신 → 해당 상품이 "작성 완료"로 바뀜
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

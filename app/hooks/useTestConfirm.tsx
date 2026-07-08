"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { testConfirm } from "@/app/data/payment/testConfirm";

export function useTestConfirm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: testConfirm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cartCount"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestReturn } from "@/app/data/order/requestReturn";

export function useRequestReturn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: requestReturn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

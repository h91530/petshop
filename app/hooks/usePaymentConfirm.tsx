"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { confirmPayment } from "@/app/data/payment/confirmPayment";

export function usePaymentConfirm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: confirmPayment,
    onSuccess: () => {
      // 결제 성공 → 장바구니 비워지고 주문내역 생김 → 둘 다 갱신
      queryClient.invalidateQueries({ queryKey: ["cartCount"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

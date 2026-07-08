"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "@/app/data/order/fetchOrders";

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    retry: false,
  });
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { checkAuth } from "@/app/data/auth/auth";

export default function useAuthCheck() {
  return useQuery({
    queryKey: ["auth", "check"],
    queryFn: checkAuth,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

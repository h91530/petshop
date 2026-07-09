"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMe } from "@/app/data/auth/updateMe";
import { useAuthStore } from "@/app/store/authStore";

export function useUpdateMe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMe,
    onSuccess: (data) => {
      // 응답의 최신 user 로 store 갱신
      if (data?.user) {
        useAuthStore.getState().setUser(data.user);
      }
      queryClient.invalidateQueries({ queryKey: ["auth", "check"] });
    },
  });
}

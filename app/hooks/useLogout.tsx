"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutRequest } from "@/app/data/auth/auth";

export default function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "check"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.removeQueries({ queryKey: ["cartCount"] });
    },
  });
}

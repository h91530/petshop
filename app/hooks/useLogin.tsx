"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { testLogin } from "@/app/data/login/login";

export default function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: testLogin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "check"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["cartCount"] });
    },
  });
}

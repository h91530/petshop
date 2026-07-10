import { useAuthStore } from "@/app/store/authStore";
import { apiFetch } from "@/app/lib/apiClient";

export async function checkAuth() {
  const res = await apiFetch("/me", {
    cache: "no-store",
  });

  if (!res.ok) {
    useAuthStore.getState().setUser(null);
    throw new Error("로그인 상태가 아닙니다.");
  }

  const data = await res.json();
  useAuthStore.getState().setUser(data.user);
  return data;
}

export async function logoutRequest() {
  const res = await apiFetch("/logout", {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("로그아웃에 실패했습니다.");
  }

  // /me 재조회(네트워크 왕복)를 기다리지 않고 바로 로그아웃 상태로 반영
  useAuthStore.getState().setUser(null);

  return res.json();
}

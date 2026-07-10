import { apiFetch } from "@/app/lib/apiClient";
import { useAuthStore } from "@/app/store/authStore";

export interface LoginPayload {
  username: string;
  password: string;
}

export async function login(payload: LoginPayload) {
  const res = await apiFetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("아이디 또는 비밀번호가 올바르지 않습니다.");
  }

  const data = await res.json();

  // /me 재조회(네트워크 왕복)를 기다리지 않고 헤더 등 로그인 상태부터 바로 반영
  // (주소·전화번호 등 나머지 필드는 뒤이은 /me 재조회가 채워줌)
  if (data.user) {
    useAuthStore.getState().setUser({
      postcode: null,
      address: null,
      address_detail: null,
      phone: null,
      ...data.user,
    });
  }

  return data;
}

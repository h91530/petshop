import { apiFetch } from "@/app/lib/apiClient";

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

  return res.json();
}

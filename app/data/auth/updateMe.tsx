import { apiFetch } from "@/app/lib/apiClient";

export interface UpdateMePayload {
  name?: string;
  postcode?: string;
  address?: string;
  addressDetail?: string;
  phone?: string;
}

export async function updateMe(payload: UpdateMePayload) {
  const res = await apiFetch("/me", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (res.status === 401) {
    throw new Error("로그인이 필요합니다");
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? "정보 수정에 실패했습니다.");
  }

  return res.json(); // { success, user }
}

export interface LoginPayload {
  username: string;
  password: string;
}

export async function login(payload: LoginPayload) {
  const res = await fetch("https://yangti.shop/searching/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("아이디 또는 비밀번호가 올바르지 않습니다.");
  }

  return res.json();
}

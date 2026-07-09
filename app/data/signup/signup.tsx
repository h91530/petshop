export interface signUp {
  username: string;
  password: string;
  name: string;
  postcode?: string;
  address?: string;
  addressDetail?: string;
  phone?: string;
}

export async function signup(payload: signUp) {
  const res = await fetch("https://yangti.shop/searching/signup", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? "회원가입에 실패하였습니다.");
  }

  return res.json();
}

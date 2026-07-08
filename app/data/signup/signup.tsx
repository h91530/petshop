export interface signUp {
    username : string,
    password : string,
    name : string
}


export async function signup({username, password, name} : signUp) {
  const res = await fetch("https://yangti.shop/searching/signup", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({username, password, name}),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error("회원가입에 실패하였습니다.");
  }

  return res.json();
}

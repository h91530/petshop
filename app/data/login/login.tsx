export async function testLogin() {
  try {
    const res = await fetch("https://yangti.shop/searching/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        username : "admin",
        password : "4321",
      }),
    });

    if (!res.ok) {
      throw new Error("로그인에 실패했습니다.");
    }

    const data = await res.json();

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
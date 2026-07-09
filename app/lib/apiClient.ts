const BASE_URL = "https://api.yangtae.site";

export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  return fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include",
  });
}

import { apiFetch } from '@/app/lib/apiClient'

export async function productsAction(id : number) {
  try {
    const res = await apiFetch(
      `/products/${id}/like`,
      {
        method: "POST",
      }
    );

    if (!res.ok) {
      throw new Error("Error");
    }

    const data = await res.json();

    return data;

  } catch(err) {
    console.error(err);
    throw err;
  }
}
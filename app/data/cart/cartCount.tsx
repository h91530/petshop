export interface CartItem {
  cart_id: number;
  product_id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  option_id: number;
  option_name: string;
  extra_price: number;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export interface CartResponse {
  success: boolean;
  data: CartItem[];
  total_count: number;
  total_price: number;
}

export async function cartCount(): Promise<CartResponse> {
  const res = await fetch("https://yangti.shop/searching/cart", {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("장바구니를 불러오지 못했습니다.");
  }

  return res.json();
}

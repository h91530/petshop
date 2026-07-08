export interface OrderItem {
  product_id: number;
  product_name: string;
  option_name: string;
  unit_price: number;
  quantity: number;
  image_url: string;
}

export interface Order {
  order_id: string;
  order_name: string;
  amount: number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

export interface OrdersResponse {
  success: boolean;
  data: Order[];
}

export async function fetchOrders(): Promise<OrdersResponse> {
  const res = await fetch("https://yangti.shop/searching/orders", {
    credentials: "include",
  });

  if (res.status === 401) {
    throw new Error("로그인이 필요합니다");
  }
  if (!res.ok) {
    throw new Error("주문내역을 불러오지 못했습니다.");
  }

  return res.json();
}

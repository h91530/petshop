export interface OrderItem {
  product_id: number;
  product_name: string;
  option_name: string;
  unit_price: number;
  quantity: number;
  image_url: string;
  reviewable: boolean; // PAID + 결제 후 3일 이내 + 미작성
  reviewed: boolean;   // 이미 작성함
}

export interface Shipping {
  postcode: string | null;
  address: string | null;
  address_detail: string | null;
  phone: string | null;
}

export type ReturnStatus = "NONE" | "REQUESTED" | "APPROVED" | "REJECTED" | "COMPLETED";

export interface Order {
  order_id: string;
  order_name: string;
  amount: number;
  status: string;
  paid_at: string;
  created_at: string;
  review_deadline: string; // 리뷰 마감 시각 (ISO)
  shipping: Shipping;
  return_status: ReturnStatus;
  return_reason: string | null;
  return_requested_at: string | null;
  return_deadline: string;   // 반품 마감 시각 (결제 후 7일)
  returnable: boolean;       // PAID + 7일 이내 + 미신청
  items: OrderItem[];
}

export interface OrdersResponse {
  success: boolean;
  data: Order[];
}

import { apiFetch } from "@/app/lib/apiClient";

export async function fetchOrders(): Promise<OrdersResponse> {
  const res = await apiFetch("/orders");

  if (res.status === 401) {
    throw new Error("로그인이 필요합니다");
  }
  if (!res.ok) {
    throw new Error("주문내역을 불러오지 못했습니다.");
  }

  return res.json();
}

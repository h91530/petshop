// data/products.ts

export interface ProductOption {
  id: number;
  name: string;
  extra_price: number;
}

export interface ProductType {
  id: number;
  name: string;
  desc: string;
  price: number;
  category: string;
  image: string;
  like_count: number,
  liked: boolean,
  detail: string,
  options: ProductOption[],
  rating_avg: number,
  rating_count: number,
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface RawProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  created_at: string;
  like_count: number;
  liked: boolean;
  detail: string,
  options: ProductOption[],
  rating_avg: number,
  rating_count: number,
}

import { apiFetch, BASE_URL } from "@/app/lib/apiClient";

function mapProduct(item: RawProduct): ProductType {
  return {
    id: item.id,
    name: item.name,
    desc: item.description,
    price: item.price,
    category: item.category,
    image: `/${item.image_url}`,
    like_count: item.like_count,
    liked: item.liked,
    detail: item.detail,
    options: item.options,
    rating_avg: item.rating_avg ?? 0,
    rating_count: item.rating_count ?? 0,
  };
}

// 클라이언트 컴포넌트에서 호출 (react-query) — 쿠키는 브라우저가 자동으로 실어보냄
export async function fetchProducts(): Promise<ProductType[]> {
  try {
    const res = await apiFetch("/");

    if (!res.ok) {
      throw new Error("상품 목록을 불러오지 못했습니다");
    }

    const json: ApiResponse<RawProduct[]> = await res.json();

    if (!json.success) {
      throw new Error(json.message || "요청이 실패했습니다");
    }

    return json.data.map(mapProduct);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// 서버 컴포넌트에서 호출 — 로그인한 사용자의 liked 여부가 정확히 나오도록 요청 쿠키를 직접 실어보냄
export async function fetchProductsServer(): Promise<ProductType[]> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();

  const res = await fetch(`${BASE_URL}/`, {
    headers: { Cookie: cookieStore.toString() },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("상품 목록을 불러오지 못했습니다");
  }

  const json: ApiResponse<RawProduct[]> = await res.json();

  if (!json.success) {
    throw new Error(json.message || "요청이 실패했습니다");
  }

  return json.data.map(mapProduct);
}

// 상품 상세 페이지(서버 컴포넌트)에서 호출 — 목록 전체를 안 가져오고 해당 상품만 요청
export async function fetchProductServer(id: number): Promise<ProductType | null> {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    cache: "no-store",
  });

  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error("상품을 불러오지 못했습니다");
  }

  const json: { success: boolean; data: RawProduct } = await res.json();

  if (!json.success) {
    return null;
  }

  return mapProduct(json.data);
}
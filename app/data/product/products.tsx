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
}

export async function fetchProducts(): Promise<ProductType[]> {
  try {
    const res = await fetch("https://yangti.shop/searching/", {
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("상품 목록을 불러오지 못했습니다");
    }

    const json: ApiResponse<RawProduct[]> = await res.json();

    if (!json.success) {
      throw new Error(json.message || "요청이 실패했습니다");
    }

    return json.data.map((item) => ({
      id: item.id,
      name: item.name,
      desc: item.description,
      price: item.price,
      category: item.category,
      image: `/${item.image_url}`,
      like_count: item.like_count,
      liked: item.liked,   
      detail: item.detail,
      options: item.options      
    }));
  } catch (err) {
    console.error(err);
    throw err;
  }
}
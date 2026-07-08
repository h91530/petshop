import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/app/data/product/products";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
}
import { Suspense } from "react";
import SearchBox from "./components/search/SearchBox"
import Category from "./components/category/Category";
import Section1 from "./components/section/section1/Section1";
import Section2 from "./components/section/section2/Section2";
import { fetchProductsServer } from "./data/product/products";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const products = await fetchProductsServer();
  const filtered = products.filter(
    (product) => !category || category === "all" || product.category === category
  );

  return (
    <>
      <SearchBox></SearchBox>
      <Suspense fallback={null}>
        <Category></Category>
      </Suspense>
      <Section1 products={filtered}></Section1>
      <Section2></Section2>
    </>
  );
}

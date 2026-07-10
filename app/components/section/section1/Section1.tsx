import "./Section1.css"
import type { ProductType } from "@/app/data/product/products";
import ProductGrid from "./ProductGrid";

export default function Section1({ products }: { products: ProductType[] }) {
  return (
    <section id="section1">
      <div className="inner">
        <ProductGrid products={products} />
      </div>
    </section>
  );
}

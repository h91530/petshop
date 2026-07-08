"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import "./Category.css";
import { memo } from "react";

function Category() {
  const searchParams = useSearchParams();
  const current = searchParams.get("category") ?? "all";

  return (
    <div className="category_wrap">
      <ul className="inner">
        <li className={current === "all" ? "active" : ""}>
          <Link href="/">전체</Link>
        </li>
        <li className={current === "dog" ? "active" : ""}>
          <Link href="/?category=dog">강아지</Link>
        </li>
        <li className={current === "cat" ? "active" : ""}>
          <Link href="/?category=cat">고양이</Link>
        </li>
      </ul>
    </div>
  );
}
export default memo(Category);

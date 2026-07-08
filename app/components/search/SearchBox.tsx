"use client";

import { memo } from "react";
import "./SearchBox.css";
import Image from "next/image";
import { useSearchStore } from "@/app/store/useSearchStore";

function SearchBox() {
  const keyword = useSearchStore((state) => state.keyword);
  const setKeyword = useSearchStore((state) => state.setKeyword);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  return (
    <div className="search_wrap">
      <div className="inner">
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="search"
            value={keyword}
            onChange={handleInput}
            placeholder="검색어를 입력해주세요."
          />
          <button type="submit">
            <Image
              src="https://cdn.jsdelivr.net/npm/remixicon@4.9.1/icons/System/search-line.svg"
              alt="검색"
              width={25}
              height={25}
            />
          </button>
        </form>
      </div>
    </div>
  );
}

export default memo(SearchBox);
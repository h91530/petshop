"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import StarRating from "./StarRating";
import Pagination from "@/app/components/pagination/Pagination";
import { useReviews } from "@/app/hooks/useReviews";
import "./ReviewSection.css";

const PAGE_SIZE = 3;
type SortKey = "latest" | "rating";

export default function ReviewSection({ productId }: { productId: number }) {
  const { data, isLoading, isError } = useReviews(productId);
  const [sort, setSort] = useState<SortKey>("latest");
  const [page, setPage] = useState(1);

  const reviews = useMemo(() => {
    const list = [...(data?.data ?? [])];
    if (sort === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    } else {
      list.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
    return list;
  }, [data, sort]);

  if (isLoading) return <p className="loading">리뷰 불러오는 중...</p>;
  if (isError) return null;

  const avg = data?.rating_avg ?? 0;
  const count = data?.rating_count ?? 0;
  const paged = reviews.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value as SortKey);
    setPage(1); // 정렬 바꾸면 첫 페이지로
  };

  return (
    <div className="review_section">
      <div className="review_summary">
        <h3>상품 리뷰</h3>
        <div className="summary_score">
          <StarRating rating={Math.round(avg)} size={22} />
          <strong>{avg.toFixed(1)}</strong>
          <span>({count})</span>
        </div>
      </div>

      {reviews.length === 0 ? (
        <p className="review_empty">아직 등록된 리뷰가 없어요.</p>
      ) : (
        <>
          <div className="review_sort">
            <select value={sort} onChange={handleSortChange}>
              <option value="latest">최신순</option>
              <option value="rating">별점순</option>
            </select>
          </div>

          <ul className="review_list">
            {paged.map((review, idx) => (
              <li key={idx} className="review_row">
                <div className="review_top">
                  <StarRating rating={review.rating} size={16} />
                  <span className="review_user">{review.user_name}</span>
                  <span className="review_date">
                    {new Date(review.created_at).toLocaleDateString("ko-KR")}
                  </span>
                </div>
                <p className="review_content">{review.content}</p>
              </li>
            ))}
          </ul>

          <Pagination page={page} total={reviews.length} pageSize={PAGE_SIZE} onChange={setPage} />
        </>
      )}
    </div>
  );
}

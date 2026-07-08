"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMyReviews } from "@/app/hooks/useMyReviews";
import { useDeleteReview } from "@/app/hooks/useDeleteReview";
import { useConfirmStore } from "@/app/store/confirmStore";
import { useToastStore } from "@/app/store/toastStore";
import RequireLogin from "@/app/components/auth/RequireLogin";
import StarRating from "@/app/components/review/StarRating";
import Pagination from "@/app/components/pagination/Pagination";
import "./my-reviews.css";

const PAGE_SIZE = 3;

export default function MyReviewsPage() {
  return (
    <RequireLogin>
      <MyReviewsContent />
    </RequireLogin>
  );
}

function MyReviewsContent() {
  const { data, isLoading, isError } = useMyReviews();
  const { mutate: removeReview } = useDeleteReview();
  const showConfirm = useConfirmStore((s) => s.showConfirm);
  const showToast = useToastStore((s) => s.showToast);
  const [page, setPage] = useState(1);

  const handleDelete = (reviewId: number) => {
    showConfirm("리뷰를 삭제하시겠습니까?", () => {
      removeReview(reviewId, {
        onSuccess: () => showToast("리뷰가 삭제되었어요."),
        onError: (err: Error) => showToast(err.message),
      });
    });
  };

  if (isLoading) return <p className="loading">로딩중...</p>;
  if (isError) return <p className="error">리뷰내역을 불러오지 못했어요.</p>;

  const reviews = data?.data ?? [];
  const paged = reviews.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="myrev_wrap">
      <div className="inner">
        <div className="title_wrap">
          <h2>내 리뷰</h2>
        </div>

        {reviews.length === 0 ? (
          <div className="empty_box">
            <p className="empty_msg">작성한 리뷰가 없어요.</p>
            <Link href="/orders" className="go_shop">
              주문내역 보기
            </Link>
          </div>
        ) : (
          <>
            <ul className="myrev_list">
              {paged.map((review) => (
                <li key={review.id} className="myrev_item">
                  <Link href={`/products/${review.product_id}`} className="myrev_img">
                    <Image src={`/${review.image_url}`} width={90} height={90} alt={review.product_name} />
                  </Link>
                  <div className="myrev_body">
                    <div className="myrev_head">
                      <Link href={`/products/${review.product_id}`} className="myrev_name">
                        {review.product_name}
                      </Link>
                      <div className="myrev_head_right">
                        <span className="myrev_date">
                          {new Date(review.created_at).toLocaleDateString("ko-KR")}
                        </span>
                        <button
                          type="button"
                          className="myrev_del"
                          onClick={() => handleDelete(review.id)}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                    <StarRating rating={review.rating} size={16} />
                    <p className="myrev_content">{review.content}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Pagination page={page} total={reviews.length} pageSize={PAGE_SIZE} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}

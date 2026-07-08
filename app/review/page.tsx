"use client";

import { Suspense, useState, type ChangeEvent } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import RequireLogin from "@/app/components/auth/RequireLogin";
import StarRating from "@/app/components/review/StarRating";
import { useCreateReview } from "@/app/hooks/useCreateReview";
import { useProducts } from "@/app/hooks/useProducts";
import { useToastStore } from "@/app/store/toastStore";
import "./review.css";

export default function ReviewPage() {
  return (
    <RequireLogin>
      <Suspense fallback={<p className="loading">로딩중...</p>}>
        <ReviewContent />
      </Suspense>
    </RequireLogin>
  );
}

function ReviewContent() {
  const params = useSearchParams();
  const router = useRouter();
  const showToast = useToastStore((s) => s.showToast);
  const { mutate: createReview, isPending } = useCreateReview();

  const { data: products } = useProducts();

  const orderId = params.get("orderId") ?? "";
  const productId = Number(params.get("productId"));
  const productName = params.get("productName") ?? "상품";
  const optionName = params.get("optionName");

  const productImage = products?.find((p) => p.id === productId)?.image;

  const [rating, setRating] = useState<number>(0);
  const [content, setContent] = useState<string>("");

  const handleSubmit = (): void => {
    if (rating === 0) {
      showToast("별점을 선택해주세요.");
      return;
    }
    if (!content.trim()) {
      showToast("리뷰 내용을 입력해주세요.");
      return;
    }

    createReview(
      { orderId, productId, rating, content },
      {
        onSuccess: () => {
          showToast("리뷰가 등록되었어요.");
          router.push("/orders");
        },
        onError: (err: Error) => {
          showToast(err.message);
        },
      }
    );
  };

  return (
    <div className="review_wrap">
      <div className="inner">
        <div className="title_wrap">
          <h2>리뷰 작성</h2>
        </div>

        <div className="review_product">
          {productImage && (
            <div className="rp_img">
              <Image src={productImage} width={72} height={72} alt={productName} />
            </div>
          )}
          <div className="rp_info">
            <p className="rp_name">{productName}</p>
            {optionName && <p className="rp_option">옵션: {optionName}</p>}
          </div>
        </div>

        <div className="review_field">
          <label>별점</label>
          <StarRating rating={rating} onChange={setRating} />
        </div>

        <div className="review_field">
          <label htmlFor="review_content">리뷰 내용</label>
          <textarea
            id="review_content"
            value={content}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
            placeholder="상품은 어떠셨나요? 솔직한 후기를 남겨주세요."
            rows={6}
          />
        </div>

        <div className="review_btns">
          <button type="button" className="review_cancel" onClick={() => router.back()} disabled={isPending}>
            취소
          </button>
          <button type="button" className="review_submit" onClick={handleSubmit} disabled={isPending}>
            {isPending ? "등록 중..." : "리뷰 등록"}
          </button>
        </div>
      </div>
    </div>
  );
}

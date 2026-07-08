"use client";

import "./StarRating.css";

interface StarRatingProps {
  rating: number; // 현재 선택된 별점 (0~5)
  onChange?: (value: number) => void; // 있으면 클릭 선택 가능, 없으면 읽기 전용
  size?: number; // 별 크기(px)
}

export default function StarRating({ rating, onChange, size = 32 }: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];
  const readOnly = !onChange;

  return (
    <div className={`star_rating ${readOnly ? "readonly" : ""}`} style={{ fontSize: size }}>
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          className={`star ${star <= rating ? "filled" : ""}`}
          onClick={() => onChange?.(star)}
          disabled={readOnly}
          aria-label={`${star}점`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

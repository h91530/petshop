"use client";

import "./Pagination.css";

interface PaginationProps {
  page: number; // 현재 페이지 (1부터)
  total: number; // 전체 아이템 수
  pageSize?: number; // 한 페이지당 개수 (기본 3)
  onChange: (page: number) => void;
}

export default function Pagination({ page, total, pageSize = 3, onChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination">
      <button
        type="button"
        className="page_btn arrow"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="이전 페이지"
      >
        ‹
      </button>

      {pages.map((p) => (
        <button
          type="button"
          key={p}
          className={`page_btn ${p === page ? "active" : ""}`}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}

      <button
        type="button"
        className="page_btn arrow"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="다음 페이지"
      >
        ›
      </button>
    </div>
  );
}

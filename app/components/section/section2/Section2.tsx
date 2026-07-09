"use client";

import { useState } from "react";
import "./Section2.css";

const FAQ = [
  {
    q: "배송은 얼마나 걸리나요?",
    a: "결제 완료 후 평균 1~3일 이내에 배송됩니다. 주말 및 공휴일은 배송이 지연될 수 있어요.",
  },
  {
    q: "교환·반품은 어떻게 하나요?",
    a: "상품 수령 후 7일 이내에 마이페이지 > 주문내역에서 신청할 수 있어요. 단순 변심의 경우 왕복 배송비가 부과됩니다.",
  },
  {
    q: "사료·간식의 유통기한은 어떻게 확인하나요?",
    a: "모든 식품류는 유통기한이 6개월 이상 남은 제품만 발송하며, 상품 상세페이지에서 제조일자를 확인하실 수 있어요.",
  },
  {
    q: "우리 아이에게 맞는 사이즈를 모르겠어요.",
    a: "각 상품 상세페이지의 옵션과 사이즈 안내를 참고해주세요.",
  },
  {
    q: "결제 수단은 어떤 게 있나요?",
    a: "신용·체크카드, 계좌이체, 간편결제(토스페이 등)를 지원해요. 결제는 토스페이먼츠를 통해 안전하게 처리됩니다.",
  },
];

export default function Section2() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="section2">
      <div className="inner">
        <div className="sec2_head">
          <h2>자주 묻는 질문</h2>
          <p>고객님들이 가장 많이 궁금해하시는 내용을 모았어요.</p>
        </div>

        <ul className="faq_list">
          {FAQ.map((item, index) => {
            const open = openIndex === index;
            return (
              <li key={index} className={`faq_item ${open ? "open" : ""}`}>
                <button type="button" className="faq_q" onClick={() => toggle(index)}>
                  <span className="q_mark">Q</span>
                  <span className="q_text">{item.q}</span>
                  <svg
                    className="q_arrow"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {open && <p className="faq_a">{item.a}</p>}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

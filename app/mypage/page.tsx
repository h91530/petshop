"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuthStore } from "@/app/store/authStore";
import { useOrders } from "@/app/hooks/useOrders";
import { useMyReviews } from "@/app/hooks/useMyReviews";
import { useProducts } from "@/app/hooks/useProducts";
import { useCartCount } from "@/app/hooks/useCart";
import RequireLogin from "@/app/components/auth/RequireLogin";
import EditInfoModal from "./EditInfoModal";
import "./mypage.css";

export default function MyPage() {
  return (
    <RequireLogin>
      <MyPageContent />
    </RequireLogin>
  );
}

const ICONS: Record<string, React.ReactNode> = {
  order: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="16" y2="17" />
    </>
  ),
  cart: (
    <>
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
    </>
  ),
  like: (
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
  ),
  review: (
    <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7.4-6.3-4.6L5.7 21.4 8 14 2 9.4h7.6z" />
  ),
};

function MyPageContent() {
  const user = useAuthStore((s) => s.user);
  const [editOpen, setEditOpen] = useState(false);

  const { data: orders } = useOrders();
  const { data: myReviews } = useMyReviews();
  const { data: products } = useProducts();
  const { data: cart } = useCartCount();

  const menus = [
    { href: "/orders", label: "주문내역", count: orders?.data?.length ?? 0, icon: "order" },
    { href: "/cart", label: "장바구니", count: cart?.data?.length ?? 0, icon: "cart" },
    { href: "/like", label: "찜한 상품", count: (products ?? []).filter((p) => p.liked).length, icon: "like" },
    { href: "/my-reviews", label: "내 리뷰", count: myReviews?.data?.length ?? 0, icon: "review" },
  ];

  return (
    <div className="mypage_wrap">
      <div className="inner">
        <div className="title_wrap">
          <h2>마이페이지</h2>
          <p className="mypage_greeting">
            <strong>{user?.name ?? "회원"}</strong>님, 안녕하세요
          </p>
        </div>

        {/* 내 정보 */}
        <div className="mypage_info">
          <div className="info_head">
            <h3>내 정보</h3>
            <button type="button" className="info_edit" onClick={() => setEditOpen(true)}>수정</button>
          </div>
          <dl className="info_list">
            <div className="info_row">
              <dt>이름</dt>
              <dd>{user?.name ?? "-"}</dd>
            </div>
            <div className="info_row">
              <dt>아이디</dt>
              <dd>{user?.username ?? "-"}</dd>
            </div>
            <div className="info_row">
              <dt>전화번호</dt>
              <dd>{user?.phone ?? "-"}</dd>
            </div>
            <div className="info_row">
              <dt>주소</dt>
              <dd>
                {user?.address ? (
                  <>
                    {user.postcode && <span className="info_postcode">({user.postcode})</span>}
                    {user.address} {user.address_detail ?? ""}
                  </>
                ) : (
                  "-"
                )}
              </dd>
            </div>
          </dl>
        </div>

        <ul className="mypage_menu">
          {menus.map((menu) => (
            <li key={menu.href}>
              <Link href={menu.href} className="menu_row">
                <span className="menu_icon">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {ICONS[menu.icon]}
                  </svg>
                </span>
                <span className="menu_label">{menu.label}</span>
                <span className="menu_count">{menu.count}</span>
                <svg className="menu_arrow" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {editOpen && <EditInfoModal onClose={() => setEditOpen(false)} />}
    </div>
  );
}

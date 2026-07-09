"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCartCount, useCartDelete, useCartplustMinus } from "@/app/hooks/useCart";
import type { CartItem } from "@/app/data/cart/cartCount";
import { useConfirmStore } from "@/app/store/confirmStore";
import RequireLogin from "@/app/components/auth/RequireLogin";
import PaymentModal from "@/app/components/payment/PaymentModal";
import Pagination from "@/app/components/pagination/Pagination";
import "./cart.css";
import { useToastStore } from '../store/toastStore'

const PAGE_SIZE = 3;


export default function CartPage() {
  return (
    <RequireLogin>
      <CartContent />
    </RequireLogin>
  );
}

function CartContent() {
  const { data: cart, isLoading, isError } = useCartCount();

  if (isLoading) return <p className="loading">로딩중...</p>;
  if (isError) return <p className="error">장바구니를 불러오지 못했어요. 로그인이 필요할 수 있어요.</p>;

  const items = cart?.data ?? [];

  return (
    <div className="cart_wrap">
      <div className="inner">
        <div className="title_wrap">
          <h2>장바구니</h2>
        </div>

        {items.length === 0 ? (
          <div className="empty_box">
            <p className="empty_msg">장바구니가 비어있어요.</p>
            <Link href="/" className="go_shop">
              쇼핑하러 가기
            </Link>
          </div>
        ) : (
          <CartList items={items} />
        )}
      </div>
    </div>
  );
}

function CartList({ items }: { items: CartItem[] }) {
    const { mutate: deleteCart, isPending : deleteCartLoading, isError : deleteCartLoadingError} = useCartDelete()
    const { mutate: changeCartQty } = useCartplustMinus()
    const [payOpen, setPayOpen] = useState(false)
    const [page, setPage] = useState(1)

  // 서버 수량으로 초기화 (마운트 시 1회)
  const [quantities, setQuantities] = useState<Record<number, number>>(() =>
    Object.fromEntries(items.map((i) => [i.cart_id, i.quantity]))
  );

  const paged = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const changeQty = (cartId: number, delta: number) => {
    const prevQty = quantities[cartId] ?? 1;
    const nextQty = Math.max(1, prevQty + delta);
    if (nextQty === prevQty) return; // 1에서 - 누른 경우 등

    // 낙관적 업데이트: 화면 먼저 갱신
    setQuantities((prev) => ({ ...prev, [cartId]: nextQty }));

    // 서버에 새 수량(절대값) 전송
    changeCartQty(
      { cartId, quantity: nextQty },
      {
        onError: () => {
          // 실패 시 이전 수량으로 롤백
          setQuantities((prev) => ({ ...prev, [cartId]: prevQty }));
        },
      }
    );
  };

  const getQty = (item: CartItem) => quantities[item.cart_id] ?? item.quantity;

  const showConfirm = useConfirmStore((s) => s.showConfirm);

  const handleDelete = (cartId: number) => {
    showConfirm("삭제하시겠습니까?", () => {
      deleteCart(cartId);
    });
  };

  const totalCount = items.reduce((sum, i) => sum + getQty(i), 0);
  const totalPrice = items.reduce((sum, i) => sum + i.unit_price * getQty(i), 0);

  return (
    <>
      <ul className="cart_list">
        {paged.map((item) => {
          const qty = getQty(item);
          return (
            <li key={item.cart_id} className="cart_item">
              <div className="item_top">
                <div className="img_box">
                  <Image src={`/${item.image_url}`} width={120} height={120} alt={item.name} />
                </div>

                <div className="item_info">
                  <h3 className="item_name">{item.name}</h3>
                  <p className="item_option">{item.option_name}</p>
                  <p className="item_unit">{item.unit_price.toLocaleString()}원</p>

                  <div className="item_qty">
                    <button
                      type="button"
                      className="qty_btn"
                      onClick={() => changeQty(item.cart_id, -1)}
                      disabled={qty <= 1}
                      aria-label="수량 감소"
                    >
                      −
                    </button>
                    <span className="qty_num">{qty}</span>
                    <button
                      type="button"
                      className="qty_btn"
                      onClick={() => changeQty(item.cart_id, 1)}
                      aria-label="수량 증가"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="item_right">
                <button type="button" className="del_btn" aria-label="삭제" onClick={() => handleDelete(item.cart_id)}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                </button>
                <div className="item_price">
                  <strong>{(item.unit_price * qty).toLocaleString()}</strong>
                  <em>원</em>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <Pagination page={page} total={items.length} pageSize={PAGE_SIZE} onChange={setPage} />

      <div className="cart_summary">
        <div className="summary_row">
          <span>총 수량</span>
          <span>{totalCount}개</span>
        </div>
        <div className="summary_row total">
          <span>총 결제금액</span>
          <strong>{totalPrice.toLocaleString()}원</strong>
        </div>
        <button type="button" className="order_btn" onClick={() => setPayOpen(true)}>
          주문하기
        </button>
      </div>

      {payOpen && <PaymentModal onClose={() => setPayOpen(false)} />}
    </>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ChangeEvent } from "react";
import { useOrders } from "@/app/hooks/useOrders";
import { useProducts } from "@/app/hooks/useProducts";
import { useRequestReturn } from "@/app/hooks/useRequestReturn";
import { useToastStore } from "@/app/store/toastStore";
import type { ReturnStatus } from "@/app/data/order/fetchOrders";
import RequireLogin from "@/app/components/auth/RequireLogin";
import Pagination from "@/app/components/pagination/Pagination";
import "./orders.css";

const PAGE_SIZE = 3;

const STATUS_LABEL: Record<string, string> = {
  PAID: "결제완료",
  READY: "결제대기",
  CANCELED: "취소됨",
  DONE: "결제완료",
};

const RETURN_LABEL: Record<ReturnStatus, string> = {
  NONE: "",
  REQUESTED: "반품 접수됨",
  APPROVED: "반품 승인",
  REJECTED: "반품 거절",
  COMPLETED: "반품 완료",
};

export default function OrdersPage() {
  return (
    <RequireLogin>
      <OrdersContent />
    </RequireLogin>
  );
}

function OrdersContent() {
  const { data, isLoading, isError } = useOrders();
  const { data: products } = useProducts();
  const { mutate: requestReturn, isPending: returning } = useRequestReturn();
  const showToast = useToastStore((s) => s.showToast);
  const [page, setPage] = useState(1);

  // 반품 사유 입력 모달
  const [returnTarget, setReturnTarget] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const submitReturn = () => {
    if (!reason.trim()) {
      showToast("반품 사유를 입력해주세요.");
      return;
    }
    requestReturn(
      { orderId: returnTarget!, reason },
      {
        onSuccess: () => {
          showToast("반품 신청이 접수되었어요.");
          setReturnTarget(null);
          setReason("");
        },
        onError: (err: Error) => showToast(err.message),
      }
    );
  };

  if (isLoading) return <p className="loading">로딩중...</p>;
  if (isError) return <p className="error">주문내역을 불러오지 못했어요.</p>;

  const orders = data?.data ?? [];
  const paged = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // product_id → 설명(desc) 매핑
  const descMap = new Map((products ?? []).map((p) => [p.id, p.desc]));

  return (
    <div className="orders_wrap">
      <div className="inner">
        <div className="title_wrap">
          <h2>주문내역</h2>
        </div>

        {orders.length === 0 ? (
          <div className="empty_box">
            <p className="empty_msg">주문내역이 없어요.</p>
            <Link href="/" className="go_shop">
              쇼핑하러 가기
            </Link>
          </div>
        ) : (
          <>
          <ul className="order_list">
            {paged.map((order) => (
              <li key={order.order_id} className="order_card">
                <div className="order_head">
                  <div className="order_meta">
                    <span className="order_date">
                      {new Date(order.created_at).toLocaleDateString("ko-KR")}
                    </span>
                    <span className="order_id">주문번호 {order.order_id}</span>
                  </div>
                  <span className={`order_status status_${order.status}`}>
                    {STATUS_LABEL[order.status] ?? order.status}
                  </span>
                </div>

                {order.items.length > 0 ? (
                  <ul className="order_items">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="order_item">
                        <div className="img_box">
                          <Image src={`/${item.image_url}`} width={72} height={72} alt={item.product_name} />
                        </div>
                        <div className="item_info">
                          <p className="item_name">{item.product_name}</p>
                          {descMap.get(item.product_id) && (
                            <p className="item_desc">{descMap.get(item.product_id)}</p>
                          )}
                          <p className="item_option">옵션: {item.option_name}</p>
                          <p className="item_qty">
                            {item.unit_price.toLocaleString()}원 · {item.quantity}개
                          </p>
                        </div>
                        {order.return_status !== "NONE" ? null : item.reviewable ? (
                          <Link
                            href={`/review?orderId=${order.order_id}&productId=${item.product_id}&productName=${encodeURIComponent(item.product_name)}&optionName=${encodeURIComponent(item.option_name)}`}
                            className="review_btn"
                          >
                            리뷰 쓰기
                          </Link>
                        ) : item.reviewed ? (
                          <span className="review_done">작성 완료</span>
                        ) : (
                          <span className="review_expired">기간 만료</span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="order_name_only">{order.order_name}</p>
                )}

                <div className="order_foot">
                  <div className="foot_left">
                    <span>총 결제금액</span>
                    <strong>{order.amount.toLocaleString()}원</strong>
                  </div>
                  {order.returnable ? (
                    <button
                      type="button"
                      className="return_btn"
                      onClick={() => setReturnTarget(order.order_id)}
                    >
                      반품 신청
                    </button>
                  ) : order.return_status !== "NONE" ? (
                    <span className={`return_status rs_${order.return_status}`}>
                      {RETURN_LABEL[order.return_status]}
                    </span>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
          <Pagination page={page} total={orders.length} pageSize={PAGE_SIZE} onChange={setPage} />
          </>
        )}
      </div>

      {returnTarget && (
        <div className="return_overlay" onClick={() => setReturnTarget(null)}>
          <div className="return_modal" onClick={(e) => e.stopPropagation()}>
            <h3>반품 신청</h3>
            <textarea
              value={reason}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)}
              placeholder="반품 사유를 입력해주세요."
              rows={4}
            />
            <div className="return_modal_btns">
              <button type="button" className="rm_cancel" onClick={() => setReturnTarget(null)}>
                취소
              </button>
              <button type="button" className="rm_submit" onClick={submitReturn} disabled={returning}>
                {returning ? "신청 중..." : "반품 신청"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

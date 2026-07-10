"use client";

import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/app/hooks/useCart';
import type { AddCartPayload } from '@/app/data/cart/addCart';
import { useToastStore } from '@/app/store/toastStore';
import PaymentModal from '@/app/components/payment/PaymentModal';
import ReviewSection from '@/app/components/review/ReviewSection';
import type { ProductType } from '@/app/data/product/products';

export default function ProductDetailClient({ product }: { product: ProductType }) {
  const { mutate: addCart, isPending, isError: cartError } = useCart();
  const showToast = useToastStore((s) => s.showToast);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [payOpen, setPayOpen] = useState(false);

  const selectedOption = product.options?.find((o) => o.id === selectedOptionId);
  const unitPrice = product.price + (selectedOption?.extra_price ?? 0);
  const totalPrice = unitPrice * quantity;

  const decrease = () => setQuantity((q) => Math.max(1, q - 1));
  const increase = () => setQuantity((q) => q + 1);

  const handleAddToCart = () => {
    if (!selectedOption) {
      showToast("옵션을 선택해주세요");
      return;
    }
    const payload: AddCartPayload = {
      productId: product.id,
      optionId: selectedOption.id,
      quantity,
    };
    addCart(payload);
  };

  return (
    <div className="product_wrap">
      <div className="inner">
        <div className="title_wrap">
          <h2>{product.name}</h2>
        </div>

        <div className="product_detail_wrap">
          <div className="img_box">
            <Image src={product.image} width={400} height={400} alt={product.name} />
          </div>

          <div className="detail_txt">
            <h2 className="detail_name">{product.name}</h2>
            <p className="detail_desc">{product.desc}</p>

            <div className="detail_desc_area">
              <h3>상세 설명</h3>
              <p>{product.detail}</p>
            </div>

            <div className="option_area">
              <label htmlFor="option_select">옵션 선택</label>
              <select
                id="option_select"
                value={selectedOptionId ?? ''}
                onChange={(e) =>
                  setSelectedOptionId(e.target.value ? Number(e.target.value) : null)
                }
              >
                <option value="">옵션을 선택해주세요</option>
                {product.options?.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                    {option.extra_price > 0
                      ? ` (+${option.extra_price.toLocaleString()}원)`
                      : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="qty_area">
              <span className="qty_label">수량</span>
              <div className="qty">
                <button
                  type="button"
                  className="qty_btn"
                  onClick={decrease}
                  disabled={quantity <= 1}
                  aria-label="수량 감소"
                >
                  −
                </button>
                <span className="qty_num">{quantity}</span>
                <button
                  type="button"
                  className="qty_btn"
                  onClick={increase}
                  aria-label="수량 증가"
                >
                  +
                </button>
              </div>
            </div>

            <div className="price_area">
              <span className="price_label">총 금액</span>
              <strong className="price_value">
                {totalPrice.toLocaleString()}
                <em>원</em>
              </strong>
            </div>

            <div className="btn_area">
              <button
                type="button"
                className="cart_btn"
                onClick={handleAddToCart}
                disabled={!selectedOption}
              >
                장바구니 담기
              </button>
              <button
                type="button"
                className="buy_btn"
                onClick={() => setPayOpen(true)}
                disabled={!selectedOption}
              >
                {selectedOption ? '구매하기' : '옵션을 선택해주세요'}
              </button>
            </div>
          </div>
        </div>

        <ReviewSection productId={product.id} />
      </div>

      {payOpen && selectedOption && (
        <PaymentModal
          onClose={() => setPayOpen(false)}
          direct={{
            productId: product.id,
            optionId: selectedOption.id,
            quantity,
            amount: totalPrice,
            orderName:
              quantity > 1 ? `${product.name} ${quantity}개` : product.name,
          }}
        />
      )}
    </div>
  );
}

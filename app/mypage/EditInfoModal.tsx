"use client";

import { useState, type ChangeEvent } from "react";
import { useUpdateMe } from "@/app/hooks/useUpdateMe";
import { useAuthStore } from "@/app/store/authStore";
import { useToastStore } from "@/app/store/toastStore";
import { openPostcode } from "@/app/lib/openPostcode";
import "./EditInfoModal.css";

export default function EditInfoModal({ onClose }: { onClose: () => void }) {
  const user = useAuthStore((s) => s.user);
  const { mutate: updateMe, isPending } = useUpdateMe();
  const showToast = useToastStore((s) => s.showToast);

  const [name, setName] = useState(user?.name ?? "");
  const [postcode, setPostcode] = useState(user?.postcode ?? "");
  const [address, setAddress] = useState(user?.address ?? "");
  const [addressDetail, setAddressDetail] = useState(user?.address_detail ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");

  const handleFindAddress = () => {
    openPostcode(({ zonecode, address }) => {
      setPostcode(zonecode);
      setAddress(address);
    });
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
    let formatted = digits;
    if (digits.length > 7) formatted = `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
    else if (digits.length > 3) formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
    setPhone(formatted);
  };

  const handleSave = () => {
    if (!name.trim()) {
      showToast("이름은 비울 수 없어요.");
      return;
    }
    updateMe(
      { name, postcode, address, addressDetail, phone },
      {
        onSuccess: () => {
          showToast("정보가 수정되었어요.");
          onClose();
        },
        onError: (err: Error) => showToast(err.message),
      }
    );
  };

  return (
    <div className="edit_overlay" onClick={onClose}>
      <div className="edit_modal" onClick={(e) => e.stopPropagation()}>
        <h3>내 정보 수정</h3>

        <div className="edit_field">
          <label htmlFor="edit_name">이름</label>
          <input
            id="edit_name"
            type="text"
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            placeholder="이름"
          />
        </div>

        <div className="edit_field">
          <label>주소</label>
          <div className="addr_row">
            <input type="text" value={postcode} readOnly placeholder="우편번호" />
            <button type="button" className="addr_find" onClick={handleFindAddress}>
              주소 검색
            </button>
          </div>
          <input type="text" value={address} readOnly placeholder="기본 주소" />
          <input
            type="text"
            value={addressDetail}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setAddressDetail(e.target.value)}
            placeholder="상세 주소"
          />
        </div>

        <div className="edit_field">
          <label htmlFor="edit_phone">전화번호</label>
          <input
            id="edit_phone"
            type="tel"
            inputMode="numeric"
            maxLength={13}
            value={phone}
            onChange={handlePhoneChange}
            placeholder="010-1234-5678"
          />
        </div>

        <div className="edit_btns">
          <button type="button" className="edit_cancel" onClick={onClose} disabled={isPending}>
            취소
          </button>
          <button type="button" className="edit_save" onClick={handleSave} disabled={isPending}>
            {isPending ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}

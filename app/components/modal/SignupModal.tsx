"use client";

import { useState, type ChangeEvent } from "react";
import "./modal.css";
import { useModalStore } from "@/app/store/modalStore";
import { useToastStore } from "@/app/store/toastStore";
import { useSignup } from "@/app/hooks/useSignup";
import type { signUp } from "@/app/data/signup/signup";
import { openPostcode } from "@/app/lib/openPostcode";

export default function SignupModal() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [postcode, setPostcode] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [addressDetail, setAddressDetail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const { mutate: signUp, isPending } = useSignup();

  const openLoginModal = useModalStore((s) => s.openLoginModal);
  const showToast = useToastStore((s) => s.showToast);

  const handleFindAddress = () => {
    openPostcode(({ zonecode, address }) => {
      setPostcode(zonecode);
      setAddress(address);
    });
  };

  // 숫자만 남겨서 010-1234-5678 형식으로 자동 하이픈
  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
    let formatted = digits;
    if (digits.length > 7) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
    } else if (digits.length > 3) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
    }
    setPhone(formatted);
  };

  const handleSignup = (): void => {
    if (!username || !password || !name) {
      showToast("아이디, 이름, 비밀번호는 필수예요.");
      return;
    }
    if (password !== passwordConfirm) {
      showToast("비밀번호가 일치하지 않습니다.");
      return;
    }

    const signData: signUp = {
      username,
      password,
      name,
      postcode: postcode || undefined,
      address: address || undefined,
      addressDetail: addressDetail || undefined,
      phone: phone || undefined,
    };
    signUp(signData, {
      onSuccess: (): void => {
        showToast("회원가입이 완료되었어요. 로그인해주세요.");
        openLoginModal();
      },
      onError: (err: Error): void => {
        showToast(err.message);
      },
    });
  };

  return (
    <div className="modal_wrap">
      <div className="inner">
        <h2>회원가입</h2>
        <div className="field">
          <label htmlFor="signup_id">아이디</label>
          <input
            id="signup_id"
            type="text"
            value={username}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
            placeholder="아이디를 입력해주세요"
          />
        </div>
        <div className="field">
          <label htmlFor="signup_name">이름</label>
          <input
            id="signup_name"
            type="text"
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            placeholder="이름을 입력해주세요"
          />
        </div>
        <div className="field">
          <label htmlFor="signup_password">비밀번호</label>
          <input
            id="signup_password"
            type="password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력해주세요"
          />
        </div>
        <div className="field">
          <label htmlFor="signup_password_confirm">비밀번호 확인</label>
          <input
            id="signup_password_confirm"
            type="password"
            value={passwordConfirm}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPasswordConfirm(e.target.value)}
            placeholder="비밀번호를 다시 입력해주세요"
          />
        </div>

        <div className="field">
          <label htmlFor="signup_postcode">주소 <span className="optional">(선택)</span></label>
          <div className="addr_row">
            <input
              id="signup_postcode"
              type="text"
              value={postcode}
              readOnly
              placeholder="우편번호"
            />
            <button type="button" className="addr_find" onClick={handleFindAddress}>
              주소 검색
            </button>
          </div>
        </div>
        <input
          type="text"
          value={address}
          readOnly
          placeholder="기본 주소 (검색으로 입력)"
        />
        <input
          type="text"
          value={addressDetail}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setAddressDetail(e.target.value)}
          placeholder="상세 주소를 입력해주세요"
        />

        <div className="field">
          <label htmlFor="signup_phone">전화번호 <span className="optional">(선택)</span></label>
          <input
            id="signup_phone"
            type="tel"
            inputMode="numeric"
            maxLength={13}
            value={phone}
            onChange={handlePhoneChange}
            placeholder="010-1234-5678"
          />
        </div>

        <button type="button" onClick={handleSignup} disabled={isPending}>
          {isPending ? "가입 중..." : "회원가입"}
        </button>
        <p className="modal_switch">
          이미 회원이신가요?{" "}
          <button type="button" className="switch_link" onClick={openLoginModal}>
            로그인
          </button>
        </p>
      </div>
    </div>
  );
}

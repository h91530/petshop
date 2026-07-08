"use client";

import { useState, type ChangeEvent } from "react";
import "./modal.css";
import { useModalStore } from "@/app/store/modalStore";
import { useToastStore } from "@/app/store/toastStore";
import { useSignup } from "@/app/hooks/useSignup";
import type { signUp } from "@/app/data/signup/signup";

export default function SignupModal() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [name, setName] = useState<string>("");
  const { mutate: signUp, isPending } = useSignup();

  const openLoginModal = useModalStore((s) => s.openLoginModal);
  const showToast = useToastStore((s) => s.showToast);

  const handleSignup = (): void => {
    if (!username || !password || !name) {
      showToast("모든 항목을 입력해주세요.");
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
        <button type="button" onClick={handleSignup}>
          회원가입
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

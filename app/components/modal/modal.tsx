"use client";

import { useState } from "react";
import "./modal.css";
import useLogin from "@/app/hooks/useLogin";
import { useModalStore } from "@/app/store/modalStore";
import { useToastStore } from "@/app/store/toastStore";

export default function Modal() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const { mutate : login, isPending} = useLogin();
  const closeLoginModal = useModalStore((s) => s.closeLoginModal);
  const openSignupModal = useModalStore((s) => s.openSignupModal);
  const showToast = useToastStore((s) => s.showToast);

const handleLogin = () => {
  if (!userId || !password) {
    showToast("아이디와 비밀번호를 입력해주세요.");
    return;
  }
  login(
    { username: userId, password },
    {
      onSuccess: () => closeLoginModal(),
      onError: (err) => showToast(err.message),
    }
  );
};

const handleTestLogin = () => {
  login(
    { username: "admin", password: "4321" },
    {
      onSuccess: () => closeLoginModal(),
      onError: (err) => showToast(err.message),
    }
  );
};



  return (
    <div className="modal_wrap">
      <div className="inner">
        <h2>로그인</h2>
        <div className="field">
          <label htmlFor="modal_id">아이디</label>
          <input
            id="modal_id"
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="아이디를 입력해주세요"
          />
        </div>
        <div className="field">
          <label htmlFor="modal_password">비밀번호</label>
          <input
            id="modal_password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력해주세요"
          />
        </div>
        <button type="button" onClick={handleLogin} disabled={isPending}>
          로그인
        </button>
        <button type="button" className="test_login" onClick={handleTestLogin} disabled={isPending}>
          {isPending ? "로그인 중..." : "테스트용 로그인"}
        </button>
        <p className="modal_switch">
          아직 회원이 아니신가요?{" "}
          <button type="button" className="switch_link" onClick={openSignupModal}>
            회원가입
          </button>
        </p>
      </div>
    </div>
  );
}
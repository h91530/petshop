"use client";

import { useState } from "react";
import "./modal.css";
import useLogin from "@/app/hooks/useLogin";
import { useModalStore } from "@/app/store/modalStore";

export default function Modal() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const { mutate : login, isPending} = useLogin();
  const closeLoginModal = useModalStore((s) => s.closeLoginModal);

const handleTestLogin = () => {
  login(undefined, {
    onSuccess: () => {
      closeLoginModal();
    },
    onError: (err) => {
      console.error("로그인 실패:", err);
    },
  });
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
        <button type="button" onClick={handleTestLogin} disabled={isPending}>
          {isPending ? "로그인 중..." : "테스트용 로그인"}
        </button>
      </div>
    </div>
  );
}
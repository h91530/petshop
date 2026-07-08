"use client";

import { useToastStore } from "@/app/store/toastStore";
import "./Toast.css";

export default function Toast() {
  const message = useToastStore((s) => s.message);
  const isOpen = useToastStore((s) => s.isOpen);
  const closeToast = useToastStore((s) => s.closeToast);

  if (!isOpen) return null;

  return (
    <div className="toast_overlay" onClick={closeToast}>
      <div className="toast_box" onClick={(e) => e.stopPropagation()}>
        <p className="toast_msg">{message}</p>
        <button type="button" className="toast_btn" onClick={closeToast}>
          확인
        </button>
      </div>
    </div>
  );
}

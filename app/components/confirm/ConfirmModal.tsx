"use client";

import { useConfirmStore } from "@/app/store/confirmStore";
import "./ConfirmModal.css";

export default function ConfirmModal() {
  const message = useConfirmStore((s) => s.message);
  const isOpen = useConfirmStore((s) => s.isOpen);
  const onConfirm = useConfirmStore((s) => s.onConfirm);
  const closeConfirm = useConfirmStore((s) => s.closeConfirm);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm?.();
    closeConfirm();
  };

  return (
    <div className="confirm_overlay" onClick={closeConfirm}>
      <div className="confirm_box" onClick={(e) => e.stopPropagation()}>
        <p className="confirm_msg">{message}</p>
        <div className="confirm_btns">
          <button type="button" className="confirm_cancel" onClick={closeConfirm}>
            취소
          </button>
          <button type="button" className="confirm_ok" onClick={handleConfirm}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

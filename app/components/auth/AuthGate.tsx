"use client";

import { useModalStore } from "@/app/store/modalStore";
import useAuthCheck from "@/app/hooks/useAuthCheck";
import Modal from "../modal/modal";

export default function AuthGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLoginModalOpen = useModalStore((state) => state.isLoginModalOpen);
  const { isError, isFetched } = useAuthCheck();

  return (
    <>
      {children}
      {isFetched && isError && isLoginModalOpen && <Modal />}
    </>
  );
}

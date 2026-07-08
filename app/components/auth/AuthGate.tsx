"use client";

import { useModalStore } from "@/app/store/modalStore";
import useAuthCheck from "@/app/hooks/useAuthCheck";
import Modal from "../modal/modal";
import SignupModal from "../modal/SignupModal";

export default function AuthGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLoginModalOpen = useModalStore((state) => state.isLoginModalOpen);
  const isSignupModalOpen = useModalStore((state) => state.isSignupModalOpen);
  const { isError, isFetched } = useAuthCheck();

  const showAuthModal = isFetched && isError;

  return (
    <>
      {children}
      {showAuthModal && isLoginModalOpen && <Modal />}
      {showAuthModal && isSignupModalOpen && <SignupModal />}
    </>
  );
}

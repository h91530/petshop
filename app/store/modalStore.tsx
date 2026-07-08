import { create } from 'zustand';

interface ModalState {
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isLoginModalOpen: true,
  openLoginModal: () => set({ isLoginModalOpen: true }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),
}));
import { create } from 'zustand';

interface ToastState {
  message: string;
  isOpen: boolean;
  showToast: (message: string) => void;
  closeToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: '',
  isOpen: false,
  showToast: (message) => set({ message, isOpen: true }),
  closeToast: () => set({ isOpen: false }),
}));

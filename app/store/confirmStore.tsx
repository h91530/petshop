import { create } from 'zustand';

interface ConfirmState {
  message: string;
  isOpen: boolean;
  onConfirm: (() => void) | null;
  showConfirm: (message: string, onConfirm: () => void) => void;
  closeConfirm: () => void;
}

export const useConfirmStore = create<ConfirmState>((set) => ({
  message: '',
  isOpen: false,
  onConfirm: null,
  showConfirm: (message, onConfirm) => set({ message, onConfirm, isOpen: true }),
  closeConfirm: () => set({ isOpen: false, onConfirm: null }),
}));

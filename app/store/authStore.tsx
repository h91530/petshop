import { create } from 'zustand';

interface User {
  id: number;
  username: string;
  name: string;
  postcode: string | null;
  address: string | null;
  address_detail: string | null;
  phone: string | null;
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

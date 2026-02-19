import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string; // 🚨 Added this line
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  // Actions
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,

  setAuth: (user, token) => set({
    user,
    accessToken: token,
    isAuthenticated: true
  }),

  logout: () => set({
    user: null,
    accessToken: null,
    isAuthenticated: false
  }),
}));
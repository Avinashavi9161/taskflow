import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { authApi, tokenStore } from '@/lib/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      hydrate: async () => {
        const token = tokenStore.get();
        if (!token) return;
        try {
          const res = await authApi.me();
          set({ user: res.data.data.user, isAuthenticated: true });
        } catch {
          tokenStore.clear();
          set({ user: null, isAuthenticated: false });
        }
      },

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await authApi.login({ email, password });
          const { user, accessToken } = res.data.data;
          tokenStore.set(accessToken);
          set({ user, isAuthenticated: true });
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true });
        try {
          const res = await authApi.register({ name, email, password });
          const { user, accessToken } = res.data.data;
          tokenStore.set(accessToken);
          set({ user, isAuthenticated: true });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try { await authApi.logout(); } catch { /* ignore */ }
        tokenStore.clear();
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'tf-auth',
      partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }),
    },
  ),
);

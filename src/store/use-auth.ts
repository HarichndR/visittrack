import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/services/api';

import { User } from '@/types';

interface Tokens {
  access: { token: string; expires: string };
  refresh: { token: string; expires: string };
}

interface AuthState {
  user: User | null;
  tokens: Tokens | null;
  setAuth: (user: User, tokens: Tokens) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      setAuth: (user, tokens) => set({ user, tokens }),
      login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const { user, tokens } = response.data.data;
        set({ user, tokens });
      },
      logout: () => set({ user: null, tokens: null }),
      updateUser: (user) => set({ user }),
    }),
    {
      name: 'visitrack-auth',
    }
  )
);

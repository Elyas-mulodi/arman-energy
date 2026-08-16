import { create } from 'zustand';
import api from '@/lib/axios';
import { User } from '@/types/user';
import { AxiosError } from 'axios';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;

  fetchUser: () => Promise<void>;
  login: (phone: string, password: string) => Promise<User>;
  register: (fullName: string, phone: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isInitialized: false,

  fetchUser: async () => {
    try {
      const { data } = await api.get<User>('/users/profile');
      set({ user: data, isLoading: false, isInitialized: true });
    } catch {
      set({ user: null, isLoading: false, isInitialized: true });
    }
  },

  login: async (phone: string, password: string) => {
    const { data } = await api.post<User>('/users/login', { phone, password });
    set({ user: data });
    return data;
  },

  register: async (fullName: string, phone: string, password: string) => {
    const { data } = await api.post<User>('/users/register', { fullName, phone, password });
    set({ user: data });
    return data;
  },

  logout: async () => {
    await api.post('/users/logout');
    set({ user: null });
  },

  isAdmin: () => get().user?.role === 'admin',
}));

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || 'خطایی رخ داد';
  }
  return 'خطایی رخ داد';
};
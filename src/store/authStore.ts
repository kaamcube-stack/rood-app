// src/store/authStore.ts
import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

interface AuthState {
  isLoggedIn: boolean;
  isGuest: boolean;
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  browseAsGuest: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  isGuest: false,
  user: null,
  token: null,

  login: async (user, token) => {
    await SecureStore.setItemAsync('auth_token', token);
    await SecureStore.setItemAsync('auth_user', JSON.stringify(user));
    set({ isLoggedIn: true, user, token });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('auth_token');
    await SecureStore.deleteItemAsync('auth_user');
    set({ isLoggedIn: false, isGuest: false, user: null, token: null });
  },

  browseAsGuest: () => {
    set({ isGuest: true });
  },

  restoreSession: async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      const userStr = await SecureStore.getItemAsync('auth_user');
      if (token && userStr) {
        const user = JSON.parse(userStr);
        set({ isLoggedIn: true, user, token });
      }
    } catch {
      // No saved session
    }
  },
}));

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../services/api';
import type { User } from '../types';

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      token: null,
      user: null,
      isLoading: false,
      isInitialized: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.login({ email, password });
          apiClient.setToken(response.accessToken);
          set({
            token: response.accessToken,
            user: response.user,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false,
          });
          throw error;
        }
      },

      signup: async (
        email: string,
        password: string,
        name: string,
        phone?: string,
      ) => {
        set({ isLoading: true, error: null });
        try {
          console.log('Signup request:', { email, name, phone });
          const response = await apiClient.signup({
            email,
            password,
            name,
            phone,
          });
          console.log('Signup response:', response);
          set({
            token: null,
            user: null,
            isLoading: false,
          });
        } catch (error) {
          console.log('Signup error:', error);
          set({
            error: error instanceof Error ? error.message : 'Signup failed',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        apiClient.setToken(null);
        set({ token: null, user: null, error: null });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'lynkup-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        token: state.token,
        user: state.user,
      }),
      onRehydrateStorage: () => state => {
        if (state?.token) {
          apiClient.setToken(state.token);
        }
        if (state) {
          state.isInitialized = true;
        }
      },
    },
  ),
);

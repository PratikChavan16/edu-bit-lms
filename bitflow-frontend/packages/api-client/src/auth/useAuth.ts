import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  photo_url?: string;
  status: string;
  roles: Array<{
    id: string;
    name: string;
    slug: string;
    college_id?: string;
    university_id?: string;
  }>;
  student?: {
    id: string;
    college_id: string;
    college_name: string;
    roll_no: string;
    course: string;
    year: number;
    section: string;
    status: string;
  };
  faculty?: {
    id: string;
    college_id: string;
    college_name: string;
    employee_id: string;
    department_id: string;
    employment_type: string;
    status: string;
  };
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  clearAuth: () => void;
  fetchUser: () => Promise<void>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username,
              password,
              device_name: 'web',
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Login failed');
          }

          if (data.success) {
            set({
              token: data.data.token,
              user: data.data.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          }
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Login failed',
          });
          throw error;
        }
      },

      logout: async () => {
        const { token } = get();
        
        if (token) {
          try {
            await fetch(`${API_BASE_URL}/auth/logout`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
          } catch (error) {
            console.error('Logout request failed:', error);
          }
        }

        set({
          token: null,
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      setToken: (token: string) => {
        set({ token });
      },

      clearAuth: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      fetchUser: async () => {
        const { token } = get();
        
        if (!token) {
          return;
        }

        set({ isLoading: true });

        try {
          const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error('Failed to fetch user');
          }

          if (data.success) {
            set({
              user: data.data,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error('Failed to fetch user:', error);
          set({
            isLoading: false,
            token: null,
            user: null,
            isAuthenticated: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Ensure isAuthenticated is set correctly after rehydration
        if (state?.token && state?.user) {
          state.isAuthenticated = true;
        }
      },
    }
  )
);

// Hook for easy access
export function useAuth() {
  return useAuthStore();
}

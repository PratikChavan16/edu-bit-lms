import axios, { AxiosInstance, AxiosError } from 'axios';

// Types
export type PortalType = 'super-admin' | 'college-admin' | 'faculty' | 'student' | 'parent';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  portal: PortalType;
  avatar?: string;
  college_id?: number;
  college_name?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  portal: PortalType;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_in: number; // seconds
}

export interface PasswordResetRequest {
  email: string;
  portal: PortalType;
}

export interface PasswordResetConfirm {
  token: string;
  new_password: string;
  confirm_password: string;
}

// Token storage
const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user';

export class TokenStorage {
  static getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  static setAccessToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
  }

  static getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  static setRefreshToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }

  static getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  static setUser(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  static clearAll(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}

// Create axios instance with base configuration
const createAuthAxios = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - Add token to all requests
  instance.interceptors.request.use(
    (config) => {
      const token = TokenStorage.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor - Handle token refresh
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as any;

      // If 401 and not already retried, try to refresh token
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = TokenStorage.getRefreshToken();
          if (!refreshToken) {
            throw new Error('No refresh token');
          }

          const { data } = await axios.post<AuthResponse>(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/auth/refresh`,
            { refresh_token: refreshToken }
          );

          // Update tokens
          TokenStorage.setAccessToken(data.access_token);
          TokenStorage.setRefreshToken(data.refresh_token);
          TokenStorage.setUser(data.user);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
          return instance(originalRequest);
        } catch (refreshError) {
          // Refresh failed, clear everything and redirect to login
          TokenStorage.clearAll();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

const authAxios = createAuthAxios();

// Auth API functions
export const authApi = {
  /**
   * Login user
   * @param credentials - Email, password, and portal type
   * @returns User data and tokens
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/auth/login`,
      credentials
    );

    // Store tokens and user
    TokenStorage.setAccessToken(response.data.access_token);
    TokenStorage.setRefreshToken(response.data.refresh_token);
    TokenStorage.setUser(response.data.user);

    return response.data;
  },

  /**
   * Logout current user
   */
  logout: async (): Promise<void> => {
    try {
      await authAxios.post('/auth/logout');
    } catch (error) {
      // Even if API call fails, clear local storage
      console.error('Logout error:', error);
    } finally {
      TokenStorage.clearAll();
    }
  },

  /**
   * Refresh access token
   * @param refreshToken - Refresh token
   * @returns New tokens and user data
   */
  refresh: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/auth/refresh`,
      { refresh_token: refreshToken }
    );

    // Update stored tokens
    TokenStorage.setAccessToken(response.data.access_token);
    TokenStorage.setRefreshToken(response.data.refresh_token);
    TokenStorage.setUser(response.data.user);

    return response.data;
  },

  /**
   * Get current user info
   * @returns Current user data
   */
  me: async (): Promise<User> => {
    const response = await authAxios.get<User>('/auth/me');
    TokenStorage.setUser(response.data);
    return response.data;
  },

  /**
   * Request password reset link
   * @param request - Email and portal type
   */
  requestPasswordReset: async (request: PasswordResetRequest): Promise<void> => {
    await axios.post('/auth/password/reset-link', request);
  },

  /**
   * Reset password with token
   * @param data - Reset token and new password
   */
  resetPassword: async (data: PasswordResetConfirm): Promise<void> => {
    await axios.post('/auth/password/reset', data);
  },

  /**
   * Change password for logged-in user
   * @param currentPassword - Current password
   * @param newPassword - New password
   */
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await authAxios.post('/auth/password/change', {
      current_password: currentPassword,
      new_password: newPassword,
    });
  },

  /**
   * Verify if current session is valid
   * @returns True if authenticated
   */
  verifySession: async (): Promise<boolean> => {
    try {
      await authAxios.get('/auth/verify');
      return true;
    } catch {
      return false;
    }
  },
};

export default authAxios;

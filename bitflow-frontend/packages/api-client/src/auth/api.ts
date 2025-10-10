/**
 * Authentication API Client
 * 
 * Handles all authentication-related API calls:
 * - Login
 * - Logout
 * - Token refresh
 * - Password reset
 * - Get current user
 */

import axios, { AxiosInstance } from 'axios';
import type {
  LoginCredentials,
  AuthResponse,
  RefreshTokenRequest,
  PasswordResetRequest,
  PasswordResetConfirm,
  ChangePasswordRequest,
  User,
} from './types';

// Base API URL from environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Create axios instance with default config
 */
const createApiClient = (): AxiosInstance => {
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    withCredentials: true, // Send cookies for refresh tokens
  });
};

const apiClient = createApiClient();

/**
 * Authentication API methods
 */
export const authApi = {
  /**
   * Login user
   * @param credentials - Email, password, and portal
   * @returns User data and tokens
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  /**
   * Logout user
   * Invalidates refresh token on server
   */
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  /**
   * Refresh access token
   * @param refreshToken - The refresh token
   * @returns New tokens
   */
  refresh: async (request: RefreshTokenRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/refresh', request);
    return response.data;
  },

  /**
   * Get current authenticated user
   * @returns User data
   */
  me: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  /**
   * Request password reset link
   * @param request - Email address
   */
  requestPasswordReset: async (request: PasswordResetRequest): Promise<void> => {
    await apiClient.post('/auth/password/reset-link', request);
  },

  /**
   * Reset password with token
   * @param request - Token and new password
   */
  resetPassword: async (request: PasswordResetConfirm): Promise<void> => {
    await apiClient.post('/auth/password/reset', request);
  },

  /**
   * Change password for authenticated user
   * @param request - Current password and new password
   */
  changePassword: async (request: ChangePasswordRequest): Promise<void> => {
    await apiClient.put('/auth/password/change', request);
  },
};

/**
 * Export the api client for use in interceptors
 */
export { apiClient };

/**
 * Axios Interceptors
 * 
 * Request interceptor: Adds auth token to all requests
 * Response interceptor: Handles token refresh on 401 errors
 */

import { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { apiClient } from './api';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

/**
 * Get access token from storage
 */
export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
};

/**
 * Set access token in storage
 */
export const setAccessToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('access_token', token);
};

/**
 * Remove access token from storage
 */
export const removeAccessToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('access_token');
};

/**
 * Get refresh token from storage
 */
export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refresh_token');
};

/**
 * Set refresh token in storage
 */
export const setRefreshToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('refresh_token', token);
};

/**
 * Remove refresh token from storage
 */
export const removeRefreshToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('refresh_token');
};

/**
 * Clear all auth tokens
 */
export const clearTokens = (): void => {
  removeAccessToken();
  removeRefreshToken();
};

/**
 * Request Interceptor
 * Adds Authorization header with access token to all requests
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles 401 errors by attempting to refresh the token
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If error is not 401 or is from refresh endpoint, reject immediately
    if (error.response?.status !== 401 || originalRequest.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    // If already retrying, queue the request
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // If already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => {
          return apiClient(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    isRefreshing = true;

    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      // No refresh token, clear everything and reject
      clearTokens();
      processQueue(new Error('No refresh token available'), null);
      isRefreshing = false;
      return Promise.reject(error);
    }

    try {
      // Attempt to refresh the token
      const response = await apiClient.post('/auth/refresh', {
        refresh_token: refreshToken,
      });

      const { access_token, refresh_token: newRefreshToken } = response.data.tokens;

      // Store new tokens
      setAccessToken(access_token);
      setRefreshToken(newRefreshToken);

      // Update the failed request with new token
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
      }

      // Process queued requests
      processQueue(null, access_token);

      isRefreshing = false;

      // Retry the original request
      return apiClient(originalRequest);
    } catch (refreshError) {
      // Refresh failed, clear tokens and redirect to login
      clearTokens();
      processQueue(refreshError as Error, null);
      isRefreshing = false;

      // Redirect to login (will be handled by app)
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }

      return Promise.reject(refreshError);
    }
  }
);

/**
 * Export configured api client
 */
export { apiClient };

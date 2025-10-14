/**
 * Standard API Response Types
 * 
 * These interfaces match the backend ApiResponse class format
 */

export interface ApiSuccessResponse<T = any> {
  data: T;
  message?: string;
  meta?: {
    current_page?: number;
    per_page?: number;
    total?: number;
    last_page?: number;
    [key: string]: any;
  };
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    errors?: Record<string, string[]>;
  };
}

/**
 * Type guard to check if response is an error
 */
export function isApiError(response: any): response is ApiErrorResponse {
  return response && typeof response === 'object' && 'error' in response;
}

/**
 * Type guard to check if response is a success
 */
export function isApiSuccess<T>(response: any): response is ApiSuccessResponse<T> {
  return response && typeof response === 'object' && 'data' in response;
}

/**
 * Extract data from API response, handling both new standardized format
 * and legacy formats for backwards compatibility
 */
export function extractApiData<T>(response: any): T {
  // New standardized format: { data: {...}, message?, meta? }
  if (isApiSuccess(response)) {
    return response.data as T;
  }
  
  // Legacy format with success wrapper: { success: true, data: {...} }
  if (response && typeof response === 'object' && 'success' in response && response.success) {
    return response.data as T;
  }
  
  // Direct data (old format without wrapper)
  return response as T;
}

/**
 * Extract error message from API error response
 */
export function extractApiError(error: any): string {
  // Standard error format
  if (isApiError(error)) {
    return error.error.message;
  }
  
  // Legacy error format
  if (error && typeof error === 'object') {
    if ('message' in error) return error.message;
    if ('error' in error && typeof error.error === 'string') return error.error;
  }
  
  // Fallback
  return 'An unexpected error occurred';
}

/**
 * Extract validation errors from API response
 */
export function extractValidationErrors(error: any): Record<string, string[]> | null {
  if (isApiError(error) && error.error.errors) {
    return error.error.errors;
  }
  
  // Legacy format
  if (error && typeof error === 'object' && 'errors' in error) {
    return error.errors as Record<string, string[]>;
  }
  
  return null;
}

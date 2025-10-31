/**
 * Centralized Error Handling Utilities
 * 
 * Provides standardized error handling, error messages, and toast notifications
 * for API calls and operations across the BitFlow Admin Portal.
 */

import { AxiosError } from 'axios'

// ============================================================================
// Error Message Catalog
// ============================================================================

export const ERROR_MESSAGES = {
  // Network Errors
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  TIMEOUT_ERROR: 'Request timeout. Please try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  
  // Authentication Errors
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  FORBIDDEN: 'Access denied. You do not have permission to access this resource.',
  
  // Validation Errors
  VALIDATION_FAILED: 'Please check the form and correct any errors.',
  REQUIRED_FIELDS: 'Please fill in all required fields.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PHONE: 'Please enter a valid phone number.',
  DUPLICATE_ENTRY: 'This entry already exists.',
  
  // CRUD Operation Errors
  CREATE_FAILED: 'Failed to create item. Please try again.',
  UPDATE_FAILED: 'Failed to update item. Please try again.',
  DELETE_FAILED: 'Failed to delete item. Please try again.',
  FETCH_FAILED: 'Failed to load data. Please try again.',
  
  // Specific Resource Errors
  USER_NOT_FOUND: 'User not found.',
  COLLEGE_NOT_FOUND: 'College not found.',
  DEPARTMENT_NOT_FOUND: 'Department not found.',
  FACULTY_NOT_FOUND: 'Faculty member not found.',
  STUDENT_NOT_FOUND: 'Student not found.',
  
  // File Upload Errors
  FILE_TOO_LARGE: 'File is too large. Maximum size is 5MB.',
  INVALID_FILE_TYPE: 'Invalid file type. Please upload a valid file.',
  UPLOAD_FAILED: 'File upload failed. Please try again.',
  
  // Generic Errors
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  OPERATION_FAILED: 'Operation failed. Please try again.',
} as const

// ============================================================================
// Success Message Catalog
// ============================================================================

export const SUCCESS_MESSAGES = {
  // CRUD Operations
  CREATED: 'Created successfully!',
  UPDATED: 'Updated successfully!',
  DELETED: 'Deleted successfully!',
  SAVED: 'Saved successfully!',
  
  // Specific Operations
  USER_CREATED: 'User created successfully!',
  USER_UPDATED: 'User updated successfully!',
  USER_DELETED: 'User deleted successfully!',
  
  COLLEGE_CREATED: 'College created successfully!',
  COLLEGE_UPDATED: 'College updated successfully!',
  COLLEGE_DELETED: 'College deleted successfully!',
  
  DEPARTMENT_CREATED: 'Department created successfully!',
  DEPARTMENT_UPDATED: 'Department updated successfully!',
  DEPARTMENT_DELETED: 'Department deleted successfully!',
  
  FACULTY_CREATED: 'Faculty member created successfully!',
  FACULTY_UPDATED: 'Faculty member updated successfully!',
  FACULTY_DELETED: 'Faculty member deleted successfully!',
  
  STUDENT_CREATED: 'Student created successfully!',
  STUDENT_UPDATED: 'Student updated successfully!',
  STUDENT_DELETED: 'Student deleted successfully!',
  
  ADMIN_STAFF_CREATED: 'Administrative staff created successfully!',
  ADMIN_STAFF_UPDATED: 'Administrative staff updated successfully!',
  ADMIN_STAFF_DELETED: 'Administrative staff deleted successfully!',
  
  NON_TEACHING_STAFF_CREATED: 'Non-teaching staff created successfully!',
  NON_TEACHING_STAFF_UPDATED: 'Non-teaching staff updated successfully!',
  NON_TEACHING_STAFF_DELETED: 'Non-teaching staff deleted successfully!',
  
  // Leadership
  LEADERSHIP_ASSIGNED: 'Leadership role assigned successfully!',
  LEADERSHIP_REMOVED: 'Leadership role removed successfully!',
  USER_CREATED_AND_ASSIGNED: 'User created and leadership role assigned successfully!',
  
  // Settings
  SETTINGS_SAVED: 'Settings saved successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!',
  EMAIL_SENT: 'Email sent successfully!',
  
  // File Operations
  FILE_UPLOADED: 'File uploaded successfully!',
  FILE_DELETED: 'File deleted successfully!',
} as const

// ============================================================================
// Error Extraction and Formatting
// ============================================================================

export interface ApiError {
  message: string
  code?: string
  field?: string
  details?: Record<string, any>
}

/**
 * Extract error message from various error formats
 */
export function extractErrorMessage(error: unknown): string {
  // Axios error
  if (error instanceof AxiosError) {
    // Laravel error format: { message: '...', errors: {...} }
    if (error.response?.data?.message) {
      return error.response.data.message
    }
    
    // Check for nested error.message
    if (error.response?.data?.error?.message) {
      return error.response.data.error.message
    }
    
    // Check for Laravel validation errors - show first field error
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors
      const firstField = Object.keys(errors)[0]
      if (firstField && Array.isArray(errors[firstField]) && errors[firstField].length > 0) {
        return `${firstField}: ${errors[firstField][0]}`
      }
    }
    
    // Check for alternative validation errors format
    if (error.response?.data?.error?.field_errors) {
      const fieldErrors = error.response.data.error.field_errors
      if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
        return fieldErrors[0].message
      }
    }
    
    // HTTP status code errors
    if (error.response?.status) {
      switch (error.response.status) {
        case 400:
          return ERROR_MESSAGES.VALIDATION_FAILED
        case 401:
          return ERROR_MESSAGES.UNAUTHORIZED
        case 403:
          return ERROR_MESSAGES.FORBIDDEN
        case 404:
          return 'Resource not found.'
        case 409:
          return ERROR_MESSAGES.DUPLICATE_ENTRY
        case 422:
          return ERROR_MESSAGES.VALIDATION_FAILED
        case 500:
          return ERROR_MESSAGES.SERVER_ERROR
        case 503:
          return 'Service temporarily unavailable. Please try again later.'
        default:
          return ERROR_MESSAGES.UNKNOWN_ERROR
      }
    }
    
    // Network errors
    if (error.code === 'ECONNABORTED') {
      return ERROR_MESSAGES.TIMEOUT_ERROR
    }
    
    if (error.code === 'ERR_NETWORK') {
      return ERROR_MESSAGES.NETWORK_ERROR
    }
  }
  
  // Standard Error object
  if (error instanceof Error) {
    return error.message || ERROR_MESSAGES.UNKNOWN_ERROR
  }
  
  // String error
  if (typeof error === 'string') {
    return error
  }
  
  // Unknown error type
  return ERROR_MESSAGES.UNKNOWN_ERROR
}

/**
 * Extract validation field errors
 */
export function extractFieldErrors(error: unknown): Record<string, string> | null {
  if (error instanceof AxiosError) {
    // Laravel validation errors format: { errors: { field: [messages] } }
    if (error.response?.data?.errors) {
      const laravelErrors = error.response.data.errors
      const errors: Record<string, string> = {}
      
      Object.keys(laravelErrors).forEach((field) => {
        const messages = laravelErrors[field]
        if (Array.isArray(messages) && messages.length > 0) {
          errors[field] = messages[0] // Take first error message
        } else if (typeof messages === 'string') {
          errors[field] = messages
        }
      })
      
      return Object.keys(errors).length > 0 ? errors : null
    }
    
    // Alternative format: { error: { field_errors: [...] } }
    const fieldErrors = error.response?.data?.error?.field_errors
    
    if (Array.isArray(fieldErrors)) {
      const errors: Record<string, string> = {}
      fieldErrors.forEach((fieldError: any) => {
        if (fieldError.field && fieldError.message) {
          errors[fieldError.field] = fieldError.message
        }
      })
      return Object.keys(errors).length > 0 ? errors : null
    }
  }
  
  return null
}

// ============================================================================
// Error Handler Wrapper
// ============================================================================

export interface ErrorHandlerOptions {
  showToast?: boolean
  customMessage?: string
  logError?: boolean
  onError?: (error: ApiError) => void
}

/**
 * Standardized error handler for API calls
 * 
 * Usage:
 * ```ts
 * import { handleError } from '@/lib/errorHandler'
 * 
 * try {
 *   await apiClient.post('/endpoint', data)
 * } catch (error) {
 *   handleError(error, toast, {
 *     customMessage: 'Failed to save data',
 *     onError: (err) => setFormErrors(err.details)
 *   })
 * }
 * ```
 */
export function handleError(
  error: unknown,
  toast: { error: (message: string) => void },
  options: ErrorHandlerOptions = {}
): ApiError {
  const {
    showToast = true,
    customMessage,
    logError = true,
    onError,
  } = options
  
  const message = customMessage || extractErrorMessage(error)
  const fieldErrors = extractFieldErrors(error)
  
  const apiError: ApiError = {
    message,
    code: error instanceof AxiosError ? error.response?.data?.error?.code : undefined,
    details: fieldErrors || undefined,
  }
  
  // Log error to console in development
  if (logError && process.env.NODE_ENV === 'development') {
    console.error('[Error Handler]', message)
    if (fieldErrors && Object.keys(fieldErrors).length > 0) {
      console.error('Field Errors:', fieldErrors)
    }
    if (error instanceof AxiosError) {
      console.error('API Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        method: error.config?.method,
      })
    } else {
      console.error('Original Error:', error)
    }
  }
  
  // Show toast notification
  if (showToast && toast) {
    toast.error(message)
  }
  
  // Call custom error handler
  if (onError) {
    onError(apiError)
  }
  
  return apiError
}

// ============================================================================
// Success Handler Wrapper
// ============================================================================

export interface SuccessHandlerOptions {
  showToast?: boolean
  duration?: number
  onSuccess?: () => void
}

/**
 * Standardized success handler
 * 
 * Usage:
 * ```ts
 * import { handleSuccess } from '@/lib/errorHandler'
 * 
 * const response = await apiClient.post('/endpoint', data)
 * handleSuccess(SUCCESS_MESSAGES.CREATED, toast, {
 *   onSuccess: () => refetch()
 * })
 * ```
 */
export function handleSuccess(
  message: string,
  toast: { success: (message: string, duration?: number) => void },
  options: SuccessHandlerOptions = {}
): void {
  const {
    showToast = true,
    duration,
    onSuccess,
  } = options
  
  // Show toast notification
  if (showToast && toast) {
    toast.success(message, duration)
  }
  
  // Call custom success handler
  if (onSuccess) {
    onSuccess()
  }
}

// ============================================================================
// API Call Wrapper with Error Handling
// ============================================================================

export interface ApiCallOptions<T> extends ErrorHandlerOptions, SuccessHandlerOptions {
  successMessage?: string
}

/**
 * Wrapper for API calls with built-in error/success handling
 * 
 * Usage:
 * ```ts
 * import { withErrorHandling } from '@/lib/errorHandler'
 * 
 * const result = await withErrorHandling(
 *   () => apiClient.post('/endpoint', data),
 *   toast,
 *   {
 *     successMessage: SUCCESS_MESSAGES.CREATED,
 *     customMessage: 'Failed to create item',
 *     onSuccess: () => refetch(),
 *     onError: (err) => setFormErrors(err.details)
 *   }
 * )
 * ```
 */
export async function withErrorHandling<T>(
  apiCall: () => Promise<T>,
  toast: {
    success: (message: string, duration?: number) => void
    error: (message: string) => void
  },
  options: ApiCallOptions<T> = {}
): Promise<T | null> {
  const {
    successMessage,
    showToast = true,
    customMessage,
    logError = true,
    duration,
    onSuccess,
    onError,
  } = options
  
  try {
    const result = await apiCall()
    
    // Handle success
    if (successMessage) {
      handleSuccess(successMessage, toast, {
        showToast,
        duration,
        onSuccess,
      })
    } else if (onSuccess) {
      onSuccess()
    }
    
    return result
  } catch (error) {
    // Handle error
    handleError(error, toast, {
      showToast,
      customMessage,
      logError,
      onError,
    })
    
    return null
  }
}

// ============================================================================
// Confirmation Dialog Helper
// ============================================================================

export interface ConfirmOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
}

/**
 * Show confirmation dialog before destructive actions
 * 
 * Usage:
 * ```ts
 * const confirmed = await confirmAction({
 *   message: 'Are you sure you want to delete this item?',
 *   danger: true
 * })
 * 
 * if (confirmed) {
 *   // Perform action
 * }
 * ```
 */
export async function confirmAction(options: ConfirmOptions): Promise<boolean> {
  const {
    title = 'Confirm Action',
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
  } = options
  
  // Using native confirm for now
  // TODO: Replace with custom modal dialog
  return window.confirm(`${title}\n\n${message}`)
}

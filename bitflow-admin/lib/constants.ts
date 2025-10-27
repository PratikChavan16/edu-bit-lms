// API Configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'

// Authentication
export const AUTH_TOKEN_KEY = 'bitflow_auth_token'
export const REFRESH_TOKEN_KEY = 'bitflow_refresh_token'
export const USER_DATA_KEY = 'bitflow_user_data'

// App Configuration
export const APP_NAME = 'Bitflow LMS'
export const APP_DESCRIPTION = 'Campus Operating System'

// Pagination
export const DEFAULT_PAGE_SIZE = 15
export const PAGE_SIZE_OPTIONS = [10, 15, 25, 50, 100]

// Date Formats
export const DATE_FORMAT = 'MMM DD, YYYY'
export const DATETIME_FORMAT = 'MMM DD, YYYY HH:mm'

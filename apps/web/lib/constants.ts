export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3000";

// API Routes
export const API_ROUTES = {
  // Auth
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  REFRESH: "/auth/refresh",
  ME: "/auth/me",

  // Dashboard
  DASHBOARD: "/dashboard",

  // Universities
  UNIVERSITIES: "/universities",
  UNIVERSITY: (id: string) => `/universities/${id}`,

  // Colleges
  COLLEGES: "/colleges",
  COLLEGE: (id: string) => `/colleges/${id}`,
  UNIVERSITY_COLLEGES: (universityId: string) => `/universities/${universityId}/colleges`,

  // Users
  USERS: "/users",
  USER: (id: string) => `/users/${id}`,

  // Tickets
  TICKETS: "/tickets",
  TICKET: (id: string) => `/tickets/${id}`,

  // Billing
  BILLING_FEE_STRUCTURES: "/billing/fee-structures",
  BILLING_FEE_PAYMENTS: "/billing/fee-payments",

  // Chat
  CHAT_CONVERSATIONS: "/chat/conversations",
  CHAT_CONVERSATION: (id: string) => `/chat/conversations/${id}`,
  CHAT_MESSAGES: (conversationId: string) => `/chat/conversations/${conversationId}/messages`,

  // Settings
  SETTINGS: "/settings",
  SETTING: (id: string) => `/settings/${id}`,

  // Upload
  UPLOAD: "/upload",
  FILE: (id: string) => `/upload/${id}`,
  FILE_DOWNLOAD: (id: string) => `/upload/${id}/download`,

  // Audit
  AUDIT_LOGS: "/audit",
} as const;

// App Routes
export const APP_ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/",
  UNIVERSITIES: "/universities",
  UNIVERSITY: (id: string) => `/universities/${id}`,
  COLLEGES: "/colleges",
  COLLEGE: (uid: string, cid: string) => `/universities/${uid}/colleges/${cid}`,
  USERS: "/users",
  SUPPORT: "/support",
  BILLING: "/billing",
  ANALYTICS: "/analytics",
  SYSTEM_LOGS: "/system-logs",
  AUDIT_LOGS: "/audit-logs",
  SETTINGS: "/settings",
  CHAT: "/chat",
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "bitflow_access_token",
  REFRESH_TOKEN: "bitflow_refresh_token",
  USER: "bitflow_user",
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

// Date Formats
export const DATE_FORMATS = {
  SHORT: "MMM dd, yyyy",
  LONG: "MMMM dd, yyyy",
  WITH_TIME: "MMM dd, yyyy HH:mm",
} as const;

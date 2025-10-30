// User & Authentication Types
export interface User {
  id: string;
  universityId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  photoUrl: string | null;
  status: "active" | "inactive" | "suspended" | "deleted";
  emailVerifiedAt: string | null;
  lastLoginAt: string | null;
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  roles?: Role[];
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface AuthenticatedUser {
  id: string;
  universityId: string;
  isGodMode: boolean;
  roles: string[];
}

// Role & Permission Types
export interface Role {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
  permissions?: Permission[];
}

export interface Permission {
  id: string;
  resource: string;
  action: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

// University Types
export interface University {
  id: string;
  name: string;
  slug: string;
  domain: string;
  email: string;
  phone: string | null;
  address: string | null;
  logoUrl: string | null;
  status: "active" | "inactive" | "suspended";
  subscriptionTier: string | null;
  storageQuotaGB: number;
  storageUsedGB: number;
  timezone: string;
  locale: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    colleges: number;
    users: number;
  };
}

// College Types
export interface College {
  id: string;
  universityId: string;
  name: string;
  code: string;
  type: string;
  email: string;
  phone: string | null;
  address: string | null;
  accreditation: string | null;
  establishedYear: number | null;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
  university?: University;
  _count?: {
    departments: number;
    students: number;
    faculty: number;
  };
}

// Department Types
export interface Department {
  id: string;
  collegeId: string;
  name: string;
  code: string;
  description: string | null;
  hodId: string | null;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
  college?: College;
  hod?: User;
  _count?: {
    faculty: number;
    students: number;
    courses: number;
  };
}

// Billing Types
export interface FeeStructure {
  id: string;
  collegeId: string;
  academicYearId: string;
  course: string;
  year: number;
  amount: number;
  installments: number;
  lateFeePerDay: number;
  components: Record<string, number> | null;
  dueDates: string[] | null;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface FeePayment {
  id: string;
  universityId: string;
  studentId: string;
  feeStructureId: string;
  amountPaid: number;
  receiptNumber: string;
  installmentNumber: number | null;
  lateFee: number | null;
  remarks: string | null;
  paymentDate: string;
  createdAt: string;
  updatedAt: string;
}

// Ticket Types
export interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "critical";
  category: string;
  createdById: string;
  assignedToId: string | null;
  resolvedById: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy?: User;
  assignedTo?: User;
  resolvedBy?: User;
}

// Chat Types
export interface Conversation {
  id: string;
  universityId: string;
  name: string | null;
  type: "direct" | "group" | "support";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  participants?: ConversationParticipant[];
  messages?: Message[];
  _count?: {
    messages: number;
    participants: number;
  };
}

export interface ConversationParticipant {
  id: string;
  conversationId: string;
  userId: string;
  role: string;
  joinedAt: string;
  user?: User;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  fileId: string | null;
  createdAt: string;
  updatedAt: string;
  sender?: User;
  file?: File;
  reads?: MessageRead[];
}

export interface MessageRead {
  id: string;
  messageId: string;
  userId: string;
  readAt: string;
  user?: User;
}

// File Types
export interface File {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  category: string | null;
  uploadedById: string;
  universityId: string | null;
  createdAt: string;
  updatedAt: string;
  uploadedBy?: User;
}

// Setting Types
export interface Setting {
  id: string;
  universityId: string | null;
  key: string;
  value: string;
  dataType: string;
  category: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

// Audit Log Types
export interface AuditLog {
  id: string;
  userId: string | null;
  action: string;
  resource: string;
  resourceId: string | null;
  oldValues: Record<string, any> | null;
  newValues: Record<string, any> | null;
  ipAddress: string | null;
  userAgent: string | null;
  universityId: string | null;
  godModeContext: boolean;
  createdAt: string;
  user?: User;
}

// Dashboard Types
export interface DashboardStats {
  totalUniversities: number;
  totalColleges: number;
  totalUsers: number;
  totalRevenue: number;
  activeUsers: number;
  apiRequests: number;
}

export interface SystemHealth {
  apiLatency: number;
  dbConnections: number;
  cacheHitRate: number;
  uptime: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
  };
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

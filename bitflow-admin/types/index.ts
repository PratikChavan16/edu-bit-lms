export interface User {
  id: string
  email: string
  username?: string
  full_name: string
  university_id: string
  roles: string[]
  permissions: string[]
  status?: string
}

// Helper to get primary role (highest level role)
// Overload: accepts User object
export function getPrimaryRole(user: User): string
// Overload: accepts array of role strings
export function getPrimaryRole(roles: string[]): string | undefined
export function getPrimaryRole(userOrRoles: User | string[]): string | undefined {
  // Handle array of roles
  if (Array.isArray(userOrRoles)) {
    const roles = userOrRoles
    if (roles.length === 0) return undefined
    
    const roleHierarchy: Record<string, number> = {
      bitflow_admin: 100,
      bitflow_owner: 100,
      university_owner: 90,
      super_admin: 80,
      principal: 70,
      vice_principal: 65,
      college_admin: 60,
      hod: 58,
      super_academics: 55,
      admission_admin: 50,
      super_accountant: 45,
      college_accounts_admin: 40,
      college_fee_admin: 35,
      super_non_teaching_manager: 30,
      faculty: 20,
      teacher: 20,
      student: 10,
      parent: 5,
    }
    
    // Return highest level role
    return roles.reduce((highest, role) => {
      const currentLevel = roleHierarchy[role] || 0
      const highestLevel = roleHierarchy[highest] || 0
      return currentLevel > highestLevel ? role : highest
    }, roles[0])
  }
  
  // Handle User object
  const user = userOrRoles
  if (!user.roles || user.roles.length === 0) return 'unknown'
  
  const roleHierarchy: Record<string, number> = {
    bitflow_admin: 100,
    bitflow_owner: 100,
    university_owner: 90,
    super_admin: 80,
    principal: 70,
    vice_principal: 65,
    college_admin: 60,
    hod: 58,
    super_academics: 55,
    admission_admin: 50,
    super_accountant: 45,
    college_accounts_admin: 40,
    college_fee_admin: 35,
    super_non_teaching_manager: 30,
    faculty: 20,
    teacher: 20,
    student: 10,
    parent: 5,
  }
  
  // Return highest level role
  return user.roles.reduce((highest, role) => {
    const currentLevel = roleHierarchy[role] || 0
    const highestLevel = roleHierarchy[highest] || 0
    return currentLevel > highestLevel ? role : highest
  }, user.roles[0])
}

export interface LoginResponse {
  success: boolean
  message: string
  data: {
    access_token: string
    refresh_token: string
    token_type: string
    expires_in: number
    user: User
  }
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T
  meta?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
  errors?: Record<string, string[]>
}

export interface University {
  id: string
  name: string
  slug: string
  domain: string
  email: string
  primary_email?: string
  phone?: string
  primary_phone?: string
  address?: string
  established_year?: number
  timezone?: string
  status: 'active' | 'inactive' | 'suspended'
  storage_quota_gb: number
  storage_used_mb: number
  last_activity_at?: string
  branding?: any
  settings?: any
  created_at: string
  updated_at: string
  deleted_at?: string | null
  stats?: {
    total_colleges: number
    total_users: number
    storage_usage_percentage: number
  }
}

export interface College {
  id: string
  university_id: string
  name: string
  code: string
  type?: string
  email: string
  phone?: string
  address?: string
  established_year?: number
  status: 'active' | 'inactive' | 'suspended'
  capacity?: number
  current_enrollment?: number
  accreditation?: any
  created_at: string
  updated_at: string
  university?: University
  stats?: {
    total_departments: number
    total_students: number
    enrollment_percentage: number
    available_seats: number
  }
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

// Global User Management (Platform Level)
export interface GlobalUser {
  id: string
  name: string
  email: string
  role: string
  university?: {
    id: string
    name: string
  }
  status: 'active' | 'inactive' | 'locked' | 'suspended'
  last_login?: string
  created_at: string
  updated_at?: string
}

export interface CreatePlatformUserRequest {
  name: string
  email: string
  role: 'bitflow_owner' | 'university_owner'
  password?: string
}

export interface UpdateUserStatusRequest {
  status: 'active' | 'inactive' | 'locked' | 'suspended'
}

// Billing & Subscriptions
export interface DataPoint {
  date: string
  value: number
}

export interface RevenueMetrics {
  mrr: number
  arr: number
  churnRate: number
  mrrTrend: DataPoint[]
}

export interface SubscriptionStatus {
  active: number
  pastDue: number
  canceled: number
  trial: number
}

export interface Subscription {
  id: string
  university: {
    id: string
    name: string
  }
  plan: string
  status: 'active' | 'past_due' | 'canceled' | 'trial'
  mrr: number
  nextBillingDate: string
  created_at: string
}

export interface Invoice {
  id: string
  university: {
    id: string
    name: string
  }
  amount: number
  status: 'paid' | 'pending' | 'failed'
  dueDate: string
  paidAt?: string
  created_at: string
}

export interface BillingData {
  revenue: RevenueMetrics
  subscriptionStatus: SubscriptionStatus
  subscriptions: Subscription[]
  recentInvoices: Invoice[]
}

// University Details
export interface UniversityOwner {
  name: string
  email: string
  phone: string
}

export interface UniversityUsage {
  totalUsers: number
  activeToday: number
  storageUsedGB: number
  storageQuotaGB: number
  apiCalls24h: number
  collegesCount: number
  programsCount: number
  studentsCount: number
  facultyCount: number
  userGrowth: DataPoint[]
  storageBreakdown: { module: string; size: number }[]
}

export interface UniversitySubscription {
  plan: string
  status: string
  nextBillingDate: string
  paymentMethod: string
  mrr: number
  totalPaid: number
  recentInvoices: Invoice[]
}

export interface UniversityConfiguration {
  storageQuotaGB: number
  apiRateLimit: number
  customDomainEnabled: boolean
  ssoEnabled: boolean
  backupFrequency: string
}

export interface UniversitySecurity {
  twoFactorRequired: boolean
  ipWhitelist: string[]
  lastSecurityAudit: string
  nextSecurityAudit: string
  failedLoginAttempts24h: number
}

export interface UniversityActivity {
  id: string
  description: string
  timestamp: string
  user: string
}

export interface UniversityDetails extends University {
  owner: UniversityOwner
  usage: UniversityUsage
  subscription: UniversitySubscription
  configuration: UniversityConfiguration
  security: UniversitySecurity
  recentActivities: UniversityActivity[]
}

// Student Types
export interface Student {
  id: string
  enrollment_number: string
  name: string
  email: string
  phone?: string
  photo_url?: string
  department_id: string
  department_name: string
  year: number
  status: 'active' | 'suspended' | 'graduated' | 'dropped'
  gpa?: number
  attendance_percentage?: number
  date_of_birth?: string
  gender?: 'male' | 'female' | 'other'
  blood_group?: string
  address?: string
  created_at?: string
  updated_at?: string
}

export interface StudentProfile extends Student {
  personal_info: {
    date_of_birth: string
    gender: string
    blood_group?: string
    address: string
  }
  academic_info: {
    admission_date: string
    current_semester: number
    program: string
    enrolled_courses: Course[]
  }
  fees_info: {
    total_fees: number
    paid_amount: number
    pending_amount: number
    last_payment_date?: string
  }
}

// Department Types
export interface Department {
  id: string
  name: string
  code: string
  college_id: string
  hod_id?: string
  hod_name?: string
  status: 'active' | 'inactive'
  students_count: number
  faculty_count: number
  courses_count: number
  created_at: string
  updated_at?: string
}

// Faculty Types
export interface Faculty {
  id: string
  employee_id: string
  name: string
  email: string
  photo_url?: string
  department_id: string
  department_name: string
  designation: 'Professor' | 'Associate Professor' | 'Assistant Professor' | 'Lecturer'
  specialization?: string
  experience_years: number
  courses_assigned: number
  status: 'active' | 'on_leave' | 'inactive'
}

export interface FacultyProfile extends Faculty {
  qualifications: string[]
  publications: any[]
  courses: Course[]
}

// Course Types
export interface Course {
  id: string
  code: string
  name: string
  department_id: string
  department_name: string
  credits: number
  semester: number
  faculty_id?: string
  faculty_name?: string
}

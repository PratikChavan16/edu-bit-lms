/**
 * Shared TypeScript Types & Interfaces
 * Version: 1.0.0
 * Last Updated: 2025-01-XX
 * 
 * PURPOSE: Single source of truth for TypeScript types used across ALL portals
 * USAGE: Import these types in both backend and frontend code
 * 
 * CRITICAL: Do NOT modify without team agreement!
 */

// =============================================================================
// CORE ENTITIES
// =============================================================================

/**
 * Base entity interface - all entities extend this
 */
export interface BaseEntity {
  id: string;
  created_at: Date;
  updated_at: Date;
  created_by?: string;
  updated_by?: string;
}

/**
 * User entity (applies to all user types across all portals)
 */
export interface User extends BaseEntity {
  email: string;
  password_hash?: string; // Only present in backend
  full_name: string;
  role: UserRole;
  tenant_id?: string | null; // Null for Bitflow Admin
  is_active: boolean;
  last_login?: Date;
  profile_image_url?: string;
  phone?: string;
  god_mode_enabled: boolean; // True for Bitflow Admin and University Owner
}

/**
 * University entity
 */
export interface University extends BaseEntity {
  name: string;
  tenant_id: string;
  owner_id: string; // References User.id (University Owner)
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  website?: string;
  logo_url?: string;
  is_active: boolean;
  subscription_status: SubscriptionStatus;
  subscription_plan: SubscriptionPlan;
}

/**
 * College entity
 */
export interface College extends BaseEntity {
  name: string;
  university_id: string;
  tenant_id: string;
  principal_id?: string; // References User.id (Principal)
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  logo_url?: string;
  is_active: boolean;
}

/**
 * Department entity
 */
export interface Department extends BaseEntity {
  name: string;
  code: string;
  college_id: string;
  tenant_id: string;
  hod_id?: string; // References User.id (HOD - could be Super Admin or Faculty)
  description?: string;
  is_active: boolean;
}

/**
 * Course entity
 */
export interface Course extends BaseEntity {
  name: string;
  code: string;
  department_id: string;
  tenant_id: string;
  credits: number;
  description?: string;
  is_active: boolean;
}

/**
 * Student entity
 */
export interface Student extends BaseEntity {
  user_id: string; // References User.id
  student_id: string; // Enrollment number
  department_id: string;
  tenant_id: string;
  year: number;
  semester: number;
  batch: string;
  date_of_birth?: Date;
  gender?: Gender;
  blood_group?: string;
  emergency_contact?: string;
  is_active: boolean;
}

/**
 * Faculty/Teacher entity
 */
export interface Faculty extends BaseEntity {
  user_id: string; // References User.id
  employee_id: string;
  department_id: string;
  tenant_id: string;
  designation: string;
  qualification?: string;
  specialization?: string;
  date_of_joining?: Date;
  is_active: boolean;
}

// =============================================================================
// GOD MODE & HIERARCHICAL NAVIGATION
// =============================================================================

/**
 * God Mode context - passed with every API request when in God Mode
 */
export interface GodModeContext {
  is_god_mode: boolean;
  original_tenant_id?: string | null; // User's home tenant (null for Bitflow Admin)
  viewing_tenant_id: string; // Current tenant being viewed
  hierarchy_level: HierarchyLevel;
  access_level: AccessLevel;
}

/**
 * Hierarchical navigation node (used in sidebar navigation)
 */
export interface NavigationNode {
  id: string;
  label: string;
  type: 'university' | 'college' | 'department';
  tenant_id: string;
  parent_id?: string;
  children?: NavigationNode[];
  stats?: {
    total_students?: number;
    total_faculty?: number;
    total_courses?: number;
  };
  access_level: AccessLevel;
}

/**
 * University hierarchy response (for Bitflow Admin)
 */
export interface UniversityHierarchy {
  universities: Array<{
    id: string;
    name: string;
    tenant_id: string;
    colleges: Array<{
      id: string;
      name: string;
      departments: Array<{
        id: string;
        name: string;
      }>;
    }>;
  }>;
}

// =============================================================================
// AUTHENTICATION & AUTHORIZATION
// =============================================================================

/**
 * JWT payload structure
 */
export interface JWTPayload {
  user_id: string;
  email: string;
  role: UserRole;
  tenant_id?: string | null;
  god_mode_enabled: boolean;
  permissions: string[];
  iat: number; // Issued at
  exp: number; // Expires at
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Login response data
 */
export interface LoginResponse {
  user: User;
  tokens: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };
}

/**
 * Permission structure
 */
export interface Permission {
  id: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'execute';
  scope: 'own' | 'department' | 'college' | 'university' | 'platform';
}

// =============================================================================
// API STANDARD STRUCTURES
// =============================================================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  metadata: ApiMetadata;
}

/**
 * API error structure
 */
export interface ApiError {
  code: string;
  message: string;
  details?: any;
  field_errors?: Array<{
    field: string;
    message: string;
  }>;
}

/**
 * API metadata
 */
export interface ApiMetadata {
  timestamp: string;
  request_id: string;
  portal: PortalType;
  god_mode_context?: GodModeContext;
}

/**
 * Pagination metadata
 */
export interface PaginationMetadata {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

/**
 * Paginated list response
 */
export interface PaginatedResponse<T = any> {
  items: T[];
  pagination: PaginationMetadata;
}

// =============================================================================
// ENUMS (synchronized with shared_enums.yaml)
// =============================================================================

export enum UserRole {
  BITFLOW_ADMIN = 'bitflow_admin',
  UNIVERSITY_OWNER = 'university_owner',
  SUPER_ADMIN = 'super_admin',
  PRINCIPAL = 'principal',
  COLLEGE_ADMIN = 'college_admin',
  SUPER_ACADEMICS = 'super_academics',
  FACULTY_TEACHER = 'faculty_teacher',
  STUDENT = 'student',
  PARENT = 'parent',
  ADMISSION_ADMIN = 'admission_admin',
  SUPER_ACCOUNTANT = 'super_accountant',
  COLLEGE_ACCOUNTS_ADMIN = 'college_accounts_admin',
  COLLEGE_FEE_ADMIN = 'college_fee_admin',
  SUPER_NON_TEACHING_MANAGER = 'super_non_teaching_manager',
}

export enum PortalType {
  BITFLOW_ADMIN = 'bitflow-admin',
  UNIVERSITY_OWNER = 'university-owner',
  SUPER_ADMIN = 'super-admin',
  PRINCIPAL = 'principal',
  COLLEGE_ADMIN = 'college-admin',
  SUPER_ACADEMICS = 'super-academics',
  FACULTY_TEACHER = 'faculty-teacher',
  STUDENT = 'student',
  PARENT = 'parent',
  ADMISSION_ADMIN = 'admission-admin',
  SUPER_ACCOUNTANT = 'super-accountant',
  COLLEGE_ACCOUNTS_ADMIN = 'college-accounts-admin',
  COLLEGE_FEE_ADMIN = 'college-fee-admin',
  SUPER_NON_TEACHING_MANAGER = 'super-non-teaching-manager',
}

export enum HierarchyLevel {
  PLATFORM = 'platform',
  UNIVERSITY = 'university',
  COLLEGE = 'college',
  DEPARTMENT = 'department',
}

export enum AccessLevel {
  FULL = 'full',
  READ_ONLY = 'read_only',
  RESTRICTED = 'restricted',
}

export enum SubscriptionStatus {
  TRIAL = 'trial',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  CANCELLED = 'cancelled',
}

export enum SubscriptionPlan {
  BASIC = 'basic',
  STANDARD = 'standard',
  PREMIUM = 'premium',
  ENTERPRISE = 'enterprise',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

// =============================================================================
// INTEGRATION EVENTS (for cross-portal communication)
// =============================================================================

/**
 * Base event structure
 */
export interface IntegrationEvent {
  event_id: string;
  event_type: string;
  source_portal: PortalType;
  timestamp: Date;
  payload: any;
  metadata?: {
    user_id?: string;
    tenant_id?: string;
    god_mode_context?: GodModeContext;
  };
}

/**
 * University created event (emitted by Bitflow Admin)
 */
export interface UniversityCreatedEvent extends IntegrationEvent {
  event_type: 'university.created';
  payload: {
    university_id: string;
    tenant_id: string;
    owner_id: string;
  };
}

/**
 * User role changed event
 */
export interface UserRoleChangedEvent extends IntegrationEvent {
  event_type: 'user.role_changed';
  payload: {
    user_id: string;
    old_role: UserRole;
    new_role: UserRole;
    tenant_id: string;
  };
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

/**
 * Make all properties optional (for partial updates)
 */
export type PartialEntity<T> = Partial<T>;

/**
 * Exclude sensitive fields (for public API responses)
 */
export type PublicUser = Omit<User, 'password_hash'>;

/**
 * Entity with relations loaded
 */
export type UserWithRelations = User & {
  university?: University;
  college?: College;
  department?: Department;
};

// =============================================================================
// NOTES FOR DEVELOPERS
// =============================================================================

/**
 * IMPORT GUIDELINES:
 * 
 * Backend (NestJS):
 * import { User, ApiResponse } from '@brain/shared_contracts/shared_types';
 * 
 * Frontend (React):
 * import type { User, ApiResponse } from '@/types/shared';
 * 
 * MODIFICATION RULES:
 * 1. Never remove existing properties (breaking change!)
 * 2. Add new optional properties with `?`
 * 3. Update version number in file header
 * 4. Notify team in daily standup
 * 5. Update corresponding YAML files if needed
 */

/**
 * VERSION HISTORY:
 * 1.0.0 - Initial version with God Mode support
 */

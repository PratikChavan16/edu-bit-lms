/**
 * Authentication Types
 * 
 * Type definitions for authentication-related data structures
 */

export type UserRole = 'super_admin' | 'college_admin' | 'faculty' | 'student' | 'parent';

export type Portal = 'super-admin' | 'college-admin' | 'faculty' | 'student' | 'parent';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  tenant_id?: number;
  college_id?: number;
  avatar?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  portal: Portal;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number; // seconds
  token_type: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  password: string;
  password_confirmation: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

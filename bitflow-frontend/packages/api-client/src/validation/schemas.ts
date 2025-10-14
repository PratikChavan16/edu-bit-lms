import { z } from 'zod';

/**
 * University Validation Schemas
 */

// Hex color validation
const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

// Branding schema for university
const brandingSchema = z.object({
  primary_color: z.string().regex(hexColorRegex, 'Must be a valid hex color (e.g., #FF5733)').optional(),
  secondary_color: z.string().regex(hexColorRegex, 'Must be a valid hex color (e.g., #3498DB)').optional(),
  logo_url: z.string().url('Must be a valid URL').optional(),
  favicon_url: z.string().url('Must be a valid URL').optional(),
}).optional();

// Create University Schema
export const createUniversitySchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(255, 'Name must not exceed 255 characters'),
  
  slug: z.string()
    .min(2, 'Slug must be at least 2 characters')
    .max(50, 'Slug must not exceed 50 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
    .optional(),
  
  domain: z.string()
    .regex(/^[a-z0-9-]+\.[a-z0-9-]+$/, 'Domain must be in format: subdomain.domain (e.g., myuni.edu)')
    .optional(),
  
  status: z.enum(['live', 'setup', 'suspended', 'archived'], {
    errorMap: () => ({ message: 'Status must be one of: live, setup, suspended, archived' }),
  }).default('setup'),
  
  timezone: z.string()
    .min(1, 'Timezone is required')
    .default('Asia/Kolkata'),
  
  storage_limit_gb: z.number()
    .int('Storage limit must be a whole number')
    .min(1, 'Storage limit must be at least 1 GB')
    .max(10000, 'Storage limit cannot exceed 10,000 GB')
    .default(100),
  
  branding: brandingSchema,
});

// Update University Schema (all fields optional)
export const updateUniversitySchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(255, 'Name must not exceed 255 characters')
    .optional(),
  
  slug: z.string()
    .min(2, 'Slug must be at least 2 characters')
    .max(50, 'Slug must not exceed 50 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
    .optional(),
  
  domain: z.string()
    .regex(/^[a-z0-9-]+\.[a-z0-9-]+$/, 'Domain must be in format: subdomain.domain')
    .optional(),
  
  status: z.enum(['live', 'setup', 'suspended', 'archived']).optional(),
  
  timezone: z.string().min(1).optional(),
  
  storage_limit_gb: z.number()
    .int()
    .min(1)
    .max(10000)
    .optional(),
  
  branding: brandingSchema,
});

/**
 * College Validation Schemas
 */

export const createCollegeSchema = z.object({
  university_id: z.string().uuid('Invalid university ID'),
  
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(255, 'Name must not exceed 255 characters'),
  
  code: z.string()
    .min(2, 'Code must be at least 2 characters')
    .max(20, 'Code must not exceed 20 characters')
    .regex(/^[A-Z0-9_]+$/, 'Code must contain only uppercase letters, numbers, and underscores'),
  
  status: z.enum(['active', 'inactive', 'pending'], {
    errorMap: () => ({ message: 'Status must be one of: active, inactive, pending' }),
  }).default('pending'),
  
  address: z.string().max(500, 'Address must not exceed 500 characters').optional(),
  
  city: z.string().max(100, 'City must not exceed 100 characters').optional(),
  
  state: z.string().max(100, 'State must not exceed 100 characters').optional(),
  
  postal_code: z.string()
    .regex(/^\d{6}$/, 'Postal code must be 6 digits')
    .optional(),
  
  phone: z.string()
    .regex(/^[0-9+\-\s()]+$/, 'Invalid phone number format')
    .optional(),
  
  email: z.string()
    .email('Invalid email address')
    .optional(),
  
  website: z.string()
    .url('Must be a valid URL')
    .optional(),
});

export const updateCollegeSchema = createCollegeSchema.partial().omit({ university_id: true });

/**
 * User Validation Schemas
 */

export const createUserSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must not exceed 50 characters')
    .regex(/^[a-z0-9_]+$/, 'Username must contain only lowercase letters, numbers, and underscores'),
  
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email must not exceed 255 characters'),
  
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  
  password_confirmation: z.string(),
  
  first_name: z.string()
    .min(1, 'First name is required')
    .max(100, 'First name must not exceed 100 characters'),
  
  last_name: z.string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must not exceed 100 characters'),
  
  phone: z.string()
    .regex(/^[0-9+\-\s()]+$/, 'Invalid phone number format')
    .optional(),
  
  role_id: z.string().uuid('Invalid role ID'),
  
  university_id: z.string().uuid('Invalid university ID').optional(),
  
  college_id: z.string().uuid('Invalid college ID').optional(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

export const updateUserSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email must not exceed 255 characters')
    .optional(),
  
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
    .optional(),
  
  password_confirmation: z.string().optional(),
  
  first_name: z.string()
    .min(1, 'First name is required')
    .max(100, 'First name must not exceed 100 characters')
    .optional(),
  
  last_name: z.string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must not exceed 100 characters')
    .optional(),
  
  phone: z.string()
    .regex(/^[0-9+\-\s()]+$/, 'Invalid phone number format')
    .optional(),
}).refine((data) => {
  if (data.password && !data.password_confirmation) {
    return false;
  }
  if (data.password && data.password_confirmation) {
    return data.password === data.password_confirmation;
  }
  return true;
}, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

/**
 * Login Schema
 */
export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Department Schema
 */
export const createDepartmentSchema = z.object({
  college_id: z.string().uuid('Invalid college ID'),
  
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(255, 'Name must not exceed 255 characters'),
  
  code: z.string()
    .min(2, 'Code must be at least 2 characters')
    .max(20, 'Code must not exceed 20 characters')
    .regex(/^[A-Z0-9_]+$/, 'Code must contain only uppercase letters, numbers, and underscores'),
  
  head_of_department_id: z.string().uuid('Invalid HOD user ID').optional(),
  
  description: z.string().max(1000, 'Description must not exceed 1000 characters').optional(),
});

export const updateDepartmentSchema = createDepartmentSchema.partial().omit({ college_id: true });

// Type exports for TypeScript
export type CreateUniversityInput = z.infer<typeof createUniversitySchema>;
export type UpdateUniversityInput = z.infer<typeof updateUniversitySchema>;
export type CreateCollegeInput = z.infer<typeof createCollegeSchema>;
export type UpdateCollegeInput = z.infer<typeof updateCollegeSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;

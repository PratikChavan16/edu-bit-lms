/**
 * Frontend validation utilities matching backend Form Request rules
 */

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

/**
 * Validate department form data
 */
export function validateDepartment(data: {
  name?: string
  code?: string
  email?: string
  phone?: string
}): ValidationResult {
  const errors: ValidationError[] = []

  // Name validation (required, min:3)
  if (!data.name || data.name.trim() === '') {
    errors.push({ field: 'name', message: 'Department name is required' })
  } else if (data.name.length < 3) {
    errors.push({ field: 'name', message: 'Department name must be at least 3 characters' })
  }

  // Code validation (required, min:2)
  if (!data.code || data.code.trim() === '') {
    errors.push({ field: 'code', message: 'Department code is required' })
  } else if (data.code.length < 2) {
    errors.push({ field: 'code', message: 'Department code must be at least 2 characters' })
  }

  // Email validation (optional but must be valid)
  if (data.email && data.email.trim() !== '') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      errors.push({ field: 'email', message: 'Please enter a valid email address' })
    }
  }

  // Phone validation (optional but must be valid)
  if (data.phone && data.phone.trim() !== '') {
    const phoneRegex = /^\+?[\d\s-()]+$/
    if (!phoneRegex.test(data.phone) || data.phone.length < 10) {
      errors.push({ field: 'phone', message: 'Please enter a valid phone number' })
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validate student enrollment form data
 */
export function validateStudentEnrollment(data: {
  user_id?: string
  admission_number?: string
  admission_date?: string
  course?: string
  year?: number
  email?: string
  phone?: string
  guardian_email?: string
}): ValidationResult {
  const errors: ValidationError[] = []

  // User ID validation
  if (!data.user_id) {
    errors.push({ field: 'user_id', message: 'User is required' })
  }

  // Admission number validation (required)
  if (!data.admission_number || data.admission_number.trim() === '') {
    errors.push({ field: 'admission_number', message: 'Admission number is required' })
  }

  // Admission date validation (required)
  if (!data.admission_date) {
    errors.push({ field: 'admission_date', message: 'Admission date is required' })
  } else {
    const admissionDate = new Date(data.admission_date)
    if (isNaN(admissionDate.getTime())) {
      errors.push({ field: 'admission_date', message: 'Please enter a valid date' })
    }
  }

  // Course validation (required)
  if (!data.course || data.course.trim() === '') {
    errors.push({ field: 'course', message: 'Course is required' })
  }

  // Year validation (required, 1-6)
  if (!data.year) {
    errors.push({ field: 'year', message: 'Year is required' })
  } else if (data.year < 1 || data.year > 6) {
    errors.push({ field: 'year', message: 'Year must be between 1 and 6' })
  }

  // Email validation (optional but must be valid)
  if (data.email && data.email.trim() !== '') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      errors.push({ field: 'email', message: 'Please enter a valid email address' })
    }
  }

  // Guardian email validation (optional but must be valid)
  if (data.guardian_email && data.guardian_email.trim() !== '') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.guardian_email)) {
      errors.push({ field: 'guardian_email', message: 'Please enter a valid guardian email address' })
    }
  }

  // Phone validation (optional but must be valid)
  if (data.phone && data.phone.trim() !== '') {
    const phoneRegex = /^\+?[\d\s-()]+$/
    if (!phoneRegex.test(data.phone) || data.phone.length < 10) {
      errors.push({ field: 'phone', message: 'Please enter a valid phone number' })
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validate faculty creation form data
 */
export function validateFaculty(data: {
  user_id?: string
  employee_id?: string
  designation?: string
  employment_type?: string
  joining_date?: string
  email?: string
  salary?: number
  experience_years?: number
}): ValidationResult {
  const errors: ValidationError[] = []

  // User ID validation
  if (!data.user_id) {
    errors.push({ field: 'user_id', message: 'User is required' })
  }

  // Employee ID validation (required)
  if (!data.employee_id || data.employee_id.trim() === '') {
    errors.push({ field: 'employee_id', message: 'Employee ID is required' })
  }

  // Designation validation (required)
  if (!data.designation || data.designation.trim() === '') {
    errors.push({ field: 'designation', message: 'Designation is required' })
  }

  // Employment type validation (required, enum)
  if (!data.employment_type) {
    errors.push({ field: 'employment_type', message: 'Employment type is required' })
  } else {
    const validTypes = ['full-time', 'part-time', 'visiting', 'contract']
    if (!validTypes.includes(data.employment_type)) {
      errors.push({ 
        field: 'employment_type', 
        message: 'Employment type must be full-time, part-time, visiting, or contract' 
      })
    }
  }

  // Joining date validation (required)
  if (!data.joining_date) {
    errors.push({ field: 'joining_date', message: 'Joining date is required' })
  } else {
    const joiningDate = new Date(data.joining_date)
    if (isNaN(joiningDate.getTime())) {
      errors.push({ field: 'joining_date', message: 'Please enter a valid date' })
    } else if (joiningDate > new Date()) {
      errors.push({ field: 'joining_date', message: 'Joining date cannot be in the future' })
    }
  }

  // Email validation (optional but must be valid)
  if (data.email && data.email.trim() !== '') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      errors.push({ field: 'email', message: 'Please enter a valid email address' })
    }
  }

  // Salary validation (optional but must be positive)
  if (data.salary !== undefined && data.salary !== null) {
    if (data.salary < 0) {
      errors.push({ field: 'salary', message: 'Salary must be a positive number' })
    }
  }

  // Experience years validation (optional but must be positive)
  if (data.experience_years !== undefined && data.experience_years !== null) {
    if (data.experience_years < 0) {
      errors.push({ field: 'experience_years', message: 'Experience years must be a positive number' })
    } else if (data.experience_years > 60) {
      errors.push({ field: 'experience_years', message: 'Experience years seems unrealistic' })
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Get error message for a specific field
 */
export function getFieldError(errors: ValidationError[], field: string): string | undefined {
  return errors.find(e => e.field === field)?.message
}

/**
 * Check if a specific field has an error
 */
export function hasFieldError(errors: ValidationError[], field: string): boolean {
  return errors.some(e => e.field === field)
}

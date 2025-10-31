'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectOption } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/toast'
import { handleError } from '@/lib/errorHandler'
import { apiClient } from '@/lib/api-client'
import { AlertCircle, X } from 'lucide-react'

export interface AdministrativeStaffFormData {
  first_name: string
  last_name: string
  email: string
  phone?: string
  role: 'admission_admin' | 'college_accounts_admin' | 'college_fee_admin'
  department_id?: string
  employee_id?: string
  designation?: string
  joining_date?: string
  status: 'active' | 'inactive' | 'on_leave'
}

interface AdministrativeStaffFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  staff?: any
  universityId: string
  collegeId: string
}

export default function AdministrativeStaffFormModal({
  isOpen,
  onClose,
  onSuccess,
  staff,
  universityId,
  collegeId,
}: AdministrativeStaffFormModalProps) {
  const isEditMode = !!staff

  const [formData, setFormData] = useState<AdministrativeStaffFormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: 'admission_admin',
    department_id: '',
    employee_id: '',
    designation: '',
    joining_date: '',
    status: 'active',
  })

  const [departments, setDepartments] = useState<SelectOption[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [apiError, setApiError] = useState<string>('')

  // Reset form when modal opens/closes or staff changes
  useEffect(() => {
    if (isOpen) {
      if (staff) {
        setFormData({
          first_name: staff.first_name || '',
          last_name: staff.last_name || '',
          email: staff.email || '',
          phone: staff.phone || '',
          role: staff.role || 'admission_admin',
          department_id: staff.department_id || '',
          employee_id: staff.employee_id || '',
          designation: staff.designation || '',
          joining_date: staff.joining_date || '',
          status: staff.status || 'active',
        })
      } else {
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          role: 'admission_admin',
          department_id: '',
          employee_id: '',
          designation: '',
          joining_date: '',
          status: 'active',
        })
      }
      setErrors({})
      setApiError('')
    }
  }, [isOpen, staff])

  // Fetch departments for dropdown
  useEffect(() => {
    if (isOpen && universityId && collegeId) {
      fetchDepartments()
    }
  }, [isOpen, universityId, collegeId])

  const fetchDepartments = async () => {
    try {
      const response = await apiClient.get<{ data: any[] }>(
        `/admin/universities/${universityId}/colleges/${collegeId}/departments`
      )
      setDepartments([
        { label: 'No Department', value: '' },
        ...response.data.map((dept: any) => ({
          label: dept.name,
          value: dept.id,
        })),
      ])
    } catch (error) {
      handleError(error, toast, { customMessage: 'Failed to fetch departments' })
      setDepartments([{ label: 'No Department', value: '' }])
    }
  }

  const roleOptions: SelectOption[] = [
    { label: 'Admission Officer', value: 'admission_admin' },
    { label: 'Accounts Administrator', value: 'college_accounts_admin' },
    { label: 'Fee Collection Administrator', value: 'college_fee_admin' },
  ]

  const statusOptions: SelectOption[] = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'On Leave', value: 'on_leave' },
  ]

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required'
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.role) {
      newErrors.role = 'Role is required'
    }

    if (!isEditMode && !formData.employee_id?.trim()) {
      newErrors.employee_id = 'Employee ID is required'
    }

    if (formData.phone && !/^\d{10,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Invalid phone number format'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const payload = {
        ...formData,
        university_id: universityId,
        college_id: collegeId,
      }

      if (isEditMode) {
        // Update existing staff member
        await apiClient.put(
          `/admin/universities/${universityId}/colleges/${collegeId}/administrative-staff/${staff.id}`,
          payload
        )
      } else {
        // Create new staff member
        await apiClient.post(
          `/admin/universities/${universityId}/colleges/${collegeId}/administrative-staff`,
          payload
        )
      }

      onSuccess()
      onClose()
    } catch (error: any) {
      handleError(error, toast, { 
        customMessage: isEditMode 
          ? 'Failed to update administrative staff' 
          : 'Failed to create administrative staff' 
      })

      if (error.response?.data?.errors) {
        // Laravel validation errors
        const validationErrors: Record<string, string> = {}
        Object.keys(error.response.data.errors).forEach((key) => {
          validationErrors[key] = error.response.data.errors[key][0]
        })
        setErrors(validationErrors)
      } else if (error.response?.data?.message) {
        setApiError(error.response.data.message)
      } else {
        setApiError('Failed to save administrative staff. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: keyof AdministrativeStaffFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-800">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditMode ? 'Edit Administrative Staff' : 'Add New Administrative Staff'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {isEditMode ? 'Update staff member information' : 'Fill in the details to add a new staff member'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            disabled={isLoading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* API Error Message */}
          {apiError && (
            <div className="flex items-start gap-3 p-4 mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-800 dark:text-red-200">Error</h4>
                <p className="text-sm text-red-600 dark:text-red-300 mt-1">{apiError}</p>
              </div>
            </div>
          )}

          {/* Personal Information Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => handleChange('first_name', e.target.value)}
                  placeholder="Enter first name"
                  className={errors.first_name ? 'border-red-500' : ''}
                />
                {errors.first_name && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1.5">{errors.first_name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="last_name">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => handleChange('last_name', e.target.value)}
                  placeholder="Enter last name"
                  className={errors.last_name ? 'border-red-500' : ''}
                />
                {errors.last_name && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1.5">{errors.last_name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="staff@college.edu"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1.5">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+91 1234567890"
                />
              </div>
            </div>
          </div>

          {/* Employment Information Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              Employment Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="role">
                  Role <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.role}
                  onChange={(value) => handleChange('role', value)}
                  options={roleOptions}
                  placeholder="Select role"
                  className={errors.role ? 'border-red-500' : ''}
                />
                {errors.role && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1.5">{errors.role}</p>
                )}
              </div>

              <div>
                <Label htmlFor="employee_id">Employee ID</Label>
                <Input
                  id="employee_id"
                  value={formData.employee_id}
                  onChange={(e) => handleChange('employee_id', e.target.value)}
                  placeholder="e.g., ADM001"
                  disabled={isEditMode}
                />
                {isEditMode && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">Employee ID cannot be changed</p>
                )}
              </div>

              <div>
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  value={formData.designation}
                  onChange={(e) => handleChange('designation', e.target.value)}
                  placeholder="e.g., Senior Administrator"
                />
              </div>

              <div>
                <Label htmlFor="joining_date">Joining Date</Label>
                <Input
                  id="joining_date"
                  type="date"
                  value={formData.joining_date}
                  onChange={(e) => handleChange('joining_date', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="status">
                  Status <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.status}
                  onChange={(value) => handleChange('status', value)}
                  options={statusOptions}
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{isEditMode ? 'Updating...' : 'Creating...'}</span>
                </div>
              ) : (
                <span>{isEditMode ? 'Update Staff' : 'Add Staff'}</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

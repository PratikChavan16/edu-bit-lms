'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectOption } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/toast'
import { handleError } from '@/lib/errorHandler'
import { apiClient } from '@/lib/api-client'
import { AlertCircle } from 'lucide-react'

export interface NonTeachingStaffFormData {
  first_name: string
  last_name: string
  email: string
  phone?: string
  employee_id?: string
  designation: string
  employee_type: 'lab_assistant' | 'peon' | 'maintenance' | 'security' | 'clerical' | 'other'
  department_id?: string
  joining_date?: string
  shift?: 'morning' | 'evening' | 'night' | 'rotational'
  supervisor_name?: string
  status: 'active' | 'inactive' | 'on_leave'
}

interface NonTeachingStaffFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  staff?: any
  universityId: string
  collegeId: string
}

export default function NonTeachingStaffFormModal({
  isOpen,
  onClose,
  onSuccess,
  staff,
  universityId,
  collegeId,
}: NonTeachingStaffFormModalProps) {
  const isEditMode = !!staff

  const [formData, setFormData] = useState<NonTeachingStaffFormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    employee_id: '',
    designation: '',
    employee_type: 'lab_assistant',
    department_id: '',
    joining_date: '',
    shift: 'morning',
    supervisor_name: '',
    status: 'active',
  })

  const [departments, setDepartments] = useState<SelectOption[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [apiError, setApiError] = useState<string>('')
  const toast = useToast()

  // Reset form when modal opens/closes or staff changes
  useEffect(() => {
    if (isOpen) {
      if (staff) {
        setFormData({
          first_name: staff.first_name || '',
          last_name: staff.last_name || '',
          email: staff.email || '',
          phone: staff.phone || '',
          employee_id: staff.employee_id || '',
          designation: staff.designation || '',
          employee_type: staff.employee_type || 'lab_assistant',
          department_id: staff.department_id || '',
          joining_date: staff.joining_date || '',
          shift: staff.shift || 'morning',
          supervisor_name: staff.supervisor_name || '',
          status: staff.status || 'active',
        })
      } else {
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          employee_id: '',
          designation: '',
          employee_type: 'lab_assistant',
          department_id: '',
          joining_date: '',
          shift: 'morning',
          supervisor_name: '',
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
        { label: 'No Department (General)', value: '' },
        ...response.data.map((dept: any) => ({
          label: dept.name,
          value: dept.id,
        })),
      ])
    } catch (error) {
      handleError(error, toast, { customMessage: 'Failed to fetch departments' })
      setDepartments([{ label: 'No Department (General)', value: '' }])
    }
  }

  const employeeTypeOptions: SelectOption[] = [
    { label: 'Lab Assistant / Technician', value: 'lab_assistant' },
    { label: 'Peon / Office Attendant', value: 'peon' },
    { label: 'Maintenance / Electrician', value: 'maintenance' },
    { label: 'Security Personnel', value: 'security' },
    { label: 'Clerical Staff', value: 'clerical' },
    { label: 'Other Support Staff', value: 'other' },
  ]

  const shiftOptions: SelectOption[] = [
    { label: 'Morning (8 AM - 4 PM)', value: 'morning' },
    { label: 'Evening (4 PM - 12 AM)', value: 'evening' },
    { label: 'Night (12 AM - 8 AM)', value: 'night' },
    { label: 'Rotational', value: 'rotational' },
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

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.employee_type) {
      newErrors.employee_type = 'Employee type is required'
    }

    if (!formData.designation.trim()) {
      newErrors.designation = 'Designation is required'
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
          `/admin/universities/${universityId}/colleges/${collegeId}/non-teaching-staff/${staff.id}`,
          payload
        )
      } else {
        // Create new staff member
        await apiClient.post(
          `/admin/universities/${universityId}/colleges/${collegeId}/non-teaching-staff`,
          payload
        )
      }

      onSuccess()
      onClose()
    } catch (error: any) {
      handleError(error, toast, { 
        customMessage: isEditMode 
          ? 'Failed to update non-teaching staff' 
          : 'Failed to create non-teaching staff' 
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
        setApiError('Failed to save non-teaching staff. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: keyof NonTeachingStaffFormData, value: any) => {
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Non-Teaching Staff' : 'Add Non-Teaching Staff'}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* API Error Message */}
        {apiError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{apiError}</p>
            </div>
          </div>
        )}

        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>

          <div className="grid grid-cols-2 gap-4">
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
                <p className="text-sm text-red-600 mt-1">{errors.first_name}</p>
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
                <p className="text-sm text-red-600 mt-1">{errors.last_name}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="email@example.com (optional)"
                className={errors.email ? 'border-red-500' : ''}
                disabled={isEditMode}
              />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+1234567890"
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
            </div>
          </div>
        </div>

        {/* Employment Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Employment Information</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="employee_id">
                Employee ID {!isEditMode && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="employee_id"
                value={formData.employee_id}
                onChange={(e) => handleChange('employee_id', e.target.value)}
                placeholder="EMP-2025-NT-001"
                className={errors.employee_id ? 'border-red-500' : ''}
                disabled={isEditMode}
              />
              {errors.employee_id && (
                <p className="text-sm text-red-600 mt-1">{errors.employee_id}</p>
              )}
            </div>

            <div>
              <Label htmlFor="employee_type">
                Employee Type <span className="text-red-500">*</span>
              </Label>
              <Select
                options={employeeTypeOptions}
                value={formData.employee_type}
                onChange={(value) => handleChange('employee_type', value)}
                className={errors.employee_type ? 'border-red-500' : ''}
              />
              {errors.employee_type && (
                <p className="text-sm text-red-600 mt-1">{errors.employee_type}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="designation">
                Designation <span className="text-red-500">*</span>
              </Label>
              <Input
                id="designation"
                value={formData.designation}
                onChange={(e) => handleChange('designation', e.target.value)}
                placeholder="Lab Technician, Peon, Electrician, etc."
                className={errors.designation ? 'border-red-500' : ''}
              />
              {errors.designation && (
                <p className="text-sm text-red-600 mt-1">{errors.designation}</p>
              )}
            </div>

            <div>
              <Label htmlFor="department_id">Assigned Department (Optional)</Label>
              <Select
                options={departments}
                value={formData.department_id || ''}
                onChange={(value) => handleChange('department_id', value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="shift">Work Shift</Label>
              <Select
                options={shiftOptions}
                value={formData.shift || 'morning'}
                onChange={(value) => handleChange('shift', value)}
              />
            </div>

            <div>
              <Label htmlFor="supervisor_name">Supervisor Name</Label>
              <Input
                id="supervisor_name"
                value={formData.supervisor_name}
                onChange={(e) => handleChange('supervisor_name', e.target.value)}
                placeholder="Enter supervisor name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="joining_date">Joining Date</Label>
              <Input
                id="joining_date"
                type="date"
                value={formData.joining_date}
                onChange={(e) => handleChange('joining_date', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <Label htmlFor="status">
                Status <span className="text-red-500">*</span>
              </Label>
              <Select
                options={statusOptions}
                value={formData.status}
                onChange={(value) => handleChange('status', value)}
              />
            </div>
          </div>
        </div>

        {/* Employee Type Descriptions */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Employee Type Descriptions</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              <strong>Lab Assistant:</strong> Assists in labs, manages equipment and experiments
            </li>
            <li>
              <strong>Peon:</strong> Office attendants, document delivery, general assistance
            </li>
            <li>
              <strong>Maintenance:</strong> Electricians, plumbers, facility maintenance staff
            </li>
            <li>
              <strong>Security:</strong> Security guards, watchmen, campus security
            </li>
            <li>
              <strong>Clerical:</strong> Data entry, filing, administrative support
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : isEditMode ? 'Update Staff' : 'Add Staff'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

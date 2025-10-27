'use client'

import { useState, useEffect } from 'react'
import { Department } from '@/types'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectOption } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface DepartmentFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: DepartmentFormData) => Promise<void>
  department?: Department | null
  facultyOptions: SelectOption[]
}

export interface DepartmentFormData {
  name: string
  code: string
  hod_id?: string
  status?: 'active' | 'inactive'
}

export function DepartmentFormModal({
  isOpen,
  onClose,
  onSubmit,
  department,
  facultyOptions,
}: DepartmentFormModalProps) {
  const [formData, setFormData] = useState<DepartmentFormData>({
    name: '',
    code: '',
    hod_id: '',
    status: 'active',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name,
        code: department.code,
        hod_id: department.hod_id || '',
        status: department.status,
      })
    } else {
      setFormData({
        name: '',
        code: '',
        hod_id: '',
        status: 'active',
      })
    }
    setErrors({})
  }, [department, isOpen])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Department name is required'
    } else if (formData.name.length < 3) {
      newErrors.name = 'Department name must be at least 3 characters'
    }
    
    if (!formData.code.trim()) {
      newErrors.code = 'Department code is required'
    } else if (formData.code.length < 2) {
      newErrors.code = 'Department code must be at least 2 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    try {
      setIsSubmitting(true)
      await onSubmit(formData)
      onClose()
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {department ? 'Edit Department' : 'Create Department'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Department Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
              placeholder="e.g., Computer Science"
            />

            <Input
              label="Department Code *"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              error={errors.code}
              placeholder="e.g., CS"
              maxLength={10}
            />

            <Select
              label="Head of Department"
              value={formData.hod_id || ''}
              onChange={(value) => setFormData({ ...formData, hod_id: value })}
              options={[
                { label: 'Not Assigned', value: '' },
                ...facultyOptions,
              ]}
            />

            {department && (
              <Select
                label="Status"
                value={formData.status || 'active'}
                onChange={(value) => setFormData({ ...formData, status: value as 'active' | 'inactive' })}
                options={[
                  { label: 'Active', value: 'active' },
                  { label: 'Inactive', value: 'inactive' },
                ]}
              />
            )}

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : department ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { ButtonLoading } from '@/components/ui/LoadingStates'
import { CreatePlatformUserRequest } from '@/types'

interface CreatePlatformUserModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (data: CreatePlatformUserRequest) => Promise<void>
}

export default function CreatePlatformUserModal({
  isOpen,
  onClose,
  onCreate,
}: CreatePlatformUserModalProps) {
  const [formData, setFormData] = useState<CreatePlatformUserRequest>({
    name: '',
    email: '',
    role: 'bitflow_owner',
    password: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters (leave empty for auto-generated)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    try {
      // Remove password if empty (backend will generate one)
      const submitData = {
        ...formData,
        password: formData.password || undefined,
      }
      await onCreate(submitData as CreatePlatformUserRequest)
      handleClose()
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to create user' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      role: 'bitflow_owner',
      password: '',
    })
    setErrors({})
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Platform User" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="John Smith"
            disabled={isLoading}
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="john@bitflow.edu"
            disabled={isLoading}
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>

        {/* Role */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            Role <span className="text-red-500">*</span>
          </label>
          <select
            id="role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            <option value="bitflow_owner">Bitflow Owner</option>
            <option value="university_owner">University Owner</option>
          </select>
          <p className="mt-1 text-xs text-gray-500">
            {formData.role === 'bitflow_owner' && 'Full platform access across all universities (Level 1 - Global Scope)'}
            {formData.role === 'university_owner' && 'Manages a single university with full control (Level 2 - University Scope)'}
          </p>
        </div>

        {/* Password (Optional) */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Leave empty for auto-generated password"
            disabled={isLoading}
          />
          {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
          {!errors.password && (
            <p className="mt-1 text-xs text-gray-500">
              If left empty, a secure password will be generated and sent via email
            </p>
          )}
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800">{errors.submit}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <ButtonLoading 
            type="submit" 
            isLoading={isLoading}
            loadingText="Creating..."
          >
            Create User
          </ButtonLoading>
        </div>
      </form>
    </Modal>
  )
}

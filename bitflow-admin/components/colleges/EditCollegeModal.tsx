'use client'

import { useState, useEffect } from 'react'
import { Modal, ModalFooter } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ButtonLoading } from '@/components/ui/LoadingStates'
import { AlertTriangle } from 'lucide-react'
import type { College } from '@/types'

interface EditCollegeModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (id: string, data: UpdateCollegeData) => Promise<void>
  college: College | null
}

export interface UpdateCollegeData {
  name: string
  code: string
  type?: string
  email: string
  phone?: string
  address?: string
  established_year?: number
  capacity?: number
  status: 'active' | 'inactive' | 'suspended'
}

export function EditCollegeModal({
  isOpen,
  onClose,
  onSubmit,
  college,
}: EditCollegeModalProps) {
  const [formData, setFormData] = useState<UpdateCollegeData>({
    name: '',
    code: '',
    type: '',
    email: '',
    phone: '',
    address: '',
    established_year: undefined,
    capacity: undefined,
    status: 'active',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (college) {
      setFormData({
        name: college.name,
        code: college.code,
        type: college.type || '',
        email: college.email,
        phone: college.phone || '',
        address: college.address || '',
        established_year: college.established_year,
        capacity: college.capacity,
        status: college.status,
      })
    }
  }, [college])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!college) return

    setError('')
    setIsSubmitting(true)

    try {
      await onSubmit(college.id, formData)
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to update college')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!college) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit College (God Mode)"
      description={`Editing ${college.name}`}
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        {/* God Mode Warning */}
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-900 text-sm">God Mode Access</h4>
              <p className="text-xs text-amber-700 mt-1">
                You're editing a college as Bitflow Owner. This action will be logged in audit logs.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-lg border">
            <p className="text-sm text-gray-600">
              <strong>University:</strong> {college.university?.name || 'N/A'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="College Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={isSubmitting}
            />

            <Input
              label="College Code *"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                College Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                disabled={isSubmitting}
              >
                <option value="">Select Type</option>
                <option value="Engineering">Engineering</option>
                <option value="Arts & Science">Arts & Science</option>
                <option value="Commerce">Commerce</option>
                <option value="Medicine">Medicine</option>
                <option value="Law">Law</option>
                <option value="Management">Management</option>
                <option value="Education">Education</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <Input
              label="Established Year"
              type="number"
              value={formData.established_year || ''}
              onChange={(e) => setFormData({ ...formData, established_year: e.target.value ? Number(e.target.value) : undefined })}
              min={1800}
              max={new Date().getFullYear()}
              disabled={isSubmitting}
            />
          </div>

          <Input
            label="Email *"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            disabled={isSubmitting}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={isSubmitting}
            />

            <Input
              label="Student Capacity"
              type="number"
              value={formData.capacity || ''}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value ? Number(e.target.value) : undefined })}
              min={1}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
              disabled={isSubmitting}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <ModalFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <ButtonLoading 
            type="submit" 
            isLoading={isSubmitting}
            loadingText="Saving..."
          >
            Save Changes
          </ButtonLoading>
        </ModalFooter>
      </form>
    </Modal>
  )
}

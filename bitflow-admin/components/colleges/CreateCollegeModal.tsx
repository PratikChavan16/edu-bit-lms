'use client'

import { useState } from 'react'
import { Modal, ModalFooter } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

interface CreateCollegeModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateCollegeData) => Promise<void>
  universities: Array<{ id: string; name: string }>
}

export interface CreateCollegeData {
  university_id: string
  name: string
  code: string
  type?: string
  email: string
  phone?: string
  address?: string
  established_year?: number
  capacity?: number
}

export function CreateCollegeModal({
  isOpen,
  onClose,
  onSubmit,
  universities,
}: CreateCollegeModalProps) {
  const [formData, setFormData] = useState<CreateCollegeData>({
    university_id: '',
    name: '',
    code: '',
    type: '',
    email: '',
    phone: '',
    address: '',
    established_year: undefined,
    capacity: undefined,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await onSubmit(formData)
      setFormData({
        university_id: '',
        name: '',
        code: '',
        type: '',
        email: '',
        phone: '',
        address: '',
        established_year: undefined,
        capacity: undefined,
      })
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to create college')
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedUniversity = universities.find(u => u.id === formData.university_id)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New College (God Mode)"
      description="Create a college for any university"
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
                You're creating a college as Bitflow Owner. Normally, this is done by the University Owner. 
                This action will be logged in audit logs.
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
          {/* University Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              University *
            </label>
            <select
              value={formData.university_id}
              onChange={(e) => setFormData({ ...formData, university_id: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
              disabled={isSubmitting}
            >
              <option value="">Select University</option>
              {universities.map((uni) => (
                <option key={uni.id} value={uni.id}>
                  {uni.name}
                </option>
              ))}
            </select>
            {selectedUniversity && (
              <p className="text-xs text-gray-500 mt-1">
                College will be created under: <strong>{selectedUniversity.name}</strong>
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="College Name *"
              placeholder="School of Engineering"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={isSubmitting}
            />

            <Input
              label="College Code *"
              placeholder="SOE"
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
              placeholder="2020"
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
            placeholder="admissions@college.edu"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            disabled={isSubmitting}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={isSubmitting}
            />

            <Input
              label="Student Capacity"
              type="number"
              placeholder="5000"
              value={formData.capacity || ''}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value ? Number(e.target.value) : undefined })}
              min={1}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Full address of the college"
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
          <Button type="submit" disabled={isSubmitting || !formData.university_id}>
            {isSubmitting ? 'Creating...' : 'Create College'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}

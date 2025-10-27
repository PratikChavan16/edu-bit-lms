'use client'

import { useState, useEffect } from 'react'
import { Modal, ModalFooter } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { University } from '@/types'

interface EditUniversityModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (id: string, data: UpdateUniversityData) => Promise<void>
  university: University | null
}

export interface UpdateUniversityData {
  name: string
  email: string
  phone: string
  storage_quota_gb: number
}

export function EditUniversityModal({
  isOpen,
  onClose,
  onSubmit,
  university,
}: EditUniversityModalProps) {
  const [formData, setFormData] = useState<UpdateUniversityData>({
    name: '',
    email: '',
    phone: '',
    storage_quota_gb: 100,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Pre-populate form when university changes
  useEffect(() => {
    if (university) {
      setFormData({
        name: university.name,
        email: university.email,
        phone: university.phone || '',
        storage_quota_gb: university.storage_quota_gb,
      })
      setError('')
    }
  }, [university])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!university) return

    setError('')
    setIsSubmitting(true)

    try {
      await onSubmit(university.id, formData)
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to update university')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setError('')
    onClose()
  }

  if (!university) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit University"
      description={`Update details for ${university.name}`}
      size="md"
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <Input
            label="University Name *"
            placeholder="MIT University"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            disabled={isSubmitting}
          />

          <Input
            label="Primary Email *"
            type="email"
            placeholder="admin@university.edu"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            disabled={isSubmitting}
          />

          <Input
            label="Contact Phone *"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
            disabled={isSubmitting}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Storage Quota (GB) *
            </label>
            <select
              value={formData.storage_quota_gb}
              onChange={(e) =>
                setFormData({ ...formData, storage_quota_gb: Number(e.target.value) })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isSubmitting}
            >
              <option value={50}>50 GB</option>
              <option value={100}>100 GB</option>
              <option value={250}>250 GB</option>
              <option value={500}>500 GB</option>
              <option value={1000}>1 TB</option>
              <option value={2000}>2 TB</option>
              <option value={5000}>5 TB</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Current usage: {university.storage_used_mb} MB /{' '}
              {university.storage_quota_gb} GB
            </p>
          </div>
        </div>

        <ModalFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update University'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}

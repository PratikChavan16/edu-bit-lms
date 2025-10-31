'use client'

import { useState } from 'react'
import { Modal, ModalFooter } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ButtonLoading } from '@/components/ui/LoadingStates'
import { Copy, Check, AlertTriangle } from 'lucide-react'

interface CreateUniversityModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateUniversityData) => Promise<any>
}

export interface CreateUniversityData {
  name: string
  domain: string
  email: string
  phone: string
  storage_quota_gb: number
}

interface OwnerCredentials {
  id: string
  name: string
  email: string
  username: string
  password: string
  role: string
}

export function CreateUniversityModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateUniversityModalProps) {
  const [formData, setFormData] = useState<CreateUniversityData>({
    name: '',
    domain: '',
    email: '',
    phone: '',
    storage_quota_gb: 100,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [ownerCredentials, setOwnerCredentials] = useState<OwnerCredentials | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await onSubmit(formData)
      // Backend returns: { data: { university: {...}, owner: {...} } }
      if (response?.data?.owner) {
        setOwnerCredentials(response.data.owner)
      }
      setFormData({ name: '', domain: '', email: '', phone: '', storage_quota_gb: 100 })
    } catch (err: any) {
      setError(err.message || 'Failed to create university')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCopy = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleClose = () => {
    setOwnerCredentials(null)
    setError('')
    onClose()
  }

  // Show credentials modal after successful creation
  if (ownerCredentials) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="University Created Successfully!"
        description="University Owner credentials have been generated"
        size="md"
      >
        <div className="space-y-4">
          {/* Warning Banner */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-900 text-sm">Important: Save These Credentials</h4>
                <p className="text-xs text-amber-700 mt-1">
                  The password will not be shown again. Please copy and securely share with the university owner.
                </p>
              </div>
            </div>
          </div>

          {/* Credentials */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Email</label>
              <div className="flex items-center gap-2 mt-1">
                <code className="flex-1 px-3 py-2 bg-white border rounded text-sm font-mono">
                  {ownerCredentials.email}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(ownerCredentials.email, 'email')}
                  className="flex-shrink-0"
                >
                  {copiedField === 'email' ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Username</label>
              <div className="flex items-center gap-2 mt-1">
                <code className="flex-1 px-3 py-2 bg-white border rounded text-sm font-mono">
                  {ownerCredentials.username}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(ownerCredentials.username, 'username')}
                  className="flex-shrink-0"
                >
                  {copiedField === 'username' ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Temporary Password</label>
              <div className="flex items-center gap-2 mt-1">
                <code className="flex-1 px-3 py-2 bg-white border rounded text-sm font-mono text-red-600">
                  {ownerCredentials.password}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(ownerCredentials.password, 'password')}
                  className="flex-shrink-0"
                >
                  {copiedField === 'password' ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-xs text-gray-600">
                <strong>Role:</strong> {ownerCredentials.role.replace('_', ' ').toUpperCase()}
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Next Steps:</strong>
            </p>
            <ol className="list-decimal list-inside text-xs text-blue-700 mt-2 space-y-1">
              <li>Copy all credentials above</li>
              <li>Send securely to the university owner</li>
              <li>Owner should change password on first login</li>
              <li>Owner can then create colleges, departments, and other users</li>
            </ol>
          </div>
        </div>

        <ModalFooter>
          <Button onClick={handleClose} className="w-full">
            Done - Close
          </Button>
        </ModalFooter>
      </Modal>
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New University"
      description="Add a new university to the platform"
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

          <div>
            <Input
              label="Domain *"
              type="text"
              placeholder="mit.edu"
              value={formData.domain}
              onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              required
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">Unique domain for this university (e.g., mit.edu, stanford.edu)</p>
          </div>

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
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
              disabled={isSubmitting}
            >
              <option value={50}>50 GB</option>
              <option value={100}>100 GB</option>
              <option value={250}>250 GB</option>
              <option value={500}>500 GB</option>
              <option value={1000}>1 TB (1000 GB)</option>
              <option value={2000}>2 TB (2000 GB)</option>
            </select>
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
            loadingText="Creating..."
          >
            Create University
          </ButtonLoading>
        </ModalFooter>
      </form>
    </Modal>
  )
}

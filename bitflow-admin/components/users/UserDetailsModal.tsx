'use client'

import { GlobalUser } from '@/types'
import { Modal } from '@/components/ui/modal'
import { Badge } from '@/components/ui/badge'
import { formatDateTime } from '@/lib/utils'

interface UserDetailsModalProps {
  user: GlobalUser | null
  isOpen: boolean
  onClose: () => void
}

export default function UserDetailsModal({ user, isOpen, onClose }: UserDetailsModalProps) {
  if (!user) return null

  const getStatusBadge = (status: GlobalUser['status']) => {
    const variants: Record<GlobalUser['status'], 'success' | 'warning' | 'danger' | 'default'> = {
      active: 'success',
      inactive: 'warning',
      locked: 'danger',
      suspended: 'danger',
    }
    return <Badge variant={variants[status]}>{status}</Badge>
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Details" size="lg">
      <div className="space-y-6">
        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Full Name</label>
              <p className="mt-1 text-sm text-gray-900">{user.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email Address</label>
              <p className="mt-1 text-sm text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Role</label>
              <p className="mt-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {user.role}
                </span>
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <p className="mt-1">{getStatusBadge(user.status)}</p>
            </div>
          </div>
        </div>

        {/* University Assignment */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">University Assignment</h3>
          {user.university ? (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{user.university.name}</p>
                  <p className="text-xs text-gray-500 mt-1">University ID: {user.university.id}</p>
                </div>
                <Badge variant="success">Assigned</Badge>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">Platform-level user (not assigned to any university)</p>
            </div>
          )}
        </div>

        {/* Account Activity */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Activity</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Last Login</span>
              <span className="text-sm font-medium text-gray-900">
                {user.last_login ? formatDateTime(user.last_login) : 'Never'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Account Created</span>
              <span className="text-sm font-medium text-gray-900">
                {formatDateTime(user.created_at)}
              </span>
            </div>
            {user.updated_at && (
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Last Updated</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatDateTime(user.updated_at)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Security Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Information</h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-800">
                  {user.status === 'locked' 
                    ? 'This account is currently locked. The user cannot access the system.'
                    : user.status === 'suspended'
                    ? 'This account is suspended. Contact support for more information.'
                    : user.status === 'inactive'
                    ? 'This account is inactive. It may require activation.'
                    : 'This account is active and in good standing.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Close
        </button>
      </div>
    </Modal>
  )
}

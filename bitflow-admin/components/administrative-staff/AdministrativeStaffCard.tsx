'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Mail, Phone, Briefcase, Calendar, Edit, Trash2, User } from 'lucide-react'

interface AdministrativeStaff {
  id: string
  first_name: string
  last_name: string
  full_name?: string
  email: string
  phone?: string
  role: string
  employee_id?: string
  designation?: string
  department_name?: string
  joining_date?: string
  status: 'active' | 'inactive' | 'on_leave'
}

interface AdministrativeStaffCardProps {
  staff: AdministrativeStaff
  onEdit?: () => void
  onDelete?: () => void
}

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  on_leave: 'bg-yellow-100 text-yellow-800',
}

const roleLabels: Record<string, string> = {
  admission_admin: 'Admission Officer',
  college_accounts_admin: 'Accounts Administrator',
  college_fee_admin: 'Fee Collection Administrator',
}

const roleColors: Record<string, string> = {
  admission_admin: 'bg-blue-100 text-blue-800',
  college_accounts_admin: 'bg-purple-100 text-purple-800',
  college_fee_admin: 'bg-orange-100 text-orange-800',
}

export function AdministrativeStaffCard({ staff, onEdit, onDelete }: AdministrativeStaffCardProps) {
  const displayName = staff.full_name || `${staff.first_name} ${staff.last_name}`
  const roleLabel = roleLabels[staff.role] || staff.role
  const roleColor = roleColors[staff.role] || 'bg-gray-100 text-gray-800'

  const cardContent = (
    <Card className="hover:shadow-lg transition-shadow p-6">
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
            <User className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        {/* Staff Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 truncate">{displayName}</h3>
              {staff.employee_id && (
                <p className="text-sm text-gray-600">{staff.employee_id}</p>
              )}
            </div>
            <Badge className={statusColors[staff.status]}>
              {staff.status.replace('_', ' ')}
            </Badge>
          </div>

          {/* Role Badge */}
          <div className="mt-2">
            <Badge className={roleColor}>{roleLabel}</Badge>
          </div>

          {/* Contact Information */}
          <div className="mt-3 space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">{staff.email}</span>
            </div>

            {staff.phone && (
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{staff.phone}</span>
              </div>
            )}

            {staff.designation && (
              <div className="flex items-center text-sm text-gray-600">
                <Briefcase className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">{staff.designation}</span>
              </div>
            )}

            {staff.department_name && (
              <div className="flex items-center text-sm text-gray-600">
                <Briefcase className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">Dept: {staff.department_name}</span>
              </div>
            )}

            {staff.joining_date && (
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>
                  Joined: {new Date(staff.joining_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {(onEdit || onDelete) && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onEdit()
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onDelete()
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  )

  return cardContent
}

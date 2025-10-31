'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Mail, Phone, Calendar, User, Edit, Trash2, Clock } from 'lucide-react'

interface NonTeachingStaff {
  id: string
  first_name: string
  last_name: string
  full_name: string
  email?: string
  phone?: string
  employee_id: string
  designation: string
  employee_type: 'lab_assistant' | 'peon' | 'maintenance' | 'security' | 'clerical' | 'other'
  department_name?: string
  joining_date?: string
  shift?: 'morning' | 'evening' | 'night' | 'rotational'
  supervisor_name?: string
  status: 'active' | 'inactive' | 'on_leave'
}

interface NonTeachingStaffCardProps {
  staff: NonTeachingStaff
  onEdit?: (staff: NonTeachingStaff) => void
  onDelete?: (staffId: string) => void
}

const statusColors = {
  active: 'bg-green-100 text-green-800 border-green-200',
  inactive: 'bg-gray-100 text-gray-800 border-gray-200',
  on_leave: 'bg-yellow-100 text-yellow-800 border-yellow-200',
}

const employeeTypeLabels = {
  lab_assistant: 'Lab Assistant',
  peon: 'Peon',
  maintenance: 'Maintenance',
  security: 'Security',
  clerical: 'Clerical',
  other: 'Other',
}

const employeeTypeColors = {
  lab_assistant: 'bg-blue-100 text-blue-800 border-blue-200',
  peon: 'bg-purple-100 text-purple-800 border-purple-200',
  maintenance: 'bg-orange-100 text-orange-800 border-orange-200',
  security: 'bg-red-100 text-red-800 border-red-200',
  clerical: 'bg-teal-100 text-teal-800 border-teal-200',
  other: 'bg-gray-100 text-gray-800 border-gray-200',
}

const shiftLabels = {
  morning: 'Morning',
  evening: 'Evening',
  night: 'Night',
  rotational: 'Rotational',
}

export default function NonTeachingStaffCard({
  staff,
  onEdit,
  onDelete,
}: NonTeachingStaffCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            {/* Avatar Placeholder */}
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-teal-600" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{staff.full_name}</h3>
              <p className="text-sm text-gray-500">ID: {staff.employee_id}</p>
            </div>
          </div>

          {/* Status Badge */}
          <Badge
            className={`${statusColors[staff.status]} capitalize ml-2`}
          >
            {staff.status === 'on_leave' ? 'On Leave' : staff.status}
          </Badge>
        </div>

        {/* Employee Type & Designation */}
        <div className="space-y-2 mb-4">
          <Badge
            className={employeeTypeColors[staff.employee_type]}
          >
            {employeeTypeLabels[staff.employee_type]}
          </Badge>
          <p className="text-sm text-gray-700 font-medium">{staff.designation}</p>
        </div>

        {/* Contact Information */}
        <div className="space-y-2 mb-4">
          {staff.email && (
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="w-4 h-4 mr-2 text-gray-400" />
              <span className="truncate">{staff.email}</span>
            </div>
          )}
          {staff.phone && (
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="w-4 h-4 mr-2 text-gray-400" />
              <span>{staff.phone}</span>
            </div>
          )}
        </div>

        {/* Additional Details */}
        <div className="space-y-2 text-sm text-gray-600">
          {staff.department_name && (
            <div className="flex items-start">
              <span className="font-medium mr-2">Department:</span>
              <span className="text-gray-700">{staff.department_name}</span>
            </div>
          )}
          {staff.shift && (
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-gray-400" />
              <span>{shiftLabels[staff.shift]} Shift</span>
            </div>
          )}
          {staff.supervisor_name && (
            <div className="flex items-start">
              <span className="font-medium mr-2">Supervisor:</span>
              <span className="text-gray-700">{staff.supervisor_name}</span>
            </div>
          )}
          {staff.joining_date && (
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
              <span>Joined {new Date(staff.joining_date).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {(onEdit || onDelete) && (
          <div className="flex space-x-2 mt-4 pt-4 border-t">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(staff)
                }}
                className="flex-1"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(staff.id)
                }}
                className="flex-1 text-red-600 hover:text-red-700 hover:border-red-300"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

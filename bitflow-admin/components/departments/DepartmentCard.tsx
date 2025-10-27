'use client'

import { Department } from '@/types'
import { usePermissions } from '@/hooks/usePermissions'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Building2, Users, GraduationCap, BookOpen, Edit, Trash2 } from 'lucide-react'

interface DepartmentCardProps {
  department: Department
  onEdit?: (department: Department) => void
  onDelete?: (department: Department) => void
}

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
}

export function DepartmentCard({ department, onEdit, onDelete }: DepartmentCardProps) {
  const { canEditDepartment, canDeleteDepartment } = usePermissions()
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{department.name}</h3>
              <p className="text-sm text-gray-600">Code: {department.code}</p>
            </div>
          </div>
          <Badge className={statusColors[department.status]}>
            {department.status}
          </Badge>
        </div>

        {/* HOD Info */}
        {department.hod_name && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Head of Department</p>
            <p className="font-medium text-gray-900">{department.hod_name}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{department.students_count}</div>
            <div className="text-xs text-gray-600">Students</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <GraduationCap className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{department.faculty_count}</div>
            <div className="text-xs text-gray-600">Faculty</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <BookOpen className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{department.courses_count}</div>
            <div className="text-xs text-gray-600">Courses</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 pt-4 border-t">
          {canEditDepartment && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 flex items-center justify-center space-x-2"
              onClick={() => onEdit?.(department)}
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </Button>
          )}
          {canDeleteDepartment && (
            <Button
              variant="destructive"
              size="sm"
              className="flex-1 flex items-center justify-center space-x-2"
              onClick={() => onDelete?.(department)}
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </Button>
          )}
          {!canEditDepartment && !canDeleteDepartment && (
            <p className="text-sm text-gray-500 text-center flex-1">View only</p>
          )}
        </div>
      </div>
    </Card>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Student } from '@/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Mail, Phone, GraduationCap, Calendar } from 'lucide-react'

interface StudentCardProps {
  student: Student
}

const statusColors = {
  active: 'bg-green-100 text-green-800',
  suspended: 'bg-red-100 text-red-800',
  graduated: 'bg-blue-100 text-blue-800',
  dropped: 'bg-gray-100 text-gray-800',
}

export function StudentCard({ student }: StudentCardProps) {
  const pathname = usePathname()

  return (
    <Link href={`${pathname}/${student.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer p-6">
        <div className="flex items-start space-x-4">
          {/* Student Photo */}
          <div className="flex-shrink-0">
            {student.photo_url ? (
              <img
                src={student.photo_url}
                alt={student.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* Student Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {student.name}
                </h3>
                <p className="text-sm text-gray-600">{student.enrollment_number}</p>
              </div>
              <Badge className={statusColors[student.status]}>
                {student.status}
              </Badge>
            </div>

            <div className="mt-3 space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <GraduationCap className="w-4 h-4 mr-2" />
                <span>{student.department_name} - Year {student.year}</span>
              </div>
              
              {student.email && (
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="truncate">{student.email}</span>
                </div>
              )}
              
              {student.phone && (
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{student.phone}</span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="mt-4 flex items-center space-x-4 text-sm">
              {student.gpa !== undefined && (
                <div>
                  <span className="text-gray-500">GPA:</span>
                  <span className="ml-1 font-semibold text-gray-900">
                    {student.gpa.toFixed(2)}
                  </span>
                </div>
              )}
              {student.attendance_percentage !== undefined && (
                <div>
                  <span className="text-gray-500">Attendance:</span>
                  <span className={`ml-1 font-semibold ${
                    student.attendance_percentage >= 75 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {student.attendance_percentage.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}

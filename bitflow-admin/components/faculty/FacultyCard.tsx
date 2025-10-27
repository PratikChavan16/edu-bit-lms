'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Faculty } from '@/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Mail, Phone, GraduationCap, Briefcase, BookOpen } from 'lucide-react'

interface FacultyCardProps {
  faculty: Faculty
}

const statusColors = {
  active: 'bg-green-100 text-green-800',
  on_leave: 'bg-yellow-100 text-yellow-800',
  inactive: 'bg-gray-100 text-gray-800',
}

const designationColors = {
  'Professor': 'bg-purple-100 text-purple-800',
  'Associate Professor': 'bg-blue-100 text-blue-800',
  'Assistant Professor': 'bg-green-100 text-green-800',
  'Lecturer': 'bg-gray-100 text-gray-800',
}

export function FacultyCard({ faculty }: FacultyCardProps) {
  const pathname = usePathname()

  return (
    <Link href={`${pathname}/${faculty.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer p-6">
        <div className="flex items-start space-x-4">
          {/* Faculty Photo */}
          <div className="flex-shrink-0">
            {faculty.photo_url ? (
              <img
                src={faculty.photo_url}
                alt={faculty.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-blue-600" />
              </div>
            )}
          </div>

          {/* Faculty Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {faculty.name}
                </h3>
                <p className="text-sm text-gray-600">{faculty.employee_id}</p>
              </div>
              <Badge className={statusColors[faculty.status]}>
                {faculty.status.replace('_', ' ')}
              </Badge>
            </div>

            <div className="mt-3 space-y-2">
              <Badge className={designationColors[faculty.designation]}>
                {faculty.designation}
              </Badge>
              
              <div className="flex items-center text-sm text-gray-600">
                <GraduationCap className="w-4 h-4 mr-2" />
                <span>{faculty.department_name}</span>
              </div>
              
              {faculty.specialization && (
                <div className="flex items-center text-sm text-gray-600">
                  <Briefcase className="w-4 h-4 mr-2" />
                  <span className="truncate">{faculty.specialization}</span>
                </div>
              )}
              
              {faculty.email && (
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="truncate">{faculty.email}</span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="mt-4 flex items-center space-x-4 text-sm">
              <div>
                <span className="text-gray-500">Experience:</span>
                <span className="ml-1 font-semibold text-gray-900">
                  {faculty.experience_years} years
                </span>
              </div>
              <div>
                <span className="text-gray-500">Courses:</span>
                <span className="ml-1 font-semibold text-blue-600">
                  {faculty.courses_assigned}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}

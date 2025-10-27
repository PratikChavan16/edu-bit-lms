'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useUniversity } from '@/contexts/UniversityContext'
import { useCollege } from '@/contexts/CollegeContext'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, Mail, Phone, GraduationCap, Briefcase, 
  BookOpen, Award, Edit, Ban 
} from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import { FacultyProfile } from '@/types'

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

export default function FacultyProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { university } = useUniversity()
  const { college } = useCollege()
  
  const [faculty, setFaculty] = useState<FacultyProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!university || !college) return

    const fetchFaculty = async () => {
      try {
        setIsLoading(true)
        const response = await apiClient.get<FacultyProfile>(
          `/admin/universities/${university.id}/colleges/${college.id}/academic-staff/${params.staffId}`
        )
        setFaculty(response)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch faculty')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFaculty()
  }, [university, college, params.staffId])

  if (!university || !college) {
    return <div>Loading...</div>
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="p-6 animate-pulse">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (error || !faculty) {
    return (
      <Card className="p-6">
        <p className="text-red-600">{error || 'Faculty not found'}</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="outline"
        onClick={() => router.back()}
        className="flex items-center space-x-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Academic Staff</span>
      </Button>

      {/* Faculty Header */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start space-x-6">
            {/* Photo */}
            {faculty.photo_url ? (
              <img
                src={faculty.photo_url}
                alt={faculty.name}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                <GraduationCap className="w-12 h-12 text-blue-600" />
              </div>
            )}

            {/* Info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold text-gray-900">{faculty.name}</h1>
                <Badge className={statusColors[faculty.status]}>
                  {faculty.status.replace('_', ' ')}
                </Badge>
              </div>
              <Badge className={designationColors[faculty.designation]}>
                {faculty.designation}
              </Badge>
              <p className="text-lg text-gray-600">{faculty.employee_id}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mt-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>{faculty.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  <span>{faculty.department_name}</span>
                </div>
                {faculty.specialization && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Briefcase className="w-4 h-4 mr-2" />
                    <span>{faculty.specialization}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="flex items-center space-x-2">
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Assign Courses</span>
            </Button>
            <Button variant="destructive" className="flex items-center space-x-2">
              <Ban className="w-4 h-4" />
              <span>Deactivate</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="text-sm text-gray-600">Experience</div>
          <div className="text-3xl font-bold text-gray-900">
            {faculty.experience_years} years
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-gray-600">Courses Assigned</div>
          <div className="text-3xl font-bold text-blue-600">
            {faculty.courses_assigned}
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-gray-600">Publications</div>
          <div className="text-3xl font-bold text-gray-900">
            {faculty.publications?.length || 0}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Qualifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>Qualifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {faculty.qualifications && faculty.qualifications.length > 0 ? (
              <ul className="space-y-2">
                {faculty.qualifications.map((qual, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span className="text-gray-700">{qual}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No qualifications added</p>
            )}
          </CardContent>
        </Card>

        {/* Assigned Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>Assigned Courses</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {faculty.courses && faculty.courses.length > 0 ? (
              <div className="space-y-3">
                {faculty.courses.map((course) => (
                  <div key={course.id} className="p-3 border rounded-lg">
                    <div className="font-medium text-gray-900">{course.name}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {course.code} • {course.credits} Credits • Semester {course.semester}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No courses assigned</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Publications */}
      {faculty.publications && faculty.publications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Publications & Research</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {faculty.publications.map((pub: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-gray-900">{pub.title || `Publication ${index + 1}`}</h4>
                  {pub.year && (
                    <p className="text-sm text-gray-600 mt-1">Year: {pub.year}</p>
                  )}
                  {pub.journal && (
                    <p className="text-sm text-gray-600">Journal: {pub.journal}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

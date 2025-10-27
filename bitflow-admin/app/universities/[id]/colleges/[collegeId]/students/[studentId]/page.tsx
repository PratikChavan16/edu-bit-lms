'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useUniversity } from '@/contexts/UniversityContext'
import { useCollege } from '@/contexts/CollegeContext'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, Mail, Phone, GraduationCap, Calendar, 
  MapPin, Droplet, Edit, Ban, Award, FileText, User 
} from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import { StudentProfile } from '@/types'

const tabs = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'academic', label: 'Academic', icon: GraduationCap },
  { id: 'attendance', label: 'Attendance', icon: Calendar },
  { id: 'fees', label: 'Fees', icon: FileText },
  { id: 'documents', label: 'Documents', icon: FileText },
]

const statusColors = {
  active: 'bg-green-100 text-green-800',
  suspended: 'bg-red-100 text-red-800',
  graduated: 'bg-blue-100 text-blue-800',
  dropped: 'bg-gray-100 text-gray-800',
}

export default function StudentProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { university } = useUniversity()
  const { college } = useCollege()
  
  const [student, setStudent] = useState<StudentProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (!university || !college) return

    const fetchStudent = async () => {
      try {
        setIsLoading(true)
        const response = await apiClient.get<StudentProfile>(
          `/admin/universities/${university.id}/colleges/${college.id}/students/${params.studentId}`
        )
        setStudent(response)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch student')
      } finally {
        setIsLoading(false)
      }
    }

    fetchStudent()
  }, [university, college, params.studentId])

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

  if (error || !student) {
    return (
      <Card className="p-6">
        <p className="text-red-600">{error || 'Student not found'}</p>
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
        <span>Back to Students</span>
      </Button>

      {/* Student Header */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start space-x-6">
            {/* Photo */}
            {student.photo_url ? (
              <img
                src={student.photo_url}
                alt={student.name}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                <GraduationCap className="w-12 h-12 text-gray-400" />
              </div>
            )}

            {/* Info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold text-gray-900">{student.name}</h1>
                <Badge className={statusColors[student.status]}>
                  {student.status}
                </Badge>
              </div>
              <p className="text-lg text-gray-600">{student.enrollment_number}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mt-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>{student.email}</span>
                </div>
                {student.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>{student.phone}</span>
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-600">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  <span>{student.department_name} - Year {student.year}</span>
                </div>
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
              <Award className="w-4 h-4" />
              <span>Generate ID</span>
            </Button>
            <Button variant="destructive" className="flex items-center space-x-2">
              <Ban className="w-4 h-4" />
              <span>Suspend</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="text-sm text-gray-600">GPA</div>
          <div className="text-3xl font-bold text-gray-900">
            {student.gpa?.toFixed(2) || 'N/A'}
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-gray-600">Attendance</div>
          <div className={`text-3xl font-bold ${
            (student.attendance_percentage || 0) >= 75 ? 'text-green-600' : 'text-red-600'
          }`}>
            {student.attendance_percentage?.toFixed(1) || '0'}%
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-gray-600">Pending Fees</div>
          <div className="text-3xl font-bold text-gray-900">
            ₹{student.fees_info.pending_amount.toLocaleString()}
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-gray-600">Current Semester</div>
          <div className="text-3xl font-bold text-gray-900">
            {student.academic_info.current_semester}
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && <OverviewTab student={student} />}
        {activeTab === 'academic' && <AcademicTab student={student} />}
        {activeTab === 'attendance' && <AttendanceTab student={student} />}
        {activeTab === 'fees' && <FeesTab student={student} />}
        {activeTab === 'documents' && <DocumentsTab student={student} />}
      </div>
    </div>
  )
}

// Overview Tab Component
function OverviewTab({ student }: { student: StudentProfile }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <InfoRow label="Date of Birth" value={student.personal_info.date_of_birth} icon={Calendar} />
          <InfoRow label="Gender" value={student.personal_info.gender} icon={User} />
          {student.personal_info.blood_group && (
            <InfoRow label="Blood Group" value={student.personal_info.blood_group} icon={Droplet} />
          )}
          {student.personal_info.address && (
            <InfoRow label="Address" value={student.personal_info.address} icon={MapPin} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Academic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <InfoRow label="Admission Date" value={student.academic_info.admission_date} icon={Calendar} />
          <InfoRow label="Program" value={student.academic_info.program} icon={GraduationCap} />
          <InfoRow label="Current Semester" value={String(student.academic_info.current_semester)} icon={GraduationCap} />
        </CardContent>
      </Card>
    </div>
  )
}

// Academic Tab Component
function AcademicTab({ student }: { student: StudentProfile }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Enrolled Courses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {student.academic_info.enrolled_courses.map((course) => (
            <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-semibold">{course.name}</h4>
                <p className="text-sm text-gray-600">
                  {course.code} • {course.credits} Credits • Semester {course.semester}
                </p>
                {course.faculty_name && (
                  <p className="text-sm text-gray-500 mt-1">Faculty: {course.faculty_name}</p>
                )}
              </div>
            </div>
          ))}
          {student.academic_info.enrolled_courses.length === 0 && (
            <p className="text-gray-500 text-center py-8">No courses enrolled</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Attendance Tab Component
function AttendanceTab({ student }: { student: StudentProfile }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Attendance details coming soon</p>
          <p className="text-2xl font-bold mt-4">
            Current: {student.attendance_percentage?.toFixed(1) || '0'}%
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// Fees Tab Component
function FeesTab({ student }: { student: StudentProfile }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="text-sm text-gray-600">Total Fees</div>
          <div className="text-2xl font-bold text-gray-900">
            ₹{student.fees_info.total_fees.toLocaleString()}
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-gray-600">Paid Amount</div>
          <div className="text-2xl font-bold text-green-600">
            ₹{student.fees_info.paid_amount.toLocaleString()}
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-gray-600">Pending Amount</div>
          <div className="text-2xl font-bold text-red-600">
            ₹{student.fees_info.pending_amount.toLocaleString()}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-600">
            {student.fees_info.last_payment_date ? (
              <p>Last payment: {student.fees_info.last_payment_date}</p>
            ) : (
              <p>No payment history available</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Documents Tab Component
function DocumentsTab({ student }: { student: StudentProfile }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No documents uploaded yet</p>
          <Button className="mt-4">Upload Document</Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Info Row Component
function InfoRow({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="flex items-start space-x-3">
      <Icon className="w-5 h-5 text-gray-400 mt-0.5" />
      <div>
        <div className="text-sm text-gray-600">{label}</div>
        <div className="text-base text-gray-900 capitalize">{value}</div>
      </div>
    </div>
  )
}

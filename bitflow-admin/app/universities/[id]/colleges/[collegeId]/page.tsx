'use client';

import { useCollege } from '@/contexts/CollegeContext';
import { useUniversity } from '@/contexts/UniversityContext';
import Breadcrumb from '@/components/Breadcrumb';
import Link from 'next/link';
import { use } from 'react';
import {
  Building2,
  Users,
  BookOpen,
  GraduationCap,
  UserCog,
  Wrench,
  Bus,
  Home as HomeIcon,
  BookMarked,
  Settings,
  AlertCircle,
  ClipboardList
} from 'lucide-react';

export default function CollegeHubPage({ params }: { params: Promise<{ id: string; collegeId: string }> }) {
  const { id, collegeId } = use(params);
  const { university } = useUniversity();
  const { college, loading, error } = useCollege();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !college) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error Loading College</h2>
          <p className="text-gray-600 dark:text-gray-400">{error || 'College not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Breadcrumb
        items={[
          { label: 'Universities', href: '/universities' },
          { label: university?.name || 'University', href: `/universities/${id}` },
          { label: 'Colleges', href: `/universities/${id}/colleges` },
          { label: college.name, current: true },
        ]}
      />

      {/* College Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{college.name}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Code: {college.code} • Type: {college.type}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {college.email} • {college.phone}
            </p>
            <div className="flex items-center space-x-3 mt-3">
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  college.status === 'active'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}
              >
                {college.status.toUpperCase()}
              </span>
              {college.accreditation && (
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {college.accreditation}
                </span>
              )}
              <span className="text-sm text-gray-500">Est. {college.established_year}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Departments</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {college.stats?.departments_count || 0}
              </p>
            </div>
            <Building2 className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Students</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {(college.stats?.students_count || 0).toLocaleString()}
              </p>
            </div>
            <GraduationCap className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Faculty</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {college.stats?.faculty_count || 0}
              </p>
            </div>
            <Users className="w-12 h-12 text-purple-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Courses</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {college.stats?.courses_count || 0}
              </p>
            </div>
            <BookOpen className="w-12 h-12 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Sections - Everything from 13 Portals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href={`/universities/${id}/colleges/${collegeId}/leadership`}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <Users className="w-12 h-12 text-blue-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Leadership</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Principal, College Admin, and leadership team management
          </p>
          <span className="text-blue-600 dark:text-blue-400 font-semibold">View Team →</span>
        </Link>

        <Link
          href={`/universities/${id}/colleges/${collegeId}/departments`}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <Building2 className="w-12 h-12 text-green-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Departments</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Manage {college.stats?.departments_count || 0} departments and HODs
          </p>
          <span className="text-green-600 dark:text-green-400 font-semibold">Manage →</span>
        </Link>

        <Link
          href={`/universities/${id}/colleges/${collegeId}/academic-staff`}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <GraduationCap className="w-12 h-12 text-purple-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Academic Staff</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Faculty, teachers, and {college.stats?.faculty_count || 0} academic staff
          </p>
          <span className="text-purple-600 dark:text-purple-400 font-semibold">View Staff →</span>
        </Link>

        <Link
          href={`/universities/${id}/colleges/${collegeId}/administrative-staff`}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <UserCog className="w-12 h-12 text-orange-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Administrative Staff</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Admission, Accounts, Fee collection admins
          </p>
          <span className="text-orange-600 dark:text-orange-400 font-semibold">Manage →</span>
        </Link>

        <Link
          href={`/universities/${id}/colleges/${collegeId}/non-teaching-staff`}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <Wrench className="w-12 h-12 text-red-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Non-Teaching Staff</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Lab assistants, peons, maintenance staff
          </p>
          <span className="text-red-600 dark:text-red-400 font-semibold">View Staff →</span>
        </Link>

        <Link
          href={`/universities/${id}/colleges/${collegeId}/students`}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <GraduationCap className="w-12 h-12 text-indigo-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Students</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            All {(college.stats?.students_count || 0).toLocaleString()} enrolled students
          </p>
          <span className="text-indigo-600 dark:text-indigo-400 font-semibold">View Students →</span>
        </Link>

        <Link
          href={`/universities/${id}/colleges/${collegeId}/curriculum`}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <BookOpen className="w-12 h-12 text-cyan-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Curriculum & Exams</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Courses, exam schedules, and academic calendar
          </p>
          <span className="text-cyan-600 dark:text-cyan-400 font-semibold">Manage →</span>
        </Link>

        <Link
          href={`/universities/${id}/colleges/${collegeId}/library`}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <BookMarked className="w-12 h-12 text-pink-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Library</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Books, issued items, and library management
          </p>
          <span className="text-pink-600 dark:text-pink-400 font-semibold">View Library →</span>
        </Link>

        <Link
          href={`/universities/${id}/colleges/${collegeId}/transport`}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <Bus className="w-12 h-12 text-yellow-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Transport</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Bus routes, vehicles, and transport management
          </p>
          <span className="text-yellow-600 dark:text-yellow-400 font-semibold">Manage →</span>
        </Link>

        <Link
          href={`/universities/${id}/colleges/${collegeId}/hostel`}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <HomeIcon className="w-12 h-12 text-teal-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Hostel</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Room allocation, hostel attendance, and facilities
          </p>
          <span className="text-teal-600 dark:text-teal-400 font-semibold">Manage →</span>
        </Link>

        <Link
          href={`/universities/${id}/colleges/${collegeId}/attendance`}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <ClipboardList className="w-12 h-12 text-lime-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Attendance</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Student and staff attendance tracking
          </p>
          <span className="text-lime-600 dark:text-lime-400 font-semibold">View Reports →</span>
        </Link>

        <Link
          href={`/universities/${id}/colleges/${collegeId}/settings`}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <Settings className="w-12 h-12 text-gray-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Settings</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            College-specific settings and configuration
          </p>
          <span className="text-gray-600 dark:text-gray-400 font-semibold">Configure →</span>
        </Link>
      </div>
    </div>
  );
}

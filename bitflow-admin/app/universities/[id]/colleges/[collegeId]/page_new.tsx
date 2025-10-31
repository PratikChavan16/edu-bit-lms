'use client';

import { useCollege } from '@/contexts/CollegeContext';
import { useUniversity } from '@/contexts/UniversityContext';
import Breadcrumb from '@/components/Breadcrumb';
import Link from 'next/link';
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
  ClipboardList,
  Shield,
  ArrowRight,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  DollarSign,
  Library,
  UserCheck
} from 'lucide-react';

interface SectionCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo' | 'pink' | 'yellow' | 'teal' | 'cyan' | 'emerald' | 'violet' | 'rose';
  stat?: string | number;
  badge?: string;
}

function SectionCard({ title, description, href, icon, color, stat, badge }: SectionCardProps) {
  const colorClasses = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    purple: 'text-purple-600 dark:text-purple-400',
    orange: 'text-orange-600 dark:text-orange-400',
    red: 'text-red-600 dark:text-red-400',
    indigo: 'text-indigo-600 dark:text-indigo-400',
    pink: 'text-pink-600 dark:text-pink-400',
    yellow: 'text-yellow-600 dark:text-yellow-400',
    teal: 'text-teal-600 dark:text-teal-400',
    cyan: 'text-cyan-600 dark:text-cyan-400',
    emerald: 'text-emerald-600 dark:text-emerald-400',
    violet: 'text-violet-600 dark:text-violet-400',
    rose: 'text-rose-600 dark:text-rose-400',
  };

  const bgColorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20',
    green: 'bg-green-50 dark:bg-green-900/20',
    purple: 'bg-purple-50 dark:bg-purple-900/20',
    orange: 'bg-orange-50 dark:bg-orange-900/20',
    red: 'bg-red-50 dark:bg-red-900/20',
    indigo: 'bg-indigo-50 dark:bg-indigo-900/20',
    pink: 'bg-pink-50 dark:bg-pink-900/20',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20',
    teal: 'bg-teal-50 dark:bg-teal-900/20',
    cyan: 'bg-cyan-50 dark:bg-cyan-900/20',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/20',
    violet: 'bg-violet-50 dark:bg-violet-900/20',
    rose: 'bg-rose-50 dark:bg-rose-900/20',
  };

  return (
    <Link
      href={href}
      className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-lg ${bgColorClasses[color]}`}>
          <div className={colorClasses[color]}>
            {icon}
          </div>
        </div>
        {stat && (
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            {stat}
          </span>
        )}
        {badge && (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {badge}
          </span>
        )}
      </div>
      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {title}
      </h3>
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
        {description}
      </p>
      <div className="flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400">
        Manage
        <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}

export default function CollegeHubPage({ params }: { params: { id: string; collegeId: string } }) {
  const { university } = useUniversity();
  const { college, loading, error } = useCollege();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading college data...</p>
        </div>
      </div>
    );
  }

  if (error || !college) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error Loading College</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error || 'College not found'}</p>
          <Link
            href={`/universities/${params.id}/colleges`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Colleges
          </Link>
        </div>
      </div>
    );
  }

  const sections = [
    {
      title: 'Leadership',
      description: 'Principal, College Admin, and other college leadership roles',
      href: `/universities/${params.id}/colleges/${params.collegeId}/leadership`,
      icon: <UserCheck className="w-5 h-5" />,
      color: 'indigo' as const,
    },
    {
      title: 'Departments',
      description: 'Academic departments and their structure',
      href: `/universities/${params.id}/colleges/${params.collegeId}/departments`,
      icon: <Building2 className="w-5 h-5" />,
      color: 'blue' as const,
      stat: college.stats.departments_count,
    },
    {
      title: 'Academic Staff',
      description: 'Faculty members and teaching staff',
      href: `/universities/${params.id}/colleges/${params.collegeId}/academic-staff`,
      icon: <GraduationCap className="w-5 h-5" />,
      color: 'purple' as const,
      stat: college.stats.faculty_count,
    },
    {
      title: 'Administrative Staff',
      description: 'Admission, Accounts, and Fee administration staff',
      href: `/universities/${params.id}/colleges/${params.collegeId}/administrative-staff`,
      icon: <UserCog className="w-5 h-5" />,
      color: 'cyan' as const,
    },
    {
      title: 'Non-Teaching Staff',
      description: 'Support staff, lab assistants, and maintenance personnel',
      href: `/universities/${params.id}/colleges/${params.collegeId}/non-teaching-staff`,
      icon: <Wrench className="w-5 h-5" />,
      color: 'orange' as const,
    },
    {
      title: 'Students',
      description: 'All enrolled students and their academic records',
      href: `/universities/${params.id}/colleges/${params.collegeId}/students`,
      icon: <Users className="w-5 h-5" />,
      color: 'green' as const,
      stat: college.stats.students_count,
    },
    {
      title: 'Curriculum & Courses',
      description: 'Course catalog, syllabi, and academic programs',
      href: `/universities/${params.id}/colleges/${params.collegeId}/curriculum`,
      icon: <BookOpen className="w-5 h-5" />,
      color: 'teal' as const,
    },
    {
      title: 'Examinations',
      description: 'Exam schedules, results, and assessment management',
      href: `/universities/${params.id}/colleges/${params.collegeId}/examinations`,
      icon: <ClipboardList className="w-5 h-5" />,
      color: 'rose' as const,
    },
    {
      title: 'Library Management',
      description: 'Library resources, books, and digital materials',
      href: `/universities/${params.id}/colleges/${params.collegeId}/library`,
      icon: <Library className="w-5 h-5" />,
      color: 'violet' as const,
    },
    {
      title: 'Transport Management',
      description: 'Bus routes, schedules, and transportation services',
      href: `/universities/${params.id}/colleges/${params.collegeId}/transport`,
      icon: <Bus className="w-5 h-5" />,
      color: 'yellow' as const,
    },
    {
      title: 'Hostel Management',
      description: 'Hostel rooms, allocations, and residential facilities',
      href: `/universities/${params.id}/colleges/${params.collegeId}/hostel`,
      icon: <HomeIcon className="w-5 h-5" />,
      color: 'emerald' as const,
    },
    {
      title: 'Fee Management',
      description: 'Fee structure, payments, and financial records',
      href: `/universities/${params.id}/colleges/${params.collegeId}/fees`,
      icon: <DollarSign className="w-5 h-5" />,
      color: 'red' as const,
    },
    {
      title: 'College Settings',
      description: 'College configuration, preferences, and general settings',
      href: `/universities/${params.id}/colleges/${params.collegeId}/settings`,
      icon: <Settings className="w-5 h-5" />,
      color: 'pink' as const,
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Dashboard', href: '/' },
          { label: 'Universities', href: '/universities' },
          { label: university?.name || 'University', href: `/universities/${params.id}` },
          { label: 'Colleges', href: `/universities/${params.id}/colleges` },
          { label: college.name, current: true },
        ]}
      />

      {/* God Mode Indicator */}
      <div className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          <div>
            <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-200">
              God Mode Active - College-Level Access
            </p>
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              You have full access to {college.name}. All actions are audited.
            </p>
          </div>
        </div>
      </div>

      {/* College Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{college.name}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Code: <span className="font-semibold">{college.code}</span> • Type: <span className="font-semibold">{college.type}</span>
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-2">
                {college.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {college.email}
                  </div>
                )}
                {college.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {college.phone}
                  </div>
                )}
              </div>
              {college.address && (
                <div className="flex items-center gap-1 mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  {college.address}
                </div>
              )}
              <div className="flex items-center gap-3 mt-3">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    college.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}
                >
                  {college.status.toUpperCase()}
                </span>
                {college.accreditation && (
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    {college.accreditation}
                  </span>
                )}
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Est. {college.established_year}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Departments</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {college.stats.departments_count}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Academic divisions
              </p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Building2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Students</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {college.stats.students_count.toLocaleString()}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Enrolled learners
              </p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Faculty</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {college.stats.faculty_count}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Teaching staff
              </p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <GraduationCap className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Courses</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {college.stats.courses_count}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Academic programs
              </p>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <BookOpen className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* College Sections - 13 Cards */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">College Management Sections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sections.map((section, index) => (
            <SectionCard key={index} {...section} />
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <BookMarked className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No recent activity</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Important Links</h3>
          <div className="space-y-3">
            <Link
              href={`/universities/${params.id}/colleges/${params.collegeId}/audit-logs`}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <span className="text-sm font-medium text-gray-900 dark:text-white">Audit Logs</span>
              <ArrowRight className="w-4 h-4 text-gray-500" />
            </Link>
            <Link
              href={`/universities/${params.id}/colleges/${params.collegeId}/reports`}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <span className="text-sm font-medium text-gray-900 dark:text-white">Reports & Analytics</span>
              <ArrowRight className="w-4 h-4 text-gray-500" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

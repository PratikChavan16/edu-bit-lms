'use client';

import { useUniversity } from '@/contexts/UniversityContext';
import Breadcrumb from '@/components/Breadcrumb';
import Link from 'next/link';
import { use } from 'react';
import { 
  Building2, 
  Users, 
  GraduationCap, 
  UserCog, 
  Settings, 
  AlertCircle,
  ArrowRight,
  MapPin,
  Globe,
  Mail,
  Phone,
  Calendar,
  Database,
  Activity
} from 'lucide-react';

export default function UniversityHubPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { university, loading, error } = useUniversity();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !university) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Error Loading University
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{error || 'University not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Breadcrumb
        items={[
          { label: 'Universities', href: '/universities' },
          { label: university.name, current: true },
        ]}
      />

      {/* University Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            {university.logo_url ? (
              <img
                src={university.logo_url}
                alt={university.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Building2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {university.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {university.email} • {university.phone}
              </p>
              <div className="flex items-center space-x-3 mt-2">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    university.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}
                >
                  {university.status.toUpperCase()}
                </span>
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  {university.subscription_tier}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Colleges</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {university.stats?.colleges_count || 0}
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
                {(university.stats?.students_count || 0).toLocaleString()}
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
                {university.stats?.faculty_count || 0}
              </p>
            </div>
            <Users className="w-12 h-12 text-purple-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Staff</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {university.stats?.staff_count || 0}
              </p>
            </div>
            <UserCog className="w-12 h-12 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href={`/universities/${id}/management`}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <Users className="w-12 h-12 text-blue-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Management Team
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            View and manage university owners, super admins, and leadership roles
          </p>
          <span className="text-blue-600 dark:text-blue-400 font-semibold">
            View Team →
          </span>
        </Link>

        <Link
          href={`/universities/${id}/colleges`}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <Building2 className="w-12 h-12 text-green-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Colleges
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Browse all {university.stats?.colleges_count || 0} colleges and manage their structure
          </p>
          <span className="text-green-600 dark:text-green-400 font-semibold">
            Browse Colleges →
          </span>
        </Link>

        <Link
          href={`/universities/${id}/settings`}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <Settings className="w-12 h-12 text-purple-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Settings
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Configure university-level settings, subscription, and preferences
          </p>
          <span className="text-purple-600 dark:text-purple-400 font-semibold">
            Manage Settings →
          </span>
        </Link>
      </div>
    </div>
  );
}


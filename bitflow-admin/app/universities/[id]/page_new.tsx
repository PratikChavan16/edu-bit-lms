'use client';

import { useUniversity } from '@/contexts/UniversityContext';
import Breadcrumb from '@/components/Breadcrumb';
import Link from 'next/link';
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
  Activity,
  Shield,
  TrendingUp
} from 'lucide-react';

interface NavigationCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo';
  stat?: string | number;
}

function NavigationCard({ title, description, href, icon, color, stat }: NavigationCardProps) {
  const colorClasses = {
    blue: 'text-blue-600 dark:text-blue-400 group-hover:text-blue-700',
    green: 'text-green-600 dark:text-green-400 group-hover:text-green-700',
    purple: 'text-purple-600 dark:text-purple-400 group-hover:text-purple-700',
    orange: 'text-orange-600 dark:text-orange-400 group-hover:text-orange-700',
    red: 'text-red-600 dark:text-red-400 group-hover:text-red-700',
    indigo: 'text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700',
  };

  const bgColorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20',
    green: 'bg-green-50 dark:bg-green-900/20',
    purple: 'bg-purple-50 dark:bg-purple-900/20',
    orange: 'bg-orange-50 dark:bg-orange-900/20',
    red: 'bg-red-50 dark:bg-red-900/20',
    indigo: 'bg-indigo-50 dark:bg-indigo-900/20',
  };

  return (
    <Link
      href={href}
      className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${bgColorClasses[color]}`}>
          <div className={colorClasses[color]}>
            {icon}
          </div>
        </div>
        {stat && (
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {stat}
          </span>
        )}
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
        {description}
      </p>
      <div className="flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400">
        View Details
        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}

export default function UniversityHubPage({ params }: { params: { id: string } }) {
  const { university, loading, error } = useUniversity();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading university data...</p>
        </div>
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
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error || 'University not found'}</p>
          <Link
            href="/universities"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Universities
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Dashboard', href: '/' },
          { label: 'Universities', href: '/universities' },
          { label: university.name, current: true },
        ]}
      />

      {/* God Mode Indicator */}
      <div className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          <div>
            <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-200">
              God Mode Active - Cross-Tenant Access
            </p>
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              You have full access to this university's data. All actions are logged for audit purposes.
            </p>
          </div>
        </div>
      </div>

      {/* University Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            {university.logo_url ? (
              <img
                src={university.logo_url}
                alt={university.name}
                className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200 dark:border-gray-700"
              />
            ) : (
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <Building2 className="w-10 h-10 text-white" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {university.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                {university.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {university.email}
                  </div>
                )}
                {university.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {university.phone}
                  </div>
                )}
                {university.website && (
                  <a 
                    href={university.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    {university.website}
                  </a>
                )}
              </div>
              {university.address && (
                <div className="flex items-center gap-1 mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  {university.address}
                </div>
              )}
              <div className="flex items-center gap-3 mt-3">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    university.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : university.status === 'suspended'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }`}
                >
                  {university.status.toUpperCase()}
                </span>
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  {university.subscription_tier.toUpperCase()}
                </span>
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {university.subscription_status}
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Colleges</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {university.stats.colleges_count}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Active institutions
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Students</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {university.stats.students_count.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Enrolled learners
              </p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <GraduationCap className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Faculty Members</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {university.stats.faculty_count}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Teaching staff
              </p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Support Staff</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {university.stats.staff_count}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Administrative & support
              </p>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <UserCog className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NavigationCard
            title="Management Team"
            description="View and manage university owners, super admins, and leadership roles"
            href={`/universities/${params.id}/management`}
            icon={<Users className="w-6 h-6" />}
            color="blue"
          />

          <NavigationCard
            title="All Colleges"
            description={`Browse and manage all ${university.stats.colleges_count} colleges under this university`}
            href={`/universities/${params.id}/colleges`}
            icon={<Building2 className="w-6 h-6" />}
            color="green"
            stat={university.stats.colleges_count}
          />

          <NavigationCard
            title="University Settings"
            description="Configure subscription, billing, domain settings, and general preferences"
            href={`/universities/${params.id}/settings`}
            icon={<Settings className="w-6 h-6" />}
            color="purple"
          />

          <NavigationCard
            title="Activity & Audit Logs"
            description="View all God Mode actions and system activity logs for compliance"
            href={`/universities/${params.id}/audit-logs`}
            icon={<Activity className="w-6 h-6" />}
            color="indigo"
          />

          <NavigationCard
            title="Storage & Database"
            description="Monitor storage usage, database performance, and resource allocation"
            href={`/universities/${params.id}/storage`}
            icon={<Database className="w-6 h-6" />}
            color="orange"
          />

          <NavigationCard
            title="Analytics & Reports"
            description="Access detailed analytics, performance metrics, and generate reports"
            href={`/universities/${params.id}/analytics`}
            icon={<TrendingUp className="w-6 h-6" />}
            color="red"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h3>
          <Link 
            href={`/universities/${params.id}/audit-logs`}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            View All
          </Link>
        </div>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No recent activity to display</p>
        </div>
      </div>
    </div>
  );
}

'use client';

import { use } from 'react';
import { useCollege } from '@/contexts/CollegeContext';
import { useUniversity } from '@/contexts/UniversityContext';
import Breadcrumb from '@/components/Breadcrumb';
import { AlertCircle, Settings } from 'lucide-react';

export default function SettingsPage({ params }: { params: Promise<{ id: string; collegeId: string }> }) {
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
          { label: college.name, href: `/universities/${id}/colleges/${collegeId}` },
          { label: 'Settings', current: true },
        ]}
      />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Settings className="w-10 h-10 text-gray-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">College Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">
              College-specific settings and configuration for {college.name}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
          <Settings className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Settings & Configuration - Coming Soon
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            This section will allow you to configure college settings including:
          </p>
          <ul className="mt-4 text-left max-w-md mx-auto space-y-2 text-gray-700 dark:text-gray-300">
            <li>• Basic Information and Contact Details</li>
            <li>• Academic Year and Semester Configuration</li>
            <li>• Fee Structure and Payment Settings</li>
            <li>• Email and Notification Templates</li>
            <li>• Access Control and Permissions</li>
            <li>• Integration Settings</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

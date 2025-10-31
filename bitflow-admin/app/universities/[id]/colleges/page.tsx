'use client';

import { useUniversity } from '@/contexts/UniversityContext';
import { useState, useEffect, use } from 'react';
import { apiClient } from '@/lib/api-client';
import Breadcrumb from '@/components/Breadcrumb';
import Link from 'next/link';
import { 
  Building2, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  AlertCircle,
  MapPin,
  Users,
  GraduationCap
} from 'lucide-react';
import type { ApiResponse } from '@/types';

interface College {
  id: string;
  university_id: string;
  name: string;
  code: string;
  type: string;
  email: string;
  phone: string;
  address: string;
  established_year: number;
  accreditation?: string;
  status: 'active' | 'inactive';
  stats?: {
    departments_count: number;
    students_count: number;
    faculty_count: number;
    courses_count: number;
  };
}

export default function CollegesListPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { university, loading: universityLoading } = useUniversity();
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🔍 FETCHING COLLEGES');
        console.log('  University ID:', id);
        console.log('  Request URL: /colleges');
        console.log('  Query Params:', { university_id: id });
        
        // Fetch colleges filtered by university_id
        const response = await apiClient.get<ApiResponse<College[]>>('/colleges', {
          university_id: id
        });
        
        console.log('✅ COLLEGES API RESPONSE:');
        console.log('  Total colleges returned:', response.data?.length || 0);
        console.log('  Colleges:', response.data?.map((c: College) => ({ 
          name: c.name, 
          university_id: c.university_id 
        })));
        
        setColleges(response.data);
      } catch (err) {
        console.error('❌ ERROR FETCHING COLLEGES:', err);
        setError(err instanceof Error ? err.message : 'Failed to load colleges');
        console.error('Error fetching colleges:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchColleges();
    }
  }, [id]);

  const filteredColleges = colleges.filter(college =>
    college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    college.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (universityLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Colleges</h2>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
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
          { label: 'Colleges', current: true },
        ]}
      />

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Colleges</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage colleges under {university?.name}
            </p>
          </div>
          <Link
            href={`/universities/${id}/colleges/create`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add College
          </Link>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search colleges by name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      {/* Colleges Grid */}
      {filteredColleges.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {searchQuery ? 'No colleges found' : 'No colleges yet'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchQuery 
              ? 'Try adjusting your search query' 
              : 'Get started by creating your first college'}
          </p>
          {!searchQuery && (
            <Link
              href={`/universities/${id}/colleges/create`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add College
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredColleges.map((college) => (
            <Link
              key={college.id}
              href={`/universities/${id}/colleges/${college.id}`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {college.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Code: {college.code}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    college.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}
                >
                  {college.status.toUpperCase()}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="truncate">{college.address}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Building2 className="w-4 h-4 mr-2" />
                  <span>{college.type}</span>
                </div>
              </div>

              {/* Stats */}
              {college.stats && (
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {college.stats.departments_count || 0}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Departments</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {college.stats.students_count || 0}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Students</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {college.stats.faculty_count || 0}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Faculty</p>
                  </div>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

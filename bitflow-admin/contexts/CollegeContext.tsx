'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types';

interface CollegeStats {
  departments_count: number;
  students_count: number;
  faculty_count: number;
  courses_count: number;
}

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
  stats?: CollegeStats;
}

interface CollegeContextType {
  college: College | null;
  loading: boolean;
  error: string | null;
  refreshCollege: () => Promise<void>;
}

const CollegeContext = createContext<CollegeContextType | undefined>(undefined);

interface CollegeProviderProps {
  universityId: string;
  collegeId: string;
  children: ReactNode;
}

export function CollegeProvider({ universityId, collegeId, children }: CollegeProviderProps) {
  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCollege = async () => {
    // Skip fetching if we're on the create page
    if (collegeId === 'create') {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get<ApiResponse<College>>(`/colleges/${collegeId}`);
      setCollege(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching college:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollege();
  }, [universityId, collegeId]);

  const refreshCollege = async () => {
    await fetchCollege();
  };

  return (
    <CollegeContext.Provider value={{ college, loading, error, refreshCollege }}>
      {children}
    </CollegeContext.Provider>
  );
}

export function useCollege() {
  const context = useContext(CollegeContext);
  if (context === undefined) {
    throw new Error('useCollege must be used within a CollegeProvider');
  }
  return context;
}

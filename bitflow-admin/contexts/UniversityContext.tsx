'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UniversityStats {
  colleges_count: number;
  students_count: number;
  faculty_count: number;
  staff_count: number;
}

interface University {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  logo_url?: string;
  website?: string;
  status: 'active' | 'inactive' | 'suspended';
  subscription_tier: string;
  subscription_status: string;
  stats: UniversityStats;
}

interface UniversityContextType {
  university: University | null;
  loading: boolean;
  error: string | null;
  refreshUniversity: () => Promise<void>;
}

const UniversityContext = createContext<UniversityContextType | undefined>(undefined);

interface UniversityProviderProps {
  universityId: string;
  children: ReactNode;
}

export function UniversityProvider({ universityId, children }: UniversityProviderProps) {
  const [university, setUniversity] = useState<University | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUniversity = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/universities/${universityId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch university');
      }

      const data = await response.json();
      setUniversity(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching university:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversity();
  }, [universityId]);

  const refreshUniversity = async () => {
    await fetchUniversity();
  };

  return (
    <UniversityContext.Provider value={{ university, loading, error, refreshUniversity }}>
      {children}
    </UniversityContext.Provider>
  );
}

export function useUniversity() {
  const context = useContext(UniversityContext);
  if (context === undefined) {
    throw new Error('useUniversity must be used within a UniversityProvider');
  }
  return context;
}

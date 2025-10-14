import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface University {
  id: string;
  name: string;
  slug: string;
  domain: string;
  status: 'live' | 'staging' | 'suspended';
}

interface TenantState {
  currentTenant: University | null;
  availableTenants: University[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setCurrentTenant: (tenant: University) => void;
  setAvailableTenants: (tenants: University[]) => void;
  fetchTenants: (token: string) => Promise<void>;
  clearTenant: () => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const useTenantStore = create<TenantState>()(
  persist(
    (set, get) => ({
      currentTenant: null,
      availableTenants: [],
      isLoading: false,
      error: null,

      setCurrentTenant: (tenant: University) => {
        set({ currentTenant: tenant, error: null });
      },

      setAvailableTenants: (tenants: University[]) => {
        set({ availableTenants: tenants });
      },

      fetchTenants: async (token: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${API_BASE_URL}/admin/universities`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch universities');
          }

          const result = await response.json();
          const universities = result.data || result;
          
          // Convert to University format
          const tenants: University[] = Array.isArray(universities) 
            ? universities.map((u: any) => ({
                id: u.id,
                name: u.name,
                slug: u.slug,
                domain: u.domain,
                status: u.status,
              }))
            : [];

          set({
            availableTenants: tenants,
            isLoading: false,
            error: null,
          });

          // Auto-select first tenant if none selected
          const currentTenant = get().currentTenant;
          if (!currentTenant && tenants.length > 0) {
            set({ currentTenant: tenants[0] });
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch tenants',
            isLoading: false,
          });
        }
      },

      clearTenant: () => {
        set({
          currentTenant: null,
          availableTenants: [],
          error: null,
        });
      },
    }),
    {
      name: 'tenant-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentTenant: state.currentTenant,
      }),
    }
  )
);

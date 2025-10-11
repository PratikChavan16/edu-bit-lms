import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { LibraryResource } from '../types';

// API Response Types
interface LibraryResourcesResponse {
  data: LibraryResource[];
  total: number;
  page: number;
  per_page: number;
}

interface LibraryBookmarksResponse {
  data: LibraryResource[];
  total: number;
}

// Hook: Get Library Resources
export function useLearnerLibrary(
  filters?: {
    subject?: string;
    type?: string;
    search?: string;
    page?: number;
  },
  options?: UseQueryOptions<LibraryResourcesResponse>
) {
  return useQuery<LibraryResourcesResponse>({
    queryKey: ['learner', 'library', 'resources', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.subject) params.append('subject', filters.subject);
      if (filters?.type) params.append('type', filters.type);
      if (filters?.search) params.append('search', filters.search);
      if (filters?.page) params.append('page', filters.page.toString());

      const response = await fetch(`/api/learner/library/resources?${params}`);
      if (!response.ok) throw new Error('Failed to fetch library resources');
      return response.json();
    },
    ...options,
  });
}

// Hook: Get Single Library Resource
export function useLearnerLibraryResource(
  resourceId: string,
  options?: UseQueryOptions<LibraryResource>
) {
  return useQuery<LibraryResource>({
    queryKey: ['learner', 'library', 'resource', resourceId],
    queryFn: async () => {
      const response = await fetch(`/api/learner/library/resources/${resourceId}`);
      if (!response.ok) throw new Error('Failed to fetch library resource');
      return response.json();
    },
    enabled: !!resourceId,
    ...options,
  });
}

// Hook: Get Bookmarked Resources
export function useLearnerBookmarks(
  options?: UseQueryOptions<LibraryBookmarksResponse>
) {
  return useQuery<LibraryBookmarksResponse>({
    queryKey: ['learner', 'library', 'bookmarks'],
    queryFn: async () => {
      const response = await fetch('/api/learner/library/bookmarks');
      if (!response.ok) throw new Error('Failed to fetch bookmarks');
      return response.json();
    },
    ...options,
  });
}

// Hook: Toggle Bookmark
export function useToggleBookmark(
  options?: UseMutationOptions<void, Error, string>
) {
  return useMutation<void, Error, string>({
    mutationFn: async (resourceId: string) => {
      const response = await fetch(`/api/learner/library/resources/${resourceId}/bookmark`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to toggle bookmark');
    },
    ...options,
  });
}

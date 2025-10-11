import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { StudentProfile } from '../types';

// Hook: Get Profile
export function useLearnerProfile(
  options?: UseQueryOptions<StudentProfile>
) {
  return useQuery<StudentProfile>({
    queryKey: ['learner', 'profile'],
    queryFn: async () => {
      const response = await fetch('/api/learner/profile');
      if (!response.ok) throw new Error('Failed to fetch profile');
      return response.json();
    },
    ...options,
  });
}

// Hook: Update Profile
export function useUpdateProfile(
  options?: UseMutationOptions<StudentProfile, Error, Partial<StudentProfile>>
) {
  return useMutation<StudentProfile, Error, Partial<StudentProfile>>({
    mutationFn: async (data) => {
      const response = await fetch('/api/learner/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update profile');
      return response.json();
    },
    ...options,
  });
}

// Hook: Upload Profile Picture
export function useUploadProfilePicture(
  options?: UseMutationOptions<{ profile_picture: string }, Error, File>
) {
  return useMutation<{ profile_picture: string }, Error, File>({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('picture', file);

      const response = await fetch('/api/learner/profile/picture', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to upload profile picture');
      return response.json();
    },
    ...options,
  });
}

// Hook: Change Password
export function useChangePassword(
  options?: UseMutationOptions<void, Error, { current_password: string; new_password: string }>
) {
  return useMutation<void, Error, { current_password: string; new_password: string }>({
    mutationFn: async (data) => {
      const response = await fetch('/api/learner/profile/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to change password');
    },
    ...options,
  });
}

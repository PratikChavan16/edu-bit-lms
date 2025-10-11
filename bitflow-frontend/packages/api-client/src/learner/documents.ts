import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { DocumentFolder, Document } from '../types';

// API Response Types
interface DocumentsResponse {
  folders: DocumentFolder[];
  recent_documents: Document[];
}

interface FolderDocumentsResponse {
  data: Document[];
  folder: DocumentFolder;
}

// Hook: Get Documents and Folders
export function useLearnerDocuments(
  options?: UseQueryOptions<DocumentsResponse>
) {
  return useQuery<DocumentsResponse>({
    queryKey: ['learner', 'documents'],
    queryFn: async () => {
      const response = await fetch('/api/learner/documents');
      if (!response.ok) throw new Error('Failed to fetch documents');
      return response.json();
    },
    ...options,
  });
}

// Hook: Get Folder Contents
export function useLearnerFolderDocuments(
  folderId: string,
  options?: UseQueryOptions<FolderDocumentsResponse>
) {
  return useQuery<FolderDocumentsResponse>({
    queryKey: ['learner', 'documents', 'folder', folderId],
    queryFn: async () => {
      const response = await fetch(`/api/learner/documents/folders/${folderId}`);
      if (!response.ok) throw new Error('Failed to fetch folder documents');
      return response.json();
    },
    enabled: !!folderId,
    ...options,
  });
}

// Hook: Upload Document
export function useUploadDocument(
  options?: UseMutationOptions<Document, Error, { folderId: string; file: File }>
) {
  return useMutation<Document, Error, { folderId: string; file: File }>({
    mutationFn: async ({ folderId, file }) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/learner/documents/folders/${folderId}/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to upload document');
      return response.json();
    },
    ...options,
  });
}

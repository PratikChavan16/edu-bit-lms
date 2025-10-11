'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Button } from './Button';
import { Spinner } from './Spinner';

// Types
export interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  maxFiles?: number;
  onFilesSelected?: (files: File[]) => void;
  onUpload?: (files: File[]) => Promise<void>;
  disabled?: boolean;
  className?: string;
  showPreview?: boolean;
  allowedTypes?: string[];
}

interface FileWithPreview {
  file: File;
  preview?: string;
  progress?: number;
  error?: string;
  id: string;
}

export function FileUpload({
  accept = '*',
  multiple = true,
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 10,
  onFilesSelected,
  onUpload,
  disabled = false,
  className = '',
  showPreview = true,
  allowedTypes,
}: FileUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Validate file
  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize) {
      return `File size exceeds ${formatFileSize(maxSize)}`;
    }

    // Check file type
    if (allowedTypes && allowedTypes.length > 0) {
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      const isAllowed = allowedTypes.some(type => {
        if (type.includes('*')) {
          const baseType = type.split('/')[0];
          return file.type.startsWith(baseType);
        }
        return file.type === type || fileExtension === type;
      });

      if (!isAllowed) {
        return `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`;
      }
    }

    return null;
  };

  // Generate preview URL for images
  const generatePreview = (file: File): string | undefined => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return undefined;
  };

  // Handle file selection
  const handleFiles = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles || disabled) return;

    const fileArray = Array.from(selectedFiles);
    const newFiles: FileWithPreview[] = [];

    // Check max files limit
    if (files.length + fileArray.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    fileArray.forEach((file) => {
      const error = validateFile(file);
      newFiles.push({
        file,
        preview: showPreview ? generatePreview(file) : undefined,
        id: Math.random().toString(36).substr(2, 9),
        error: error || undefined,
      });
    });

    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);

    if (onFilesSelected) {
      onFilesSelected(updatedFiles.map(f => f.file));
    }
  }, [files, disabled, maxFiles, showPreview, onFilesSelected]);

  // Handle drag events
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const droppedFiles = e.dataTransfer.files;
    handleFiles(droppedFiles);
  };

  // Handle click to open file dialog
  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove file
  const removeFile = (id: string) => {
    const updatedFiles = files.filter(f => f.id !== id);
    setFiles(updatedFiles);

    // Revoke preview URL to free memory
    const fileToRemove = files.find(f => f.id === id);
    if (fileToRemove?.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }

    if (onFilesSelected) {
      onFilesSelected(updatedFiles.map(f => f.file));
    }
  };

  // Clear all files
  const clearAll = () => {
    files.forEach(f => {
      if (f.preview) {
        URL.revokeObjectURL(f.preview);
      }
    });
    setFiles([]);
    if (onFilesSelected) {
      onFilesSelected([]);
    }
  };

  // Handle upload
  const handleUpload = async () => {
    if (!onUpload || files.length === 0 || isUploading) return;

    // Check for validation errors
    const hasErrors = files.some(f => f.error);
    if (hasErrors) {
      alert('Please remove files with errors before uploading');
      return;
    }

    setIsUploading(true);

    try {
      await onUpload(files.map(f => f.file));
      clearAll();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Get file icon based on type
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return (
        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    } else if (file.type.includes('pdf')) {
      return (
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    } else if (file.type.includes('word') || file.type.includes('document')) {
      return (
        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    } else if (file.type.includes('sheet') || file.type.includes('excel')) {
      return (
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
      );
    } else {
      return (
        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drop Zone */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer
          ${isDragging
            ? 'border-blue-500 bg-blue-50'
            : disabled
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
          }
        `}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          disabled={disabled}
        />

        <div className="flex flex-col items-center gap-4">
          <div className={`w-16 h-16 rounded-full ${isDragging ? 'bg-blue-100' : 'bg-gray-100'} flex items-center justify-center`}>
            <svg className={`w-8 h-8 ${isDragging ? 'text-blue-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>

          <div>
            <p className="text-lg font-medium text-gray-700">
              {isDragging ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              or <span className="text-blue-600 font-medium">browse</span> to choose files
            </p>
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p>Maximum file size: {formatFileSize(maxSize)}</p>
            {allowedTypes && <p>Allowed types: {allowedTypes.join(', ')}</p>}
            <p>Maximum {maxFiles} file{maxFiles !== 1 ? 's' : ''} allowed</p>
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">
              Selected Files ({files.length})
            </h3>
            <Button variant="secondary" size="sm" onClick={clearAll} disabled={isUploading}>
              Clear All
            </Button>
          </div>

          <div className="space-y-2">
            {files.map((fileItem) => (
              <div
                key={fileItem.id}
                className={`
                  flex items-center gap-4 p-4 rounded-lg border
                  ${fileItem.error ? 'bg-red-50 border-red-300' : 'bg-white border-gray-200'}
                `}
              >
                {/* Preview or Icon */}
                <div className="flex-shrink-0">
                  {fileItem.preview ? (
                    <img
                      src={fileItem.preview}
                      alt={fileItem.file.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    getFileIcon(fileItem.file)
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {fileItem.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(fileItem.file.size)}
                  </p>
                  {fileItem.error && (
                    <p className="text-xs text-red-600 mt-1">{fileItem.error}</p>
                  )}
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFile(fileItem.id)}
                  disabled={isUploading}
                  className="flex-shrink-0 p-1 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Upload Button */}
          {onUpload && (
            <Button
              variant="primary"
              className="w-full"
              onClick={handleUpload}
              disabled={isUploading || files.some(f => f.error)}
              isLoading={isUploading}
            >
              {isUploading ? 'Uploading...' : `Upload ${files.length} File${files.length !== 1 ? 's' : ''}`}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

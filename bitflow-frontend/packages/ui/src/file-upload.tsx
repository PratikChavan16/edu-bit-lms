'use client';

import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, X, File, FileText, Image as ImageIcon, AlertCircle } from 'lucide-react';

export interface FileUploadProps {
  value?: File[];
  onChange?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  maxFiles?: number;
  disabled?: boolean;
  className?: string;
  error?: string;
  label?: string;
  required?: boolean;
  showPreview?: boolean;
}

export function FileUpload({
  value = [],
  onChange,
  accept,
  multiple = false,
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 5,
  disabled = false,
  className = '',
  error,
  label,
  required = false,
  showPreview = true,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Validate file
  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize) {
      return `File size exceeds ${formatFileSize(maxSize)}`;
    }
    if (accept) {
      const acceptedTypes = accept.split(',').map((type) => type.trim());
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      const mimeType = file.type;

      const isAccepted = acceptedTypes.some((type) => {
        if (type.startsWith('.')) {
          return fileExtension === type.toLowerCase();
        }
        if (type.endsWith('/*')) {
          return mimeType.startsWith(type.replace('/*', ''));
        }
        return mimeType === type;
      });

      if (!isAccepted) {
        return `File type not accepted. Allowed types: ${accept}`;
      }
    }
    return null;
  };

  // Handle file selection
  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const filesArray = Array.from(files);
    const currentFiles = value || [];

    // Check max files limit
    if (!multiple && filesArray.length > 1) {
      setUploadError('Only one file is allowed');
      return;
    }

    if (multiple && currentFiles.length + filesArray.length > maxFiles) {
      setUploadError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate all files
    const validFiles: File[] = [];
    let hasError = false;

    for (const file of filesArray) {
      const validationError = validateFile(file);
      if (validationError) {
        setUploadError(validationError);
        hasError = true;
        break;
      }
      validFiles.push(file);
    }

    if (!hasError) {
      setUploadError('');
      const newFiles = multiple ? [...currentFiles, ...validFiles] : validFiles;
      onChange?.(newFiles);
    }
  };

  // Handle file input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  // Handle drag events
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (!disabled) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Remove file
  const handleRemoveFile = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange?.(newFiles);
    setUploadError('');
  };

  // Get file icon
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="h-8 w-8 text-blue-500" />;
    }
    if (file.type === 'application/pdf') {
      return <FileText className="h-8 w-8 text-red-500" />;
    }
    return <File className="h-8 w-8 text-gray-500" />;
  };

  // Get image preview URL
  const getImagePreview = (file: File) => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  const displayError = error || uploadError;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="mb-1 block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}

      {/* Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`
          relative cursor-pointer rounded-lg border-2 border-dashed p-6 text-center
          transition-colors
          ${displayError ? 'border-red-500 bg-red-50' : ''}
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
          ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:border-gray-400 hover:bg-gray-100'}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          onChange={handleInputChange}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className="hidden"
        />

        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm font-medium text-gray-700">
          {isDragging ? 'Drop files here' : 'Click to upload or drag and drop'}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          {accept ? `Accepted types: ${accept}` : 'Any file type'}
          {maxSize && ` • Max size: ${formatFileSize(maxSize)}`}
          {multiple && ` • Max files: ${maxFiles}`}
        </p>
      </div>

      {/* Error Message */}
      {displayError && (
        <div className="mt-2 flex items-start gap-2 text-sm text-red-500">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>{displayError}</span>
        </div>
      )}

      {/* File Preview List */}
      {showPreview && value.length > 0 && (
        <div className="mt-4 space-y-2">
          {value.map((file, index) => {
            const imagePreview = getImagePreview(file);

            return (
              <div
                key={index}
                className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3"
              >
                {/* File Icon/Preview */}
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt={file.name}
                    className="h-12 w-12 rounded object-cover"
                  />
                ) : (
                  getFileIcon(file)
                )}

                {/* File Info */}
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>

                {/* Remove Button */}
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { FileUpload, Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@bitflow/ui';

export default function FileUploadDemo() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  // Simulate upload function
  const handleUpload = async (files: File[]) => {
    setUploadStatus('Uploading...');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setUploadedFiles(prev => [...prev, ...files]);
    setUploadStatus(`Successfully uploaded ${files.length} file(s)!`);
    
    setTimeout(() => setUploadStatus(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-4">
            📁 FileUpload Component Demo
          </h1>
          <p className="text-lg text-gray-600">
            Drag & drop file upload with validation, preview, and progress tracking
          </p>
        </div>

        {/* Feature Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">🎯</div>
              <div className="text-2xl font-bold text-gray-900">Drag & Drop</div>
              <div className="text-sm text-gray-600">Easy Upload</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-pink-600 mb-2">✅</div>
              <div className="text-2xl font-bold text-gray-900">Validation</div>
              <div className="text-sm text-gray-600">Size & Type</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-red-600 mb-2">🖼️</div>
              <div className="text-2xl font-bold text-gray-900">Preview</div>
              <div className="text-sm text-gray-600">Image Preview</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-indigo-600 mb-2">📊</div>
              <div className="text-2xl font-bold text-gray-900">{uploadedFiles.length}</div>
              <div className="text-sm text-gray-600">Files Uploaded</div>
            </CardContent>
          </Card>
        </div>

        {/* Upload Status */}
        {uploadStatus && (
          <Card className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-2 text-green-700 font-semibold">
                <span className="text-2xl">✅</span>
                <span>{uploadStatus}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Demo Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📤</span>
                Basic File Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <FileUpload
                  onUpload={handleUpload}
                  placeholder="Upload any file"
                />
                
                <div className="text-sm text-gray-600">
                  <strong>Features:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Drag and drop files</li>
                    <li>Click to browse</li>
                    <li>Multiple file selection</li>
                    <li>Default 10MB limit</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Image Upload with Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🖼️</span>
                Image Upload (with Preview)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <FileUpload
                  accept="image/*"
                  maxSize={5 * 1024 * 1024} // 5MB
                  maxFiles={5}
                  allowedTypes={['image/jpeg', 'image/png', 'image/gif', 'image/webp']}
                  onUpload={handleUpload}
                  showPreview={true}
                />
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-sm text-gray-600">
                    <strong>Restrictions:</strong>
                    <div className="mt-2 space-y-1">
                      <div>📌 Max Size: 5MB per file</div>
                      <div>📌 Max Files: 5</div>
                      <div>📌 Types: JPEG, PNG, GIF, WEBP</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📄</span>
                Document Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <FileUpload
                  accept=".pdf,.doc,.docx,.txt"
                  maxSize={20 * 1024 * 1024} // 20MB
                  maxFiles={3}
                  allowedTypes={['.pdf', '.doc', '.docx', '.txt']}
                  onUpload={handleUpload}
                  showPreview={false}
                />
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-gray-600">
                    <strong>Use Cases:</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Assignment submissions</li>
                      <li>Course materials</li>
                      <li>Student documents</li>
                      <li>Reports and essays</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Disabled State */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🚫</span>
                Disabled Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <FileUpload
                  disabled={true}
                  onUpload={handleUpload}
                />
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">
                    <strong>When to disable:</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Upload in progress</li>
                      <li>User lacks permissions</li>
                      <li>Maximum files reached</li>
                      <li>Form is read-only</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="text-2xl">📋</span>
                  Uploaded Files ({uploadedFiles.length})
                </span>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => setUploadedFiles([])}
                >
                  Clear All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {file.type.startsWith('image/') ? '🖼️' : 
                         file.type.includes('pdf') ? '📕' :
                         file.type.includes('word') ? '📘' : '📄'}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{file.name}</div>
                        <div className="text-sm text-gray-600">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    </div>
                    <Badge variant="success">Uploaded</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features Grid */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl">✨ Component Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🎯</div>
                <div>
                  <div className="font-semibold text-gray-900">Drag & Drop</div>
                  <div className="text-sm text-gray-600">Intuitive file selection</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">✅</div>
                <div>
                  <div className="font-semibold text-gray-900">File Validation</div>
                  <div className="text-sm text-gray-600">Size and type checks</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">🖼️</div>
                <div>
                  <div className="font-semibold text-gray-900">Image Preview</div>
                  <div className="text-sm text-gray-600">Thumbnail generation</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">📁</div>
                <div>
                  <div className="font-semibold text-gray-900">File Type Icons</div>
                  <div className="text-sm text-gray-600">Visual file identification</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">🔢</div>
                <div>
                  <div className="font-semibold text-gray-900">Max Files Limit</div>
                  <div className="text-sm text-gray-600">Configurable restrictions</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">⚠️</div>
                <div>
                  <div className="font-semibold text-gray-900">Error Display</div>
                  <div className="text-sm text-gray-600">Clear validation messages</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">🗑️</div>
                <div>
                  <div className="font-semibold text-gray-900">Remove Files</div>
                  <div className="text-sm text-gray-600">Individual file removal</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">💾</div>
                <div>
                  <div className="font-semibold text-gray-900">Memory Safe</div>
                  <div className="text-sm text-gray-600">Proper blob URL cleanup</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">🚫</div>
                <div>
                  <div className="font-semibold text-gray-900">Disabled State</div>
                  <div className="text-sm text-gray-600">Prevent interaction</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Use Cases */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl">💼 Common Use Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-3">🎓 Educational Platform</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <Badge variant="info">Assignment</Badge>
                    <span>Student submission uploads</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="success">Profile</Badge>
                    <span>Profile picture uploads</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="warning">Resources</Badge>
                    <span>Course material uploads</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="info">Certificate</Badge>
                    <span>Document verification</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-3">🏢 Business Applications</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <Badge variant="success">Bulk</Badge>
                    <span>CSV/Excel imports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="info">Media</Badge>
                    <span>Image galleries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="warning">Backup</Badge>
                    <span>File backups</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="error">Report</Badge>
                    <span>Report uploads</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

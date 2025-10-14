'use client';

import { useState } from 'react';
import { useAuth } from '@bitflow/api-client/auth/useAuth';
import { toast } from '@bitflow/ui/toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitflow/ui/card";
import { Button } from "@bitflow/ui/button";
import { Badge } from "@bitflow/ui/badge";
import { Upload, Download, FileText, AlertCircle, CheckCircle2, Loader2, Users, GraduationCap, FileQuestion } from 'lucide-react';

interface Template {
  type: string;
  name: string;
  description: string;
  template_url: string;
  required_fields: string[];
  optional_fields: string[];
}

interface UploadHistory {
  id: string;
  type: string;
  created_at: string;
  total_rows: number;
  success_count: number;
  failure_count: number;
  status: string;
}

export default function BulkUploadPage() {
  const { token } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadHistory, setUploadHistory] = useState<UploadHistory[]>([]);
  const [validationResult, setValidationResult] = useState<any>(null);

  // Load templates on mount
  useState(() => {
    fetchTemplates();
    fetchHistory();
  });

  const fetchTemplates = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/bulk-upload/templates`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setTemplates(data.data);
      }
    } catch (error) {
      toast.error('Error', 'Failed to load templates');
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/bulk-upload/history`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setUploadHistory(data.data);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        toast.error('Error', 'Please select a CSV file');
        return;
      }
      setSelectedFile(file);
      validateFile(file);
    }
  };

  const validateFile = async (file: File) => {
    if (!selectedTemplate) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', selectedTemplate.type);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/bulk-upload/validate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setValidationResult(data.data);
        toast.success('Validation Passed', `File contains ${data.data.row_count} rows`);
      } else {
        toast.error('Validation Failed', data.message);
        setValidationResult(null);
      }
    } catch (error) {
      toast.error('Error', 'Failed to validate file');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedTemplate) {
      toast.error('Error', 'Please select a template and file');
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('type', selectedTemplate.type);
    formData.append('college_id', 'YOUR_COLLEGE_ID'); // Should come from context/state

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/bulk-upload/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Upload Complete', data.message);
        setSelectedFile(null);
        setValidationResult(null);
        fetchHistory();
      } else {
        toast.error('Upload Failed', data.message);
      }
    } catch (error) {
      toast.error('Error', 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = (type: string) => {
    const template = templates.find(t => t.type === type);
    if (template) {
      // In production, this would trigger actual file download
      window.open(template.template_url, '_blank');
    }
  };

  const getTemplateIcon = (type: string) => {
    switch (type) {
      case 'students':
        return <GraduationCap className="w-6 h-6" />;
      case 'faculty':
        return <Users className="w-6 h-6" />;
      case 'assessments':
        return <FileQuestion className="w-6 h-6" />;
      default:
        return <FileText className="w-6 h-6" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      completed: { label: 'Completed', className: 'bg-green-100 text-green-800' },
      completed_with_errors: { label: 'Partial', className: 'bg-yellow-100 text-yellow-800' },
      failed: { label: 'Failed', className: 'bg-red-100 text-red-800' },
      processing: { label: 'Processing', className: 'bg-blue-100 text-blue-800' },
    };
    
    const variant = variants[status] || variants.processing;
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Bulk Upload</h1>
        <p className="text-muted-foreground mt-1">
          Upload CSV files to add students, faculty, or assessment questions in bulk
        </p>
      </div>

      {/* Template Selection */}
      <div className="grid gap-4 md:grid-cols-3">
        {templates.map((template) => (
          <Card
            key={template.type}
            className={`cursor-pointer transition-all ${
              selectedTemplate?.type === template.type
                ? 'ring-2 ring-primary'
                : 'hover:border-primary'
            }`}
            onClick={() => setSelectedTemplate(template)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {getTemplateIcon(template.type)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                  </div>
                </div>
              </div>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  downloadTemplate(template.type);
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upload Section */}
      {selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle>Upload {selectedTemplate.name}</CardTitle>
            <CardDescription>
              Upload a CSV file following the template format
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* File Upload */}
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm font-medium">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground mt-1">CSV files only, max 10MB</p>
              </label>
              {selectedFile && (
                <div className="mt-4 flex items-center justify-center gap-2 text-sm">
                  <FileText className="w-4 h-4" />
                  <span>{selectedFile.name}</span>
                </div>
              )}
            </div>

            {/* Validation Result */}
            {validationResult && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-900">Validation Passed</p>
                    <p className="text-sm text-green-700 mt-1">
                      File contains {validationResult.row_count} rows ready to upload
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Upload Button */}
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || !validationResult || isUploading}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload File
                </>
              )}
            </Button>

            {/* Required Fields Info */}
            <div className="text-sm space-y-2">
              <p className="font-medium">Required fields:</p>
              <div className="flex flex-wrap gap-2">
                {selectedTemplate.required_fields.map((field) => (
                  <Badge key={field} variant="outline">
                    {field}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload History */}
      <Card>
        <CardHeader>
          <CardTitle>Upload History</CardTitle>
          <CardDescription>Recent bulk upload operations</CardDescription>
        </CardHeader>
        <CardContent>
          {uploadHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No uploads yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {uploadHistory.map((upload) => (
                <div
                  key={upload.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <p className="font-medium">{upload.type}</p>
                      {getStatusBadge(upload.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {upload.success_count} of {upload.total_rows} records imported successfully
                      {upload.failure_count > 0 && ` • ${upload.failure_count} failed`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(upload.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

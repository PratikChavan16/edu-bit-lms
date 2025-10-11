'use client';

import { useState, useRef } from 'react';
import Papa from 'papaparse';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Alert,
  Spinner,
  Badge,
} from '@bitflow/ui';

// Types
interface StudentData {
  first_name: string;
  last_name: string;
  email: string;
  roll_number: string;
  department: string;
  year: string;
  phone: string;
  parent_phone: string;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

interface UploadStats {
  total: number;
  valid: number;
  invalid: number;
  imported: number;
}

export default function BulkStudentUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<StudentData[]>([]);
  const [allData, setAllData] = useState<StudentData[]>([]);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [stats, setStats] = useState<UploadStats>({
    total: 0,
    valid: 0,
    invalid: 0,
    imported: 0,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validateRow = (row: StudentData, index: number): ValidationError[] => {
    const rowErrors: ValidationError[] = [];

    if (!row.first_name || row.first_name.trim() === '') {
      rowErrors.push({ row: index + 2, field: 'first_name', message: 'First name is required' });
    }
    if (!row.last_name || row.last_name.trim() === '') {
      rowErrors.push({ row: index + 2, field: 'last_name', message: 'Last name is required' });
    }
    if (!row.email || !validateEmail(row.email)) {
      rowErrors.push({ row: index + 2, field: 'email', message: 'Invalid email address' });
    }
    if (!row.roll_number || row.roll_number.trim() === '') {
      rowErrors.push({ row: index + 2, field: 'roll_number', message: 'Roll number is required' });
    }
    if (!row.phone || !validatePhone(row.phone)) {
      rowErrors.push({ row: index + 2, field: 'phone', message: 'Invalid phone number (10 digits)' });
    }
    if (!row.parent_phone || !validatePhone(row.parent_phone)) {
      rowErrors.push({ row: index + 2, field: 'parent_phone', message: 'Invalid parent phone (10 digits)' });
    }

    return rowErrors;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        alert('Please select a CSV file');
        return;
      }
      setFile(selectedFile);
      setUploadComplete(false);
      parseCSV(selectedFile);
    }
  };

  const parseCSV = (file: File) => {
    setIsProcessing(true);
    setErrors([]);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as StudentData[];
        
        // Validate all rows
        const allErrors: ValidationError[] = [];
        data.forEach((row, index) => {
          const rowErrors = validateRow(row, index);
          allErrors.push(...rowErrors);
        });

        setAllData(data);
        setPreviewData(data.slice(0, 10)); // Show first 10 rows
        setErrors(allErrors);
        setStats({
          total: data.length,
          valid: data.length - new Set(allErrors.map(e => e.row)).size,
          invalid: new Set(allErrors.map(e => e.row)).size,
          imported: 0,
        });
        setIsProcessing(false);
      },
      error: (error) => {
        alert(`Error parsing CSV: ${error.message}`);
        setIsProcessing(false);
      },
    });
  };

  const handleImportAll = async () => {
    if (errors.length > 0) {
      const confirm = window.confirm(
        `There are ${stats.invalid} rows with errors. Do you want to import only the valid rows?`
      );
      if (!confirm) return;
    }

    await simulateUpload(allData);
  };

  const handleImportValidOnly = async () => {
    const errorRows = new Set(errors.map(e => e.row));
    const validData = allData.filter((_, index) => !errorRows.has(index + 2));
    await simulateUpload(validData);
  };

  const simulateUpload = async (data: StudentData[]) => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate chunked upload
    const chunkSize = 100;
    const chunks = Math.ceil(data.length / chunkSize);

    for (let i = 0; i < chunks; i++) {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setUploadProgress(((i + 1) / chunks) * 100);
    }

    setStats(prev => ({ ...prev, imported: data.length }));
    setUploadComplete(true);
    setIsUploading(false);
  };

  const downloadTemplate = () => {
    const csvContent = `first_name,last_name,email,roll_number,department,year,phone,parent_phone
John,Doe,john.doe@example.com,2024001,Computer Science,1,9876543210,9876543211
Jane,Smith,jane.smith@example.com,2024002,Electronics,1,9876543212,9876543213
Mike,Johnson,mike.j@example.com,2024003,Mechanical,2,9876543214,9876543215`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_upload_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadErrorReport = () => {
    const errorReport = errors.map(error => 
      `Row ${error.row},${error.field},${error.message}`
    ).join('\n');

    const csvContent = `Row,Field,Error\n${errorReport}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'upload_errors.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setFile(null);
    setPreviewData([]);
    setAllData([]);
    setErrors([]);
    setUploadProgress(0);
    setIsProcessing(false);
    setIsUploading(false);
    setUploadComplete(false);
    setStats({ total: 0, valid: 0, invalid: 0, imported: 0 });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bulk Student Upload</h1>
          <p className="text-gray-700 mt-1">Upload CSV file to import multiple students at once</p>
        </div>
        <Button variant="secondary" onClick={handleReset}>
          Start Over
        </Button>
      </div>

      {/* Step 1: Download Template */}
      <Card className="bg-white border-2 border-gray-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <CardTitle className="text-gray-900">Download CSV Template</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">
            Download the template CSV file with the correct format and fill in your student data.
          </p>
          <Button onClick={downloadTemplate} variant="primary">
            Download Template
          </Button>
        </CardContent>
      </Card>

      {/* Step 2: Upload CSV */}
      <Card className="bg-white border-2 border-gray-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <CardTitle className="text-gray-900">Upload CSV File</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
            {file ? (
              <div className="space-y-2">
                <svg className="mx-auto w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg font-semibold text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-600">{(file.size / 1024).toFixed(2)} KB</p>
                <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); handleReset(); }}>
                  Change File
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <svg className="mx-auto w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-lg font-semibold text-gray-900">Drop CSV file here or click to browse</p>
                <p className="text-sm text-gray-600">CSV files only, max 5MB</p>
              </div>
            )}
          </div>
          {isProcessing && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <Spinner size="md" />
              <span className="text-gray-700 font-medium">Processing CSV...</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Step 3: Preview & Validate */}
      {previewData.length > 0 && (
        <Card className="bg-white border-2 border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <CardTitle className="text-gray-900">Preview & Validate</CardTitle>
              </div>
              <div className="flex gap-2">
                <Badge variant={stats.valid > 0 ? 'success' : 'secondary'}>
                  Valid: {stats.valid}
                </Badge>
                <Badge variant={stats.invalid > 0 ? 'error' : 'secondary'}>
                  Errors: {stats.invalid}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {errors.length > 0 && (
              <Alert variant="warning" title={`${stats.invalid} rows have validation errors`}>
                <p className="text-sm mb-2">You can import only valid rows or fix errors and re-upload.</p>
                <Button size="sm" variant="secondary" onClick={downloadErrorReport}>
                  Download Error Report
                </Button>
              </Alert>
            )}

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-500 to-indigo-500">
                    <th className="border border-gray-300 p-2 text-left font-bold text-white">Row</th>
                    <th className="border border-gray-300 p-2 text-left font-bold text-white">Name</th>
                    <th className="border border-gray-300 p-2 text-left font-bold text-white">Email</th>
                    <th className="border border-gray-300 p-2 text-left font-bold text-white">Roll No.</th>
                    <th className="border border-gray-300 p-2 text-left font-bold text-white">Department</th>
                    <th className="border border-gray-300 p-2 text-left font-bold text-white">Year</th>
                    <th className="border border-gray-300 p-2 text-left font-bold text-white">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((student, index) => {
                    const rowErrors = errors.filter(e => e.row === index + 2);
                    const hasError = rowErrors.length > 0;

                    return (
                      <tr key={index} className={hasError ? 'bg-red-50' : 'bg-white hover:bg-gray-50'}>
                        <td className="border border-gray-300 p-2 font-medium text-gray-900">{index + 2}</td>
                        <td className="border border-gray-300 p-2 text-gray-900">
                          {student.first_name} {student.last_name}
                        </td>
                        <td className="border border-gray-300 p-2 text-gray-900">{student.email}</td>
                        <td className="border border-gray-300 p-2 text-gray-900">{student.roll_number}</td>
                        <td className="border border-gray-300 p-2 text-gray-900">{student.department}</td>
                        <td className="border border-gray-300 p-2 text-gray-900">{student.year}</td>
                        <td className="border border-gray-300 p-2">
                          {hasError ? (
                            <Badge variant="error">Error</Badge>
                          ) : (
                            <Badge variant="success">Valid</Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {allData.length > 10 && (
              <p className="text-sm text-gray-600 font-medium">
                Showing first 10 of {stats.total} rows
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 4: Import */}
      {previewData.length > 0 && !uploadComplete && (
        <Card className="bg-white border-2 border-gray-200">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <CardTitle className="text-gray-900">Import Students</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isUploading ? (
              <div className="flex gap-3">
                <Button
                  onClick={handleImportAll}
                  variant="primary"
                  disabled={allData.length === 0}
                >
                  Import All ({stats.total} students)
                </Button>
                {errors.length > 0 && (
                  <Button
                    onClick={handleImportValidOnly}
                    variant="secondary"
                    disabled={stats.valid === 0}
                  >
                    Import Valid Only ({stats.valid} students)
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-medium text-gray-900">
                  <span>Uploading students...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  Processing in chunks of 100... Please wait.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 5: Results */}
      {uploadComplete && (
        <Card className="bg-white border-2 border-green-200">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                ✓
              </div>
              <CardTitle className="text-gray-900">Upload Complete!</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Alert variant="success" title="Students imported successfully">
              <div className="space-y-2">
                <p className="font-semibold text-gray-900">✓ Successfully imported {stats.imported} students</p>
                {errors.length > 0 && (
                  <p className="text-gray-700">✗ Failed to import {stats.invalid} students due to validation errors</p>
                )}
                <div className="flex gap-3 mt-4">
                  <Button variant="primary" onClick={handleReset}>
                    Upload More Students
                  </Button>
                  {errors.length > 0 && (
                    <Button variant="secondary" onClick={downloadErrorReport}>
                      Download Error Report
                    </Button>
                  )}
                </div>
              </div>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

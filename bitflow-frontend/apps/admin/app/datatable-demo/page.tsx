'use client';

import { useState } from 'react';
import { DataTable, Column, Badge, Button } from '@bitflow/ui';

// Sample data types
interface Student {
  id: number;
  name: string;
  email: string;
  course: string;
  year: number;
  gpa: number;
  status: 'active' | 'inactive' | 'suspended';
  enrollmentDate: string;
}

// Sample data
const students: Student[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice.j@example.com', course: 'Computer Science', year: 3, gpa: 3.8, status: 'active', enrollmentDate: '2022-09-01' },
  { id: 2, name: 'Bob Smith', email: 'bob.smith@example.com', course: 'Engineering', year: 2, gpa: 3.5, status: 'active', enrollmentDate: '2023-09-01' },
  { id: 3, name: 'Carol Williams', email: 'carol.w@example.com', course: 'Business', year: 4, gpa: 3.9, status: 'active', enrollmentDate: '2021-09-01' },
  { id: 4, name: 'David Brown', email: 'david.b@example.com', course: 'Arts', year: 1, gpa: 3.2, status: 'inactive', enrollmentDate: '2024-09-01' },
  { id: 5, name: 'Eva Davis', email: 'eva.davis@example.com', course: 'Computer Science', year: 2, gpa: 4.0, status: 'active', enrollmentDate: '2023-09-01' },
  { id: 6, name: 'Frank Miller', email: 'frank.m@example.com', course: 'Engineering', year: 3, gpa: 3.4, status: 'suspended', enrollmentDate: '2022-09-01' },
  { id: 7, name: 'Grace Wilson', email: 'grace.w@example.com', course: 'Medical', year: 4, gpa: 3.7, status: 'active', enrollmentDate: '2021-09-01' },
  { id: 8, name: 'Henry Moore', email: 'henry.m@example.com', course: 'Arts', year: 1, gpa: 3.1, status: 'active', enrollmentDate: '2024-09-01' },
  { id: 9, name: 'Iris Taylor', email: 'iris.t@example.com', course: 'Business', year: 2, gpa: 3.6, status: 'active', enrollmentDate: '2023-09-01' },
  { id: 10, name: 'Jack Anderson', email: 'jack.a@example.com', course: 'Computer Science', year: 3, gpa: 3.3, status: 'inactive', enrollmentDate: '2022-09-01' },
  { id: 11, name: 'Kate Thomas', email: 'kate.t@example.com', course: 'Engineering', year: 4, gpa: 3.8, status: 'active', enrollmentDate: '2021-09-01' },
  { id: 12, name: 'Liam Jackson', email: 'liam.j@example.com', course: 'Medical', year: 1, gpa: 3.5, status: 'active', enrollmentDate: '2024-09-01' },
  { id: 13, name: 'Mia White', email: 'mia.white@example.com', course: 'Arts', year: 2, gpa: 3.9, status: 'active', enrollmentDate: '2023-09-01' },
  { id: 14, name: 'Noah Harris', email: 'noah.h@example.com', course: 'Business', year: 3, gpa: 3.2, status: 'active', enrollmentDate: '2022-09-01' },
  { id: 15, name: 'Olivia Martin', email: 'olivia.m@example.com', course: 'Computer Science', year: 4, gpa: 4.0, status: 'active', enrollmentDate: '2021-09-01' },
];

export default function DataTableDemo() {
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);

  // Define columns
  const columns: Column<Student>[] = [
    {
      id: 'id',
      header: 'ID',
      accessor: 'id',
      sortable: true,
      width: '80px',
    },
    {
      id: 'name',
      header: 'Name',
      accessor: 'name',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
            {row.name.split(' ').map(n => n[0]).join('')}
          </div>
          <span className="font-medium text-gray-900">{row.name}</span>
        </div>
      ),
    },
    {
      id: 'email',
      header: 'Email',
      accessor: 'email',
      sortable: true,
      cell: (row) => (
        <span className="text-gray-600">{row.email}</span>
      ),
    },
    {
      id: 'course',
      header: 'Course',
      accessor: 'course',
      sortable: true,
      cell: (row) => (
        <Badge variant="info">{row.course}</Badge>
      ),
    },
    {
      id: 'year',
      header: 'Year',
      accessor: 'year',
      sortable: true,
      align: 'center',
      cell: (row) => (
        <span className="text-sm font-semibold text-gray-700">Year {row.year}</span>
      ),
    },
    {
      id: 'gpa',
      header: 'GPA',
      accessor: 'gpa',
      sortable: true,
      align: 'center',
      cell: (row) => (
        <span className={`font-bold ${row.gpa >= 3.7 ? 'text-green-600' : row.gpa >= 3.0 ? 'text-blue-600' : 'text-yellow-600'}`}>
          {row.gpa.toFixed(1)}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessor: 'status',
      sortable: true,
      cell: (row) => {
        const statusVariants: Record<Student['status'], 'success' | 'warning' | 'error'> = {
          active: 'success',
          inactive: 'warning',
          suspended: 'error',
        };
        return (
          <Badge variant={statusVariants[row.status]}>
            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          </Badge>
        );
      },
    },
    {
      id: 'enrollmentDate',
      header: 'Enrollment',
      accessor: 'enrollmentDate',
      sortable: true,
      cell: (row) => (
        <span className="text-sm text-gray-600">
          {new Date(row.enrollmentDate).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      align: 'center',
      cell: (row) => (
        <div className="flex items-center justify-center gap-2">
          <button
            className="text-blue-600 hover:text-blue-800 transition-colors"
            onClick={() => alert(`View details for ${row.name}`)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            className="text-green-600 hover:text-green-800 transition-colors"
            onClick={() => alert(`Edit ${row.name}`)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            className="text-red-600 hover:text-red-800 transition-colors"
            onClick={() => alert(`Delete ${row.name}`)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            DataTable Component Demo
          </h1>
          <p className="text-gray-600">
            Powerful data table with sorting, search, pagination, and row selection
          </p>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Search</p>
                <p className="text-lg font-semibold text-gray-900">Enabled</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Sorting</p>
                <p className="text-lg font-semibold text-gray-900">Multi-column</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Rows</p>
                <p className="text-lg font-semibold text-gray-900">{students.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Selected</p>
                <p className="text-lg font-semibold text-gray-900">{selectedStudents.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedStudents.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-blue-900">
                  {selectedStudents.length} student{selectedStudents.length !== 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="primary" size="sm">
                  Export Selected
                </Button>
                <Button variant="danger" size="sm">
                  Delete Selected
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => setSelectedStudents([])}
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* DataTable */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <DataTable
            data={students}
            columns={columns}
            enableSearch
            searchPlaceholder="Search students by name, email, course..."
            enableRowSelection
            onRowSelect={setSelectedStudents}
            enablePagination
            pageSize={10}
            striped
            hoverable
            emptyMessage="No students found"
          />
        </div>

        {/* Feature List */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Features Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'Column sorting (asc/desc)',
              'Global search filter',
              'Row selection with checkboxes',
              'Pagination with page size selector',
              'Custom cell renderers',
              'Loading state',
              'Empty state message',
              'Striped rows',
              'Hover effects',
              'Responsive design',
              'TypeScript support',
              'Customizable columns',
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

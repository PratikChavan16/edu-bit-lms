# Quick Component Reference Guide

Quick copy-paste examples for all components in the UI library.

---

## 📊 Data Display

### DataTable
```tsx
import { DataTable } from '@bitflow/ui/data-table';

interface Student {
  id: string;
  name: string;
  email: string;
  department: string;
}

<DataTable<Student>
  data={students}
  columns={[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'department', label: 'Department' }
  ]}
  loading={isLoading}
  searchable
  pagination={{
    page: currentPage,
    pageSize: 10,
    total: totalCount,
    onPageChange: setCurrentPage
  }}
  onRowClick={(student) => router.push(`/students/${student.id}`)}
  actions={(student) => (
    <>
      <button onClick={() => handleEdit(student)}>Edit</button>
      <button onClick={() => handleDelete(student)}>Delete</button>
    </>
  )}
/>
```

---

## 📈 Charts

### LineChart
```tsx
import { LineChart } from '@bitflow/ui/line-chart';

const attendanceData = [
  { date: 'Mon', present: 45, absent: 5 },
  { date: 'Tue', present: 48, absent: 2 },
  { date: 'Wed', present: 46, absent: 4 },
];

<LineChart
  data={attendanceData}
  xKey="date"
  yKeys={[
    { key: 'present', name: 'Present', color: '#10b981' },
    { key: 'absent', name: 'Absent', color: '#ef4444' }
  ]}
  title="Weekly Attendance"
  height={300}
  loading={isLoading}
/>
```

### BarChart
```tsx
import { BarChart } from '@bitflow/ui/bar-chart';

const feeData = [
  { month: 'Jan', collected: 50000, pending: 10000 },
  { month: 'Feb', collected: 60000, pending: 8000 },
];

<BarChart
  data={feeData}
  xKey="month"
  yKeys={[
    { key: 'collected', name: 'Collected', color: '#10b981' },
    { key: 'pending', name: 'Pending', color: '#f59e0b' }
  ]}
  title="Fee Collection"
  stacked
  height={300}
/>
```

### ProgressCircle
```tsx
import { ProgressCircle, ProgressCircleGroup } from '@bitflow/ui/progress-circle';

// Single circle
<ProgressCircle
  value={85}
  label="Attendance"
  color="#10b981"
  size={120}
/>

// Multiple circles
<ProgressCircleGroup
  items={[
    { value: 85, label: 'Attendance', color: '#10b981' },
    { value: 92, label: 'Assignments', color: '#3b82f6' },
    { value: 78, label: 'Exams', color: '#f59e0b' }
  ]}
  size={100}
/>
```

---

## 📝 Form Components

### Select
```tsx
import { Select } from '@bitflow/ui/select';

const departments = [
  { value: 'cs', label: 'Computer Science' },
  { value: 'ee', label: 'Electrical Engineering' },
  { value: 'me', label: 'Mechanical Engineering' }
];

// Single select
<Select
  options={departments}
  value={selectedDept}
  onChange={setSelectedDept}
  label="Department"
  placeholder="Choose a department"
  searchable
  clearable
  required
  error={errors.department}
/>

// Multiple select
<Select
  options={courses}
  value={selectedCourses}
  onChange={setSelectedCourses}
  label="Courses"
  placeholder="Select courses"
  multiple
  searchable
/>
```

### DatePicker
```tsx
import { DatePicker } from '@bitflow/ui/date-picker';

<DatePicker
  value={startDate}
  onChange={setStartDate}
  label="Start Date"
  placeholder="Select a date"
  required
  minDate={new Date()}
  maxDate={new Date(2025, 11, 31)}
  error={errors.startDate}
/>
```

### FileUpload
```tsx
import { FileUpload } from '@bitflow/ui/file-upload';

<FileUpload
  value={files}
  onChange={setFiles}
  label="Upload Documents"
  accept=".pdf,.doc,.docx,.jpg,.png"
  multiple
  maxSize={10 * 1024 * 1024} // 10MB
  maxFiles={5}
  showPreview
  error={errors.files}
/>
```

---

## 🪟 Modal

### Basic Modal
```tsx
import { Modal } from '@bitflow/ui/modal';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Edit Student"
  size="lg"
  footer={
    <div className="flex gap-2">
      <button 
        onClick={() => setIsOpen(false)}
        className="px-4 py-2 border rounded"
      >
        Cancel
      </button>
      <button 
        onClick={handleSave}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Save Changes
      </button>
    </div>
  }
>
  <StudentForm data={student} />
</Modal>
```

### Confirmation Modal
```tsx
import { ConfirmModal } from '@bitflow/ui/modal';

<ConfirmModal
  isOpen={showDeleteConfirm}
  onClose={() => setShowDeleteConfirm(false)}
  onConfirm={async () => {
    await deleteStudent(studentId);
    setShowDeleteConfirm(false);
  }}
  title="Delete Student"
  message="Are you sure you want to delete this student? This action cannot be undone."
  confirmText="Delete"
  cancelText="Cancel"
  variant="danger" // 'danger' | 'warning' | 'info'
  isLoading={isDeleting}
/>
```

---

## 🎨 Existing Components (Already Built)

### Button
```tsx
import { Button } from '@bitflow/ui/button';

<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>
```

### Card
```tsx
import { Card } from '@bitflow/ui/card';

<Card title="Student Details" className="p-6">
  <p>Content here</p>
</Card>
```

### Badge
```tsx
import { Badge } from '@bitflow/ui/badge';

<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Inactive</Badge>
```

### Input
```tsx
import { Input } from '@bitflow/ui/input';

<Input
  type="text"
  value={name}
  onChange={(e) => setName(e.target.value)}
  label="Full Name"
  placeholder="Enter name"
  required
  error={errors.name}
/>
```

### Switch
```tsx
import { Switch } from '@bitflow/ui/switch';

<Switch
  checked={isActive}
  onCheckedChange={setIsActive}
  label="Active Status"
/>
```

---

## 🔄 Common Patterns

### Form with Validation
```tsx
import { Select, DatePicker, FileUpload, Modal } from '@bitflow/ui';
import { useState } from 'react';

function StudentForm() {
  const [formData, setFormData] = useState({
    department: '',
    enrollmentDate: new Date(),
    documents: []
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = () => {
    // Validate
    const newErrors = {};
    if (!formData.department) {
      newErrors.department = 'Department is required';
    }
    if (formData.documents.length === 0) {
      newErrors.documents = 'At least one document is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit
    createStudent(formData);
  };

  return (
    <div className="space-y-4">
      <Select
        options={departments}
        value={formData.department}
        onChange={(value) => setFormData({ ...formData, department: value })}
        label="Department"
        error={errors.department}
        required
      />
      
      <DatePicker
        value={formData.enrollmentDate}
        onChange={(date) => setFormData({ ...formData, enrollmentDate: date })}
        label="Enrollment Date"
        required
      />
      
      <FileUpload
        value={formData.documents}
        onChange={(files) => setFormData({ ...formData, documents: files })}
        label="Documents"
        error={errors.documents}
        required
      />
      
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
```

### Dashboard with Charts
```tsx
import { LineChart, BarChart, ProgressCircleGroup, DataTable } from '@bitflow/ui';

function Dashboard() {
  const { data: attendance } = useAttendance();
  const { data: fees } = useFees();
  const { data: students } = useStudents();

  return (
    <div className="space-y-6">
      {/* Stats */}
      <ProgressCircleGroup
        items={[
          { value: 85, label: 'Attendance', color: '#10b981' },
          { value: 92, label: 'Performance', color: '#3b82f6' }
        ]}
      />

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <LineChart
          data={attendance}
          xKey="date"
          yKeys={[{ key: 'present', name: 'Present' }]}
          title="Attendance Trend"
        />
        
        <BarChart
          data={fees}
          xKey="month"
          yKeys={[
            { key: 'collected', name: 'Collected' },
            { key: 'pending', name: 'Pending' }
          ]}
          title="Fee Collection"
          stacked
        />
      </div>

      {/* Table */}
      <DataTable
        data={students}
        columns={[
          { key: 'name', label: 'Name', sortable: true },
          { key: 'department', label: 'Department' }
        ]}
        searchable
      />
    </div>
  );
}
```

### List Page with Actions
```tsx
import { DataTable, ConfirmModal } from '@bitflow/ui';
import { useState } from 'react';

function StudentList() {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data: students, isLoading } = useStudents();
  const { mutate: deleteStudent } = useDeleteStudent();

  return (
    <>
      <DataTable
        data={students}
        columns={[
          { key: 'name', label: 'Name', sortable: true },
          { key: 'email', label: 'Email' },
          { key: 'department', label: 'Department' }
        ]}
        loading={isLoading}
        searchable
        pagination={paginationProps}
        actions={(student) => (
          <div className="flex gap-2">
            <button onClick={() => router.push(`/students/${student.id}/edit`)}>
              Edit
            </button>
            <button onClick={() => setDeleteId(student.id)}>
              Delete
            </button>
          </div>
        )}
      />

      <ConfirmModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          deleteStudent(deleteId);
          setDeleteId(null);
        }}
        title="Delete Student"
        message="Are you sure you want to delete this student?"
        variant="danger"
      />
    </>
  );
}
```

---

## 🎨 Tailwind Classes Reference

### Common Colors
```tsx
// Success (green)
bg-green-500 text-green-700 border-green-500

// Warning (yellow/orange)
bg-yellow-500 text-yellow-700 border-yellow-500

// Danger (red)
bg-red-500 text-red-700 border-red-500

// Info (blue)
bg-blue-500 text-blue-700 border-blue-500

// Neutral (gray)
bg-gray-500 text-gray-700 border-gray-500
```

### Common Layouts
```tsx
// Container
<div className="container mx-auto px-4 py-8">

// Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Flex
<div className="flex items-center justify-between gap-4">

// Card
<div className="bg-white rounded-lg shadow p-6">
```

---

## 📚 Import Paths

All components use the package name imports:

```tsx
import { DataTable } from '@bitflow/ui/data-table';
import { LineChart } from '@bitflow/ui/line-chart';
import { BarChart } from '@bitflow/ui/bar-chart';
import { ProgressCircle } from '@bitflow/ui/progress-circle';
import { Select } from '@bitflow/ui/select';
import { DatePicker } from '@bitflow/ui/date-picker';
import { FileUpload } from '@bitflow/ui/file-upload';
import { Modal, ConfirmModal } from '@bitflow/ui/modal';

// Or import from main package (all exports)
import { 
  DataTable, 
  LineChart, 
  Select, 
  Modal 
} from '@bitflow/ui';
```

---

## 🚀 Quick Start Template

```tsx
'use client';

import { useState } from 'react';
import { DataTable, Modal, Select, DatePicker } from '@bitflow/ui';

export default function MyPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Page</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Add New
        </button>
      </div>

      <DataTable
        data={data}
        columns={columns}
        loading={isLoading}
        searchable
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Item"
        size="md"
      >
        <div className="space-y-4">
          <Select
            options={options}
            label="Select Option"
          />
          <DatePicker
            label="Select Date"
          />
        </div>
      </Modal>
    </div>
  );
}
```

---

**Ready to build pages with these components!** 🎉

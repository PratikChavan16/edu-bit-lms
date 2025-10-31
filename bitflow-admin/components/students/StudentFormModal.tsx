'use client';

import { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface Student {
  id: string;
  enrollment_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  department_id: string;
  year: number;
  semester: number;
  status: string;
  admission_date: string;
}

interface Department {
  id: string;
  name: string;
  code: string;
}

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  student?: Student | null;
  universityId: string;
  collegeId: string;
}

export default function StudentFormModal({
  isOpen,
  onClose,
  onSuccess,
  student = null,
  universityId,
  collegeId,
}: StudentFormModalProps) {
  const [formData, setFormData] = useState({
    enrollment_number: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    department_id: '',
    year: 1,
    semester: 1,
    status: 'active',
    admission_date: '',
  });
  const [departments, setDepartments] = useState<Department[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);

  // Fetch departments when modal opens
  useEffect(() => {
    if (isOpen && universityId && collegeId) {
      fetchDepartments();
    }
  }, [isOpen, universityId, collegeId]);

  // Reset form when modal opens/closes or student changes
  useEffect(() => {
    if (isOpen) {
      if (student) {
        // Edit mode
        setFormData({
          enrollment_number: student.enrollment_number,
          first_name: student.first_name,
          last_name: student.last_name,
          email: student.email,
          phone: student.phone || '',
          department_id: student.department_id,
          year: student.year,
          semester: student.semester,
          status: student.status,
          admission_date: student.admission_date,
        });
      } else {
        // Create mode
        setFormData({
          enrollment_number: '',
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          department_id: '',
          year: 1,
          semester: 1,
          status: 'active',
          admission_date: '',
        });
      }
      setErrors({});
      setApiError('');
    }
  }, [isOpen, student]);

  const fetchDepartments = async () => {
    setIsLoadingDepartments(true);
    try {
      const response = await apiClient.get<{ data: Department[] }>(
        `/admin/universities/${universityId}/colleges/${collegeId}/departments`
      );
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setApiError('Failed to load departments. Please try again.');
    } finally {
      setIsLoadingDepartments(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.enrollment_number.trim()) {
      newErrors.enrollment_number = 'Enrollment number is required';
    }

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.department_id) {
      newErrors.department_id = 'Department is required';
    }

    if (formData.year < 1 || formData.year > 4) {
      newErrors.year = 'Year must be between 1 and 4';
    }

    if (formData.semester < 1 || formData.semester > 8) {
      newErrors.semester = 'Semester must be between 1 and 8';
    }

    if (!formData.admission_date) {
      newErrors.admission_date = 'Admission date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setApiError('');

    try {
      const endpoint = student
        ? `/admin/universities/${universityId}/colleges/${collegeId}/students/${student.id}`
        : `/admin/universities/${universityId}/colleges/${collegeId}/students`;

      const method = student ? 'put' : 'post';

      await apiClient[method](endpoint, formData);

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving student:', error);
      if (error.response?.data?.message) {
        setApiError(error.response.data.message);
      } else if (error.response?.data?.errors) {
        // Laravel validation errors
        const validationErrors: Record<string, string> = {};
        Object.keys(error.response.data.errors).forEach((key) => {
          validationErrors[key] = error.response.data.errors[key][0];
        });
        setErrors(validationErrors);
      } else {
        setApiError('Failed to save student. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {student ? 'Edit Student' : 'Add Student'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* API Error */}
          {apiError && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{apiError}</p>
            </div>
          )}

          {/* Enrollment Number */}
          <div>
            <label htmlFor="enrollment_number" className="block text-sm font-medium text-gray-700 mb-1">
              Enrollment Number *
            </label>
            <input
              type="text"
              id="enrollment_number"
              value={formData.enrollment_number}
              onChange={(e) => setFormData({ ...formData, enrollment_number: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.enrollment_number ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="2024CS001"
              disabled={!!student} // Disable editing enrollment number
            />
            {errors.enrollment_number && <p className="mt-1 text-sm text-red-600">{errors.enrollment_number}</p>}
          </div>

          {/* Name Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  errors.first_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="John"
              />
              {errors.first_name && <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>}
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  errors.last_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Doe"
              />
              {errors.last_name && <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>}
            </div>
          </div>

          {/* Contact Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="john.doe@student.edu"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="+91 1234567890"
              />
            </div>
          </div>

          {/* Department */}
          <div>
            <label htmlFor="department_id" className="block text-sm font-medium text-gray-700 mb-1">
              Department *
            </label>
            <select
              id="department_id"
              value={formData.department_id}
              onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.department_id ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoadingDepartments}
            >
              <option value="">
                {isLoadingDepartments ? 'Loading...' : 'Select Department'}
              </option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name} ({dept.code})
                </option>
              ))}
            </select>
            {errors.department_id && <p className="mt-1 text-sm text-red-600">{errors.department_id}</p>}
          </div>

          {/* Year & Semester Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Year */}
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                Year *
              </label>
              <select
                id="year"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  errors.year ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value={1}>Year 1</option>
                <option value={2}>Year 2</option>
                <option value={3}>Year 3</option>
                <option value={4}>Year 4</option>
              </select>
              {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year}</p>}
            </div>

            {/* Semester */}
            <div>
              <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">
                Semester *
              </label>
              <select
                id="semester"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  errors.semester ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
              {errors.semester && <p className="mt-1 text-sm text-red-600">{errors.semester}</p>}
            </div>
          </div>

          {/* Status & Admission Date Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="graduated">Graduated</option>
                <option value="dropped">Dropped</option>
              </select>
            </div>

            {/* Admission Date */}
            <div>
              <label htmlFor="admission_date" className="block text-sm font-medium text-gray-700 mb-1">
                Admission Date *
              </label>
              <input
                type="date"
                id="admission_date"
                value={formData.admission_date}
                onChange={(e) => setFormData({ ...formData, admission_date: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  errors.admission_date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.admission_date && <p className="mt-1 text-sm text-red-600">{errors.admission_date}</p>}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
              disabled={isSubmitting || isLoadingDepartments}
            >
              {isSubmitting ? 'Saving...' : student ? 'Update Student' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

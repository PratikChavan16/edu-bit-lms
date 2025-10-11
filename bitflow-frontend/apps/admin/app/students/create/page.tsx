"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitflow/ui/card";
import { Button } from "@bitflow/ui/button";
import { Input } from "@bitflow/ui/input";

// Validation schema with advanced rules
const studentSchema = z.object({
  // Personal Information
  student_id: z.string().min(3, "Student ID must be at least 3 characters").regex(/^[A-Z0-9]+$/, "Student ID must be uppercase letters and numbers only"),
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address").regex(/@student\.(.*?)\.(edu|com|in)$/, "Must use student email domain"),
  phone: z.string().regex(/^\+?[0-9\s-]{10,15}$/, "Invalid phone number format"),
  date_of_birth: z.string().refine((date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 16 && age <= 35;
  }, "Student must be between 16 and 35 years old"),
  gender: z.enum(["male", "female", "other"], { required_error: "Gender is required" }),
  blood_group: z.string().optional(),
  address: z.string().min(10, "Address must be at least 10 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^[0-9]{6}$/, "Pincode must be 6 digits"),

  // Academic Information
  department_id: z.string().min(1, "Department is required"),
  college_id: z.string().min(1, "College is required"),
  batch: z.string().regex(/^\d{4}-\d{4}$/, "Batch format must be YYYY-YYYY (e.g., 2021-2025)"),
  semester: z.coerce.number().int().min(1, "Semester must be at least 1").max(8, "Semester cannot exceed 8"),
  roll_number: z.string().min(3, "Roll number is required").regex(/^[A-Z0-9]+$/, "Roll number must be uppercase letters and numbers"),
  enrollment_date: z.string(),
  status: z.enum(["active", "inactive", "graduated", "suspended"], { required_error: "Status is required" }),

  // Parent/Guardian Information
  parent_name: z.string().min(3, "Parent/Guardian name is required"),
  parent_phone: z.string().regex(/^\+?[0-9\s-]{10,15}$/, "Invalid phone number format"),
  parent_email: z.string().email("Invalid email address").optional().or(z.literal("")),
  guardian_relationship: z.string().optional(),

  // Additional Information
  emergency_contact: z.string().regex(/^\+?[0-9\s-]{10,15}$/, "Invalid phone number format"),
  medical_info: z.string().optional(),
  previous_education: z.string().optional(),
});

type StudentFormData = z.infer<typeof studentSchema>;

export default function CreateStudentPage() {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      status: "active",
      gender: "male",
      semester: 1,
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: StudentFormData) => {
      // TODO: Replace with actual API endpoint
      // const response = await fetch('/api/students', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      // return response.json();
      
      console.log('Creating student:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      alert('Student created successfully!');
      window.location.href = '/students';
    },
    onError: (error) => {
      console.error('Error creating student:', error);
      alert('Failed to create student. Please try again.');
    },
  });

  const onSubmit = async (data: StudentFormData) => {
    setIsSubmitting(true);
    try {
      await createMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Add New Student</h1>
          <p className="text-muted-foreground">
            Register a new student with complete personal, academic, and contact information.
          </p>
        </div>
        <Button variant="secondary" onClick={() => window.location.href = '/students'}>
          Back to Students
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section 1: Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Basic personal details of the student</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Input
                  label="Student ID *"
                  {...register("student_id")}
                  error={errors.student_id?.message}
                  placeholder="STU001"
                />
              </div>
              <div className="space-y-2">
                <Input
                  label="Roll Number *"
                  {...register("roll_number")}
                  error={errors.roll_number?.message}
                  placeholder="CSE21001"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Input
                  label="First Name *"
                  {...register("first_name")}
                  error={errors.first_name?.message}
                  placeholder="Rahul"
                />
              </div>
              <div className="space-y-2">
                <Input
                  label="Last Name *"
                  {...register("last_name")}
                  error={errors.last_name?.message}
                  placeholder="Sharma"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Gender *</label>
                <select
                  {...register("gender")}
                  className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-black ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-sm text-red-500">{errors.gender.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Input
                  label="Email *"
                  type="email"
                  {...register("email")}
                  error={errors.email?.message}
                  placeholder="rahul.sharma@student.mvp.edu"
                />
              </div>
              <div className="space-y-2">
                <Input
                  label="Phone Number *"
                  {...register("phone")}
                  error={errors.phone?.message}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Input
                  label="Date of Birth *"
                  type="date"
                  {...register("date_of_birth")}
                  error={errors.date_of_birth?.message}
                />
              </div>
              <div className="space-y-2">
                <Input
                  label="Blood Group"
                  {...register("blood_group")}
                  error={errors.blood_group?.message}
                  placeholder="O+"
                />
              </div>
              <div className="space-y-2">
                <Input
                  label="Emergency Contact *"
                  {...register("emergency_contact")}
                  error={errors.emergency_contact?.message}
                  placeholder="+91 98765 11111"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-1">
              <div className="space-y-2">
                <Input
                  label="Address *"
                  {...register("address")}
                  error={errors.address?.message}
                  placeholder="123 Main Street, Apartment 4B"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Input
                  label="City *"
                  {...register("city")}
                  error={errors.city?.message}
                  placeholder="Mumbai"
                />
              </div>
              <div className="space-y-2">
                <Input
                  label="State *"
                  {...register("state")}
                  error={errors.state?.message}
                  placeholder="Maharashtra"
                />
              </div>
              <div className="space-y-2">
                <Input
                  label="Pincode *"
                  {...register("pincode")}
                  error={errors.pincode?.message}
                  placeholder="400001"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Academic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Academic Information</CardTitle>
            <CardDescription>Enrollment and course details</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">College *</label>
                <select
                  {...register("college_id")}
                  className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-black ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select College</option>
                  <option value="1">MVP Engineering College</option>
                  <option value="2">Stellar Arts & Science College</option>
                  <option value="3">Greenfield Business Institute</option>
                </select>
                {errors.college_id && (
                  <p className="text-sm text-red-500">{errors.college_id.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Department *</label>
                <select
                  {...register("department_id")}
                  className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-black ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select Department</option>
                  <option value="1">Computer Science & Engineering - MVP</option>
                  <option value="2">Mechanical Engineering - MVP</option>
                  <option value="3">Business Administration - Greenfield</option>
                  <option value="4">English Literature - Stellar</option>
                </select>
                {errors.department_id && (
                  <p className="text-sm text-red-500">{errors.department_id.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Input
                  label="Batch *"
                  {...register("batch")}
                  error={errors.batch?.message}
                  placeholder="2021-2025"
                />
              </div>
              <div className="space-y-2">
                <Input
                  label="Semester *"
                  type="number"
                  {...register("semester")}
                  error={errors.semester?.message}
                  placeholder="1"
                />
              </div>
              <div className="space-y-2">
                <Input
                  label="Enrollment Date *"
                  type="date"
                  {...register("enrollment_date")}
                  error={errors.enrollment_date?.message}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status *</label>
                <select
                  {...register("status")}
                  className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-black ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="graduated">Graduated</option>
                  <option value="suspended">Suspended</option>
                </select>
                {errors.status && (
                  <p className="text-sm text-red-500">{errors.status.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Parent/Guardian Information */}
        <Card>
          <CardHeader>
            <CardTitle>Parent/Guardian Information</CardTitle>
            <CardDescription>Emergency contact and guardian details</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Input
                  label="Parent/Guardian Name *"
                  {...register("parent_name")}
                  error={errors.parent_name?.message}
                  placeholder="Mr. Anil Sharma"
                />
              </div>
              <div className="space-y-2">
                <Input
                  label="Relationship"
                  {...register("guardian_relationship")}
                  error={errors.guardian_relationship?.message}
                  placeholder="Father"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Input
                  label="Parent Phone Number *"
                  {...register("parent_phone")}
                  error={errors.parent_phone?.message}
                  placeholder="+91 98765 22222"
                />
              </div>
              <div className="space-y-2">
                <Input
                  label="Parent Email"
                  type="email"
                  {...register("parent_email")}
                  error={errors.parent_email?.message}
                  placeholder="parent@example.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>Medical history and previous education (optional)</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-1">
              <div className="space-y-2">
                <label className="text-sm font-medium">Medical Information</label>
                <textarea
                  {...register("medical_info")}
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-black ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Any allergies, medical conditions, or special needs..."
                />
                {errors.medical_info && (
                  <p className="text-sm text-red-500">{errors.medical_info.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-1">
              <div className="space-y-2">
                <label className="text-sm font-medium">Previous Education</label>
                <textarea
                  {...register("previous_education")}
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-black ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Previous school/college details, board, percentage..."
                />
                {errors.previous_education && (
                  <p className="text-sm text-red-500">{errors.previous_education.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Student'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => reset()}
            disabled={isSubmitting}
          >
            Reset Form
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => window.location.href = '/students'}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

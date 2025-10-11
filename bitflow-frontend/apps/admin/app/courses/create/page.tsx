"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitflow/ui/card";
import { Button } from "@bitflow/ui/button";
import { Input } from "@bitflow/ui/input";

// Validation schema
const courseSchema = z.object({
  course_code: z.string().min(3, "Course code must be at least 3 characters").regex(/^[A-Z]{2,4}[0-9]{3}$/, "Format: 2-4 letters + 3 digits (e.g., CS101)"),
  name: z.string().min(3, "Course name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  department_id: z.string().min(1, "Department is required"),
  credits: z.coerce.number().int().min(1, "Credits must be at least 1").max(6, "Credits cannot exceed 6"),
  semester: z.coerce.number().int().min(1, "Semester must be at least 1").max(8, "Semester cannot exceed 8"),
  type: z.enum(["theory", "practical", "lab"], { required_error: "Course type is required" }),
  hours_per_week: z.coerce.number().int().min(1, "Hours per week must be at least 1").max(20, "Hours per week cannot exceed 20"),
  prerequisites: z.string().optional(),
  faculty_id: z.string().optional(),
  status: z.enum(["active", "inactive", "archived"], { required_error: "Status is required" }),
});

type CourseFormData = z.infer<typeof courseSchema>;

export default function CreateCoursePage() {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      status: "active",
      type: "theory",
      credits: 3,
      semester: 1,
      hours_per_week: 4,
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: CourseFormData) => {
      // TODO: Replace with actual API endpoint
      // const response = await fetch('/api/courses', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      // return response.json();
      
      console.log('Creating course:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      alert('Course created successfully!');
      window.location.href = '/courses';
    },
    onError: (error) => {
      console.error('Error creating course:', error);
      alert('Failed to create course. Please try again.');
    },
  });

  const onSubmit = async (data: CourseFormData) => {
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
          <h1 className="text-2xl font-semibold">Add New Course</h1>
          <p className="text-muted-foreground">
            Create a new course with curriculum details and requirements.
          </p>
        </div>
        <Button variant="secondary" onClick={() => window.location.href = '/courses'}>
          Back to Courses
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Course identification and classification</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Input
                  label="Course Code *"
                  {...register("course_code")}
                  error={errors.course_code?.message}
                  placeholder="CS101"
                />
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

            <div className="grid gap-4 md:grid-cols-1">
              <div className="space-y-2">
                <Input
                  label="Course Name *"
                  {...register("name")}
                  error={errors.name?.message}
                  placeholder="Introduction to Programming"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-1">
              <div className="space-y-2">
                <label className="text-sm font-medium">Description *</label>
                <textarea
                  {...register("description")}
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-black ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Detailed description of the course content and objectives..."
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Details */}
        <Card>
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
            <CardDescription>Credits, semester, and type classification</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Input
                  label="Credits *"
                  type="number"
                  {...register("credits")}
                  error={errors.credits?.message}
                  placeholder="3"
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
                  label="Hours per Week *"
                  type="number"
                  {...register("hours_per_week")}
                  error={errors.hours_per_week?.message}
                  placeholder="4"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Course Type *</label>
                <select
                  {...register("type")}
                  className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-black ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="theory">Theory</option>
                  <option value="practical">Practical</option>
                  <option value="lab">Lab</option>
                </select>
                {errors.type && (
                  <p className="text-sm text-red-500">{errors.type.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status *</label>
                <select
                  {...register("status")}
                  className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-black ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="archived">Archived</option>
                </select>
                {errors.status && (
                  <p className="text-sm text-red-500">{errors.status.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>Prerequisites and faculty assignment (optional)</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-1">
              <div className="space-y-2">
                <Input
                  label="Prerequisites"
                  {...register("prerequisites")}
                  error={errors.prerequisites?.message}
                  placeholder="e.g., Mathematics I, Physics II"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-1">
              <div className="space-y-2">
                <label className="text-sm font-medium">Assigned Faculty</label>
                <select
                  {...register("faculty_id")}
                  className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-black ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Not assigned</option>
                  <option value="1">Dr. Rajesh Kumar - CS & Engineering</option>
                  <option value="2">Dr. Priya Mehta - Mechanical Engg</option>
                  <option value="3">Prof. Amit Verma - Business Admin</option>
                  <option value="4">Dr. Sarah Johnson - English Lit</option>
                </select>
                {errors.faculty_id && (
                  <p className="text-sm text-red-500">{errors.faculty_id.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Course'}
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
            onClick={() => window.location.href = '/courses'}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

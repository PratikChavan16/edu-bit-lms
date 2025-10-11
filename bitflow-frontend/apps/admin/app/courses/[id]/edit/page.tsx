"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitflow/ui/card";
import { Button } from "@bitflow/ui/button";
import { Input } from "@bitflow/ui/input";

// Validation schema (same as create)
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

interface EditCoursePageProps {
  params: {
    id: string;
  };
}

export default function EditCoursePage({ params }: EditCoursePageProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const courseId = params.id;

  // Fetch course data
  const { data: course, isLoading, error } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      // TODO: Replace with actual API endpoint
      // const response = await fetch(`/api/courses/${courseId}`);
      // return response.json();
      
      // Mock data based on courseId
      const mockCourses: Record<string, any> = {
        "1": {
          id: "1",
          course_code: "CS101",
          name: "Introduction to Programming",
          description: "Fundamentals of programming using Python",
          department_id: "1",
          credits: 4,
          semester: 1,
          type: "theory",
          hours_per_week: 5,
          prerequisites: "None",
          faculty_id: "1",
          status: "active",
        },
        "2": {
          id: "2",
          course_code: "CS102",
          name: "Programming Lab",
          description: "Hands-on programming practice",
          department_id: "1",
          credits: 2,
          semester: 1,
          type: "lab",
          hours_per_week: 4,
          prerequisites: "CS101 (Co-requisite)",
          faculty_id: "1",
          status: "active",
        },
      };
      
      return mockCourses[courseId] || mockCourses["1"];
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
  });

  // Pre-fill form when course data loads
  useEffect(() => {
    if (course) {
      reset({
        course_code: course.course_code,
        name: course.name,
        description: course.description,
        department_id: course.department_id,
        credits: course.credits,
        semester: course.semester,
        type: course.type,
        hours_per_week: course.hours_per_week,
        prerequisites: course.prerequisites || "",
        faculty_id: course.faculty_id || "",
        status: course.status,
      });
    }
  }, [course, reset]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: CourseFormData) => {
      // TODO: Replace with actual API endpoint
      // const response = await fetch(`/api/courses/${courseId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      // return response.json();
      
      console.log('Updating course:', courseId, data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      alert('Course updated successfully!');
      window.location.href = '/courses';
    },
    onError: (error) => {
      console.error('Error updating course:', error);
      alert('Failed to update course. Please try again.');
    },
  });

  const onSubmit = async (data: CourseFormData) => {
    setIsSubmitting(true);
    try {
      await updateMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading course data...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-red-500">Error loading course. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Edit Course</h1>
          <p className="text-muted-foreground">
            Update course information - {course?.name} ({course?.course_code})
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
            {isSubmitting ? 'Updating...' : 'Update Course'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => reset()}
            disabled={isSubmitting}
          >
            Reset Changes
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

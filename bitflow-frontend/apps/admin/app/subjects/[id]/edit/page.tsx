"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import { Button, Input } from "@bitflow/ui";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

// Mock data
const mockCourses = [
  { id: "1", name: "Computer Science" },
  { id: "2", name: "Mechanical Engineering" },
  { id: "3", name: "Business Administration" },
];

const mockFaculty = [
  { id: "1", name: "Dr. Rajesh Kumar" },
  { id: "2", name: "Prof. Priya Sharma" },
  { id: "3", name: "Dr. Amit Patel" },
  { id: "4", name: "Dr. Sarah Johnson" },
  { id: "5", name: "Prof. Anjali Verma" },
];

const mockSubjectsData: Record<string, any> = {
  "1": {
    id: "1",
    subjectCode: "CS101-TH",
    subjectName: "Introduction to Programming",
    courseId: "1",
    courseName: "Computer Science",
    type: "theory",
    credits: 4,
    hoursPerWeek: 5,
    semester: 1,
    facultyId: "1",
    facultyName: "Dr. Rajesh Kumar",
    prerequisites: "None",
    description: "Fundamental concepts of programming using C language",
    status: "active",
  },
  "2": {
    id: "2",
    subjectCode: "CS101-PR",
    subjectName: "Programming Lab",
    courseId: "1",
    courseName: "Computer Science",
    type: "practical",
    credits: 2,
    hoursPerWeek: 4,
    semester: 1,
    facultyId: "2",
    facultyName: "Prof. Priya Sharma",
    prerequisites: "CS101-TH",
    description: "Hands-on programming practice and problem solving",
    status: "active",
  },
};

// Validation schema
const subjectSchema = z.object({
  subjectCode: z
    .string()
    .min(1, "Subject code is required")
    .regex(/^[A-Z]{2,4}[0-9]{3}-(TH|PR|LB)$/, "Format: CS101-TH, ME201-PR, or BUS301-LB"),
  subjectName: z
    .string()
    .min(3, "Subject name must be at least 3 characters")
    .max(100, "Subject name must not exceed 100 characters"),
  courseId: z.string().min(1, "Course is required"),
  type: z.enum(["theory", "practical"], {
    required_error: "Subject type is required",
  }),
  credits: z
    .number()
    .min(1, "Credits must be at least 1")
    .max(6, "Credits must not exceed 6"),
  hoursPerWeek: z
    .number()
    .min(1, "Hours per week must be at least 1")
    .max(20, "Hours per week must not exceed 20"),
  semester: z
    .number()
    .min(1, "Semester must be at least 1")
    .max(8, "Semester must not exceed 8"),
  facultyId: z.string().min(1, "Faculty is required"),
  prerequisites: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"], {
    required_error: "Status is required",
  }),
});

type SubjectFormData = z.infer<typeof subjectSchema>;

export default function EditSubjectPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const subjectId = params.id as string;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
  });

  // Fetch subject data
  const { data: subject, isLoading } = useQuery({
    queryKey: ["subjects", subjectId],
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockSubjectsData[subjectId];
    },
  });

  // Update form when data is loaded
  useEffect(() => {
    if (subject) {
      reset({
        subjectCode: subject.subjectCode,
        subjectName: subject.subjectName,
        courseId: subject.courseId,
        type: subject.type,
        credits: subject.credits,
        hoursPerWeek: subject.hoursPerWeek,
        semester: subject.semester,
        facultyId: subject.facultyId,
        prerequisites: subject.prerequisites || "",
        description: subject.description || "",
        status: subject.status,
      });
    }
  }, [subject, reset]);

  const updateMutation = useMutation({
    mutationFn: async (data: SubjectFormData) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Updating subject:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      queryClient.invalidateQueries({ queryKey: ["subjects", subjectId] });
      router.push("/subjects");
    },
  });

  const onSubmit = (data: SubjectFormData) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading subject...</div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Subject not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/subjects">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Subject</h1>
          <p className="text-muted-foreground">
            Update subject information: {subject.subjectCode}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="rounded-lg border p-6 space-y-4">
          <h2 className="text-xl font-semibold">Basic Information</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="subjectCode" className="block text-sm font-medium text-gray-900">
                Subject Code <span className="text-red-500">*</span>
              </label>
              <Input
                id="subjectCode"
                placeholder="CS101-TH, ME201-PR"
                {...register("subjectCode")}
                className={errors.subjectCode ? "border-red-500" : ""}
              />
              {errors.subjectCode && (
                <p className="text-sm text-red-500">
                  {errors.subjectCode.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="subjectName" className="block text-sm font-medium text-gray-900">
                Subject Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="subjectName"
                placeholder="Introduction to Programming"
                {...register("subjectName")}
                className={errors.subjectName ? "border-red-500" : ""}
              />
              {errors.subjectName && (
                <p className="text-sm text-red-500">
                  {errors.subjectName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="courseId" className="block text-sm font-medium text-gray-900">
                Course <span className="text-red-500">*</span>
              </label>
              <select
                id="courseId"
                {...register("courseId")}
                className={`flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-black ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  errors.courseId ? "border-red-500" : ""
                }`}
              >
                <option value="">Select a course</option>
                {mockCourses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
              {errors.courseId && (
                <p className="text-sm text-red-500">{errors.courseId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="type" className="block text-sm font-medium text-gray-900">
                Subject Type <span className="text-red-500">*</span>
              </label>
              <select
                id="type"
                {...register("type")}
                className={`flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-black ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  errors.type ? "border-red-500" : ""
                }`}
              >
                <option value="">Select type</option>
                <option value="theory">Theory</option>
                <option value="practical">Practical</option>
              </select>
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Academic Details */}
        <div className="rounded-lg border p-6 space-y-4">
          <h2 className="text-xl font-semibold">Academic Details</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label htmlFor="credits" className="block text-sm font-medium text-gray-900">
                Credits <span className="text-red-500">*</span>
              </label>
              <Input
                id="credits"
                type="number"
                min="1"
                max="6"
                placeholder="4"
                {...register("credits", { valueAsNumber: true })}
                className={errors.credits ? "border-red-500" : ""}
              />
              {errors.credits && (
                <p className="text-sm text-red-500">{errors.credits.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="hoursPerWeek" className="block text-sm font-medium text-gray-900">
                Hours Per Week <span className="text-red-500">*</span>
              </label>
              <Input
                id="hoursPerWeek"
                type="number"
                min="1"
                max="20"
                placeholder="5"
                {...register("hoursPerWeek", { valueAsNumber: true })}
                className={errors.hoursPerWeek ? "border-red-500" : ""}
              />
              {errors.hoursPerWeek && (
                <p className="text-sm text-red-500">
                  {errors.hoursPerWeek.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="semester" className="block text-sm font-medium text-gray-900">
                Semester <span className="text-red-500">*</span>
              </label>
              <select
                id="semester"
                {...register("semester", { valueAsNumber: true })}
                className={`flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-black ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  errors.semester ? "border-red-500" : ""
                }`}
              >
                <option value="">Select semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
              {errors.semester && (
                <p className="text-sm text-red-500">{errors.semester.message}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-3">
              <label htmlFor="facultyId" className="block text-sm font-medium text-gray-900">
                Assigned Faculty <span className="text-red-500">*</span>
              </label>
              <select
                id="facultyId"
                {...register("facultyId")}
                className={`flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-black ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  errors.facultyId ? "border-red-500" : ""
                }`}
              >
                <option value="">Select faculty</option>
                {mockFaculty.map((faculty) => (
                  <option key={faculty.id} value={faculty.id}>
                    {faculty.name}
                  </option>
                ))}
              </select>
              {errors.facultyId && (
                <p className="text-sm text-red-500">{errors.facultyId.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="rounded-lg border p-6 space-y-4">
          <h2 className="text-xl font-semibold">Additional Information</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="prerequisites" className="block text-sm font-medium text-gray-900">Prerequisites</label>
              <Input
                id="prerequisites"
                placeholder="CS100, MATH101 (comma separated)"
                {...register("prerequisites")}
              />
              <p className="text-sm text-muted-foreground">
                Enter prerequisite subject codes separated by commas
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-900">Description</label>
              <textarea
                id="description"
                placeholder="Brief description of the subject..."
                rows={4}
                {...register("description")}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-black ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="status" className="block text-sm font-medium text-gray-900">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                {...register("status")}
                className={`flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-black ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  errors.status ? "border-red-500" : ""
                }`}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              {errors.status && (
                <p className="text-sm text-red-500">{errors.status.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link href="/subjects">
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Updating..." : "Update Subject"}
          </Button>
        </div>
      </form>
    </div>
  );
}

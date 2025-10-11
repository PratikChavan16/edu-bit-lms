"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@bitflow/ui";
import { Input } from "@bitflow/ui";
import { Label } from "@bitflow/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@bitflow/ui";
import { Textarea } from "@bitflow/ui";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// Mock data
const mockCourses = [
  { id: "1", name: "Computer Science" },
  { id: "2", name: "Mechanical Engineering" },
  { id: "3", name: "Business Administration" },
];

// Validation schema
const batchSchema = z.object({
  batchYear: z
    .string()
    .min(1, "Batch year is required")
    .regex(/^\d{4}-\d{4}$/, "Format: YYYY-YYYY (e.g., 2021-2025)"),
  batchName: z
    .string()
    .min(3, "Batch name must be at least 3 characters")
    .max(50, "Batch name must not exceed 50 characters"),
  courseId: z.string().min(1, "Course is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  currentSemester: z
    .number()
    .min(0, "Current semester must be at least 0")
    .max(8, "Current semester must not exceed 8"),
  enrollmentCapacity: z
    .number()
    .min(1, "Enrollment capacity must be at least 1")
    .max(500, "Enrollment capacity must not exceed 500"),
  description: z.string().optional(),
  status: z.enum(["active", "completed", "upcoming"], {
    required_error: "Status is required",
  }),
});

type BatchFormData = z.infer<typeof batchSchema>;

export default function CreateBatchPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BatchFormData>({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      status: "upcoming",
      currentSemester: 0,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: BatchFormData) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Creating batch:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batches"] });
      router.push("/batches");
    },
  });

  const onSubmit = (data: BatchFormData) => {
    createMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/batches">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Add New Batch</h1>
          <p className="text-muted-foreground">
            Create a new academic batch for enrollment
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
              <Label htmlFor="batchYear">
                Batch Year <span className="text-red-500">*</span>
              </Label>
              <Input
                id="batchYear"
                placeholder="2021-2025"
                {...register("batchYear")}
                className={errors.batchYear ? "border-red-500" : ""}
              />
              {errors.batchYear && (
                <p className="text-sm text-red-500">
                  {errors.batchYear.message}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Format: YYYY-YYYY (e.g., 2021-2025 for 4-year course)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="batchName">
                Batch Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="batchName"
                placeholder="Batch 2021"
                {...register("batchName")}
                className={errors.batchName ? "border-red-500" : ""}
              />
              {errors.batchName && (
                <p className="text-sm text-red-500">
                  {errors.batchName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="courseId">
                Course <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) => setValue("courseId", value)}
                defaultValue={watch("courseId")}
              >
                <SelectTrigger className="bg-white text-black">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {mockCourses.map((course) => (
                    <SelectItem key={course.id} value={course.id} className="text-black">
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.courseId && (
                <p className="text-sm text-red-500">{errors.courseId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">
                Status <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) => setValue("status", value as "active" | "completed" | "upcoming")}
                defaultValue={watch("status")}
              >
                <SelectTrigger className="bg-white text-black">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="upcoming" className="text-black">Upcoming</SelectItem>
                  <SelectItem value="active" className="text-black">Active</SelectItem>
                  <SelectItem value="completed" className="text-black">Completed</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-500">{errors.status.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Academic Details */}
        <div className="rounded-lg border p-6 space-y-4">
          <h2 className="text-xl font-semibold">Academic Details</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">
                Start Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="startDate"
                type="date"
                {...register("startDate")}
                className={errors.startDate ? "border-red-500" : ""}
              />
              {errors.startDate && (
                <p className="text-sm text-red-500">{errors.startDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">
                End Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="endDate"
                type="date"
                {...register("endDate")}
                className={errors.endDate ? "border-red-500" : ""}
              />
              {errors.endDate && (
                <p className="text-sm text-red-500">{errors.endDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentSemester">
                Current Semester <span className="text-red-500">*</span>
              </Label>
              <Input
                id="currentSemester"
                type="number"
                min="0"
                max="8"
                placeholder="1"
                {...register("currentSemester", { valueAsNumber: true })}
                className={errors.currentSemester ? "border-red-500" : ""}
              />
              {errors.currentSemester && (
                <p className="text-sm text-red-500">
                  {errors.currentSemester.message}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Use 0 for upcoming batches not yet started
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="enrollmentCapacity">
                Enrollment Capacity <span className="text-red-500">*</span>
              </Label>
              <Input
                id="enrollmentCapacity"
                type="number"
                min="1"
                max="500"
                placeholder="150"
                {...register("enrollmentCapacity", { valueAsNumber: true })}
                className={errors.enrollmentCapacity ? "border-red-500" : ""}
              />
              {errors.enrollmentCapacity && (
                <p className="text-sm text-red-500">
                  {errors.enrollmentCapacity.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="rounded-lg border p-6 space-y-4">
          <h2 className="text-xl font-semibold">Additional Information</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the batch..."
                rows={4}
                {...register("description")}
                className="bg-white text-black"
              />
              <p className="text-sm text-muted-foreground">
                Optional notes about the batch (e.g., special programs, initiatives)
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link href="/batches">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Creating..." : "Create Batch"}
          </Button>
        </div>
      </form>
    </div>
  );
}

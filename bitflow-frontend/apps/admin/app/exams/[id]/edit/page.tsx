"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Calendar, Clock, FileText, Users, Trash2 } from "lucide-react";

// Mock data for fetching
const mockExams = [
  {
    id: "1",
    name: "Data Structures Midterm Exam",
    courseId: "1",
    subjectId: "1",
    type: "midterm",
    date: "2025-11-15",
    startTime: "10:00",
    duration: 180,
    maxMarks: 100,
    passingMarks: 40,
    instructions: "Scientific calculator allowed. No mobile phones.",
    status: "scheduled",
    venue: "Main Hall A",
    invigilator: "Dr. Sharma",
  },
  {
    id: "2",
    name: "Database Management Final Exam",
    courseId: "1",
    subjectId: "2",
    type: "final",
    date: "2025-12-20",
    startTime: "14:00",
    duration: 180,
    maxMarks: 100,
    passingMarks: 40,
    instructions: "Open book exam. Laptops not allowed.",
    status: "scheduled",
    venue: "Main Hall B",
    invigilator: "Prof. Patel",
  },
];

// Validation schema
const examSchema = z.object({
  name: z.string().min(5, "Exam name must be at least 5 characters"),
  courseId: z.string().min(1, "Course is required"),
  subjectId: z.string().min(1, "Subject is required"),
  type: z.enum(["midterm", "final", "quiz", "assignment", "practical"], {
    required_error: "Exam type is required",
  }),
  date: z.string().min(1, "Exam date is required"),
  startTime: z.string().min(1, "Start time is required"),
  duration: z.coerce.number().min(15, "Duration must be at least 15 minutes"),
  maxMarks: z.coerce.number().min(1, "Max marks must be at least 1"),
  passingMarks: z.coerce.number().min(1, "Passing marks must be at least 1"),
  venue: z.string().min(3, "Venue is required"),
  invigilator: z.string().min(3, "Invigilator name is required"),
  instructions: z.string().optional(),
  status: z.enum(["scheduled", "ongoing", "completed", "cancelled"]),
}).refine((data) => data.passingMarks <= data.maxMarks, {
  message: "Passing marks cannot exceed max marks",
  path: ["passingMarks"],
});

type ExamFormData = z.infer<typeof examSchema>;

export default function EditExamPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const examId = params.id as string;

  // Fetch exam data
  const { data: exam, isLoading } = useQuery({
    queryKey: ["exams", examId],
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));
      const found = mockExams.find((e) => e.id === examId);
      if (!found) throw new Error("Exam not found");
      return found;
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ExamFormData>({
    resolver: zodResolver(examSchema),
    values: exam
      ? {
          ...exam,
          // Remove id and cast type/status to correct union types
          type: exam.type as ExamFormData["type"],
          status: exam.status as ExamFormData["status"],
        }
      : undefined,
  });

  // Watch max marks to validate passing marks
  const maxMarks = watch("maxMarks");

  const updateMutation = useMutation({
    mutationFn: async (data: ExamFormData) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Updating exam:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      router.push("/exams");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Deleting exam:", examId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      router.push("/exams");
    },
  });

  const onSubmit = async (data: ExamFormData) => {
    setIsSubmitting(true);
    try {
      await updateMutation.mutateAsync(data);
    } catch (error) {
      console.error("Error updating exam:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this exam? This action cannot be undone.")) {
      return;
    }
    setIsDeleting(true);
    try {
      await deleteMutation.mutateAsync();
    } catch (error) {
      console.error("Error deleting exam:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-3xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-6">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-500">Exam not found</p>
          <Link href="/exams" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
            Back to Exams
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/exams"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Exams
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Exam</h1>
            <p className="text-sm text-gray-500 mt-1">
              Update exam details and schedule
            </p>
          </div>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl">
        {/* Basic Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exam Name *
              </label>
              <input
                type="text"
                {...register("name")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Data Structures Midterm Exam"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course *
                </label>
                <select
                  {...register("courseId")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Course</option>
                  <option value="1">B.Tech Computer Science</option>
                  <option value="2">B.Tech Mechanical Engineering</option>
                  <option value="3">B.Tech Electrical Engineering</option>
                </select>
                {errors.courseId && (
                  <p className="text-red-500 text-sm mt-1">{errors.courseId.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <select
                  {...register("subjectId")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Subject</option>
                  <option value="1">Data Structures & Algorithms</option>
                  <option value="2">Database Management Systems</option>
                  <option value="3">Operating Systems</option>
                  <option value="4">Computer Networks</option>
                </select>
                {errors.subjectId && (
                  <p className="text-red-500 text-sm mt-1">{errors.subjectId.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exam Type *
              </label>
              <select
                {...register("type")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Type</option>
                <option value="midterm">Midterm Exam</option>
                <option value="final">Final Exam</option>
                <option value="quiz">Quiz</option>
                <option value="assignment">Assignment Test</option>
                <option value="practical">Practical Exam</option>
              </select>
              {errors.type && (
                <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Schedule & Duration */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Schedule & Duration</h2>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exam Date *
                </label>
                <input
                  type="date"
                  {...register("date")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time *
                </label>
                <input
                  type="time"
                  {...register("startTime")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.startTime && (
                  <p className="text-red-500 text-sm mt-1">{errors.startTime.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes) *
              </label>
              <input
                type="number"
                {...register("duration")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 180"
              />
              {errors.duration && (
                <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Common durations: 60 (1 hour), 120 (2 hours), 180 (3 hours)
              </p>
            </div>
          </div>
        </div>

        {/* Marks & Assessment */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Marks & Assessment</h2>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Marks *
                </label>
                <input
                  type="number"
                  {...register("maxMarks")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 100"
                />
                {errors.maxMarks && (
                  <p className="text-red-500 text-sm mt-1">{errors.maxMarks.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Passing Marks *
                </label>
                <input
                  type="number"
                  {...register("passingMarks")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 40"
                  max={maxMarks}
                />
                {errors.passingMarks && (
                  <p className="text-red-500 text-sm mt-1">{errors.passingMarks.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Venue & Logistics */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Venue & Logistics</h2>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Venue *
                </label>
                <input
                  type="text"
                  {...register("venue")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Main Hall A, Computer Lab 2"
                />
                {errors.venue && (
                  <p className="text-red-500 text-sm mt-1">{errors.venue.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invigilator *
                </label>
                <input
                  type="text"
                  {...register("invigilator")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Dr. Sharma, Prof. Patel"
                />
                {errors.invigilator && (
                  <p className="text-red-500 text-sm mt-1">{errors.invigilator.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exam Instructions
              </label>
              <textarea
                {...register("instructions")}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Calculators allowed. No mobile phones. Bring your ID card."
              />
              {errors.instructions && (
                <p className="text-red-500 text-sm mt-1">{errors.instructions.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
              <select
                {...register("status")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="scheduled">Scheduled</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              {errors.status && (
                <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
          <Link
            href="/exams"
            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Calendar, Users, Trash2, CheckCircle, XCircle, Clock } from "lucide-react";

// Mock attendance record
const mockAttendanceRecords = [
  {
    id: "1",
    studentId: "1",
    studentName: "Raj Kumar",
    rollNumber: "CS2021001",
    subjectId: "1",
    subjectName: "Data Structures & Algorithms",
    subjectCode: "CS201-TH",
    batchId: "1",
    batchName: "CS 2021-2025 Batch A",
    date: "2025-10-11",
    status: "present",
    markedBy: "Dr. Sharma",
    markedAt: "10:05",
    lectureTime: "10:00-11:00",
    notes: "",
  },
  {
    id: "3",
    studentId: "3",
    studentName: "Amit Patel",
    rollNumber: "CS2021003",
    subjectId: "1",
    subjectName: "Data Structures & Algorithms",
    subjectCode: "CS201-TH",
    batchId: "1",
    batchName: "CS 2021-2025 Batch A",
    date: "2025-10-11",
    status: "absent",
    markedBy: "Dr. Sharma",
    markedAt: "10:05",
    lectureTime: "10:00-11:00",
    notes: "Medical leave",
  },
];

// Validation schema
const attendanceSchema = z.object({
  status: z.enum(["present", "absent", "late", "excused"], {
    required_error: "Status is required",
  }),
  notes: z.string().optional(),
});

type AttendanceFormData = z.infer<typeof attendanceSchema>;

export default function EditAttendancePage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const recordId = params.id as string;

  // Fetch attendance record
  const { data: record, isLoading } = useQuery({
    queryKey: ["attendance", recordId],
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));
      const found = mockAttendanceRecords.find((r) => r.id === recordId);
      if (!found) throw new Error("Attendance record not found");
      return found;
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<AttendanceFormData>({
    resolver: zodResolver(attendanceSchema),
    values: record
      ? {
          status: record.status as any,
          notes: record.notes,
        }
      : undefined,
  });

  const status = watch("status");

  const updateMutation = useMutation({
    mutationFn: async (data: AttendanceFormData) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Updating attendance record:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      router.push("/attendance");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Deleting attendance record:", recordId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      router.push("/attendance");
    },
  });

  const onSubmit = async (data: AttendanceFormData) => {
    setIsSubmitting(true);
    try {
      await updateMutation.mutateAsync(data);
    } catch (error) {
      console.error("Error updating attendance record:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this attendance record? This action cannot be undone."
      )
    ) {
      return;
    }
    setIsDeleting(true);
    try {
      await deleteMutation.mutateAsync();
    } catch (error) {
      console.error("Error deleting attendance record:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-2xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-48 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-500">Attendance record not found</p>
          <Link href="/attendance" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
            Back to Attendance
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
          href="/attendance"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Attendance
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Attendance Record</h1>
            <p className="text-sm text-gray-500 mt-1">
              Update attendance status and notes
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

      {/* Record Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900">Record Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Student</p>
            <p className="text-sm font-medium text-gray-900">{record.studentName}</p>
            <p className="text-xs text-gray-500">{record.rollNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Subject</p>
            <p className="text-sm font-medium text-gray-900">{record.subjectName}</p>
            <p className="text-xs text-gray-500">{record.subjectCode}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Batch</p>
            <p className="text-sm font-medium text-gray-900">{record.batchName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date & Time</p>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-gray-400" />
              <p className="text-sm font-medium text-gray-900">
                {new Date(record.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <p className="text-xs text-gray-500">{record.lectureTime}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Marked By</p>
            <p className="text-sm font-medium text-gray-900">{record.markedBy}</p>
            <p className="text-xs text-gray-500">at {record.markedAt}</p>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl">
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Update Attendance</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attendance Status *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg cursor-pointer transition-all ${
                    status === "present"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    value="present"
                    {...register("status")}
                    className="sr-only"
                  />
                  <CheckCircle
                    className={`w-5 h-5 ${
                      status === "present" ? "text-green-600" : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      status === "present" ? "text-green-900" : "text-gray-700"
                    }`}
                  >
                    Present
                  </span>
                </label>

                <label
                  className={`flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg cursor-pointer transition-all ${
                    status === "absent"
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    value="absent"
                    {...register("status")}
                    className="sr-only"
                  />
                  <XCircle
                    className={`w-5 h-5 ${
                      status === "absent" ? "text-red-600" : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      status === "absent" ? "text-red-900" : "text-gray-700"
                    }`}
                  >
                    Absent
                  </span>
                </label>

                <label
                  className={`flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg cursor-pointer transition-all ${
                    status === "late"
                      ? "border-yellow-500 bg-yellow-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    value="late"
                    {...register("status")}
                    className="sr-only"
                  />
                  <Clock
                    className={`w-5 h-5 ${
                      status === "late" ? "text-yellow-600" : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      status === "late" ? "text-yellow-900" : "text-gray-700"
                    }`}
                  >
                    Late
                  </span>
                </label>

                <label
                  className={`flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg cursor-pointer transition-all ${
                    status === "excused"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    value="excused"
                    {...register("status")}
                    className="sr-only"
                  />
                  <CheckCircle
                    className={`w-5 h-5 ${
                      status === "excused" ? "text-blue-600" : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      status === "excused" ? "text-blue-900" : "text-gray-700"
                    }`}
                  >
                    Excused
                  </span>
                </label>
              </div>
              {errors.status && (
                <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                {...register("notes")}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add any notes about this attendance record..."
              />
              {errors.notes && (
                <p className="text-red-500 text-sm mt-1">{errors.notes.message}</p>
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
            href="/attendance"
            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

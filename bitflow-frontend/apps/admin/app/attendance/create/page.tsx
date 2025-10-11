"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Calendar, Users, CheckCircle, XCircle, Clock } from "lucide-react";

// Mock students data
const mockStudents = [
  { id: "1", name: "Raj Kumar", rollNumber: "CS2021001", email: "raj@example.com" },
  { id: "2", name: "Priya Sharma", rollNumber: "CS2021002", email: "priya@example.com" },
  { id: "3", name: "Amit Patel", rollNumber: "CS2021003", email: "amit@example.com" },
  { id: "4", name: "Sneha Reddy", rollNumber: "CS2021004", email: "sneha@example.com" },
  { id: "5", name: "Vikram Singh", rollNumber: "CS2021005", email: "vikram@example.com" },
];

// Validation schema
const attendanceSchema = z.object({
  subjectId: z.string().min(1, "Subject is required"),
  batchId: z.string().min(1, "Batch is required"),
  date: z.string().min(1, "Date is required"),
  lectureTime: z.string().min(1, "Lecture time is required"),
  attendanceRecords: z.array(
    z.object({
      studentId: z.string(),
      status: z.enum(["present", "absent", "late", "excused"]),
      notes: z.string().optional(),
    })
  ),
});

type AttendanceFormData = z.infer<typeof attendanceSchema>;

export default function CreateAttendancePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<AttendanceFormData>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
    },
  });

  const batchId = watch("batchId");

  // Fetch students for selected batch
  const { data: students = mockStudents, isLoading: loadingStudents } = useQuery({
    queryKey: ["students", batchId],
    queryFn: async () => {
      if (!batchId) return [];
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));
      // Initialize all students as present by default
      const initialStatus: Record<string, string> = {};
      mockStudents.forEach((student) => {
        if (!attendanceStatus[student.id]) {
          initialStatus[student.id] = "present";
        }
      });
      setAttendanceStatus((prev) => ({ ...initialStatus, ...prev }));
      return mockStudents;
    },
    enabled: !!batchId,
  });

  const createMutation = useMutation({
    mutationFn: async (data: AttendanceFormData) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Creating attendance records:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      router.push("/attendance");
    },
  });

  const onSubmit = async (data: AttendanceFormData) => {
    // Build attendance records from state
    const attendanceRecords = students.map((student) => ({
      studentId: student.id,
      status: attendanceStatus[student.id] || "present",
      notes: notes[student.id] || "",
    }));

    setIsSubmitting(true);
    try {
      await createMutation.mutateAsync({
        ...data,
        attendanceRecords: attendanceRecords as any,
      });
    } catch (error) {
      console.error("Error marking attendance:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendanceStatus((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleNotesChange = (studentId: string, note: string) => {
    setNotes((prev) => ({
      ...prev,
      [studentId]: note,
    }));
  };

  const markAllAs = (status: string) => {
    const newStatus: Record<string, string> = {};
    students.forEach((student) => {
      newStatus[student.id] = status;
    });
    setAttendanceStatus(newStatus);
  };

  const getStatusCounts = () => {
    const counts = { present: 0, absent: 0, late: 0, excused: 0 };
    Object.values(attendanceStatus).forEach((status) => {
      if (status in counts) {
        counts[status as keyof typeof counts]++;
      }
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

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
        <h1 className="text-2xl font-bold text-gray-900">Mark Attendance</h1>
        <p className="text-sm text-gray-500 mt-1">
          Mark attendance for a batch in bulk
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-5xl">
        {/* Lecture Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Lecture Details</h2>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Batch *
                </label>
                <select
                  {...register("batchId")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Batch</option>
                  <option value="1">CS 2021-2025 Batch A</option>
                  <option value="2">CS 2021-2025 Batch B</option>
                  <option value="3">CS 2022-2026 Batch A</option>
                </select>
                {errors.batchId && (
                  <p className="text-red-500 text-sm mt-1">{errors.batchId.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
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
                  Lecture Time *
                </label>
                <input
                  type="text"
                  {...register("lectureTime")}
                  placeholder="e.g., 10:00-11:00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.lectureTime && (
                  <p className="text-red-500 text-sm mt-1">{errors.lectureTime.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Marking */}
        {batchId && students.length > 0 && (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-xs text-gray-500">Present</p>
                    <p className="text-xl font-bold text-green-600">{statusCounts.present}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="text-xs text-gray-500">Absent</p>
                    <p className="text-xl font-bold text-red-600">{statusCounts.absent}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="text-xs text-gray-500">Late</p>
                    <p className="text-xl font-bold text-yellow-600">{statusCounts.late}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="text-xl font-bold text-gray-900">{students.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bulk Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-gray-400" />
                <h3 className="text-sm font-semibold text-gray-900">Quick Actions</h3>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => markAllAs("present")}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm font-medium"
                >
                  Mark All Present
                </button>
                <button
                  type="button"
                  onClick={() => markAllAs("absent")}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium"
                >
                  Mark All Absent
                </button>
              </div>
            </div>

            {/* Students List */}
            <div className="bg-white rounded-lg border border-gray-200 mb-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-400" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Students ({students.length})
                  </h2>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {students.map((student) => (
                  <div key={student.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{student.name}</p>
                        <p className="text-xs text-gray-500">
                          {student.rollNumber} • {student.email}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, "present")}
                          className={`px-3 py-1 text-xs font-medium rounded-lg ${
                            attendanceStatus[student.id] === "present"
                              ? "bg-green-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          Present
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, "absent")}
                          className={`px-3 py-1 text-xs font-medium rounded-lg ${
                            attendanceStatus[student.id] === "absent"
                              ? "bg-red-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          Absent
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, "late")}
                          className={`px-3 py-1 text-xs font-medium rounded-lg ${
                            attendanceStatus[student.id] === "late"
                              ? "bg-yellow-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          Late
                        </button>
                      </div>
                    </div>
                    {attendanceStatus[student.id] !== "present" && (
                      <div className="mt-2">
                        <input
                          type="text"
                          placeholder="Add notes (optional)"
                          value={notes[student.id] || ""}
                          onChange={(e) => handleNotesChange(student.id, e.target.value)}
                          className="w-full px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting || !batchId || students.length === 0}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? "Saving..." : "Save Attendance"}
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

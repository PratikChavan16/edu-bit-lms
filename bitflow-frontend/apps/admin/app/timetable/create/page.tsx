"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Calendar, Clock, Users, MapPin, AlertCircle } from "lucide-react";

// Validation schema
const timetableSchema = z.object({
  dayOfWeek: z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"], {
    required_error: "Day of week is required",
  }),
  timeSlot: z.string().min(1, "Time slot is required"),
  subjectId: z.string().min(1, "Subject is required"),
  facultyId: z.string().min(1, "Faculty is required"),
  room: z.string().min(3, "Room is required"),
  batchId: z.string().min(1, "Batch is required"),
  type: z.enum(["lecture", "lab", "tutorial", "seminar"], {
    required_error: "Class type is required",
  }),
  isRecurring: z.boolean(),
});

type TimetableFormData = z.infer<typeof timetableSchema>;

export default function CreateTimetablePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<TimetableFormData>({
    resolver: zodResolver(timetableSchema),
    defaultValues: {
      isRecurring: true,
      type: "lecture",
    },
  });

  const dayOfWeek = watch("dayOfWeek");
  const timeSlot = watch("timeSlot");
  const room = watch("room");

  // Check for conflicts when day/time/room changes
  const checkConflicts = () => {
    if (dayOfWeek && timeSlot && room) {
      // Simulate conflict detection
      // In real app, this would call an API to check if the slot is available
      setConflictWarning(null);
    }
  };

  const createMutation = useMutation({
    mutationFn: async (data: TimetableFormData) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Creating timetable entry:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timetable"] });
      router.push("/timetable");
    },
  });

  const onSubmit = async (data: TimetableFormData) => {
    setIsSubmitting(true);
    try {
      await createMutation.mutateAsync(data);
    } catch (error) {
      console.error("Error creating timetable entry:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/timetable"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Timetable
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Add Class Schedule</h1>
        <p className="text-sm text-gray-500 mt-1">
          Schedule a new class with time slot and room allocation
        </p>
      </div>

      {/* Conflict Warning */}
      {conflictWarning && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-yellow-900">Conflict Detected</h3>
              <p className="text-sm text-yellow-700 mt-1">{conflictWarning}</p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit as (data: any) => void)} className="max-w-3xl">
        {/* Schedule Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Schedule Details</h2>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Day of Week *
                </label>
                <select
                  {...register("dayOfWeek")}
                  onChange={(e) => {
                    register("dayOfWeek").onChange(e);
                    checkConflicts();
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Day</option>
                  <option value="monday">Monday</option>
                  <option value="tuesday">Tuesday</option>
                  <option value="wednesday">Wednesday</option>
                  <option value="thursday">Thursday</option>
                  <option value="friday">Friday</option>
                  <option value="saturday">Saturday</option>
                </select>
                {errors.dayOfWeek && (
                  <p className="text-red-500 text-sm mt-1">{errors.dayOfWeek.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time Slot *
                </label>
                <select
                  {...register("timeSlot")}
                  onChange={(e) => {
                    register("timeSlot").onChange(e);
                    checkConflicts();
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Time</option>
                  <option value="09:00-10:00">09:00 - 10:00 AM</option>
                  <option value="10:00-11:00">10:00 - 11:00 AM</option>
                  <option value="11:00-12:00">11:00 - 12:00 PM</option>
                  <option value="12:00-13:00">12:00 - 01:00 PM</option>
                  <option value="13:00-14:00">01:00 - 02:00 PM</option>
                  <option value="14:00-15:00">02:00 - 03:00 PM</option>
                  <option value="15:00-16:00">03:00 - 04:00 PM</option>
                  <option value="16:00-17:00">04:00 - 05:00 PM</option>
                </select>
                {errors.timeSlot && (
                  <p className="text-red-500 text-sm mt-1">{errors.timeSlot.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class Type *
              </label>
              <select
                {...register("type")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="lecture">Lecture</option>
                <option value="lab">Lab / Practical</option>
                <option value="tutorial">Tutorial</option>
                <option value="seminar">Seminar</option>
              </select>
              {errors.type && (
                <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Subject & Faculty */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Subject & Faculty</h2>
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
                  Faculty *
                </label>
                <select
                  {...register("facultyId")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Faculty</option>
                  <option value="1">Dr. Rajesh Sharma</option>
                  <option value="2">Prof. Anita Patel</option>
                  <option value="3">Dr. Kumar Reddy</option>
                  <option value="4">Dr. Priya Singh</option>
                </select>
                {errors.facultyId && (
                  <p className="text-red-500 text-sm mt-1">{errors.facultyId.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Room & Batch */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Room & Batch</h2>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room *
                </label>
                <input
                  type="text"
                  {...register("room")}
                  onChange={(e) => {
                    register("room").onChange(e);
                    checkConflicts();
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Room 301, Computer Lab 1"
                />
                {errors.room && (
                  <p className="text-red-500 text-sm mt-1">{errors.room.message}</p>
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

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                {...register("isRecurring")}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Recurring Weekly
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  This class will repeat every week on the selected day and time
                </p>
              </div>
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
            {isSubmitting ? "Scheduling..." : "Schedule Class"}
          </button>
          <Link
            href="/timetable"
            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

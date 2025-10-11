"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Calendar, Users, MapPin, Trash2 } from "lucide-react";

// Mock data
const mockTimetableEntries = [
  {
    id: "1",
    dayOfWeek: "monday",
    timeSlot: "09:00-10:00",
    subjectId: "1",
    facultyId: "1",
    room: "Room 301",
    batchId: "1",
    type: "lecture",
    isRecurring: true,
  },
];

// Validation schema
const timetableSchema = z.object({
  dayOfWeek: z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]),
  timeSlot: z.string().min(1, "Time slot is required"),
  subjectId: z.string().min(1, "Subject is required"),
  facultyId: z.string().min(1, "Faculty is required"),
  room: z.string().min(3, "Room is required"),
  batchId: z.string().min(1, "Batch is required"),
  type: z.enum(["lecture", "lab", "tutorial", "seminar"]),
  isRecurring: z.boolean(),
});

type TimetableFormData = z.infer<typeof timetableSchema>;

export default function EditTimetablePage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const entryId = params.id as string;

  const { data: entry, isLoading } = useQuery({
    queryKey: ["timetable", entryId],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const found = mockTimetableEntries.find((e) => e.id === entryId);
      if (!found) throw new Error("Timetable entry not found");
      return found;
    },
  });

  const { register, handleSubmit, formState: { errors } } = useForm<TimetableFormData>({
    resolver: zodResolver(timetableSchema),
    values: entry
      ? {
          ...entry,
          // Cast to the correct literal types
          type: entry.type as "lecture" | "lab" | "tutorial" | "seminar",
          dayOfWeek: entry.dayOfWeek as "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday",
        }
      : undefined,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: TimetableFormData) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Updating timetable entry:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timetable"] });
      router.push("/timetable");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Deleting timetable entry:", entryId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timetable"] });
      router.push("/timetable");
    },
  });

  const onSubmit = async (data: TimetableFormData) => {
    setIsSubmitting(true);
    try {
      await updateMutation.mutateAsync(data);
    } catch (error) {
      console.error("Error updating timetable entry:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this class schedule?")) return;
    setIsDeleting(true);
    try {
      await deleteMutation.mutateAsync();
    } catch (error) {
      console.error("Error deleting timetable entry:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <div className="p-6"><div className="text-center text-gray-500">Loading...</div></div>;
  }

  if (!entry) {
    return <div className="p-6"><div className="text-center text-gray-500">Entry not found</div></div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link href="/timetable" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Timetable
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Class Schedule</h1>
            <p className="text-sm text-gray-500 mt-1">Update schedule details</p>
          </div>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl">
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Schedule Details</h2>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Day *</label>
                <select {...register("dayOfWeek")} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option value="monday">Monday</option>
                  <option value="tuesday">Tuesday</option>
                  <option value="wednesday">Wednesday</option>
                  <option value="thursday">Thursday</option>
                  <option value="friday">Friday</option>
                  <option value="saturday">Saturday</option>
                </select>
                {errors.dayOfWeek && <p className="text-red-500 text-sm mt-1">{errors.dayOfWeek.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                <select {...register("timeSlot")} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option value="09:00-10:00">09:00-10:00</option>
                  <option value="10:00-11:00">10:00-11:00</option>
                  <option value="11:00-12:00">11:00-12:00</option>
                  <option value="14:00-15:00">14:00-15:00</option>
                </select>
                {errors.timeSlot && <p className="text-red-500 text-sm mt-1">{errors.timeSlot.message}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select {...register("type")} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option value="lecture">Lecture</option>
                <option value="lab">Lab</option>
                <option value="tutorial">Tutorial</option>
                <option value="seminar">Seminar</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Subject & Faculty</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
              <select {...register("subjectId")} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option value="1">Data Structures</option>
                <option value="2">DBMS</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Faculty *</label>
              <select {...register("facultyId")} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option value="1">Dr. Sharma</option>
                <option value="2">Prof. Patel</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Room & Batch</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room *</label>
              <input type="text" {...register("room")} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Batch *</label>
              <select {...register("batchId")} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option value="1">CS 2021-2025 A</option>
                <option value="2">CS 2021-2025 B</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
            <Save className="w-4 h-4" />
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
          <Link href="/timetable" className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200">Cancel</Link>
        </div>
      </form>
    </div>
  );
}

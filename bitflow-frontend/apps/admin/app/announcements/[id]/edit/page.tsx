"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, Save, Trash2, Archive, Eye } from "lucide-react";
import Link from "next/link";

// Mock data
const mockAnnouncementDetails = {
  id: "1",
  title: "Mid-Semester Examination Schedule",
  content: "The mid-semester examinations will be conducted from February 15-22, 2025. Students are advised to check the detailed timetable on the portal.",
  targetAudience: "students",
  priority: "high",
  isPinned: true,
  status: "active",
  expiresAt: "2025-02-22",
  notifyViaEmail: true,
  notifyViaSMS: false,
  createdBy: "Dr. Kumar",
  createdAt: "2025-01-10",
  views: 342,
};

const targetAudiences = [
  { value: "all", label: "Everyone (All Users)" },
  { value: "students", label: "All Students" },
  { value: "faculty", label: "All Faculty" },
  { value: "batch_cs2021", label: "CS 2021 Batch" },
  { value: "batch_cs2022", label: "CS 2022 Batch" },
  { value: "batch_cs2023", label: "CS 2023 Batch" },
];

const announcementSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  targetAudience: z.string().min(1, "Target audience is required"),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["draft", "active", "archived"]),
  isPinned: z.boolean(),
  expiresAt: z.string().min(1, "Expiry date is required"),
});

type AnnouncementFormData = z.infer<typeof announcementSchema>;

export default function EditAnnouncementPage() {
  const router = useRouter();
  const params = useParams();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: announcement = mockAnnouncementDetails, isLoading } = useQuery({
    queryKey: ["announcement", params.id],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockAnnouncementDetails;
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: announcement,
  });

  const title = watch("title") || "";
  const content = watch("content") || "";
  const status = watch("status");

  const updateAnnouncementMutation = useMutation({
    mutationFn: async (data: AnnouncementFormData) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return data;
    },
    onSuccess: () => {
      router.push("/announcements");
    },
  });

  const deleteAnnouncementMutation = useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return true;
    },
    onSuccess: () => {
      router.push("/announcements");
    },
  });

  const archiveAnnouncementMutation = useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return true;
    },
    onSuccess: () => {
      router.push("/announcements");
    },
  });

  const onSubmit = (data: AnnouncementFormData) => {
    updateAnnouncementMutation.mutate(data);
  };

  const handleDelete = () => {
    deleteAnnouncementMutation.mutate();
  };

  const handleArchive = () => {
    archiveAnnouncementMutation.mutate();
  };

  if (isLoading) {
    return <div className="p-6 text-center text-gray-500">Loading announcement...</div>;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/announcements"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Announcements
        </Link>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Announcement</h1>
            <p className="text-sm text-gray-500 mt-1">Update announcement details</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleArchive}
              disabled={archiveAnnouncementMutation.isPending}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <Archive className="w-4 h-4" />
              Archive
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          {/* Statistics Card */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{announcement.views}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created By</p>
                <p className="text-sm font-medium text-gray-900">{announcement.createdBy}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Published On</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(announcement.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("title")}
                  placeholder="Enter announcement title"
                  maxLength={100}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.title ? (
                    <p className="text-red-500 text-sm">{errors.title.message}</p>
                  ) : (
                    <span />
                  )}
                  <span className="text-xs text-gray-500">{title.length}/100</span>
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("content")}
                  rows={6}
                  placeholder="Enter announcement content..."
                  maxLength={1000}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.content ? (
                    <p className="text-red-500 text-sm">{errors.content.message}</p>
                  ) : (
                    <span />
                  )}
                  <span className="text-xs text-gray-500">{content.length}/1000</span>
                </div>
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Audience <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("targetAudience")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {targetAudiences.map((audience) => (
                    <option key={audience.value} value={audience.value}>
                      {audience.label}
                    </option>
                  ))}
                </select>
                {errors.targetAudience && (
                  <p className="text-red-500 text-sm mt-1">{errors.targetAudience.message}</p>
                )}
              </div>

              {/* Priority & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("priority")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("status")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Expires At */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expires On <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register("expiresAt")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                {errors.expiresAt && (
                  <p className="text-red-500 text-sm mt-1">{errors.expiresAt.message}</p>
                )}
              </div>

              {/* Pin Option */}
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register("isPinned")}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Pin to top of announcements</span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={updateAnnouncementMutation.isPending}
                  className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {updateAnnouncementMutation.isPending ? "Updating..." : "Update Announcement"}
                </button>
                <Link
                  href="/announcements"
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </form>

          {/* Delete Button */}
          <div className="mt-6">
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Announcement
            </button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg border border-gray-200 sticky top-6">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
            </div>
            <div className="p-4 rounded-lg border-2 border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{title || "Title"}</h4>
              <p className="text-sm text-gray-600 mb-3">{content || "Content"}</p>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    status === "active"
                      ? "bg-green-100 text-green-700"
                      : status === "draft"
                      ? "bg-gray-100 text-gray-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Announcement?</h3>
            <p className="text-sm text-gray-600 mb-6">
              This action cannot be undone. The announcement will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleteAnnouncementMutation.isPending}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400"
              >
                {deleteAnnouncementMutation.isPending ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

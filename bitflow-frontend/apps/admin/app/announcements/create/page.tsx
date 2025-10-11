"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Megaphone, Eye, Pin } from "lucide-react";
import Link from "next/link";

// Mock data
const targetAudiences = [
  { value: "all", label: "Everyone (All Users)", icon: "🌐" },
  { value: "students", label: "All Students", icon: "🎓" },
  { value: "faculty", label: "All Faculty", icon: "👨‍🏫" },
  { value: "batch_cs2021", label: "CS 2021 Batch", icon: "👥" },
  { value: "batch_cs2022", label: "CS 2022 Batch", icon: "👥" },
  { value: "batch_cs2023", label: "CS 2023 Batch", icon: "👥" },
];

const announcementSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  targetAudience: z.string().min(1, "Target audience is required"),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["draft", "active"]),
  isPinned: z.boolean().default(false),
  expiresAt: z.string().min(1, "Expiry date is required"),
  notifyViaEmail: z.boolean().default(false),
  notifyViaSMS: z.boolean().default(false),
});

type AnnouncementFormData = z.infer<typeof announcementSchema>;

export default function CreateAnnouncementPage() {
  const router = useRouter();
  const [charCount, setCharCount] = useState({ title: 0, content: 0 });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      priority: "medium",
      status: "draft",
      isPinned: false,
      notifyViaEmail: false,
      notifyViaSMS: false,
    },
  });

  const title = watch("title") || "";
  const content = watch("content") || "";
  const priority = watch("priority");
  const isPinned = watch("isPinned");
  const status = watch("status");

  const createAnnouncementMutation = useMutation({
    mutationFn: async (data: AnnouncementFormData) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return data;
    },
    onSuccess: () => {
      router.push("/announcements");
    },
  });

  const onSubmit = (data: AnnouncementFormData) => {
    createAnnouncementMutation.mutate(data);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

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
        <h1 className="text-2xl font-bold text-gray-900">Create Announcement</h1>
        <p className="text-sm text-gray-500 mt-1">Create a new announcement or notice</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
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
                  onChange={(e) => setCharCount({ ...charCount, title: e.target.value.length })}
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
                  onChange={(e) => setCharCount({ ...charCount, content: e.target.value.length })}
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
                  <option value="">Select Audience</option>
                  {targetAudiences.map((audience) => (
                    <option key={audience.value} value={audience.value}>
                      {audience.icon} {audience.label}
                    </option>
                  ))}
                </select>
                {errors.targetAudience && (
                  <p className="text-red-500 text-sm mt-1">{errors.targetAudience.message}</p>
                )}
              </div>

              {/* Priority & Expiry Date */}
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
                  {errors.priority && (
                    <p className="text-red-500 text-sm mt-1">{errors.priority.message}</p>
                  )}
                </div>

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
              </div>

              {/* Status & Pin Options */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register("isPinned")}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Pin className="w-4 h-4" />
                    Pin to top of announcements
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        {...register("status")}
                        value="draft"
                        className="border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Save as Draft</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        {...register("status")}
                        value="active"
                        className="border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Publish Now</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Notification Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Notification Options
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      {...register("notifyViaEmail")}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Send email notification</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      {...register("notifyViaSMS")}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Send SMS notification</span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={createAnnouncementMutation.isPending}
                  className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
                >
                  <Megaphone className="w-4 h-4" />
                  {createAnnouncementMutation.isPending ? "Creating..." : "Create Announcement"}
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
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg border border-gray-200 sticky top-6">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
            </div>
            <div
              className={`p-4 rounded-lg border-2 ${
                isPinned ? "border-yellow-300 bg-yellow-50" : "border-gray-200"
              }`}
            >
              {isPinned && (
                <div className="flex items-center gap-1 mb-2">
                  <Pin className="w-4 h-4 text-yellow-600 fill-yellow-600" />
                  <span className="text-xs text-yellow-700 font-medium">Pinned</span>
                </div>
              )}
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {title || "Announcement Title"}
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                {content || "Announcement content will appear here..."}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(priority)}`}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
                </span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                }`}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-600 font-medium">💡 Publishing Tips</p>
              <ul className="text-xs text-gray-600 mt-2 space-y-1">
                <li>• Keep title concise and descriptive</li>
                <li>• Use high priority for urgent matters</li>
                <li>• Pin important announcements</li>
                <li>• Set appropriate expiry dates</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

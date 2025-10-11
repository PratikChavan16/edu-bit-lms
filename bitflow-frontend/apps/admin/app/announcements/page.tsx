"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Search, Plus, Megaphone, Pin, Users, AlertCircle } from "lucide-react";

// Mock data
const mockAnnouncements = [
  {
    id: "1",
    title: "Mid-Semester Examination Schedule",
    content: "The mid-semester examinations will be conducted from February 15-22, 2025. Students are advised to check the detailed timetable on the portal.",
    targetAudience: "students",
    targetAudienceName: "All Students",
    priority: "high",
    isPinned: true,
    status: "active",
    createdBy: "Dr. Kumar",
    createdAt: "2025-01-10",
    expiresAt: "2025-02-22",
    views: 342,
  },
  {
    id: "2",
    title: "Faculty Meeting - January 20th",
    content: "All faculty members are requested to attend the monthly meeting on January 20th at 2:00 PM in the Conference Hall.",
    targetAudience: "faculty",
    targetAudienceName: "All Faculty",
    priority: "medium",
    isPinned: false,
    status: "active",
    createdBy: "Admin",
    createdAt: "2025-01-08",
    expiresAt: "2025-01-20",
    views: 45,
  },
  {
    id: "3",
    title: "Library Hours Extended During Exams",
    content: "The library will remain open from 8:00 AM to 10:00 PM during the examination period. Students can utilize the extended hours for preparation.",
    targetAudience: "all",
    targetAudienceName: "Everyone",
    priority: "medium",
    isPinned: true,
    status: "active",
    createdBy: "Librarian",
    createdAt: "2025-01-12",
    expiresAt: "2025-02-28",
    views: 156,
  },
  {
    id: "4",
    title: "Sports Day Registrations Open",
    content: "Annual Sports Day is scheduled for March 5th. Students interested in participating should register by February 15th.",
    targetAudience: "batch_cs2021",
    targetAudienceName: "CS 2021 Batch",
    priority: "low",
    isPinned: false,
    status: "draft",
    createdBy: "Sports Committee",
    createdAt: "2025-01-09",
    expiresAt: "2025-03-05",
    views: 89,
  },
  {
    id: "5",
    title: "System Maintenance Notice",
    content: "The university portal will undergo scheduled maintenance on January 18th from 11:00 PM to 3:00 AM. Services will be temporarily unavailable.",
    targetAudience: "all",
    targetAudienceName: "Everyone",
    priority: "high",
    isPinned: false,
    status: "active",
    createdBy: "IT Department",
    createdAt: "2025-01-15",
    expiresAt: "2025-01-19",
    views: 278,
  },
  {
    id: "6",
    title: "Guest Lecture on AI and Machine Learning",
    content: "Join us for an insightful guest lecture on AI and Machine Learning by industry expert Dr. Sharma on January 25th at 10:00 AM.",
    targetAudience: "students",
    targetAudienceName: "All Students",
    priority: "medium",
    isPinned: false,
    status: "archived",
    createdBy: "CS Department",
    createdAt: "2024-12-20",
    expiresAt: "2025-01-25",
    views: 421,
  },
];

export default function AnnouncementsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [targetFilter, setTargetFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: announcements = mockAnnouncements, isLoading } = useQuery({
    queryKey: ["announcements", searchQuery, targetFilter, priorityFilter, statusFilter],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockAnnouncements.filter((announcement) => {
        const matchesSearch =
          announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          announcement.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTarget =
          targetFilter === "all" ||
          announcement.targetAudience === targetFilter ||
          (targetFilter === "pinned" && announcement.isPinned);
        const matchesPriority = priorityFilter === "all" || announcement.priority === priorityFilter;
        const matchesStatus = statusFilter === "all" || announcement.status === statusFilter;
        return matchesSearch && matchesTarget && matchesPriority && matchesStatus;
      });
    },
  });

  const getPriorityBadge = (priority: string) => {
    const badges = {
      high: "bg-red-100 text-red-700",
      medium: "bg-yellow-100 text-yellow-700",
      low: "bg-blue-100 text-blue-700",
    };
    return badges[priority as keyof typeof badges] || "bg-gray-100 text-gray-700";
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: "bg-green-100 text-green-700",
      draft: "bg-gray-100 text-gray-700",
      archived: "bg-gray-100 text-gray-500",
    };
    return badges[status as keyof typeof badges] || "bg-gray-100 text-gray-700";
  };

  const getTargetIcon = (target: string) => {
    if (target.startsWith("batch_")) return "👥";
    if (target === "students") return "🎓";
    if (target === "faculty") return "👨‍🏫";
    return "🌐";
  };

  // Statistics
  const stats = {
    total: announcements.length,
    active: announcements.filter((a) => a.status === "active").length,
    pinned: announcements.filter((a) => a.isPinned).length,
    totalViews: announcements.reduce((acc, a) => acc + a.views, 0),
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements & Notices</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage announcements and communicate with students and faculty
          </p>
        </div>
        <Link
          href="/announcements/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Announcement
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Announcements</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Megaphone className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pinned</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pinned}</p>
            </div>
            <Pin className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Views</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalViews}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={targetFilter}
            onChange={(e) => setTargetFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Audiences</option>
            <option value="pinned">Pinned Only</option>
            <option value="students">Students</option>
            <option value="faculty">Faculty</option>
            <option value="batch_cs2021">Specific Batch</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Announcements Grid */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading announcements...</div>
        ) : announcements.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No announcements found</div>
        ) : (
          announcements.map((announcement) => (
            <div
              key={announcement.id}
              className={`bg-white p-6 rounded-lg border-2 ${
                announcement.isPinned ? "border-yellow-300 bg-yellow-50" : "border-gray-200"
              } hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {announcement.isPinned && (
                      <Pin className="w-4 h-4 text-yellow-600 fill-yellow-600" />
                    )}
                    <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{announcement.content}</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(
                        announcement.priority
                      )}`}
                    >
                      {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)} Priority
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                        announcement.status
                      )}`}
                    >
                      {announcement.status.charAt(0).toUpperCase() + announcement.status.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <span>{getTargetIcon(announcement.targetAudience)}</span>
                      {announcement.targetAudienceName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {announcement.views} views
                    </span>
                  </div>
                </div>
                <Link
                  href={`/announcements/${announcement.id}/edit`}
                  className="ml-4 text-blue-600 hover:text-blue-900 text-sm font-medium"
                >
                  Edit
                </Link>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>By {announcement.createdBy}</span>
                  <span>
                    Posted:{" "}
                    {new Date(announcement.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span>
                    Expires:{" "}
                    {new Date(announcement.expiresAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

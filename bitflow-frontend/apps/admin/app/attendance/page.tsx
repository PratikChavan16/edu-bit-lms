"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  Search,
  Plus,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  TrendingUp,
} from "lucide-react";

// Mock data
const mockAttendance = [
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
    id: "2",
    studentId: "2",
    studentName: "Priya Sharma",
    rollNumber: "CS2021002",
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
  {
    id: "4",
    studentId: "4",
    studentName: "Sneha Reddy",
    rollNumber: "CS2021004",
    subjectId: "1",
    subjectName: "Data Structures & Algorithms",
    subjectCode: "CS201-TH",
    batchId: "1",
    batchName: "CS 2021-2025 Batch A",
    date: "2025-10-11",
    status: "late",
    markedBy: "Dr. Sharma",
    markedAt: "10:05",
    lectureTime: "10:00-11:00",
    notes: "Arrived at 10:20",
  },
  {
    id: "5",
    studentId: "1",
    studentName: "Raj Kumar",
    rollNumber: "CS2021001",
    subjectId: "2",
    subjectName: "Database Management Systems",
    subjectCode: "CS202-TH",
    batchId: "1",
    batchName: "CS 2021-2025 Batch A",
    date: "2025-10-10",
    status: "present",
    markedBy: "Prof. Patel",
    markedAt: "14:05",
    lectureTime: "14:00-15:00",
    notes: "",
  },
  {
    id: "6",
    studentId: "2",
    studentName: "Priya Sharma",
    rollNumber: "CS2021002",
    subjectId: "2",
    subjectName: "Database Management Systems",
    subjectCode: "CS202-TH",
    batchId: "1",
    batchName: "CS 2021-2025 Batch A",
    date: "2025-10-10",
    status: "absent",
    markedBy: "Prof. Patel",
    markedAt: "14:05",
    lectureTime: "14:00-15:00",
    notes: "Unexcused absence",
  },
];

export default function AttendancePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [batchFilter, setBatchFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock query - replace with real API call
  const { data: attendanceRecords = mockAttendance, isLoading } = useQuery({
    queryKey: ["attendance", searchQuery, dateFrom, dateTo, subjectFilter, batchFilter, statusFilter],
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockAttendance.filter((record) => {
        const matchesSearch =
          record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.subjectName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDateFrom = !dateFrom || record.date >= dateFrom;
        const matchesDateTo = !dateTo || record.date <= dateTo;
        const matchesSubject = subjectFilter === "all" || record.subjectId === subjectFilter;
        const matchesBatch = batchFilter === "all" || record.batchId === batchFilter;
        const matchesStatus = statusFilter === "all" || record.status === statusFilter;
        return matchesSearch && matchesDateFrom && matchesDateTo && matchesSubject && matchesBatch && matchesStatus;
      });
    },
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      present: "bg-green-100 text-green-700",
      absent: "bg-red-100 text-red-700",
      late: "bg-yellow-100 text-yellow-700",
      excused: "bg-blue-100 text-blue-700",
    };
    return badges[status as keyof typeof badges] || "bg-gray-100 text-gray-700";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="w-4 h-4" />;
      case "absent":
        return <XCircle className="w-4 h-4" />;
      case "late":
        return <Clock className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // Statistics
  const stats = {
    total: attendanceRecords.length,
    present: attendanceRecords.filter((r) => r.status === "present").length,
    absent: attendanceRecords.filter((r) => r.status === "absent").length,
    late: attendanceRecords.filter((r) => r.status === "late").length,
  };

  const presentPercentage = stats.total > 0 ? ((stats.present / stats.total) * 100).toFixed(1) : 0;
  const absentPercentage = stats.total > 0 ? ((stats.absent / stats.total) * 100).toFixed(1) : 0;
  const latePercentage = stats.total > 0 ? ((stats.late / stats.total) * 100).toFixed(1) : 0;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track and manage student attendance records
          </p>
        </div>
        <Link
          href="/attendance/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Mark Attendance
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Records</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Present</p>
              <p className="text-2xl font-bold text-green-600">{stats.present}</p>
              <p className="text-xs text-gray-500">{presentPercentage}%</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Absent</p>
              <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
              <p className="text-xs text-gray-500">{absentPercentage}%</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Late</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
              <p className="text-xs text-gray-500">{latePercentage}%</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            placeholder="From Date"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            placeholder="To Date"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Subjects</option>
            <option value="1">Data Structures</option>
            <option value="2">DBMS</option>
            <option value="3">Operating Systems</option>
          </select>
          <select
            value={batchFilter}
            onChange={(e) => setBatchFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Batches</option>
            <option value="1">CS 2021-2025 A</option>
            <option value="2">CS 2021-2025 B</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
            <option value="excused">Excused</option>
          </select>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading attendance records...</div>
        ) : attendanceRecords.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No attendance records found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Batch
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lecture Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marked By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {attendanceRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{record.studentName}</div>
                      <div className="text-xs text-gray-500">{record.rollNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{record.subjectName}</div>
                      <div className="text-xs text-gray-500">{record.subjectCode}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.batchName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(record.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.lectureTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full flex items-center gap-1 w-fit ${getStatusBadge(
                          record.status
                        )}`}
                      >
                        {getStatusIcon(record.status)}
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{record.markedBy}</div>
                      <div className="text-xs text-gray-500">{record.markedAt}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {record.notes || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/attendance/${record.id}/edit`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

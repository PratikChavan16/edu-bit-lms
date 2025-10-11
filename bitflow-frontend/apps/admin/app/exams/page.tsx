"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  Search,
  Plus,
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

// Mock data
const mockExams = [
  {
    id: "1",
    name: "Data Structures Midterm Exam",
    courseId: "1",
    courseName: "B.Tech Computer Science",
    subjectId: "1",
    subjectName: "Data Structures & Algorithms",
    subjectCode: "CS201-TH",
    type: "midterm",
    date: "2025-11-15",
    startTime: "10:00",
    duration: 180,
    maxMarks: 100,
    passingMarks: 40,
    instructions: "Scientific calculator allowed. No mobile phones.",
    status: "scheduled",
    totalStudents: 85,
    venue: "Main Hall A",
    invigilator: "Dr. Sharma",
    createdAt: "2025-10-01",
  },
  {
    id: "2",
    name: "Database Management Final Exam",
    courseId: "1",
    courseName: "B.Tech Computer Science",
    subjectId: "2",
    subjectName: "Database Management Systems",
    subjectCode: "CS202-TH",
    type: "final",
    date: "2025-12-20",
    startTime: "14:00",
    duration: 180,
    maxMarks: 100,
    passingMarks: 40,
    instructions: "Open book exam. Laptops not allowed.",
    status: "scheduled",
    totalStudents: 82,
    venue: "Main Hall B",
    invigilator: "Prof. Patel",
    createdAt: "2025-10-02",
  },
  {
    id: "3",
    name: "Operating Systems Quiz 1",
    courseId: "1",
    courseName: "B.Tech Computer Science",
    subjectId: "3",
    subjectName: "Operating Systems",
    subjectCode: "CS203-TH",
    type: "quiz",
    date: "2025-10-25",
    startTime: "11:00",
    duration: 60,
    maxMarks: 25,
    passingMarks: 10,
    instructions: "Multiple choice questions. No negative marking.",
    status: "completed",
    totalStudents: 88,
    venue: "Room 301",
    invigilator: "Dr. Kumar",
    createdAt: "2025-09-15",
  },
  {
    id: "4",
    name: "Computer Networks Assignment Test",
    courseId: "1",
    courseName: "B.Tech Computer Science",
    subjectId: "4",
    subjectName: "Computer Networks",
    subjectCode: "CS204-TH",
    type: "assignment",
    date: "2025-11-05",
    startTime: "09:00",
    duration: 120,
    maxMarks: 50,
    passingMarks: 20,
    instructions: "Submit code via GitHub. Documentation required.",
    status: "ongoing",
    totalStudents: 80,
    venue: "Computer Lab 2",
    invigilator: "Dr. Reddy",
    createdAt: "2025-10-05",
  },
  {
    id: "5",
    name: "Software Engineering Midterm",
    courseId: "1",
    courseName: "B.Tech Computer Science",
    subjectId: "5",
    subjectName: "Software Engineering",
    subjectCode: "CS205-TH",
    type: "midterm",
    date: "2025-10-10",
    startTime: "15:00",
    duration: 150,
    maxMarks: 80,
    passingMarks: 32,
    instructions: "Case study based questions. Diagrams required.",
    status: "cancelled",
    totalStudents: 75,
    venue: "Room 402",
    invigilator: "Prof. Singh",
    createdAt: "2025-09-20",
  },
  {
    id: "6",
    name: "Artificial Intelligence Practical Exam",
    courseId: "1",
    courseName: "B.Tech Computer Science",
    subjectId: "6",
    subjectName: "Artificial Intelligence",
    subjectCode: "CS301-PR",
    type: "practical",
    date: "2025-11-30",
    startTime: "10:00",
    duration: 240,
    maxMarks: 100,
    passingMarks: 40,
    instructions: "Implement ML algorithms. Dataset will be provided.",
    status: "scheduled",
    totalStudents: 70,
    venue: "AI Lab",
    invigilator: "Dr. Mehta",
    createdAt: "2025-10-08",
  },
];

export default function ExamsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock query - replace with real API call
  const { data: exams = mockExams, isLoading } = useQuery({
    queryKey: ["exams", searchQuery, courseFilter, subjectFilter, typeFilter, statusFilter],
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockExams.filter((exam) => {
        const matchesSearch =
          exam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exam.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exam.subjectCode.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCourse = courseFilter === "all" || exam.courseId === courseFilter;
        const matchesSubject = subjectFilter === "all" || exam.subjectId === subjectFilter;
        const matchesType = typeFilter === "all" || exam.type === typeFilter;
        const matchesStatus = statusFilter === "all" || exam.status === statusFilter;
        return matchesSearch && matchesCourse && matchesSubject && matchesType && matchesStatus;
      });
    },
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      scheduled: "bg-blue-100 text-blue-700",
      ongoing: "bg-yellow-100 text-yellow-700",
      completed: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return badges[status as keyof typeof badges] || "bg-gray-100 text-gray-700";
  };

  const getTypeBadge = (type: string) => {
    const badges = {
      midterm: "bg-purple-100 text-purple-700",
      final: "bg-indigo-100 text-indigo-700",
      quiz: "bg-pink-100 text-pink-700",
      assignment: "bg-orange-100 text-orange-700",
      practical: "bg-teal-100 text-teal-700",
    };
    return badges[type as keyof typeof badges] || "bg-gray-100 text-gray-700";
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
    if (hours > 0) return `${hours}h`;
    return `${mins}m`;
  };

  // Statistics
  const stats = {
    total: exams.length,
    scheduled: exams.filter((e) => e.status === "scheduled").length,
    ongoing: exams.filter((e) => e.status === "ongoing").length,
    completed: exams.filter((e) => e.status === "completed").length,
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Exams Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and schedule exams, quizzes, and assessments
          </p>
        </div>
        <Link
          href="/exams/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Exam
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Exams</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Scheduled</p>
              <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Ongoing</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.ongoing}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search exams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-700"
          >
            <option value="all">All Courses</option>
            <option value="1">B.Tech Computer Science</option>
            <option value="2">B.Tech Mechanical</option>
          </select>
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-700"
          >
            <option value="all">All Subjects</option>
            <option value="1">Data Structures</option>
            <option value="2">DBMS</option>
            <option value="3">Operating Systems</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-700"
          >
            <option value="all">All Types</option>
            <option value="midterm">Midterm</option>
            <option value="final">Final</option>
            <option value="quiz">Quiz</option>
            <option value="assignment">Assignment</option>
            <option value="practical">Practical</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-700"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Exams Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading exams...</div>
        ) : exams.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No exams found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exam Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Max Marks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Students
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {exams.map((exam) => (
                  <tr key={exam.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{exam.name}</div>
                      <div className="text-xs text-gray-500">{exam.venue}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {exam.courseName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{exam.subjectName}</div>
                      <div className="text-xs text-gray-500">{exam.subjectCode}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeBadge(
                          exam.type
                        )}`}
                      >
                        {exam.type.charAt(0).toUpperCase() + exam.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(exam.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3 text-gray-400" />
                        {exam.startTime}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDuration(exam.duration)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {exam.maxMarks}
                      <span className="text-xs text-gray-500"> (Pass: {exam.passingMarks})</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {exam.totalStudents}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                          exam.status
                        )}`}
                      >
                        {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/exams/${exam.id}/edit`}
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

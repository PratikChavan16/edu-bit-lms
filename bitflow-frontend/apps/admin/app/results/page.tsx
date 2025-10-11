"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Search, Plus, Award, TrendingUp, TrendingDown, Target } from "lucide-react";

// Mock data
const mockResults = [
  {
    id: "1",
    studentId: "1",
    studentName: "Raj Kumar",
    rollNumber: "CS2021001",
    examId: "1",
    examName: "Data Structures Midterm",
    subjectId: "1",
    subjectName: "Data Structures & Algorithms",
    subjectCode: "CS201-TH",
    batchId: "1",
    batchName: "CS 2021-2025 Batch A",
    maxMarks: 100,
    marksObtained: 87,
    grade: "A",
    gradePoint: 9.0,
    rank: 2,
    totalStudents: 85,
    status: "passed",
    remarks: "Excellent performance",
    declaredDate: "2025-11-20",
  },
  {
    id: "2",
    studentId: "2",
    studentName: "Priya Sharma",
    rollNumber: "CS2021002",
    examId: "1",
    examName: "Data Structures Midterm",
    subjectId: "1",
    subjectName: "Data Structures & Algorithms",
    subjectCode: "CS201-TH",
    batchId: "1",
    batchName: "CS 2021-2025 Batch A",
    maxMarks: 100,
    marksObtained: 92,
    grade: "A+",
    gradePoint: 10.0,
    rank: 1,
    totalStudents: 85,
    status: "passed",
    remarks: "Outstanding",
    declaredDate: "2025-11-20",
  },
  {
    id: "3",
    studentId: "3",
    studentName: "Amit Patel",
    rollNumber: "CS2021003",
    examId: "1",
    examName: "Data Structures Midterm",
    subjectId: "1",
    subjectName: "Data Structures & Algorithms",
    subjectCode: "CS201-TH",
    batchId: "1",
    batchName: "CS 2021-2025 Batch A",
    maxMarks: 100,
    marksObtained: 35,
    grade: "F",
    gradePoint: 0.0,
    rank: 82,
    totalStudents: 85,
    status: "failed",
    remarks: "Below passing marks",
    declaredDate: "2025-11-20",
  },
  {
    id: "4",
    studentId: "4",
    studentName: "Sneha Reddy",
    rollNumber: "CS2021004",
    examId: "2",
    examName: "DBMS Final Exam",
    subjectId: "2",
    subjectName: "Database Management Systems",
    subjectCode: "CS202-TH",
    batchId: "1",
    batchName: "CS 2021-2025 Batch A",
    maxMarks: 100,
    marksObtained: 78,
    grade: "B+",
    gradePoint: 8.0,
    rank: 15,
    totalStudents: 82,
    status: "passed",
    remarks: "Good work",
    declaredDate: "2025-12-25",
  },
  {
    id: "5",
    studentId: "1",
    studentName: "Raj Kumar",
    rollNumber: "CS2021001",
    examId: "3",
    examName: "OS Quiz 1",
    subjectId: "3",
    subjectName: "Operating Systems",
    subjectCode: "CS203-TH",
    batchId: "1",
    batchName: "CS 2021-2025 Batch A",
    maxMarks: 25,
    marksObtained: 23,
    grade: "A+",
    gradePoint: 10.0,
    rank: 1,
    totalStudents: 88,
    status: "passed",
    remarks: "Perfect score",
    declaredDate: "2025-10-28",
  },
  {
    id: "6",
    studentId: "5",
    studentName: "Vikram Singh",
    rollNumber: "CS2021005",
    examId: "1",
    examName: "Data Structures Midterm",
    subjectId: "1",
    subjectName: "Data Structures & Algorithms",
    subjectCode: "CS201-TH",
    batchId: "1",
    batchName: "CS 2021-2025 Batch A",
    maxMarks: 100,
    marksObtained: null,
    grade: "AB",
    gradePoint: 0.0,
    rank: null,
    totalStudents: 85,
    status: "absent",
    remarks: "Absent",
    declaredDate: "2025-11-20",
  },
];

export default function ResultsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [examFilter, setExamFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [batchFilter, setBatchFilter] = useState("all");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock query - replace with real API call
  const { data: results = mockResults, isLoading } = useQuery({
    queryKey: ["results", searchQuery, examFilter, subjectFilter, batchFilter, gradeFilter, statusFilter],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockResults.filter((result) => {
        const matchesSearch =
          result.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.examName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesExam = examFilter === "all" || result.examId === examFilter;
        const matchesSubject = subjectFilter === "all" || result.subjectId === subjectFilter;
        const matchesBatch = batchFilter === "all" || result.batchId === batchFilter;
        const matchesGrade = gradeFilter === "all" || result.grade === gradeFilter;
        const matchesStatus = statusFilter === "all" || result.status === statusFilter;
        return matchesSearch && matchesExam && matchesSubject && matchesBatch && matchesGrade && matchesStatus;
      });
    },
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      passed: "bg-green-100 text-green-700",
      failed: "bg-red-100 text-red-700",
      absent: "bg-gray-100 text-gray-700",
      pending: "bg-yellow-100 text-yellow-700",
    };
    return badges[status as keyof typeof badges] || "bg-gray-100 text-gray-700";
  };

  const getGradeBadge = (grade: string) => {
    const badges = {
      "A+": "bg-green-600 text-white",
      "A": "bg-green-500 text-white",
      "B+": "bg-blue-500 text-white",
      "B": "bg-blue-400 text-white",
      "C+": "bg-yellow-500 text-white",
      "C": "bg-yellow-400 text-white",
      "D": "bg-orange-500 text-white",
      "F": "bg-red-600 text-white",
      "AB": "bg-gray-500 text-white",
    };
    return badges[grade as keyof typeof badges] || "bg-gray-400 text-white";
  };

  const getPercentage = (obtained: number | null, max: number) => {
    if (obtained === null) return "-";
    return ((obtained / max) * 100).toFixed(1) + "%";
  };

  // Statistics
  const stats = {
    total: results.filter((r) => r.status !== "absent").length,
    passed: results.filter((r) => r.status === "passed").length,
    failed: results.filter((r) => r.status === "failed").length,
    absent: results.filter((r) => r.status === "absent").length,
    avgPercentage: results
      .filter((r) => r.marksObtained !== null)
      .reduce((acc, r) => acc + ((r.marksObtained! / r.maxMarks) * 100), 0) / 
      results.filter((r) => r.marksObtained !== null).length || 0,
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Results & Grades Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage exam results, grades, and student performance
          </p>
        </div>
        <Link
          href="/results/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Result
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Results</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Award className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Passed</p>
              <p className="text-2xl font-bold text-green-600">{stats.passed}</p>
              <p className="text-xs text-gray-500">
                {stats.total > 0 ? ((stats.passed / stats.total) * 100).toFixed(1) : 0}% pass rate
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Failed</p>
              <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
              <p className="text-xs text-gray-500">
                {stats.total > 0 ? ((stats.failed / stats.total) * 100).toFixed(1) : 0}% fail rate
              </p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Score</p>
              <p className="text-2xl font-bold text-blue-600">{stats.avgPercentage.toFixed(1)}%</p>
            </div>
            <Target className="w-8 h-8 text-blue-500" />
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
              placeholder="Search student, exam..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={examFilter}
            onChange={(e) => setExamFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Exams</option>
            <option value="1">DS Midterm</option>
            <option value="2">DBMS Final</option>
            <option value="3">OS Quiz 1</option>
          </select>
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
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Grades</option>
            <option value="A+">A+</option>
            <option value="A">A</option>
            <option value="B+">B+</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="F">F</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="passed">Passed</option>
            <option value="failed">Failed</option>
            <option value="absent">Absent</option>
          </select>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading results...</div>
        ) : results.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No results found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exam
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
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
                {results.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{result.studentName}</div>
                      <div className="text-xs text-gray-500">{result.rollNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{result.examName}</div>
                      <div className="text-xs text-gray-500">{result.batchName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{result.subjectName}</div>
                      <div className="text-xs text-gray-500">{result.subjectCode}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {result.marksObtained !== null ? (
                        <span className="font-medium">
                          {result.marksObtained}/{result.maxMarks}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getPercentage(result.marksObtained, result.maxMarks)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded ${getGradeBadge(
                          result.grade
                        )}`}
                      >
                        {result.grade}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">GP: {result.gradePoint}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {result.rank ? (
                        <div>
                          <span className="font-medium">#{result.rank}</span>
                          <span className="text-xs text-gray-500"> / {result.totalStudents}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                          result.status
                        )}`}
                      >
                        {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/results/${result.id}/edit`}
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

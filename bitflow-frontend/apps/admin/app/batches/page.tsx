"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Button } from "@bitflow/ui";
import { Input } from "@bitflow/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@bitflow/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@bitflow/ui";
import { Badge } from "@bitflow/ui";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Mock data
const mockBatches = [
  {
    id: "1",
    batchYear: "2021-2025",
    batchName: "Batch 2021",
    courseId: "1",
    courseName: "Computer Science",
    startDate: "2021-08-01",
    endDate: "2025-06-30",
    currentSemester: 7,
    totalStudents: 120,
    enrollmentCapacity: 150,
    status: "active",
  },
  {
    id: "2",
    batchYear: "2022-2026",
    batchName: "Batch 2022",
    courseId: "1",
    courseName: "Computer Science",
    startDate: "2022-08-01",
    endDate: "2026-06-30",
    currentSemester: 5,
    totalStudents: 135,
    enrollmentCapacity: 150,
    status: "active",
  },
  {
    id: "3",
    batchYear: "2023-2027",
    batchName: "Batch 2023",
    courseId: "2",
    courseName: "Mechanical Engineering",
    startDate: "2023-08-01",
    endDate: "2027-06-30",
    currentSemester: 3,
    totalStudents: 98,
    enrollmentCapacity: 120,
    status: "active",
  },
  {
    id: "4",
    batchYear: "2024-2028",
    batchName: "Batch 2024",
    courseId: "1",
    courseName: "Computer Science",
    startDate: "2024-08-01",
    endDate: "2028-06-30",
    currentSemester: 1,
    totalStudents: 145,
    enrollmentCapacity: 150,
    status: "active",
  },
  {
    id: "5",
    batchYear: "2020-2024",
    batchName: "Batch 2020",
    courseId: "3",
    courseName: "Business Administration",
    startDate: "2020-08-01",
    endDate: "2024-06-30",
    currentSemester: 8,
    totalStudents: 85,
    enrollmentCapacity: 100,
    status: "completed",
  },
  {
    id: "6",
    batchYear: "2025-2029",
    batchName: "Batch 2025",
    courseId: "2",
    courseName: "Mechanical Engineering",
    startDate: "2025-08-01",
    endDate: "2029-06-30",
    currentSemester: 0,
    totalStudents: 0,
    enrollmentCapacity: 120,
    status: "upcoming",
  },
];

const mockCourses = [
  { id: "1", name: "Computer Science" },
  { id: "2", name: "Mechanical Engineering" },
  { id: "3", name: "Business Administration" },
];

export default function BatchesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch batches
  const { data: batches = [], isLoading } = useQuery({
    queryKey: ["batches"],
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockBatches;
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batches"] });
    },
  });

  // Filter batches
  const filteredBatches = batches.filter((batch) => {
    const matchesSearch =
      batch.batchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.batchYear.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse =
      courseFilter === "all" || batch.courseId === courseFilter;
    const matchesStatus =
      statusFilter === "all" || batch.status === statusFilter;
    return matchesSearch && matchesCourse && matchesStatus;
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this batch?")) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      completed: "secondary",
      upcoming: "outline",
    };
    return (
      <Badge variant={variants[status as keyof typeof variants] || "outline"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getEnrollmentStatus = (total: number, capacity: number) => {
    const percentage = (total / capacity) * 100;
    if (percentage >= 90) return <Badge variant="destructive">{percentage.toFixed(0)}%</Badge>;
    if (percentage >= 70) return <Badge variant="default">{percentage.toFixed(0)}%</Badge>;
    return <Badge variant="secondary">{percentage.toFixed(0)}%</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading batches...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Batches</h1>
          <p className="text-muted-foreground">
            Manage academic batches and enrollment
          </p>
        </div>
        <Link href="/batches/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Batch
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by batch name, year, or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <Select value={courseFilter} onValueChange={setCourseFilter}>
          <SelectTrigger className="w-[200px] bg-white text-black">
            <SelectValue placeholder="All Courses" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all" className="text-black">All Courses</SelectItem>
            {mockCourses.map((course) => (
              <SelectItem key={course.id} value={course.id} className="text-black">
                {course.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px] bg-white text-black">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all" className="text-black">All Status</SelectItem>
            <SelectItem value="active" className="text-black">Active</SelectItem>
            <SelectItem value="completed" className="text-black">Completed</SelectItem>
            <SelectItem value="upcoming" className="text-black">Upcoming</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Total Batches
          </div>
          <div className="text-2xl font-bold">{batches.length}</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Active Batches
          </div>
          <div className="text-2xl font-bold">
            {batches.filter((b) => b.status === "active").length}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Total Students
          </div>
          <div className="text-2xl font-bold">
            {batches.reduce((sum, b) => sum + b.totalStudents, 0)}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Avg Enrollment
          </div>
          <div className="text-2xl font-bold">
            {batches.length > 0
              ? ((batches.reduce((sum, b) => sum + (b.totalStudents / b.enrollmentCapacity) * 100, 0) / batches.length)).toFixed(0)
              : 0}%
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Batch Year</TableHead>
              <TableHead>Batch Name</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Current Semester</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Enrollment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBatches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center">
                  No batches found
                </TableCell>
              </TableRow>
            ) : (
              filteredBatches.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell className="font-medium">{batch.batchYear}</TableCell>
                  <TableCell>{batch.batchName}</TableCell>
                  <TableCell>{batch.courseName}</TableCell>
                  <TableCell>{new Date(batch.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(batch.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>{batch.currentSemester || "Not Started"}</TableCell>
                  <TableCell>
                    {batch.totalStudents} / {batch.enrollmentCapacity}
                  </TableCell>
                  <TableCell>
                    {getEnrollmentStatus(batch.totalStudents, batch.enrollmentCapacity)}
                  </TableCell>
                  <TableCell>{getStatusBadge(batch.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/batches/${batch.id}/edit`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(batch.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

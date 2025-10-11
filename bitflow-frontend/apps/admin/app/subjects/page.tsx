"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Button, Input, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Badge } from "@bitflow/ui";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Mock data
const mockSubjects = [
  {
    id: "1",
    subjectCode: "CS101-TH",
    subjectName: "Introduction to Programming",
    courseId: "1",
    courseName: "Computer Science",
    type: "theory",
    credits: 4,
    hoursPerWeek: 5,
    semester: 1,
    facultyId: "1",
    facultyName: "Dr. Rajesh Kumar",
    status: "active",
  },
  {
    id: "2",
    subjectCode: "CS101-PR",
    subjectName: "Programming Lab",
    courseId: "1",
    courseName: "Computer Science",
    type: "practical",
    credits: 2,
    hoursPerWeek: 4,
    semester: 1,
    facultyId: "2",
    facultyName: "Prof. Priya Sharma",
    status: "active",
  },
  {
    id: "3",
    subjectCode: "CS201-TH",
    subjectName: "Data Structures",
    courseId: "1",
    courseName: "Computer Science",
    type: "theory",
    credits: 4,
    hoursPerWeek: 5,
    semester: 3,
    facultyId: "1",
    facultyName: "Dr. Rajesh Kumar",
    status: "active",
  },
  {
    id: "4",
    subjectCode: "ME101-TH",
    subjectName: "Engineering Mechanics",
    courseId: "2",
    courseName: "Mechanical Engineering",
    type: "theory",
    credits: 3,
    hoursPerWeek: 4,
    semester: 1,
    facultyId: "3",
    facultyName: "Dr. Amit Patel",
    status: "active",
  },
  {
    id: "5",
    subjectCode: "BUS301-TH",
    subjectName: "Financial Management",
    courseId: "3",
    courseName: "Business Administration",
    type: "theory",
    credits: 3,
    hoursPerWeek: 4,
    semester: 5,
    facultyId: "4",
    facultyName: "Dr. Sarah Johnson",
    status: "active",
  },
  {
    id: "6",
    subjectCode: "CS202-PR",
    subjectName: "Database Lab",
    courseId: "1",
    courseName: "Computer Science",
    type: "practical",
    credits: 2,
    hoursPerWeek: 4,
    semester: 4,
    facultyId: "5",
    facultyName: "Prof. Anjali Verma",
    status: "inactive",
  },
];

const mockCourses = [
  { id: "1", name: "Computer Science" },
  { id: "2", name: "Mechanical Engineering" },
  { id: "3", name: "Business Administration" },
];

export default function SubjectsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [semesterFilter, setSemesterFilter] = useState("all");

  // Fetch subjects
  const { data: subjects = [], isLoading } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockSubjects;
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
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });

  // Filter subjects
  const filteredSubjects = subjects.filter((subject) => {
    const matchesSearch =
      subject.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.subjectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.facultyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse =
      courseFilter === "all" || subject.courseId === courseFilter;
    const matchesType =
      typeFilter === "all" || subject.type === typeFilter;
    const matchesSemester =
      semesterFilter === "all" || subject.semester.toString() === semesterFilter;
    return matchesSearch && matchesCourse && matchesType && matchesSemester;
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this subject?")) {
      deleteMutation.mutate(id);
    }
  };

  const getTypeBadge = (type: string) => {
    const variants: Record<string, "default" | "secondary"> = {
      theory: "default",
      practical: "secondary",
    };
    const variant: "default" | "secondary" | "outline" =
      variants[type] ?? "outline";
    return (
      <Badge variant={variant}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant={status === "active" ? "default" : "destructive"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading subjects...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Subjects</h1>
          <p className="text-muted-foreground">
            Manage subjects and course curriculum
          </p>
        </div>
        <Link href="/subjects/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Subject
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by subject name, code, or faculty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <select 
          value={courseFilter} 
          onChange={(e) => setCourseFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-black focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Courses</option>
          {mockCourses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
        <select 
          value={typeFilter} 
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-black focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Types</option>
          <option value="theory">Theory</option>
          <option value="practical">Practical</option>
        </select>
        <select 
          value={semesterFilter} 
          onChange={(e) => setSemesterFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-black focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Semesters</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
            <option key={sem} value={sem.toString()}>
              Semester {sem}
            </option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Total Subjects
          </div>
          <div className="text-2xl font-bold">{subjects.length}</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Theory Subjects
          </div>
          <div className="text-2xl font-bold">
            {subjects.filter((s) => s.type === "theory").length}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Practical Subjects
          </div>
          <div className="text-2xl font-bold">
            {subjects.filter((s) => s.type === "practical").length}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Active Subjects
          </div>
          <div className="text-2xl font-bold">
            {subjects.filter((s) => s.status === "active").length}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject Code</TableHead>
              <TableHead>Subject Name</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Hours/Week</TableHead>
              <TableHead>Semester</TableHead>
              <TableHead>Faculty</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center">
                  No subjects found
                </TableCell>
              </TableRow>
            ) : (
              filteredSubjects.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell className="font-medium">
                    {subject.subjectCode}
                  </TableCell>
                  <TableCell>{subject.subjectName}</TableCell>
                  <TableCell>{subject.courseName}</TableCell>
                  <TableCell>{getTypeBadge(subject.type)}</TableCell>
                  <TableCell>{subject.credits}</TableCell>
                  <TableCell>{subject.hoursPerWeek}</TableCell>
                  <TableCell>{subject.semester}</TableCell>
                  <TableCell>{subject.facultyName}</TableCell>
                  <TableCell>{getStatusBadge(subject.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          router.push(`/subjects/${subject.id}/edit`)
                        }
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(subject.id)}
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

"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitflow/ui/card";
import { Badge } from "@bitflow/ui/badge";
import { Button } from "@bitflow/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@bitflow/ui/table";
import { Input } from "@bitflow/ui/input";

// Type definition for Course
interface Course {
  id: string;
  course_code: string;
  name: string;
  description?: string;
  department_id: string;
  department_name?: string;
  college_name?: string;
  credits: number;
  semester: number;
  type: "theory" | "practical" | "lab";
  hours_per_week?: number;
  prerequisites?: string;
  faculty_id?: string;
  faculty_name?: string;
  status: "active" | "inactive" | "archived";
  created_at?: string;
}

const statusMap: Record<string, "success" | "secondary" | "warning"> = {
  active: "success",
  inactive: "secondary",
  archived: "warning",
};

const typeMap: Record<string, "default" | "secondary" | "outline"> = {
  theory: "default",
  practical: "secondary",
  lab: "outline",
};

export default function CoursesPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");

  // Fetch courses from API
  const { data: courses = [], isLoading, error } = useQuery({
    queryKey: ['courses', searchQuery, departmentFilter, semesterFilter],
    queryFn: async () => {
      // TODO: Replace with actual API endpoint
      // const response = await fetch(`/api/courses?search=${searchQuery}&department=${departmentFilter}&semester=${semesterFilter}`);
      // return response.json();
      
      // Mock data for now
      return [
        {
          id: "1",
          course_code: "CS101",
          name: "Introduction to Programming",
          description: "Fundamentals of programming using Python",
          department_id: "1",
          department_name: "Computer Science & Engineering",
          college_name: "MVP Engineering College",
          credits: 4,
          semester: 1,
          type: "theory" as const,
          hours_per_week: 5,
          prerequisites: "None",
          faculty_id: "1",
          faculty_name: "Dr. Rajesh Kumar",
          status: "active" as const,
          created_at: "2024-01-15",
        },
        {
          id: "2",
          course_code: "CS102",
          name: "Programming Lab",
          description: "Hands-on programming practice",
          department_id: "1",
          department_name: "Computer Science & Engineering",
          college_name: "MVP Engineering College",
          credits: 2,
          semester: 1,
          type: "lab" as const,
          hours_per_week: 4,
          prerequisites: "CS101 (Co-requisite)",
          faculty_id: "1",
          faculty_name: "Dr. Rajesh Kumar",
          status: "active" as const,
          created_at: "2024-01-15",
        },
        {
          id: "3",
          course_code: "ME201",
          name: "Engineering Mechanics",
          description: "Study of forces and motion",
          department_id: "2",
          department_name: "Mechanical Engineering",
          college_name: "MVP Engineering College",
          credits: 3,
          semester: 3,
          type: "theory" as const,
          hours_per_week: 4,
          prerequisites: "Physics I, Mathematics II",
          faculty_id: "2",
          faculty_name: "Dr. Priya Mehta",
          status: "active" as const,
          created_at: "2024-01-15",
        },
        {
          id: "4",
          course_code: "ME202",
          name: "Workshop Practice",
          description: "Practical training in mechanical workshop",
          department_id: "2",
          department_name: "Mechanical Engineering",
          college_name: "MVP Engineering College",
          credits: 2,
          semester: 3,
          type: "practical" as const,
          hours_per_week: 6,
          prerequisites: "None",
          faculty_id: "2",
          faculty_name: "Dr. Priya Mehta",
          status: "active" as const,
          created_at: "2024-01-15",
        },
        {
          id: "5",
          course_code: "BUS301",
          name: "Marketing Management",
          description: "Principles and practices of marketing",
          department_id: "3",
          department_name: "Business Administration",
          college_name: "Greenfield Business Institute",
          credits: 3,
          semester: 5,
          type: "theory" as const,
          hours_per_week: 4,
          prerequisites: "Introduction to Business",
          faculty_id: "3",
          faculty_name: "Prof. Amit Verma",
          status: "active" as const,
          created_at: "2024-01-15",
        },
        {
          id: "6",
          course_code: "ENG201",
          name: "Shakespeare Studies",
          description: "Analysis of Shakespeare's major works",
          department_id: "4",
          department_name: "English Literature",
          college_name: "Stellar Arts & Science College",
          credits: 3,
          semester: 3,
          type: "theory" as const,
          hours_per_week: 4,
          prerequisites: "English Literature I",
          faculty_id: "4",
          faculty_name: "Dr. Sarah Johnson",
          status: "inactive" as const,
          created_at: "2024-01-15",
        },
      ] as Course[];
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // TODO: Replace with actual API endpoint
      // await fetch(`/api/courses/${id}`, { method: 'DELETE' });
      console.log('Delete course:', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      deleteMutation.mutate(id);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading courses...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-red-500">Error loading courses. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold">Courses Management</h1>
          <p className="text-muted-foreground">
            Manage course catalog, credits, and curriculum across all departments.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">Import CSV</Button>
          <Button variant="secondary">Export</Button>
          <Button onClick={() => window.location.href = '/courses/create'}>
            Add Course
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Input
              type="text"
              placeholder="Search by course name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="md:col-span-1"
            />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="flex h-10 rounded-md border border-input bg-white px-3 py-2 text-sm text-black ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">All Departments</option>
              <option value="1">Computer Science & Engineering</option>
              <option value="2">Mechanical Engineering</option>
              <option value="3">Business Administration</option>
              <option value="4">English Literature</option>
            </select>
            <select
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
              className="flex h-10 rounded-md border border-input bg-white px-3 py-2 text-sm text-black ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">All Semesters</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
              <option value="3">Semester 3</option>
              <option value="4">Semester 4</option>
              <option value="5">Semester 5</option>
              <option value="6">Semester 6</option>
              <option value="7">Semester 7</option>
              <option value="8">Semester 8</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Courses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Courses Overview</CardTitle>
          <CardDescription>
            All courses with curriculum details. Total: {courses.length} courses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-center">Credits</TableHead>
                  <TableHead className="text-center">Semester</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Faculty</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground">
                      No courses found.
                    </TableCell>
                  </TableRow>
                ) : (
                  courses.map((course) => (
                    <TableRow key={course.id} className="hover:bg-muted/40">
                      <TableCell className="font-mono text-xs font-semibold">
                        {course.course_code}
                      </TableCell>
                      <TableCell className="font-medium">{course.name}</TableCell>
                      <TableCell className="text-sm">{course.department_name}</TableCell>
                      <TableCell className="text-center font-semibold">
                        {course.credits}
                      </TableCell>
                      <TableCell className="text-center">{course.semester}</TableCell>
                      <TableCell>
                        <Badge variant={typeMap[course.type] ?? "default"}>
                          {course.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {course.faculty_name || "Not assigned"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusMap[course.status] ?? "secondary"}>
                          {course.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => window.location.href = `/courses/${course.id}`}
                          >
                            View
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => window.location.href = `/courses/${course.id}/edit`}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(course.id)}
                            disabled={deleteMutation.isPending}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

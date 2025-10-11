"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitflow/ui/card";
import { Badge } from "@bitflow/ui/badge";
import { Button } from "@bitflow/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@bitflow/ui/table";
import { Input } from "@bitflow/ui/input";

// Type definition for Student
interface Student {
  id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: "male" | "female" | "other";
  department_id: string;
  department_name?: string;
  college_name?: string;
  batch: string;
  semester: number;
  enrollment_date: string;
  status: "active" | "inactive" | "graduated" | "suspended";
  gpa?: number;
  parent_name?: string;
  parent_phone?: string;
  address?: string;
  photo_url?: string;
  created_at?: string;
}

const statusMap: Record<string, "success" | "secondary" | "warning" | "destructive"> = {
  active: "success",
  inactive: "secondary",
  graduated: "warning",
  suspended: "destructive",
};

export default function StudentsPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [collegeFilter, setCollegeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [batchFilter, setBatchFilter] = useState("");

  // Fetch students from API
  const { data: students = [], isLoading, error } = useQuery({
    queryKey: ['students', searchQuery, departmentFilter, collegeFilter, statusFilter, batchFilter],
    queryFn: async () => {
      // TODO: Replace with actual API endpoint
      // const response = await fetch(`/api/students?search=${searchQuery}&department=${departmentFilter}&college=${collegeFilter}&status=${statusFilter}&batch=${batchFilter}`);
      // return response.json();
      
      // Mock data for now
      return [
        {
          id: "1",
          student_id: "STU001",
          first_name: "Rahul",
          last_name: "Sharma",
          email: "rahul.sharma@student.mvp.edu",
          phone: "+91 98765 11111",
          date_of_birth: "2003-08-15",
          gender: "male" as const,
          department_id: "1",
          department_name: "Computer Science & Engineering",
          college_name: "MVP Engineering College",
          batch: "2021-2025",
          semester: 6,
          enrollment_date: "2021-08-01",
          status: "active" as const,
          gpa: 8.5,
          parent_name: "Mr. Anil Sharma",
          parent_phone: "+91 98765 22222",
          address: "123 Main Street, Mumbai",
          created_at: "2021-08-01",
        },
        {
          id: "2",
          student_id: "STU002",
          first_name: "Priya",
          last_name: "Patel",
          email: "priya.patel@student.mvp.edu",
          phone: "+91 98765 11112",
          date_of_birth: "2003-05-20",
          gender: "female" as const,
          department_id: "2",
          department_name: "Mechanical Engineering",
          college_name: "MVP Engineering College",
          batch: "2021-2025",
          semester: 6,
          enrollment_date: "2021-08-01",
          status: "active" as const,
          gpa: 9.1,
          parent_name: "Mrs. Meera Patel",
          parent_phone: "+91 98765 22223",
          address: "456 Park Avenue, Mumbai",
          created_at: "2021-08-01",
        },
        {
          id: "3",
          student_id: "STU003",
          first_name: "Arjun",
          last_name: "Kumar",
          email: "arjun.kumar@student.greenfield.edu",
          phone: "+91 98765 11113",
          date_of_birth: "2002-11-10",
          gender: "male" as const,
          department_id: "3",
          department_name: "Business Administration",
          college_name: "Greenfield Business Institute",
          batch: "2020-2024",
          semester: 8,
          enrollment_date: "2020-08-01",
          status: "active" as const,
          gpa: 7.8,
          parent_name: "Mr. Suresh Kumar",
          parent_phone: "+91 98765 22224",
          address: "789 Lake Road, Delhi",
          created_at: "2020-08-01",
        },
        {
          id: "4",
          student_id: "STU004",
          first_name: "Sneha",
          last_name: "Reddy",
          email: "sneha.reddy@student.stellar.edu",
          phone: "+91 98765 11114",
          date_of_birth: "2004-03-25",
          gender: "female" as const,
          department_id: "4",
          department_name: "English Literature",
          college_name: "Stellar Arts & Science College",
          batch: "2022-2025",
          semester: 4,
          enrollment_date: "2022-08-01",
          status: "active" as const,
          gpa: 8.9,
          parent_name: "Dr. Ramesh Reddy",
          parent_phone: "+91 98765 22225",
          address: "321 Hill View, Hyderabad",
          created_at: "2022-08-01",
        },
        {
          id: "5",
          student_id: "STU005",
          first_name: "Karan",
          last_name: "Singh",
          email: "karan.singh@student.mvp.edu",
          phone: "+91 98765 11115",
          date_of_birth: "2001-06-30",
          gender: "male" as const,
          department_id: "1",
          department_name: "Computer Science & Engineering",
          college_name: "MVP Engineering College",
          batch: "2019-2023",
          semester: 8,
          enrollment_date: "2019-08-01",
          status: "graduated" as const,
          gpa: 8.2,
          parent_name: "Mr. Vikram Singh",
          parent_phone: "+91 98765 22226",
          address: "555 Garden Street, Pune",
          created_at: "2019-08-01",
        },
        {
          id: "6",
          student_id: "STU006",
          first_name: "Anjali",
          last_name: "Verma",
          email: "anjali.verma@student.stellar.edu",
          phone: "+91 98765 11116",
          date_of_birth: "2003-12-18",
          gender: "female" as const,
          department_id: "4",
          department_name: "English Literature",
          college_name: "Stellar Arts & Science College",
          batch: "2021-2024",
          semester: 6,
          enrollment_date: "2021-08-01",
          status: "suspended" as const,
          gpa: 6.5,
          parent_name: "Mrs. Sunita Verma",
          parent_phone: "+91 98765 22227",
          address: "888 River Side, Chennai",
          created_at: "2021-08-01",
        },
      ] as Student[];
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // TODO: Replace with actual API endpoint
      // await fetch(`/api/students/${id}`, { method: 'DELETE' });
      console.log('Delete student:', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      deleteMutation.mutate(id);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading students...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-red-500">Error loading students. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold">Students Management</h1>
          <p className="text-muted-foreground">
            Manage student records, enrollment, and academic progress across all departments.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">Import CSV</Button>
          <Button variant="secondary">Export</Button>
          <Button onClick={() => window.location.href = '/students/create'}>
            Add Student
          </Button>
        </div>
      </div>

      {/* Advanced Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Input
              type="text"
              placeholder="Search by name, email, or student ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="lg:col-span-2"
            />
            <select
              value={collegeFilter}
              onChange={(e) => setCollegeFilter(e.target.value)}
              className="flex h-10 rounded-md border border-input bg-white px-3 py-2 text-sm text-black ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">All Colleges</option>
              <option value="1">MVP Engineering College</option>
              <option value="2">Stellar Arts & Science College</option>
              <option value="3">Greenfield Business Institute</option>
            </select>
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex h-10 rounded-md border border-input bg-white px-3 py-2 text-sm text-black ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="graduated">Graduated</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <div className="mt-4 flex gap-4">
            <select
              value={batchFilter}
              onChange={(e) => setBatchFilter(e.target.value)}
              className="flex h-10 w-48 rounded-md border border-input bg-white px-3 py-2 text-sm text-black ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">All Batches</option>
              <option value="2022-2025">2022-2025</option>
              <option value="2021-2025">2021-2025</option>
              <option value="2020-2024">2020-2024</option>
              <option value="2019-2023">2019-2023</option>
            </select>
            <Button variant="secondary">Search</Button>
            <Button variant="secondary">Clear Filters</Button>
          </div>
        </CardContent>
      </Card>

      {/* Students Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Total Students</CardDescription>
            <CardTitle className="text-2xl">{students.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Active</CardDescription>
            <CardTitle className="text-2xl">
              {students.filter(s => s.status === 'active').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Graduated</CardDescription>
            <CardTitle className="text-2xl">
              {students.filter(s => s.status === 'graduated').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Average GPA</CardDescription>
            <CardTitle className="text-2xl">
              {(students.reduce((sum, s) => sum + (s.gpa || 0), 0) / students.length).toFixed(2)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Students Overview</CardTitle>
          <CardDescription>
            All students with their academic details. Total: {students.length} students
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>College</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead className="text-center">Semester</TableHead>
                  <TableHead className="text-center">GPA</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center text-muted-foreground">
                      No students found.
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map((student) => (
                    <TableRow key={student.id} className="hover:bg-muted/40">
                      <TableCell className="font-mono text-xs">{student.student_id}</TableCell>
                      <TableCell className="font-medium">
                        {student.first_name} {student.last_name}
                      </TableCell>
                      <TableCell className="text-sm">{student.email}</TableCell>
                      <TableCell className="text-sm">{student.department_name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {student.college_name}
                      </TableCell>
                      <TableCell className="text-sm">{student.batch}</TableCell>
                      <TableCell className="text-center">{student.semester}</TableCell>
                      <TableCell className="text-center font-semibold">
                        {student.gpa?.toFixed(2) || "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusMap[student.status] ?? "secondary"}>
                          {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => window.location.href = `/students/${student.id}`}
                          >
                            View
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => window.location.href = `/students/${student.id}/edit`}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(student.id)}
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

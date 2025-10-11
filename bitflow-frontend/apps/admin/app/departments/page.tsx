"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitflow/ui/card";
import { Badge } from "@bitflow/ui/badge";
import { Button } from "@bitflow/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@bitflow/ui/table";
import { Input } from "@bitflow/ui/input";

// Type definition for Department
interface Department {
  id: string;
  name: string;
  code: string;
  college_id: string;
  college_name?: string;
  head_of_department?: string;
  status: "active" | "inactive";
  faculty_count?: number;
  students_count?: number;
  created_at?: string;
}

const statusMap: Record<string, "success" | "secondary"> = {
  active: "success",
  inactive: "secondary",
};

export default function DepartmentsPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [collegeFilter, setCollegeFilter] = useState("");

  // Fetch departments from API
  const { data: departments = [], isLoading, error } = useQuery({
    queryKey: ['departments', searchQuery, collegeFilter],
    queryFn: async () => {
      // TODO: Replace with actual API endpoint
      // const response = await fetch(`/api/departments?search=${searchQuery}&college=${collegeFilter}`);
      // return response.json();
      
      // Mock data for now
      return [
        {
          id: "1",
          name: "Computer Science & Engineering",
          code: "CSE",
          college_id: "1",
          college_name: "MVP Engineering College",
          head_of_department: "Dr. Rajesh Kumar",
          status: "active" as const,
          faculty_count: 25,
          students_count: 450,
          created_at: "2024-01-15",
        },
        {
          id: "2",
          name: "Mechanical Engineering",
          code: "MECH",
          college_id: "1",
          college_name: "MVP Engineering College",
          head_of_department: "Dr. Priya Sharma",
          status: "active" as const,
          faculty_count: 18,
          students_count: 320,
          created_at: "2024-01-15",
        },
        {
          id: "3",
          name: "Business Administration",
          code: "BA",
          college_id: "3",
          college_name: "Greenfield Business Institute",
          head_of_department: "Prof. Amit Verma",
          status: "active" as const,
          faculty_count: 15,
          students_count: 280,
          created_at: "2024-03-10",
        },
        {
          id: "4",
          name: "English Literature",
          code: "ENG",
          college_id: "2",
          college_name: "Stellar Arts & Science College",
          head_of_department: "Dr. Sarah Johnson",
          status: "active" as const,
          faculty_count: 12,
          students_count: 180,
          created_at: "2024-02-20",
        },
        {
          id: "5",
          name: "Electronics Engineering",
          code: "ECE",
          college_id: "1",
          college_name: "MVP Engineering College",
          head_of_department: "Dr. Suresh Reddy",
          status: "inactive" as const,
          faculty_count: 8,
          students_count: 120,
          created_at: "2024-01-15",
        },
      ] as Department[];
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // TODO: Replace with actual API endpoint
      // await fetch(`/api/departments/${id}`, { method: 'DELETE' });
      console.log('Delete department:', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      deleteMutation.mutate(id);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading departments...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-red-500">Error loading departments. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold">Departments</h1>
          <p className="text-muted-foreground">Manage departments across all colleges.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">Import CSV</Button>
          <Button onClick={() => window.location.href = '/departments/create'}>
            Add Department
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <Input
              type="text"
              placeholder="Search departments by name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
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
            <Button variant="secondary">Search</Button>
          </div>
        </CardContent>
      </Card>

      {/* Departments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Departments Overview</CardTitle>
          <CardDescription>All departments in the system with their details.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>College</TableHead>
                <TableHead>Head of Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Faculty</TableHead>
                <TableHead className="text-right">Students</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    No departments found.
                  </TableCell>
                </TableRow>
              ) : (
                departments.map((department) => (
                  <TableRow key={department.id} className="hover:bg-muted/40">
                    <TableCell className="font-medium">{department.name}</TableCell>
                    <TableCell className="text-muted-foreground">{department.code}</TableCell>
                    <TableCell className="text-sm">
                      {department.college_name}
                    </TableCell>
                    <TableCell className="text-sm">
                      {department.head_of_department || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusMap[department.status] ?? "secondary"}>
                        {department.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{department.faculty_count || 0}</TableCell>
                    <TableCell className="text-right">{department.students_count || 0}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => window.location.href = `/departments/${department.id}/edit`}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(department.id)}
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
        </CardContent>
      </Card>
    </div>
  );
}

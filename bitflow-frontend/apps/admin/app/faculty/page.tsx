"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitflow/ui/card";
import { Badge } from "@bitflow/ui/badge";
import { Button } from "@bitflow/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@bitflow/ui/table";
import { Input } from "@bitflow/ui/input";

// Type definition for Faculty
interface Faculty {
  id: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department_id: string;
  department_name?: string;
  college_name?: string;
  designation: string;
  qualifications: string;
  experience_years: number;
  specialization?: string;
  date_of_birth?: string;
  gender: "male" | "female" | "other";
  date_of_joining?: string;
  salary?: number;
  status: "active" | "inactive" | "on_leave";
  created_at?: string;
}

const statusMap: Record<string, "success" | "secondary" | "warning"> = {
  active: "success",
  inactive: "secondary",
  on_leave: "warning",
};

export default function FacultyPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [collegeFilter, setCollegeFilter] = useState("");

  // Fetch faculty from API
  const { data: faculty = [], isLoading, error } = useQuery({
    queryKey: ['faculty', searchQuery, departmentFilter, collegeFilter],
    queryFn: async () => {
      // TODO: Replace with actual API endpoint
      // const response = await fetch(`/api/faculty?search=${searchQuery}&department=${departmentFilter}&college=${collegeFilter}`);
      // return response.json();
      
      // Mock data for now
      return [
        {
          id: "1",
          employee_id: "FAC001",
          first_name: "Rajesh",
          last_name: "Kumar",
          email: "rajesh.kumar@mvp.edu",
          phone: "+91 98765 43210",
          department_id: "1",
          department_name: "Computer Science & Engineering",
          college_name: "MVP Engineering College",
          designation: "Professor",
          qualifications: "Ph.D. in Computer Science",
          experience_years: 15,
          specialization: "Machine Learning, AI",
          date_of_birth: "1978-05-15",
          gender: "male" as const,
          date_of_joining: "2010-07-01",
          salary: 85000,
          status: "active" as const,
          created_at: "2010-07-01",
        },
        {
          id: "2",
          employee_id: "FAC002",
          first_name: "Priya",
          last_name: "Sharma",
          email: "priya.sharma@mvp.edu",
          phone: "+91 98765 43211",
          department_id: "2",
          department_name: "Mechanical Engineering",
          college_name: "MVP Engineering College",
          designation: "Associate Professor",
          qualifications: "Ph.D. in Mechanical Engineering",
          experience_years: 12,
          specialization: "Robotics, Automation",
          date_of_birth: "1982-08-20",
          gender: "female" as const,
          date_of_joining: "2013-08-15",
          salary: 75000,
          status: "active" as const,
          created_at: "2013-08-15",
        },
        {
          id: "3",
          employee_id: "FAC003",
          first_name: "Amit",
          last_name: "Verma",
          email: "amit.verma@greenfield.edu",
          phone: "+91 98765 43212",
          department_id: "3",
          department_name: "Business Administration",
          college_name: "Greenfield Business Institute",
          designation: "Assistant Professor",
          qualifications: "MBA, Ph.D. in Management",
          experience_years: 8,
          specialization: "Marketing, Strategy",
          date_of_birth: "1985-03-10",
          gender: "male" as const,
          date_of_joining: "2017-06-01",
          salary: 65000,
          status: "active" as const,
          created_at: "2017-06-01",
        },
        {
          id: "4",
          employee_id: "FAC004",
          first_name: "Sarah",
          last_name: "Johnson",
          email: "sarah.johnson@stellar.edu",
          phone: "+91 98765 43213",
          department_id: "4",
          department_name: "English Literature",
          college_name: "Stellar Arts & Science College",
          designation: "Senior Lecturer",
          qualifications: "M.A., Ph.D. in English Literature",
          experience_years: 10,
          specialization: "Victorian Literature, Poetry",
          date_of_birth: "1983-11-25",
          gender: "female" as const,
          date_of_joining: "2015-01-10",
          salary: 55000,
          status: "on_leave" as const,
          created_at: "2015-01-10",
        },
        {
          id: "5",
          employee_id: "FAC005",
          first_name: "Suresh",
          last_name: "Reddy",
          email: "suresh.reddy@mvp.edu",
          phone: "+91 98765 43214",
          department_id: "5",
          department_name: "Electronics Engineering",
          college_name: "MVP Engineering College",
          designation: "Lecturer",
          qualifications: "M.Tech in Electronics",
          experience_years: 5,
          specialization: "VLSI Design, Embedded Systems",
          date_of_birth: "1988-07-18",
          gender: "male" as const,
          date_of_joining: "2020-08-01",
          salary: 45000,
          status: "inactive" as const,
          created_at: "2020-08-01",
        },
        {
          id: "6",
          employee_id: "FAC006",
          first_name: "Anita",
          last_name: "Desai",
          email: "anita.desai@stellar.edu",
          phone: "+91 98765 43215",
          department_id: "4",
          department_name: "English Literature",
          college_name: "Stellar Arts & Science College",
          designation: "Assistant Professor",
          qualifications: "M.A., M.Phil in English",
          experience_years: 6,
          specialization: "Modern Literature, Linguistics",
          date_of_birth: "1987-02-14",
          gender: "female" as const,
          date_of_joining: "2019-07-15",
          salary: 50000,
          status: "active" as const,
          created_at: "2019-07-15",
        },
      ] as Faculty[];
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // TODO: Replace with actual API endpoint
      // await fetch(`/api/faculty/${id}`, { method: 'DELETE' });
      console.log('Delete faculty:', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculty'] });
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this faculty member?')) {
      deleteMutation.mutate(id);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading faculty...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-red-500">Error loading faculty. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold">Faculty Management</h1>
          <p className="text-muted-foreground">Manage faculty members across all departments and colleges.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">Import CSV</Button>
          <Button variant="secondary">Export</Button>
          <Button onClick={() => window.location.href = '/faculty/create'}>
            Add Faculty
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <Input
              type="text"
              placeholder="Search by name, email, or employee ID..."
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
              <option value="5">Electronics Engineering</option>
            </select>
            <Button variant="secondary">Search</Button>
          </div>
        </CardContent>
      </Card>

      {/* Faculty Table */}
      <Card>
        <CardHeader>
          <CardTitle>Faculty Overview</CardTitle>
          <CardDescription>
            All faculty members with their details. Total: {faculty.length} faculty
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Employee ID</TableHead>
                  <TableHead className="w-[150px]">Name</TableHead>
                  <TableHead className="w-[200px]">Email</TableHead>
                  <TableHead className="w-[130px]">Phone</TableHead>
                  <TableHead className="w-[180px]">Department</TableHead>
                  <TableHead className="w-[180px]">College</TableHead>
                  <TableHead className="w-[130px]">Designation</TableHead>
                  <TableHead className="w-[180px]">Qualifications</TableHead>
                  <TableHead className="w-[120px] text-right">Experience</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[150px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faculty.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center text-muted-foreground">
                      No faculty members found.
                    </TableCell>
                  </TableRow>
                ) : (
                  faculty.map((member) => (
                    <TableRow key={member.id} className="hover:bg-muted/40">
                      <TableCell className="w-[100px] font-mono text-xs">{member.employee_id}</TableCell>
                      <TableCell className="w-[150px] font-medium">
                        {member.first_name} {member.last_name}
                      </TableCell>
                      <TableCell className="w-[200px] text-sm text-muted-foreground">
                        {member.email}
                      </TableCell>
                      <TableCell className="w-[130px] text-sm">{member.phone}</TableCell>
                      <TableCell className="w-[180px] text-sm">{member.department_name}</TableCell>
                      <TableCell className="w-[180px] text-sm text-muted-foreground">
                        {member.college_name}
                      </TableCell>
                      <TableCell className="w-[130px] text-sm">{member.designation}</TableCell>
                      <TableCell className="w-[180px] text-sm">{member.qualifications}</TableCell>
                      <TableCell className="w-[120px] text-right">{member.experience_years} years</TableCell>
                      <TableCell className="w-[100px]">
                        <Badge variant={statusMap[member.status] ?? "secondary"}>
                          {member.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="w-[150px] text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => window.location.href = `/faculty/${member.id}/edit`}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(member.id)}
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

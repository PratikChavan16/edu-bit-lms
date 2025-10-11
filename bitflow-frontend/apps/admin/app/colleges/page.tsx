"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitflow/ui/card";
import { Badge } from "@bitflow/ui/badge";
import { Button } from "@bitflow/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@bitflow/ui/table";
import { Input } from "@bitflow/ui/input";

// Type definition for College
interface College {
  id: string;
  name: string;
  code: string;
  university_id: string;
  university_name?: string;
  address: string;
  contact_email: string;
  contact_phone: string;
  status: "active" | "inactive";
  students_count?: number;
  faculty_count?: number;
  created_at?: string;
}

const statusMap: Record<string, "success" | "secondary"> = {
  active: "success",
  inactive: "secondary",
};

export default function CollegesPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [universityFilter, setUniversityFilter] = useState("");

  // Fetch colleges from API
  const { data: colleges = [], isLoading, error } = useQuery({
    queryKey: ['colleges', searchQuery, universityFilter],
    queryFn: async () => {
      // TODO: Replace with actual API endpoint
      // const response = await fetch(`/api/colleges?search=${searchQuery}&university=${universityFilter}`);
      // return response.json();
      
      // Mock data for now (until backend API is ready)
      return [
        {
          id: "1",
          name: "MVP Engineering College",
          code: "MVPEC",
          university_id: "1",
          university_name: "MVP Engineering University",
          address: "123 Engineering Road, Mumbai, Maharashtra 400001",
          contact_email: "admin@mvpec.edu.in",
          contact_phone: "+91-22-12345678",
          status: "active" as const,
          students_count: 1200,
          faculty_count: 85,
          created_at: "2024-01-15",
        },
        {
          id: "2",
          name: "Stellar Arts & Science College",
          code: "SASC",
          university_id: "2",
          university_name: "Stellar Arts College",
          address: "456 Arts Avenue, Pune, Maharashtra 411001",
          contact_email: "info@sasc.edu",
          contact_phone: "+91-20-98765432",
          status: "active" as const,
          students_count: 800,
          faculty_count: 45,
          created_at: "2024-02-20",
        },
        {
          id: "3",
          name: "Greenfield Business Institute",
          code: "GBI",
          university_id: "3",
          university_name: "Greenfield Business School",
          address: "789 Business Park, Delhi 110001",
          contact_email: "contact@gbi.edu",
          contact_phone: "+91-11-55551234",
          status: "active" as const,
          students_count: 600,
          faculty_count: 38,
          created_at: "2024-03-10",
        },
        {
          id: "4",
          name: "MVP Medical College",
          code: "MVPMC",
          university_id: "1",
          university_name: "MVP Engineering University",
          address: "321 Medical Lane, Mumbai, Maharashtra 400002",
          contact_email: "admin@mvpmc.edu.in",
          contact_phone: "+91-22-87654321",
          status: "inactive" as const,
          students_count: 500,
          faculty_count: 65,
          created_at: "2024-04-05",
        },
      ] as College[];
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // TODO: Replace with actual API endpoint
      // await fetch(`/api/colleges/${id}`, { method: 'DELETE' });
      console.log('Delete college:', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colleges'] });
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this college?')) {
      deleteMutation.mutate(id);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading colleges...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-red-500">Error loading colleges. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold">Colleges</h1>
          <p className="text-muted-foreground">Manage colleges across all universities.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">Import CSV</Button>
          <Button onClick={() => window.location.href = '/colleges/create'}>
            Add College
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <Input
              type="text"
              placeholder="Search colleges by name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <select
              value={universityFilter}
              onChange={(e) => setUniversityFilter(e.target.value)}
              className="flex h-10 rounded-md border border-input bg-white px-3 py-2 text-sm text-black ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">All Universities</option>
              <option value="1">MVP Engineering University</option>
              <option value="2">Stellar Arts College</option>
              <option value="3">Greenfield Business School</option>
            </select>
            <Button variant="secondary">Search</Button>
          </div>
        </CardContent>
      </Card>

      {/* Colleges Table */}
      <Card>
        <CardHeader>
          <CardTitle>Colleges Overview</CardTitle>
          <CardDescription>All colleges in the system with their details.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>College Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>University</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Students</TableHead>
                <TableHead className="text-right">Faculty</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {colleges.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    No colleges found.
                  </TableCell>
                </TableRow>
              ) : (
                colleges.map((college) => (
                  <TableRow key={college.id} className="hover:bg-muted/40">
                    <TableCell className="font-medium">{college.name}</TableCell>
                    <TableCell className="text-muted-foreground">{college.code}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {college.university_name}
                    </TableCell>
                    <TableCell className="text-sm">
                      <div>{college.contact_email}</div>
                      <div className="text-muted-foreground">{college.contact_phone}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusMap[college.status] ?? "secondary"}>
                        {college.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{college.students_count || 0}</TableCell>
                    <TableCell className="text-right">{college.faculty_count || 0}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => window.location.href = `/colleges/${college.id}/edit`}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(college.id)}
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

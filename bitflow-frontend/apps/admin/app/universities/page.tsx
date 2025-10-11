"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitflow/ui/card";
import { Badge } from "@bitflow/ui/badge";
import { Button } from "@bitflow/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@bitflow/ui/table";
import { Input } from "@bitflow/ui/input";

// Type definition for University
interface University {
  id: string;
  name: string;
  code: string;
  domain: string;
  status: "live" | "staging" | "suspended";
  colleges_count?: number;
  created_at?: string;
}

const statusMap: Record<string, "success" | "warning" | "secondary"> = {
  live: "success",
  staging: "warning",
  suspended: "secondary",
};

export default function UniversitiesPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch universities from API
  const { data: universities = [], isLoading, error } = useQuery({
    queryKey: ['universities', searchQuery],
    queryFn: async () => {
      // TODO: Replace with actual API endpoint
      // const response = await fetch(`/api/universities?search=${searchQuery}`);
      // return response.json();
      
      // Mock data for now (until backend API is ready)
      return [
        {
          id: "1",
          name: "MVP Engineering University",
          code: "MVP",
          domain: "mvp.edu.in",
          status: "live" as const,
          colleges_count: 7,
          created_at: "2024-01-15",
        },
        {
          id: "2",
          name: "Stellar Arts College",
          code: "SAC",
          domain: "stellararts.edu",
          status: "staging" as const,
          colleges_count: 3,
          created_at: "2024-02-20",
        },
        {
          id: "3",
          name: "Greenfield Business School",
          code: "GBS",
          domain: "greenfield.edu",
          status: "live" as const,
          colleges_count: 2,
          created_at: "2024-03-10",
        },
      ] as University[];
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // TODO: Replace with actual API endpoint
      // await fetch(`/api/universities/${id}`, { method: 'DELETE' });
      console.log('Delete university:', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['universities'] });
      setDeleteId(null);
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this university?')) {
      deleteMutation.mutate(id);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading universities...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-red-500">Error loading universities. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold">Universities</h1>
          <p className="text-muted-foreground">Manage tenants, feature toggles, quotas, and provisioning.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">Import CSV</Button>
          <Button onClick={() => window.location.href = '/universities/create'}>
            Add university
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Input
              type="text"
              placeholder="Search universities by name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
            <Button variant="secondary">Search</Button>
          </div>
        </CardContent>
      </Card>

      {/* Universities Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tenant overview</CardTitle>
          <CardDescription>Snapshot of all active and staging universities.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Colleges</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {universities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No universities found.
                  </TableCell>
                </TableRow>
              ) : (
                universities.map((university) => (
                  <TableRow key={university.id} className="hover:bg-muted/40">
                    <TableCell className="font-medium">{university.name}</TableCell>
                    <TableCell className="text-muted-foreground">{university.code}</TableCell>
                    <TableCell className="text-muted-foreground">{university.domain}</TableCell>
                    <TableCell>
                      <Badge variant={statusMap[university.status] ?? "secondary"}>
                        {university.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{university.colleges_count || 0}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => window.location.href = `/universities/${university.id}/edit`}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(university.id)}
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

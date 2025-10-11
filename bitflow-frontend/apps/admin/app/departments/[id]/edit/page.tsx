"use client";

import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitflow/ui/card";
import { Button } from "@bitflow/ui/button";
import { Input } from "@bitflow/ui/input";

// Zod validation schema for department
const departmentSchema = z.object({
  name: z.string().min(3, "Department name must be at least 3 characters"),
  code: z.string().min(2, "Department code must be at least 2 characters").max(10, "Code too long"),
  college_id: z.string().min(1, "Please select a college"),
  head_of_department: z.string().optional(),
  status: z.enum(["active", "inactive"], {
    required_error: "Please select a status",
  }),
});

type DepartmentFormData = z.infer<typeof departmentSchema>;

interface College {
  id: string;
  name: string;
}

interface Department {
  id: string;
  name: string;
  code: string;
  college_id: string;
  head_of_department?: string;
  status: "active" | "inactive";
}

export default function EditDepartmentPage() {
  const router = useRouter();
  const params = useParams();
  const departmentId = params.id as string;

  // Fetch colleges for dropdown
  const { data: colleges = [], isLoading: loadingColleges } = useQuery({
    queryKey: ['colleges'],
    queryFn: async () => {
      // TODO: Replace with actual API endpoint
      // const response = await fetch('/api/colleges?status=active');
      // return response.json();
      
      // Mock data for now
      return [
        { id: "1", name: "MVP Engineering College" },
        { id: "2", name: "Stellar Arts & Science College" },
        { id: "3", name: "Greenfield Business Institute" },
        { id: "4", name: "Oakridge Medical College" },
      ] as College[];
    },
  });

  // Fetch existing department data
  const { data: department, isLoading: loadingDepartment } = useQuery({
    queryKey: ['department', departmentId],
    queryFn: async () => {
      // TODO: Replace with actual API endpoint
      // const response = await fetch(`/api/departments/${departmentId}`);
      // return response.json();
      
      // Mock data for now
      return {
        id: departmentId,
        name: "Computer Science & Engineering",
        code: "CSE",
        college_id: "1",
        head_of_department: "Dr. Rajesh Kumar",
        status: "active",
      } as Department;
    },
    enabled: !!departmentId,
  });

  // Form setup with pre-filled values
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    values: department ? {
      name: department.name,
      code: department.code,
      college_id: department.college_id,
      head_of_department: department.head_of_department || "",
      status: department.status,
    } : undefined,
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: DepartmentFormData) => {
      // TODO: Replace with actual API endpoint
      // const response = await fetch(`/api/departments/${departmentId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      // return response.json();
      
      console.log('Updating department:', departmentId, data);
      return Promise.resolve(data);
    },
    onSuccess: () => {
      router.push('/departments');
    },
    onError: (error) => {
      console.error('Failed to update department:', error);
      alert('Failed to update department. Please try again.');
    },
  });

  const onSubmit = (data: DepartmentFormData) => {
    updateMutation.mutate(data);
  };

  // Loading state
  if (loadingDepartment || loadingColleges) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading department details...</p>
      </div>
    );
  }

  // Error state
  if (!department) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">Department not found.</p>
          <Button onClick={() => router.push('/departments')}>
            Back to Departments
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Edit Department</h1>
        <p className="text-muted-foreground">Update the department information below.</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Department Details</CardTitle>
          <CardDescription>
            Modify the department information as needed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Department Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Department Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                type="text"
                placeholder="e.g., Computer Science & Engineering"
                {...register("name")}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Department Code */}
            <div className="space-y-2">
              <label htmlFor="code" className="text-sm font-medium">
                Department Code <span className="text-red-500">*</span>
              </label>
              <Input
                id="code"
                type="text"
                placeholder="e.g., CSE"
                {...register("code")}
                className={errors.code ? "border-red-500" : ""}
              />
              {errors.code && (
                <p className="text-sm text-red-500">{errors.code.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Short code for the department (e.g., CSE, MECH, BA)
              </p>
            </div>

            {/* College Selection */}
            <div className="space-y-2">
              <label htmlFor="college_id" className="text-sm font-medium">
                College <span className="text-red-500">*</span>
              </label>
              <select
                id="college_id"
                {...register("college_id")}
                className={`flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-black ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  errors.college_id ? "border-red-500" : ""
                }`}
              >
                <option value="">Select a college</option>
                {colleges.map((college) => (
                  <option key={college.id} value={college.id}>
                    {college.name}
                  </option>
                ))}
              </select>
              {errors.college_id && (
                <p className="text-sm text-red-500">{errors.college_id.message}</p>
              )}
            </div>

            {/* Head of Department */}
            <div className="space-y-2">
              <label htmlFor="head_of_department" className="text-sm font-medium">
                Head of Department
              </label>
              <Input
                id="head_of_department"
                type="text"
                placeholder="e.g., Dr. Rajesh Kumar"
                {...register("head_of_department")}
              />
              <p className="text-xs text-muted-foreground">
                Optional: Name of the department head
              </p>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                {...register("status")}
                className={`flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-black ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  errors.status ? "border-red-500" : ""
                }`}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              {errors.status && (
                <p className="text-sm text-red-500">{errors.status.message}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Updating..." : "Update Department"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push('/departments')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

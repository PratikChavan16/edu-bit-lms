"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitflow/ui/card";
import { Button } from "@bitflow/ui/button";
import { Input } from "@bitflow/ui/input";

// Validation schema using Zod (same as create)
const collegeSchema = z.object({
  name: z.string().min(3, "College name must be at least 3 characters"),
  code: z.string().min(2, "Code must be at least 2 characters").max(10, "Code must be at most 10 characters"),
  university_id: z.string().min(1, "Please select a university"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  contact_email: z.string().email("Invalid email address"),
  contact_phone: z.string().min(10, "Phone number must be at least 10 characters"),
  status: z.enum(["active", "inactive"], {
    required_error: "Please select a status",
  }),
});

type CollegeFormData = z.infer<typeof collegeSchema>;

export default function EditCollegePage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const collegeId = params.id as string;

  // Fetch universities for dropdown
  const { data: universities = [] } = useQuery({
    queryKey: ['universities'],
    queryFn: async () => {
      // TODO: Replace with actual API endpoint
      // Mock data
      return [
        { id: "1", name: "MVP Engineering University" },
        { id: "2", name: "Stellar Arts College" },
        { id: "3", name: "Greenfield Business School" },
      ];
    },
  });

  // Fetch existing college data
  const { data: college, isLoading, error } = useQuery({
    queryKey: ["college", collegeId],
    queryFn: async () => {
      // TODO: Replace with actual API endpoint
      // const response = await fetch(`/api/colleges/${collegeId}`);
      // if (!response.ok) throw new Error('Failed to fetch college');
      // return response.json();

      // Mock data for now
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        id: collegeId,
        name: "MVP Engineering College",
        code: "MVPEC",
        university_id: "1",
        address: "123 Engineering Road, Mumbai, Maharashtra 400001",
        contact_email: "admin@mvpec.edu.in",
        contact_phone: "+91-22-12345678",
        status: "active" as const,
      };
    },
  });

  // Setup React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CollegeFormData>({
    resolver: zodResolver(collegeSchema),
    values: college, // This will pre-fill the form when data loads
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: CollegeFormData) => {
      // TODO: Replace with actual API endpoint
      // const response = await fetch(`/api/colleges/${collegeId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      // if (!response.ok) throw new Error('Failed to update college');
      // return response.json();

      console.log("Updating college:", collegeId, data);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { id: collegeId, ...data };
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["colleges"] });
      queryClient.invalidateQueries({ queryKey: ["college", collegeId] });
      // Navigate back to list
      router.push("/colleges");
    },
    onError: (error) => {
      console.error("Error updating college:", error);
      alert("Failed to update college. Please try again.");
    },
  });

  const onSubmit = (data: CollegeFormData) => {
    updateMutation.mutate(data);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading college data...</p>
      </div>
    );
  }

  // Error state
  if (error || !college) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <p className="text-red-500">Error loading college data.</p>
          <Button onClick={() => router.push("/colleges")}>
            Back to Colleges
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Edit College</h1>
        <p className="text-muted-foreground">Update college information.</p>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>College Information</CardTitle>
          <CardDescription>Edit the details for {college.name}.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* University Field */}
            <div className="space-y-2">
              <label htmlFor="university_id" className="text-sm font-medium">
                University <span className="text-red-500">*</span>
              </label>
              <select
                id="university_id"
                {...register("university_id")}
                className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  errors.university_id ? "border-red-500" : ""
                }`}
              >
                <option value="">Select a university</option>
                {universities.map((uni: any) => (
                  <option key={uni.id} value={uni.id}>
                    {uni.name}
                  </option>
                ))}
              </select>
              {errors.university_id && (
                <p className="text-sm text-red-500">{errors.university_id.message}</p>
              )}
            </div>

            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                College Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                type="text"
                placeholder="e.g., MVP Engineering College"
                {...register("name")}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Code Field */}
            <div className="space-y-2">
              <label htmlFor="code" className="text-sm font-medium">
                College Code <span className="text-red-500">*</span>
              </label>
              <Input
                id="code"
                type="text"
                placeholder="e.g., MVPEC"
                {...register("code")}
                className={errors.code ? "border-red-500" : ""}
              />
              {errors.code && (
                <p className="text-sm text-red-500">{errors.code.message}</p>
              )}
              <p className="text-sm text-muted-foreground">
                A unique code to identify the college (2-10 characters)
              </p>
            </div>

            {/* Address Field */}
            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                id="address"
                placeholder="e.g., 123 College Road, City, State - PIN"
                {...register("address")}
                rows={3}
                className={`flex w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-black ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  errors.address ? "border-red-500" : ""
                }`}
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>

            {/* Contact Email Field */}
            <div className="space-y-2">
              <label htmlFor="contact_email" className="text-sm font-medium">
                Contact Email <span className="text-red-500">*</span>
              </label>
              <Input
                id="contact_email"
                type="email"
                placeholder="e.g., admin@college.edu"
                {...register("contact_email")}
                className={errors.contact_email ? "border-red-500" : ""}
              />
              {errors.contact_email && (
                <p className="text-sm text-red-500">{errors.contact_email.message}</p>
              )}
            </div>

            {/* Contact Phone Field */}
            <div className="space-y-2">
              <label htmlFor="contact_phone" className="text-sm font-medium">
                Contact Phone <span className="text-red-500">*</span>
              </label>
              <Input
                id="contact_phone"
                type="tel"
                placeholder="e.g., +91-22-12345678"
                {...register("contact_phone")}
                className={errors.contact_phone ? "border-red-500" : ""}
              />
              {errors.contact_phone && (
                <p className="text-sm text-red-500">{errors.contact_phone.message}</p>
              )}
            </div>

            {/* Status Field */}
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                {...register("status")}
                className={`flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-black ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
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
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isSubmitting || updateMutation.isPending}
              >
                {updateMutation.isPending ? "Updating..." : "Update College"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push("/colleges")}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => reset(college)}
                disabled={isSubmitting || updateMutation.isPending}
              >
                Reset Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

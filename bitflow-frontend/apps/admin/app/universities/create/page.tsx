"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitflow/ui/card";
import { Button } from "@bitflow/ui/button";
import { Input } from "@bitflow/ui/input";

// Validation schema using Zod
const universitySchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  code: z.string().min(2, "Code must be at least 2 characters").max(10, "Code must be at most 10 characters"),
  domain: z.string().min(3, "Domain is required"),
  status: z.enum(["live", "staging", "suspended"], {
    required_error: "Please select a status",
  }),
});

type UniversityFormData = z.infer<typeof universitySchema>;

export default function CreateUniversityPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Setup React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UniversityFormData>({
    resolver: zodResolver(universitySchema),
    defaultValues: {
      status: "live",
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: UniversityFormData) => {
      // TODO: Replace with actual API endpoint
      // const response = await fetch('/api/universities', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      // if (!response.ok) throw new Error('Failed to create university');
      // return response.json();
      
      console.log("Creating university:", data);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { id: Date.now().toString(), ...data };
    },
    onSuccess: () => {
      // Invalidate and refetch universities list
      queryClient.invalidateQueries({ queryKey: ["universities"] });
      // Navigate back to list
      router.push("/universities");
    },
    onError: (error) => {
      console.error("Error creating university:", error);
      alert("Failed to create university. Please try again.");
    },
  });

  const onSubmit = (data: UniversityFormData) => {
    createMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Create University</h1>
        <p className="text-muted-foreground">Add a new university to the system.</p>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>University Information</CardTitle>
          <CardDescription>Enter the details for the new university.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                University Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                type="text"
                placeholder="e.g., Mumbai University"
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
                University Code <span className="text-red-500">*</span>
              </label>
              <Input
                id="code"
                type="text"
                placeholder="e.g., MU"
                {...register("code")}
                className={errors.code ? "border-red-500" : ""}
              />
              {errors.code && (
                <p className="text-sm text-red-500">{errors.code.message}</p>
              )}
              <p className="text-sm text-muted-foreground">
                A unique code to identify the university (2-10 characters)
              </p>
            </div>

            {/* Domain Field */}
            <div className="space-y-2">
              <label htmlFor="domain" className="text-sm font-medium">
                Domain <span className="text-red-500">*</span>
              </label>
              <Input
                id="domain"
                type="text"
                placeholder="e.g., mumbai.edu.in"
                {...register("domain")}
                className={errors.domain ? "border-red-500" : ""}
              />
              {errors.domain && (
                <p className="text-sm text-red-500">{errors.domain.message}</p>
              )}
              <p className="text-sm text-muted-foreground">
                The domain name for this university
              </p>
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
                <option value="live">Live</option>
                <option value="staging">Staging</option>
                <option value="suspended">Suspended</option>
              </select>
              {errors.status && (
                <p className="text-sm text-red-500">{errors.status.message}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isSubmitting || createMutation.isPending}
              >
                {createMutation.isPending ? "Creating..." : "Create University"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push("/universities")}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => reset()}
                disabled={isSubmitting || createMutation.isPending}
              >
                Reset Form
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

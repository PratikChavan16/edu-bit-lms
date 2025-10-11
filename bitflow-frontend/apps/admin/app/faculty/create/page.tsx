"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitflow/ui/card";
import { Button } from "@bitflow/ui/button";
import { Input } from "@bitflow/ui/input";

// Zod validation schema for faculty
const facultySchema = z.object({
  employee_id: z.string().min(3, "Employee ID must be at least 3 characters"),
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?[0-9\s-]{10,15}$/, "Invalid phone number"),
  department_id: z.string().min(1, "Please select a department"),
  designation: z.string().min(2, "Designation is required"),
  qualifications: z.string().min(3, "Qualifications are required"),
  experience_years: z.coerce.number().min(0, "Experience cannot be negative").max(50, "Experience seems too high"),
  specialization: z.string().optional(),
  date_of_birth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Please select gender",
  }),
  date_of_joining: z.string().min(1, "Date of joining is required"),
  salary: z.coerce.number().min(0, "Salary cannot be negative").optional(),
  status: z.enum(["active", "inactive", "on_leave"], {
    required_error: "Please select a status",
  }),
});

type FacultyFormData = z.infer<typeof facultySchema>;

interface Department {
  id: string;
  name: string;
  college_name?: string;
}

export default function CreateFacultyPage() {
  const router = useRouter();

  // Fetch departments for dropdown
  const { data: departments = [], isLoading: loadingDepartments } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      // TODO: Replace with actual API endpoint
      // const response = await fetch('/api/departments?status=active');
      // return response.json();
      
      // Mock data for now
      return [
        { id: "1", name: "Computer Science & Engineering", college_name: "MVP Engineering College" },
        { id: "2", name: "Mechanical Engineering", college_name: "MVP Engineering College" },
        { id: "3", name: "Business Administration", college_name: "Greenfield Business Institute" },
        { id: "4", name: "English Literature", college_name: "Stellar Arts & Science College" },
        { id: "5", name: "Electronics Engineering", college_name: "MVP Engineering College" },
      ] as Department[];
    },
  });

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FacultyFormData>({
    resolver: zodResolver(facultySchema),
    defaultValues: {
      status: "active",
      experience_years: 0,
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: FacultyFormData) => {
      // TODO: Replace with actual API endpoint
      // const response = await fetch('/api/faculty', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      // return response.json();
      
      console.log('Creating faculty:', data);
      return Promise.resolve(data);
    },
    onSuccess: () => {
      router.push('/faculty');
    },
    onError: (error) => {
      console.error('Failed to create faculty:', error);
      alert('Failed to create faculty member. Please try again.');
    },
  });

  const onSubmit = (data: FacultyFormData) => {
    createMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Add New Faculty Member</h1>
        <p className="text-muted-foreground">Fill in the details to add a new faculty member.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Basic personal details of the faculty member.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Employee ID */}
              <div className="space-y-2">
                <label htmlFor="employee_id" className="text-sm font-medium">
                  Employee ID <span className="text-red-500">*</span>
                </label>
                <Input
                  id="employee_id"
                  type="text"
                  placeholder="e.g., FAC001"
                  {...register("employee_id")}
                  className={errors.employee_id ? "border-red-500" : ""}
                />
                {errors.employee_id && (
                  <p className="text-sm text-red-500">{errors.employee_id.message}</p>
                )}
              </div>

              {/* First Name */}
              <div className="space-y-2">
                <label htmlFor="first_name" className="text-sm font-medium">
                  First Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="first_name"
                  type="text"
                  placeholder="e.g., Rajesh"
                  {...register("first_name")}
                  className={errors.first_name ? "border-red-500" : ""}
                />
                {errors.first_name && (
                  <p className="text-sm text-red-500">{errors.first_name.message}</p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label htmlFor="last_name" className="text-sm font-medium">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="last_name"
                  type="text"
                  placeholder="e.g., Kumar"
                  {...register("last_name")}
                  className={errors.last_name ? "border-red-500" : ""}
                />
                {errors.last_name && (
                  <p className="text-sm text-red-500">{errors.last_name.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g., rajesh.kumar@mvp.edu"
                  {...register("email")}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <Input
                  id="phone"
                  type="text"
                  placeholder="e.g., +91 98765 43210"
                  {...register("phone")}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <label htmlFor="date_of_birth" className="text-sm font-medium">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <Input
                  id="date_of_birth"
                  type="date"
                  {...register("date_of_birth")}
                  className={errors.date_of_birth ? "border-red-500" : ""}
                />
                {errors.date_of_birth && (
                  <p className="text-sm text-red-500">{errors.date_of_birth.message}</p>
                )}
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label htmlFor="gender" className="text-sm font-medium">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  id="gender"
                  {...register("gender")}
                  className={`flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-black ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    errors.gender ? "border-red-500" : ""
                  }`}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-sm text-red-500">{errors.gender.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
            <CardDescription>Employment and academic details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Department */}
              <div className="space-y-2">
                <label htmlFor="department_id" className="text-sm font-medium">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  id="department_id"
                  {...register("department_id")}
                  disabled={loadingDepartments}
                  className={`flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-black ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    errors.department_id ? "border-red-500" : ""
                  }`}
                >
                  <option value="">Select a department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name} - {dept.college_name}
                    </option>
                  ))}
                </select>
                {errors.department_id && (
                  <p className="text-sm text-red-500">{errors.department_id.message}</p>
                )}
              </div>

              {/* Designation */}
              <div className="space-y-2">
                <label htmlFor="designation" className="text-sm font-medium">
                  Designation <span className="text-red-500">*</span>
                </label>
                <Input
                  id="designation"
                  type="text"
                  placeholder="e.g., Professor, Associate Professor"
                  {...register("designation")}
                  className={errors.designation ? "border-red-500" : ""}
                />
                {errors.designation && (
                  <p className="text-sm text-red-500">{errors.designation.message}</p>
                )}
              </div>

              {/* Qualifications */}
              <div className="space-y-2">
                <label htmlFor="qualifications" className="text-sm font-medium">
                  Qualifications <span className="text-red-500">*</span>
                </label>
                <Input
                  id="qualifications"
                  type="text"
                  placeholder="e.g., Ph.D. in Computer Science"
                  {...register("qualifications")}
                  className={errors.qualifications ? "border-red-500" : ""}
                />
                {errors.qualifications && (
                  <p className="text-sm text-red-500">{errors.qualifications.message}</p>
                )}
              </div>

              {/* Experience Years */}
              <div className="space-y-2">
                <label htmlFor="experience_years" className="text-sm font-medium">
                  Experience (Years) <span className="text-red-500">*</span>
                </label>
                <Input
                  id="experience_years"
                  type="number"
                  min="0"
                  max="50"
                  placeholder="e.g., 10"
                  {...register("experience_years")}
                  className={errors.experience_years ? "border-red-500" : ""}
                />
                {errors.experience_years && (
                  <p className="text-sm text-red-500">{errors.experience_years.message}</p>
                )}
              </div>

              {/* Specialization */}
              <div className="space-y-2">
                <label htmlFor="specialization" className="text-sm font-medium">
                  Specialization
                </label>
                <Input
                  id="specialization"
                  type="text"
                  placeholder="e.g., Machine Learning, AI"
                  {...register("specialization")}
                />
                <p className="text-xs text-muted-foreground">
                  Optional: Area of expertise
                </p>
              </div>

              {/* Date of Joining */}
              <div className="space-y-2">
                <label htmlFor="date_of_joining" className="text-sm font-medium">
                  Date of Joining <span className="text-red-500">*</span>
                </label>
                <Input
                  id="date_of_joining"
                  type="date"
                  {...register("date_of_joining")}
                  className={errors.date_of_joining ? "border-red-500" : ""}
                />
                {errors.date_of_joining && (
                  <p className="text-sm text-red-500">{errors.date_of_joining.message}</p>
                )}
              </div>

              {/* Salary */}
              <div className="space-y-2">
                <label htmlFor="salary" className="text-sm font-medium">
                  Salary (Monthly)
                </label>
                <Input
                  id="salary"
                  type="number"
                  min="0"
                  placeholder="e.g., 75000"
                  {...register("salary")}
                  className={errors.salary ? "border-red-500" : ""}
                />
                {errors.salary && (
                  <p className="text-sm text-red-500">{errors.salary.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Optional: Monthly salary in rupees
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
                  <option value="on_leave">On Leave</option>
                </select>
                {errors.status && (
                  <p className="text-sm text-red-500">{errors.status.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Creating..." : "Create Faculty Member"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/faculty')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

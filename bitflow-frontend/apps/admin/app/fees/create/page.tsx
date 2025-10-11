"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, DollarSign, Calculator } from "lucide-react";
import Link from "next/link";

// Mock data for dropdowns
const mockStudents = [
  { id: "1", name: "Raj Kumar", rollNumber: "CS2021001" },
  { id: "2", name: "Priya Sharma", rollNumber: "CS2021002" },
  { id: "3", name: "Amit Patel", rollNumber: "CS2021003" },
  { id: "4", name: "Sneha Reddy", rollNumber: "CS2021004" },
  { id: "5", name: "Vikram Singh", rollNumber: "CS2021005" },
];

const feeTypes = [
  { value: "tuition", label: "Tuition Fee", defaultAmount: 50000 },
  { value: "library", label: "Library Fee", defaultAmount: 5000 },
  { value: "exam", label: "Exam Fee", defaultAmount: 3000 },
  { value: "hostel", label: "Hostel Fee", defaultAmount: 30000 },
  { value: "transport", label: "Transport Fee", defaultAmount: 10000 },
  { value: "lab", label: "Lab Fee", defaultAmount: 15000 },
  { value: "sports", label: "Sports Fee", defaultAmount: 2000 },
  { value: "other", label: "Other", defaultAmount: 0 },
];

const feeSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  feeType: z.string().min(1, "Fee type is required"),
  amount: z.number().min(1, "Amount must be greater than 0"),
  dueDate: z.string().min(1, "Due date is required"),
  semester: z.string().min(1, "Semester is required"),
  academicYear: z.string().min(1, "Academic year is required"),
  description: z.string().optional(),
  installmentPlan: z.boolean(),
  numberOfInstallments: z.number().optional(),
});

type FeeFormData = z.infer<typeof feeSchema>;

export default function CreateFeePage() {
  const router = useRouter();
  const [selectedFeeType, setSelectedFeeType] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FeeFormData>({
    resolver: zodResolver(feeSchema),
    defaultValues: {
      installmentPlan: false,
      numberOfInstallments: 1,
    },
  });

  const installmentPlan = watch("installmentPlan");
  const numberOfInstallments = watch("numberOfInstallments") || 1;
  const amount = watch("amount") || 0;

  const createFeeMutation = useMutation({
    mutationFn: async (data: FeeFormData) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return data;
    },
    onSuccess: () => {
      router.push("/fees");
    },
  });

  const onSubmit = (data: FeeFormData) => {
    createFeeMutation.mutate(data);
  };

  const handleFeeTypeChange = (feeType: string) => {
    setSelectedFeeType(feeType);
    const selectedType = feeTypes.find((t) => t.value === feeType);
    if (selectedType) {
      setValue("amount", selectedType.defaultAmount);
    }
  };

  const installmentAmount = installmentPlan ? amount / numberOfInstallments : amount;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/fees"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Fees
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Add Fee Record</h1>
        <p className="text-sm text-gray-500 mt-1">Create a new fee record for a student</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="space-y-6">
              {/* Student Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("studentId")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Student</option>
                  {mockStudents.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} ({student.rollNumber})
                    </option>
                  ))}
                </select>
                {errors.studentId && (
                  <p className="text-red-500 text-sm mt-1">{errors.studentId.message}</p>
                )}
              </div>

              {/* Fee Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fee Type <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("feeType")}
                  onChange={(e) => handleFeeTypeChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Fee Type</option>
                  {feeTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.feeType && (
                  <p className="text-red-500 text-sm mt-1">{errors.feeType.message}</p>
                )}
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  {...register("amount", { valueAsNumber: true })}
                  placeholder="Enter amount"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                {errors.amount && (
                  <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
                )}
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register("dueDate")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                {errors.dueDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.dueDate.message}</p>
                )}
              </div>

              {/* Semester & Academic Year */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Semester <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("semester")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Semester</option>
                    <option value="Fall 2024">Fall 2024</option>
                    <option value="Spring 2025">Spring 2025</option>
                    <option value="Summer 2025">Summer 2025</option>
                  </select>
                  {errors.semester && (
                    <p className="text-red-500 text-sm mt-1">{errors.semester.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Academic Year <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("academicYear")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Year</option>
                    <option value="2024-25">2024-25</option>
                    <option value="2025-26">2025-26</option>
                  </select>
                  {errors.academicYear && (
                    <p className="text-red-500 text-sm mt-1">{errors.academicYear.message}</p>
                  )}
                </div>
              </div>

              {/* Installment Plan */}
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register("installmentPlan")}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Enable Installment Plan</span>
                </label>
              </div>

              {/* Number of Installments */}
              {installmentPlan && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Installments
                  </label>
                  <input
                    type="number"
                    {...register("numberOfInstallments", { valueAsNumber: true })}
                    min="1"
                    max="12"
                    placeholder="Enter number of installments"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.numberOfInstallments && (
                    <p className="text-red-500 text-sm mt-1">{errors.numberOfInstallments.message}</p>
                  )}
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  {...register("description")}
                  rows={3}
                  placeholder="Add notes or additional details..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={createFeeMutation.isPending}
                  className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
                >
                  <DollarSign className="w-4 h-4" />
                  {createFeeMutation.isPending ? "Creating..." : "Create Fee Record"}
                </button>
                <Link
                  href="/fees"
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </form>
        </div>

        {/* Payment Calculation Preview */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg border border-gray-200 sticky top-6">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Payment Summary</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-sm text-gray-600">Total Amount</span>
                <span className="text-lg font-bold text-gray-900">
                  {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
                    amount || 0
                  )}
                </span>
              </div>
              {installmentPlan && numberOfInstallments > 1 && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Number of Installments</span>
                    <span className="text-sm font-medium text-gray-900">{numberOfInstallments}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-sm text-gray-600">Per Installment</span>
                    <span className="text-lg font-bold text-blue-600">
                      {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
                        installmentAmount
                      )}
                    </span>
                  </div>
                </>
              )}
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs text-blue-600 font-medium">💡 Payment Information</p>
                <p className="text-xs text-gray-600 mt-1">
                  {installmentPlan
                    ? `Student will pay ${numberOfInstallments} installments of ${new Intl.NumberFormat(
                        "en-IN",
                        { style: "currency", currency: "INR" }
                      ).format(installmentAmount)}`
                    : "Full payment expected by due date"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

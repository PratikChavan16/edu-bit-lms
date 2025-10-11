"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Award } from "lucide-react";

// Validation schema
const resultSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  examId: z.string().min(1, "Exam is required"),
  marksObtained: z.coerce.number().min(0, "Marks must be 0 or greater"),
  maxMarks: z.coerce.number().min(1, "Max marks is required"),
  remarks: z.string().optional(),
}).refine((data) => data.marksObtained <= data.maxMarks, {
  message: "Marks obtained cannot exceed max marks",
  path: ["marksObtained"],
});

type ResultFormData = z.infer<typeof resultSchema>;

export default function CreateResultPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<ResultFormData>({
    resolver: zodResolver(resultSchema),
    defaultValues: { maxMarks: 100 },
  });

  const marksObtained = watch("marksObtained");
  const maxMarks = watch("maxMarks");

  // Calculate grade
  const calculateGrade = (obtained: number, max: number) => {
    const percentage = (obtained / max) * 100;
    if (percentage >= 90) return { grade: "A+", gp: 10.0 };
    if (percentage >= 80) return { grade: "A", gp: 9.0 };
    if (percentage >= 70) return { grade: "B+", gp: 8.0 };
    if (percentage >= 60) return { grade: "B", gp: 7.0 };
    if (percentage >= 50) return { grade: "C+", gp: 6.0 };
    if (percentage >= 40) return { grade: "C", gp: 5.0 };
    if (percentage >= 33) return { grade: "D", gp: 4.0 };
    return { grade: "F", gp: 0.0 };
  };

  const currentGrade = marksObtained && maxMarks ? calculateGrade(marksObtained, maxMarks) : null;
  const percentage = marksObtained && maxMarks ? ((marksObtained / maxMarks) * 100).toFixed(1) : null;

  const createMutation = useMutation({
    mutationFn: async (data: ResultFormData) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Creating result:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["results"] });
      router.push("/results");
    },
  });

  const onSubmit = async (data: ResultFormData) => {
    setIsSubmitting(true);
    try {
      await createMutation.mutateAsync(data);
    } catch (error) {
      console.error("Error creating result:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link href="/results" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Results
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Add Result</h1>
        <p className="text-sm text-gray-500 mt-1">Enter exam result and marks for a student</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl">
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Result Details</h2>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student *</label>
                <select {...register("studentId")} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option value="">Select Student</option>
                  <option value="1">Raj Kumar - CS2021001</option>
                  <option value="2">Priya Sharma - CS2021002</option>
                  <option value="3">Amit Patel - CS2021003</option>
                </select>
                {errors.studentId && <p className="text-red-500 text-sm mt-1">{errors.studentId.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exam *</label>
                <select {...register("examId")} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option value="">Select Exam</option>
                  <option value="1">Data Structures Midterm</option>
                  <option value="2">DBMS Final Exam</option>
                  <option value="3">OS Quiz 1</option>
                </select>
                {errors.examId && <p className="text-red-500 text-sm mt-1">{errors.examId.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marks Obtained *</label>
                <input
                  type="number"
                  {...register("marksObtained")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., 85"
                />
                {errors.marksObtained && <p className="text-red-500 text-sm mt-1">{errors.marksObtained.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Marks *</label>
                <input
                  type="number"
                  {...register("maxMarks")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., 100"
                />
                {errors.maxMarks && <p className="text-red-500 text-sm mt-1">{errors.maxMarks.message}</p>}
              </div>
            </div>

            {/* Grade Preview */}
            {currentGrade && percentage && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">Grade Preview</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-blue-700">Percentage</p>
                    <p className="text-xl font-bold text-blue-900">{percentage}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-700">Grade</p>
                    <p className="text-xl font-bold text-blue-900">{currentGrade.grade}</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-700">Grade Point</p>
                    <p className="text-xl font-bold text-blue-900">{currentGrade.gp}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
              <textarea
                {...register("remarks")}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Optional remarks..."
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? "Saving..." : "Save Result"}
          </button>
          <Link href="/results" className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash2, Award } from "lucide-react";

const mockResults = [
  { id: "1", studentId: "1", examId: "1", marksObtained: 87, maxMarks: 100, remarks: "Excellent" },
];

const resultSchema = z.object({
  marksObtained: z.coerce.number().min(0),
  maxMarks: z.coerce.number().min(1),
  remarks: z.string().optional(),
}).refine((data) => data.marksObtained <= data.maxMarks, {
  message: "Marks obtained cannot exceed max marks",
  path: ["marksObtained"],
});

type ResultFormData = z.infer<typeof resultSchema>;

export default function EditResultPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const resultId = params.id as string;

  const { data: result, isLoading } = useQuery({
    queryKey: ["results", resultId],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockResults.find((r) => r.id === resultId);
    },
  });

  const { register, handleSubmit, formState: { errors } } = useForm<ResultFormData>({
    resolver: zodResolver(resultSchema),
    values: result,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: ResultFormData) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["results"] });
      router.push("/results");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["results"] });
      router.push("/results");
    },
  });

  const onSubmit = async (data: ResultFormData) => {
    setIsSubmitting(true);
    try {
      await updateMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this result?")) return;
    setIsDeleting(true);
    try {
      await deleteMutation.mutateAsync();
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading || !result) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link href="/results" className="inline-flex items-center text-sm text-gray-500 mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Link>
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Edit Result</h1>
          <button onClick={handleDelete} disabled={isDeleting} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
            <Trash2 className="w-4 h-4 inline mr-1" />
            Delete
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl">
        <div className="bg-white rounded-lg border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5" />
            Marks
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Marks Obtained *</label>
                <input type="number" {...register("marksObtained")} className="w-full px-4 py-2 border rounded-lg" />
                {errors.marksObtained && <p className="text-red-500 text-sm mt-1">{errors.marksObtained.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Max Marks *</label>
                <input type="number" {...register("maxMarks")} className="w-full px-4 py-2 border rounded-lg" />
                {errors.maxMarks && <p className="text-red-500 text-sm mt-1">{errors.maxMarks.message}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Remarks</label>
              <textarea {...register("remarks")} rows={3} className="w-full px-4 py-2 border rounded-lg" />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            <Save className="w-4 h-4 inline mr-1" />
            Save
          </button>
          <Link href="/results" className="bg-gray-100 px-6 py-2 rounded-lg">Cancel</Link>
        </div>
      </form>
    </div>
  );
}

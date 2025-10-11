"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, Save, Trash2, Receipt } from "lucide-react";
import Link from "next/link";

// Mock data
const mockFeeDetails = {
  id: "1",
  studentId: "1",
  studentName: "Raj Kumar",
  rollNumber: "CS2021001",
  feeType: "tuition",
  feeTypeName: "Tuition Fee",
  amount: 50000,
  paidAmount: 25000,
  dueDate: "2025-01-15",
  semester: "Fall 2024",
  academicYear: "2024-25",
  status: "partial",
  description: "Semester 1 tuition fee",
  paymentHistory: [
    {
      id: "1",
      date: "2024-12-20",
      amount: 15000,
      method: "Online",
      transactionId: "TXN123456",
    },
    {
      id: "2",
      date: "2025-01-05",
      amount: 10000,
      method: "Bank Transfer",
      transactionId: "TXN123457",
    },
  ],
};

const paymentSchema = z.object({
  paidAmount: z.number().min(0, "Amount must be positive"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  transactionId: z.string().optional(),
  paymentDate: z.string().min(1, "Payment date is required"),
  remarks: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

export default function EditFeePage() {
  const router = useRouter();
  const params = useParams();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: fee = mockFeeDetails, isLoading } = useQuery({
    queryKey: ["fee", params.id],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockFeeDetails;
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paidAmount: 0,
      paymentDate: new Date().toISOString().split("T")[0],
    },
  });

  const newPaymentAmount = watch("paidAmount") || 0;
  const remainingBalance = fee.amount - fee.paidAmount - newPaymentAmount;

  const updatePaymentMutation = useMutation({
    mutationFn: async (data: PaymentFormData) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return data;
    },
    onSuccess: () => {
      router.push("/fees");
    },
  });

  const deleteFeeMutation = useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return true;
    },
    onSuccess: () => {
      router.push("/fees");
    },
  });

  const onSubmit = (data: PaymentFormData) => {
    updatePaymentMutation.mutate(data);
  };

  const handleDelete = () => {
    deleteFeeMutation.mutate();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);
  };

  if (isLoading) {
    return <div className="p-6 text-center text-gray-500">Loading fee details...</div>;
  }

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
        <h1 className="text-2xl font-bold text-gray-900">Record Payment</h1>
        <p className="text-sm text-gray-500 mt-1">Update fee payment for {fee.studentName}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          {/* Fee Details Card */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fee Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Student</p>
                <p className="text-sm font-medium text-gray-900">
                  {fee.studentName} ({fee.rollNumber})
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fee Type</p>
                <p className="text-sm font-medium text-gray-900">{fee.feeTypeName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Semester</p>
                <p className="text-sm font-medium text-gray-900">{fee.semester}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Due Date</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(fee.dueDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-sm font-bold text-gray-900">{formatCurrency(fee.amount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Paid Amount</p>
                <p className="text-sm font-bold text-green-600">{formatCurrency(fee.paidAmount)}</p>
              </div>
            </div>
          </div>

          {/* Record New Payment */}
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Record New Payment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Amount (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  {...register("paidAmount", { valueAsNumber: true })}
                  placeholder="Enter payment amount"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                {errors.paidAmount && (
                  <p className="text-red-500 text-sm mt-1">{errors.paidAmount.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("paymentMethod")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Method</option>
                    <option value="Cash">Cash</option>
                    <option value="Online">Online Payment</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Demand Draft">Demand Draft</option>
                  </select>
                  {errors.paymentMethod && (
                    <p className="text-red-500 text-sm mt-1">{errors.paymentMethod.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    {...register("paymentDate")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.paymentDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.paymentDate.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction ID (Optional)
                </label>
                <input
                  type="text"
                  {...register("transactionId")}
                  placeholder="Enter transaction ID or reference number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remarks (Optional)
                </label>
                <textarea
                  {...register("remarks")}
                  rows={3}
                  placeholder="Add payment notes..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={updatePaymentMutation.isPending}
                  className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {updatePaymentMutation.isPending ? "Recording..." : "Record Payment"}
                </button>
                <button
                  type="button"
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                >
                  <Receipt className="w-4 h-4" />
                  Generate Receipt
                </button>
              </div>
            </div>
          </form>

          {/* Payment History */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
            {fee.paymentHistory.length === 0 ? (
              <p className="text-sm text-gray-500">No payments recorded yet</p>
            ) : (
              <div className="space-y-3">
                {fee.paymentHistory.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(payment.amount)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(payment.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                        • {payment.method}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Txn ID</p>
                      <p className="text-xs font-mono text-gray-900">{payment.transactionId}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Delete Button */}
          <div className="mt-6">
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Fee Record
            </button>
          </div>
        </div>

        {/* Balance Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg border border-gray-200 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Balance Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-sm text-gray-600">Total Fee</span>
                <span className="text-lg font-bold text-gray-900">{formatCurrency(fee.amount)}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-sm text-gray-600">Paid So Far</span>
                <span className="text-lg font-bold text-green-600">
                  {formatCurrency(fee.paidAmount)}
                </span>
              </div>
              {newPaymentAmount > 0 && (
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-sm text-gray-600">Current Payment</span>
                  <span className="text-lg font-bold text-blue-600">
                    {formatCurrency(newPaymentAmount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">Remaining Balance</span>
                <span
                  className={`text-xl font-bold ${
                    remainingBalance <= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {formatCurrency(remainingBalance)}
                </span>
              </div>
              {remainingBalance <= 0 && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-xs text-green-600 font-medium">✅ Fee Fully Paid</p>
                  <p className="text-xs text-gray-600 mt-1">All dues have been cleared</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Fee Record?</h3>
            <p className="text-sm text-gray-600 mb-6">
              This action cannot be undone. All payment history will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleteFeeMutation.isPending}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400"
              >
                {deleteFeeMutation.isPending ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Search, Plus, DollarSign, CheckCircle, Clock, XCircle } from "lucide-react";

// Mock data
const mockFees = [
  {
    id: "1",
    studentId: "1",
    studentName: "Raj Kumar",
    rollNumber: "CS2021001",
    feeType: "tuition",
    feeTypeName: "Tuition Fee",
    amount: 50000,
    paidAmount: 50000,
    dueDate: "2025-01-15",
    paidDate: "2025-01-10",
    status: "paid",
    paymentMethod: "Online",
    transactionId: "TXN123456",
    semester: "Fall 2024",
  },
  {
    id: "2",
    studentId: "2",
    studentName: "Priya Sharma",
    rollNumber: "CS2021002",
    feeType: "tuition",
    feeTypeName: "Tuition Fee",
    amount: 50000,
    paidAmount: 25000,
    dueDate: "2025-01-15",
    paidDate: null,
    status: "partial",
    paymentMethod: "Bank Transfer",
    transactionId: "TXN123457",
    semester: "Fall 2024",
  },
  {
    id: "3",
    studentId: "3",
    studentName: "Amit Patel",
    rollNumber: "CS2021003",
    feeType: "library",
    feeTypeName: "Library Fee",
    amount: 5000,
    paidAmount: 0,
    dueDate: "2025-02-01",
    paidDate: null,
    status: "pending",
    paymentMethod: null,
    transactionId: null,
    semester: "Fall 2024",
  },
  {
    id: "4",
    studentId: "4",
    studentName: "Sneha Reddy",
    rollNumber: "CS2021004",
    feeType: "exam",
    feeTypeName: "Exam Fee",
    amount: 3000,
    paidAmount: 0,
    dueDate: "2024-12-31",
    paidDate: null,
    status: "overdue",
    paymentMethod: null,
    transactionId: null,
    semester: "Fall 2024",
  },
  {
    id: "5",
    studentId: "1",
    studentName: "Raj Kumar",
    rollNumber: "CS2021001",
    feeType: "hostel",
    feeTypeName: "Hostel Fee",
    amount: 30000,
    paidAmount: 30000,
    dueDate: "2025-01-10",
    paidDate: "2025-01-08",
    status: "paid",
    paymentMethod: "Cash",
    transactionId: "TXN123458",
    semester: "Fall 2024",
  },
  {
    id: "6",
    studentId: "5",
    studentName: "Vikram Singh",
    rollNumber: "CS2021005",
    feeType: "transport",
    feeTypeName: "Transport Fee",
    amount: 10000,
    paidAmount: 0,
    dueDate: "2025-01-20",
    paidDate: null,
    status: "pending",
    paymentMethod: null,
    transactionId: null,
    semester: "Fall 2024",
  },
];

export default function FeesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [feeTypeFilter, setFeeTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const { data: fees = mockFees, isLoading } = useQuery({
    queryKey: ["fees", searchQuery, feeTypeFilter, statusFilter, dateFrom, dateTo],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockFees.filter((fee) => {
        const matchesSearch =
          fee.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          fee.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFeeType = feeTypeFilter === "all" || fee.feeType === feeTypeFilter;
        const matchesStatus = statusFilter === "all" || fee.status === statusFilter;
        const matchesDateFrom = !dateFrom || fee.dueDate >= dateFrom;
        const matchesDateTo = !dateTo || fee.dueDate <= dateTo;
        return matchesSearch && matchesFeeType && matchesStatus && matchesDateFrom && matchesDateTo;
      });
    },
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      paid: "bg-green-100 text-green-700",
      partial: "bg-yellow-100 text-yellow-700",
      pending: "bg-blue-100 text-blue-700",
      overdue: "bg-red-100 text-red-700",
    };
    return badges[status as keyof typeof badges] || "bg-gray-100 text-gray-700";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="w-4 h-4" />;
      case "partial":
        return <Clock className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "overdue":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);
  };

  // Statistics
  const stats = {
    total: fees.reduce((acc, f) => acc + f.amount, 0),
    collected: fees.reduce((acc, f) => acc + f.paidAmount, 0),
    pending: fees.reduce((acc, f) => acc + (f.amount - f.paidAmount), 0),
    overdue: fees.filter((f) => f.status === "overdue").reduce((acc, f) => acc + f.amount, 0),
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fees & Payments Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track fee payments and manage student finances
          </p>
        </div>
        <Link
          href="/fees/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Fee Record
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Fees</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.total)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Collected</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.collected)}</p>
              <p className="text-xs text-gray-500">
                {((stats.collected / stats.total) * 100).toFixed(1)}%
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{formatCurrency(stats.pending)}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.overdue)}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search student..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={feeTypeFilter}
            onChange={(e) => setFeeTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Fee Types</option>
            <option value="tuition">Tuition Fee</option>
            <option value="library">Library Fee</option>
            <option value="exam">Exam Fee</option>
            <option value="hostel">Hostel Fee</option>
            <option value="transport">Transport Fee</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="partial">Partially Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            placeholder="From Date"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            placeholder="To Date"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Fees Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading fees...</div>
        ) : fees.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No fee records found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {fees.map((fee) => (
                  <tr key={fee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{fee.studentName}</div>
                      <div className="text-xs text-gray-500">{fee.rollNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{fee.feeTypeName}</div>
                      <div className="text-xs text-gray-500">{fee.semester}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(fee.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                      {formatCurrency(fee.paidAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                      {formatCurrency(fee.amount - fee.paidAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(fee.dueDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full flex items-center gap-1 w-fit ${getStatusBadge(
                          fee.status
                        )}`}
                      >
                        {getStatusIcon(fee.status)}
                        {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {fee.paymentMethod || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link href={`/fees/${fee.id}/edit`} className="text-blue-600 hover:text-blue-900">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

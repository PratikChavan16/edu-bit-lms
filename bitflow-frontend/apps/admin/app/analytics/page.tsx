'use client';

import { useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Select,
  Badge,
} from '@bitflow/ui';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Mock data
const revenueData = [
  { month: 'Jan', revenue: 45000, expenses: 32000 },
  { month: 'Feb', revenue: 52000, expenses: 35000 },
  { month: 'Mar', revenue: 48000, expenses: 33000 },
  { month: 'Apr', revenue: 61000, expenses: 38000 },
  { month: 'May', revenue: 55000, expenses: 36000 },
  { month: 'Jun', revenue: 67000, expenses: 40000 },
  { month: 'Jul', revenue: 72000, expenses: 42000 },
  { month: 'Aug', revenue: 68000, expenses: 41000 },
  { month: 'Sep', revenue: 75000, expenses: 43000 },
  { month: 'Oct', revenue: 82000, expenses: 45000 },
];

const enrollmentData = [
  { month: 'Jan', students: 1250 },
  { month: 'Feb', students: 1320 },
  { month: 'Mar', students: 1280 },
  { month: 'Apr', students: 1450 },
  { month: 'May', students: 1380 },
  { month: 'Jun', students: 1520 },
  { month: 'Jul', students: 1680 },
  { month: 'Aug', students: 1750 },
  { month: 'Sep', students: 1650 },
  { month: 'Oct', students: 1820 },
];

const feeCollectionData = [
  { name: 'Collected', value: 85, count: 765 },
  { name: 'Pending', value: 10, count: 90 },
  { name: 'Overdue', value: 5, count: 45 },
];

const attendanceData = [
  { day: 'Mon', attendance: 92 },
  { day: 'Tue', attendance: 88 },
  { day: 'Wed', attendance: 90 },
  { day: 'Thu', attendance: 85 },
  { day: 'Fri', attendance: 87 },
  { day: 'Sat', attendance: 78 },
];

const departmentData = [
  { name: 'Computer Science', students: 450, revenue: 225000 },
  { name: 'Mechanical', students: 380, revenue: 190000 },
  { name: 'Electrical', students: 320, revenue: 160000 },
  { name: 'Civil', students: 290, revenue: 145000 },
  { name: 'Electronics', students: 380, revenue: 190000 },
];

const COLORS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
};

const PIE_COLORS = [COLORS.success, COLORS.warning, COLORS.danger];

export default function AnalyticsDashboardPage() {
  const [timeRange, setTimeRange] = useState('last-30-days');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const handleExport = () => {
    alert('Exporting analytics data as PDF...');
  };

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: '$650,000',
      change: '+12.5%',
      trend: 'up',
      color: 'from-blue-500 to-blue-600',
      icon: '💰',
    },
    {
      title: 'Active Students',
      value: '1,820',
      change: '+8.3%',
      trend: 'up',
      color: 'from-green-500 to-green-600',
      icon: '👨‍🎓',
    },
    {
      title: 'Avg Attendance',
      value: '86.7%',
      change: '-2.1%',
      trend: 'down',
      color: 'from-purple-500 to-purple-600',
      icon: '📊',
    },
    {
      title: 'Fee Collection',
      value: '85%',
      change: '+5.2%',
      trend: 'up',
      color: 'from-orange-500 to-orange-600',
      icon: '💳',
    },
  ];

  return (
    <div className="space-y-6 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-700 mt-1">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex gap-3">
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            options={[
              { value: 'last-7-days', label: 'Last 7 Days' },
              { value: 'last-30-days', label: 'Last 30 Days' },
              { value: 'last-90-days', label: 'Last 90 Days' },
              { value: 'last-year', label: 'Last Year' },
            ]}
            className="w-48"
          />
          <Select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            options={[
              { value: 'all', label: 'All Departments' },
              { value: 'cs', label: 'Computer Science' },
              { value: 'mech', label: 'Mechanical' },
              { value: 'elec', label: 'Electrical' },
              { value: 'civil', label: 'Civil' },
            ]}
            className="w-48"
          />
          <Button variant="ghost" onClick={handleExport}>
            Export PDF
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => (
          <Card
            key={index}
            className={`bg-gradient-to-br ${kpi.color} text-white border-0 transform transition-transform hover:scale-105`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm opacity-90">{kpi.title}</p>
                  <p className="text-3xl font-bold mt-2">{kpi.value}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge
                      variant={kpi.trend === 'up' ? 'success' : 'error'}
                      className="text-white bg-white/20"
                    >
                      {kpi.change}
                    </Badge>
                    <span className="text-xs opacity-80">vs last period</span>
                  </div>
                </div>
                <span className="text-4xl">{kpi.icon}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue & Expenses Chart */}
      <Card className="bg-white border-2 border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900">Revenue vs Expenses</CardTitle>
            <Badge variant="info">Monthly Trend</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke={COLORS.primary}
                strokeWidth={3}
                name="Revenue"
                dot={{ fill: COLORS.primary, r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke={COLORS.danger}
                strokeWidth={3}
                name="Expenses"
                dot={{ fill: COLORS.danger, r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Enrollment & Fee Collection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Trend */}
        <Card className="bg-white border-2 border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-900">Student Enrollment</CardTitle>
              <Badge variant="success">Growing</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="students" fill={COLORS.success} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Fee Collection */}
        <Card className="bg-white border-2 border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-900">Fee Collection Status</CardTitle>
              <Badge variant="warning">Action Needed</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <ResponsiveContainer width="60%" height={300}>
                <PieChart>
                  <Pie
                    data={feeCollectionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {feeCollectionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-4">
                {feeCollectionData.map((item, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: PIE_COLORS[index] }}
                        />
                        <span className="text-sm font-medium text-gray-900">{item.name}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{item.value}%</span>
                    </div>
                    <p className="text-xs text-gray-600 ml-6">{item.count} students</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance & Department Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Attendance */}
        <Card className="bg-white border-2 border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-900">Weekly Attendance</CardTitle>
              <Badge variant="info">This Week</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="attendance" fill={COLORS.info} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Performance */}
        <Card className="bg-white border-2 border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Department Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentData.map((dept, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{dept.name}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-700">{dept.students} students</span>
                      <span className="text-sm font-bold text-gray-900">
                        ${dept.revenue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all"
                      style={{ width: `${(dept.students / 450) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card className="bg-gradient-to-r from-gray-800 to-gray-900 text-white border-0">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm opacity-80">Faculty Members</p>
              <p className="text-2xl font-bold mt-1">124</p>
            </div>
            <div>
              <p className="text-sm opacity-80">Total Courses</p>
              <p className="text-2xl font-bold mt-1">48</p>
            </div>
            <div>
              <p className="text-sm opacity-80">Avg Class Size</p>
              <p className="text-2xl font-bold mt-1">37.9</p>
            </div>
            <div>
              <p className="text-sm opacity-80">Pass Rate</p>
              <p className="text-2xl font-bold mt-1">89.3%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

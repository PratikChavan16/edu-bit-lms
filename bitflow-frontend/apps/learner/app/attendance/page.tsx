'use client';

import { useState } from 'react';
import { useLearnerAttendance } from '@bitflow/api-client/learner';
import { Card, Select, Badge, ProgressCircle } from '@bitflow/ui';
import { Calendar, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function AttendancePage() {
  const currentDate = new Date();
  const [filters, setFilters] = useState({
    month: (currentDate.getMonth() + 1).toString(),
    year: currentDate.getFullYear().toString(),
    subject: undefined as string | undefined,
  });

  const { data, isLoading, error } = useLearnerAttendance(filters);

  const statusColors = {
    present: 'bg-green-100 text-green-700 border-green-200',
    absent: 'bg-red-100 text-red-700 border-red-200',
    late: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    excused: 'bg-blue-100 text-blue-700 border-blue-200',
    holiday: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  const statusIcons = {
    present: <CheckCircle className="h-4 w-4" />,
    absent: <XCircle className="h-4 w-4" />,
    late: <Clock className="h-4 w-4" />,
    excused: <AlertCircle className="h-4 w-4" />,
  };

  // Generate calendar days for the selected month
  const generateCalendar = () => {
    const year = parseInt(filters.year);
    const month = parseInt(filters.month) - 1;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let date = 1; date <= lastDay.getDate(); date++) {
      days.push(date);
    }

    return days;
  };

  const getStatusForDate = (date: number) => {
    if (!data?.calendar) return null;
    const dateStr = `${filters.year}-${filters.month.padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
    return data.calendar[dateStr];
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - i);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Attendance</h1>
        <p className="text-gray-600 mt-1">Track your class attendance and maintain a good record</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Overall</h3>
            <TrendingUp className="h-5 w-5 text-blue-500" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">{data?.summary?.percentage.toFixed(1) || 0}%</p>
              <p className="text-sm text-gray-500 mt-1">
                {data?.summary?.present || 0}/{data?.summary?.total_classes || 0} classes
              </p>
            </div>
            <ProgressCircle value={data?.summary?.percentage || 0} size="lg" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-gray-600">Present</span>
            </div>
            <p className="text-3xl font-bold">{data?.summary?.present || 0}</p>
            <p className="text-sm text-gray-500 mt-1">Days attended</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <span className="text-sm font-medium text-gray-600">Absent</span>
            </div>
            <p className="text-3xl font-bold">{data?.summary?.absent || 0}</p>
            <p className="text-sm text-gray-500 mt-1">Days missed</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-600">Late</span>
            </div>
            <p className="text-3xl font-bold">{data?.summary?.late || 0}</p>
            <p className="text-sm text-gray-500 mt-1">Late arrivals</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <Select
            value={filters.month}
            onValueChange={(value) => setFilters({ ...filters, month: value })}
          >
            {months.map((month, idx) => (
              <option key={month} value={(idx + 1).toString()}>
                {month}
              </option>
            ))}
          </Select>
          <Select
            value={filters.year}
            onValueChange={(value) => setFilters({ ...filters, year: value })}
          >
            {years.map((year) => (
              <option key={year} value={year.toString()}>
                {year}
              </option>
            ))}
          </Select>
          <Select
            value={filters.subject || 'all'}
            onValueChange={(value) =>
              setFilters({ ...filters, subject: value === 'all' ? undefined : value })
            }
          >
            <option value="all">All Subjects</option>
            {data?.summary?.subject_wise?.map((s) => (
              <option key={s.subject} value={s.subject}>
                {s.subject}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      {/* Calendar View */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Attendance Calendar
        </h2>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            <p>Failed to load attendance data</p>
          </div>
        ) : (
          <div>
            {/* Calendar Header */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {generateCalendar().map((date, idx) => {
                if (!date) {
                  return <div key={`empty-${idx}`} className="aspect-square" />;
                }
                const status = getStatusForDate(date);
                return (
                  <div
                    key={date}
                    className={`aspect-square rounded-lg border-2 flex items-center justify-center text-sm font-medium ${
                      status ? statusColors[status] : 'bg-white border-gray-200'
                    }`}
                  >
                    {date}
                  </div>
                );
              })}
            </div>
            {/* Legend */}
            <div className="flex gap-4 mt-6 flex-wrap">
              {Object.entries(statusColors).map(([status, className]) => (
                <div key={status} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded border-2 ${className}`} />
                  <span className="text-sm capitalize">{status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Subject-wise Breakdown */}
      {data?.summary?.subject_wise && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Subject-wise Attendance</h2>
          <div className="space-y-4">
            {data.summary.subject_wise.map((subject) => (
              <div key={subject.subject} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{subject.subject}</span>
                    <span className="text-sm text-gray-600">
                      {subject.present}/{subject.total} ({subject.percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        subject.percentage >= 75
                          ? 'bg-green-500'
                          : subject.percentage >= 60
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${subject.percentage}%` }}
                    />
                  </div>
                </div>
                <Badge
                  className={
                    subject.percentage >= 75
                      ? 'bg-green-100 text-green-700'
                      : subject.percentage >= 60
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }
                >
                  {subject.percentage >= 75 ? 'Good' : subject.percentage >= 60 ? 'Warning' : 'Low'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recent Records */}
      {data?.records && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Records</h2>
          <div className="space-y-3">
            {data.records.slice(0, 10).map((record, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  {statusIcons[record.status]}
                  <div>
                    <p className="font-medium">{record.subject}</p>
                    <p className="text-sm text-gray-600">{record.faculty}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={statusColors[record.status]}>
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </Badge>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(record.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

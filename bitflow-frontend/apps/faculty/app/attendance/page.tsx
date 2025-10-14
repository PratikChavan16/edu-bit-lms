'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFacultyAttendance, useRecordFacultyAttendance } from '@bitflow/api-client/faculty';
import { Button } from '@bitflow/ui/button';
import { Card } from '@bitflow/ui/card';
import { Badge } from '@bitflow/ui/badge';
import { CheckCircle2, XCircle, Clock, UserCheck, Calendar, ArrowLeft, Save } from 'lucide-react';

type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export default function AttendanceMarkingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const blockId = searchParams.get('block');
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

  const [attendanceData, setAttendanceData] = useState<Record<string, { status: AttendanceStatus; notes?: string }>>({});
  const [bulkStatus, setBulkStatus] = useState<AttendanceStatus>('present');

  const { data: attendance, isLoading, error } = useFacultyAttendance(blockId || '', { date });
  const recordAttendance = useRecordFacultyAttendance({
    onSuccess: () => {
      router.push('/dashboard');
    },
  });

  if (!blockId) {
    return (
      <div className="p-8">
        <Card className="p-6">
          <p className="text-muted-foreground">No timetable block selected. Please go back to the dashboard.</p>
          <Button onClick={() => router.push('/dashboard')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading attendance data...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error || !attendance?.success) {
    return (
      <div className="p-8">
        <Card className="p-6">
          <p className="text-destructive mb-4">Failed to load attendance data</p>
          <Button onClick={() => router.push('/dashboard')} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const { data: attendanceInfo } = attendance;
  const students = attendanceInfo.students || [];

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], status },
    }));
  };

  const handleNotesChange = (studentId: string, notes: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], notes: notes || undefined },
    }));
  };

  const handleBulkMark = () => {
    const updates: Record<string, { status: AttendanceStatus; notes?: string }> = {};
    students.forEach(student => {
      updates[student.id] = { status: bulkStatus };
    });
    setAttendanceData(updates);
  };

  const handleSubmit = async () => {
    const entries = students.map(student => ({
      student_id: student.id,
      status: attendanceData[student.id]?.status || 'present',
      notes: attendanceData[student.id]?.notes || null,
    }));

    recordAttendance.mutate({ blockId, date, entries });
  };

  const getStatusIcon = (status: AttendanceStatus) => {
    switch (status) {
      case 'present':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'absent':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'late':
        return <Clock className="h-4 w-4 text-orange-600" />;
      case 'excused':
        return <UserCheck className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: AttendanceStatus) => {
    const variants: Record<AttendanceStatus, 'default' | 'destructive' | 'outline' | 'secondary'> = {
      present: 'default',
      absent: 'destructive',
      late: 'secondary',
      excused: 'outline',
    };
    return <Badge variant={variants[status]}>{status.toUpperCase()}</Badge>;
  };

  const markedCount = Object.keys(attendanceData).length;
  const presentCount = Object.values(attendanceData).filter(a => a.status === 'present').length;
  const absentCount = Object.values(attendanceData).filter(a => a.status === 'absent').length;

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">Mark Attendance</h1>
          </div>
          <p className="text-muted-foreground">
            {attendanceInfo.subject} - {attendanceInfo.section}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <input
            type="date"
            value={date}
            onChange={e => router.push(`/attendance?block=${blockId}&date=${e.target.value}`)}
            className="rounded-md border px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="text-2xl font-bold">{students.length}</div>
          <p className="text-sm text-muted-foreground">Total Students</p>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">{presentCount}</div>
          <p className="text-sm text-muted-foreground">Present</p>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-red-600">{absentCount}</div>
          <p className="text-sm text-muted-foreground">Absent</p>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold">{markedCount}/{students.length}</div>
          <p className="text-sm text-muted-foreground">Marked</p>
        </Card>
      </div>

      {/* Bulk Actions */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Bulk Mark:</span>
          <select
            value={bulkStatus}
            onChange={e => setBulkStatus(e.target.value as AttendanceStatus)}
            className="rounded-md border px-3 py-2 text-sm"
          >
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
            <option value="excused">Excused</option>
          </select>
          <Button onClick={handleBulkMark} variant="outline" size="sm">
            Mark All as {bulkStatus}
          </Button>
        </div>
      </Card>

      {/* Students List */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Students</h2>
          <div className="space-y-4">
            {students.map((student, index) => {
              const currentStatus = attendanceData[student.id]?.status || 'present';
              const currentNotes = attendanceData[student.id]?.notes || '';

              return (
                <div key={student.id} className="flex items-start gap-4 border-b pb-4 last:border-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-medium text-muted-foreground w-8">{index + 1}.</span>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.enrollment_number}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {['present', 'absent', 'late', 'excused'].map(status => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(student.id, status as AttendanceStatus)}
                        className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm transition-colors ${
                          currentStatus === status
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted hover:bg-muted/80'
                        }`}
                      >
                        {getStatusIcon(status as AttendanceStatus)}
                        <span className="capitalize">{status}</span>
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Notes (optional)"
                    value={currentNotes}
                    onChange={e => handleNotesChange(student.id, e.target.value)}
                    className="w-48 rounded-md border px-3 py-2 text-sm"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => router.push('/dashboard')}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={recordAttendance.isPending || markedCount === 0}
        >
          {recordAttendance.isPending ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Attendance
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

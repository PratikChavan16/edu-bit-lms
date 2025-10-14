'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFacultyTimetable } from '@bitflow/api-client/faculty';
import { Button } from '@bitflow/ui/button';
import { Card } from '@bitflow/ui/card';
import { Badge } from '@bitflow/ui/badge';
import { DataTable } from '@bitflow/ui/data-table';
import { Users, Search, Download } from 'lucide-react';

export default function StudentsListPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: timetable, isLoading } = useFacultyTimetable();

  // Extract unique students from all timetable blocks
  const students = timetable?.success
    ? Array.from(
        new Map(
          timetable.data.days
            .flatMap((day: any) => day.blocks)
            .flatMap((block: any) => block.students || [])
            .map((student: any) => [student.id, student])
        ).values()
      )
    : [];

  const filteredStudents = students.filter((student: any) =>
    student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.enrollment_number?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      header: 'Name',
      accessorKey: 'name',
      cell: ({ row }: any) => (
        <div>
          <p className="font-medium">{row.original.name}</p>
          <p className="text-sm text-muted-foreground">{row.original.enrollment_number}</p>
        </div>
      ),
    },
    {
      header: 'Course',
      accessorKey: 'course',
    },
    {
      header: 'Year',
      accessorKey: 'year',
      cell: ({ row }: any) => `Year ${row.original.year}`,
    },
    {
      header: 'Section',
      accessorKey: 'section',
    },
    {
      header: 'Email',
      accessorKey: 'email',
    },
    {
      header: 'Phone',
      accessorKey: 'phone',
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }: any) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/students/${row.original.id}`)}
        >
          View Profile
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground">View and manage your students</p>
        </div>
        <Button variant="outline" onClick={() => window.print()}>
          <Download className="mr-2 h-4 w-4" />
          Export List
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name or enrollment number..."
            className="flex-1 border-0 bg-transparent outline-none"
          />
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="text-2xl font-bold">{students.length}</div>
          <p className="text-sm text-muted-foreground">Total Students</p>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold">{filteredStudents.length}</div>
          <p className="text-sm text-muted-foreground">Filtered Results</p>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold">
            {new Set(students.map((s: any) => s.course)).size}
          </div>
          <p className="text-sm text-muted-foreground">Courses</p>
        </Card>
      </div>

      {isLoading ? (
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading students...</p>
          </div>
        </Card>
      ) : (
        <Card>
          <DataTable columns={columns} data={filteredStudents} />
        </Card>
      )}
    </div>
  );
}

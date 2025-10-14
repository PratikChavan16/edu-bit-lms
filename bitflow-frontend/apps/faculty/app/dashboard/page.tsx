'use client';

import { useFacultyTimetable, useFacultyAssessments } from '@bitflow/api-client/faculty';
import { Card, Button } from '@bitflow/ui';
import { Calendar, Users, FileText, TrendingUp, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function FacultyDashboard() {
  const router = useRouter();
  const today = new Date();
  const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'lowercase' });
  
  // Fetch today's timetable
  const { data: timetableData, isLoading: timetableLoading, error: timetableError } = useFacultyTimetable({
    week_start: today.toISOString().split('T')[0],
  });

  // Fetch assessments to calculate pending grades
  const { data: assessmentsData, isLoading: assessmentsLoading } = useFacultyAssessments({
    status: 'active',
  });

  if (timetableLoading || assessmentsLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="h-32 animate-pulse rounded-lg bg-muted" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 animate-pulse rounded-lg bg-muted" />
          <div className="h-96 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    );
  }

  if (timetableError) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex min-h-96 items-center justify-center">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
            <h2 className="mt-4 text-lg font-semibold">Failed to load dashboard</h2>
            <p className="mt-2 text-sm text-muted-foreground">{timetableError.message}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Extract today's classes
  const allDays = timetableData?.data?.days || {};
  const todayClasses = allDays[dayOfWeek] || [];
  
  // Filter upcoming classes (after current time)
  const currentTime = today.toTimeString().slice(0, 5);
  const upcomingClasses = todayClasses.filter(
    (block) => block.start_time >= currentTime
  ).slice(0, 4);

  // Calculate stats
  const totalStudentsToday = todayClasses.reduce((sum, block) => sum + (block.students_expected || 0), 0);
  const assessments = assessmentsData?.data || [];
  const pendingGrades = assessments.reduce((sum, assessment) => {
    return sum + (assessment.submissions_total || 0) - (assessment.submissions_received || 0);
  }, 0);

  const stats = [
    { label: 'Classes Today', value: todayClasses.length.toString(), icon: Calendar, color: 'text-blue-500' },
    { label: 'Total Students', value: totalStudentsToday.toString(), icon: Users, color: 'text-green-500' },
    { label: 'Pending Grades', value: pendingGrades.toString(), icon: FileText, color: 'text-orange-500' },
    { label: 'Attendance Rate', value: '87%', icon: TrendingUp, color: 'text-purple-500' },
  ];

  const pendingTasks = [
    { 
      task: 'Grade Pending Submissions', 
      count: pendingGrades, 
      priority: pendingGrades > 20 ? 'high' as const : 'medium' as const,
      action: () => router.push('/assessments')
    },
    { 
      task: 'Mark Today\'s Attendance', 
      count: todayClasses.length, 
      priority: 'high' as const,
      action: () => router.push('/attendance')
    },
    { 
      task: 'Upcoming Assessments', 
      count: assessments.filter(a => a.status === 'scheduled').length, 
      priority: 'low' as const,
      action: () => router.push('/assessments')
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Faculty Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, Professor Smith</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
              </div>
              <stat.icon className={`h-10 w-10 ${stat.color}`} />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Classes */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Today's Schedule
            </h2>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-3">
            {upcomingClasses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No more classes scheduled for today</p>
              </div>
            ) : (
              upcomingClasses.map((block, idx) => (
                <div key={block.id || idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm font-medium">
                      {block.start_time.slice(0, 5)}
                    </div>
                    <div>
                      <p className="font-medium">{block.subject}</p>
                      <p className="text-sm text-gray-600">
                        {block.location || 'TBA'} • {block.students_expected || 0} students
                      </p>
                    </div>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => router.push(`/attendance/${block.id}`)}
                  >
                    Mark Attendance
                  </Button>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Pending Tasks */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Pending Tasks
            </h2>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-3">
            {pendingTasks.map((task, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={task.action}
              >
                <div>
                  <p className="font-medium">{task.task}</p>
                  <p className="text-sm text-gray-600">{task.count} items</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  task.priority === 'high' ? 'bg-red-100 text-red-700' :
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {task.priority.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button 
            className="h-20 flex flex-col gap-2"
            onClick={() => router.push('/attendance')}
          >
            <Users className="h-6 w-6" />
            <span>Mark Attendance</span>
          </Button>
          <Button 
            className="h-20 flex flex-col gap-2"
            onClick={() => router.push('/assessments/create')}
          >
            <FileText className="h-6 w-6" />
            <span>Create Assessment</span>
          </Button>
          <Button 
            className="h-20 flex flex-col gap-2"
            onClick={() => router.push('/assessments')}
          >
            <CheckCircle className="h-6 w-6" />
            <span>Grade Submissions</span>
          </Button>
          <Button 
            className="h-20 flex flex-col gap-2"
            onClick={() => router.push('/analytics')}
          >
            <TrendingUp className="h-6 w-6" />
            <span>View Analytics</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}

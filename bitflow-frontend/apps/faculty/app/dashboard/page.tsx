'use client';

import { Card, Button } from '@bitflow/ui';
import { Calendar, Users, FileText, TrendingUp, Clock, CheckCircle } from 'lucide-react';

export default function FacultyDashboard() {
  const stats = [
    { label: 'Classes Today', value: '4', icon: Calendar, color: 'text-blue-500' },
    { label: 'Total Students', value: '156', icon: Users, color: 'text-green-500' },
    { label: 'Pending Grades', value: '23', icon: FileText, color: 'text-orange-500' },
    { label: 'Attendance Rate', value: '87%', icon: TrendingUp, color: 'text-purple-500' },
  ];

  const upcomingClasses = [
    { time: '09:00 AM', subject: 'Data Structures', room: 'Lab 301', students: 45 },
    { time: '11:00 AM', subject: 'Algorithms', room: 'Room 205', students: 38 },
    { time: '02:00 PM', subject: 'Database Systems', room: 'Room 310', students: 42 },
    { time: '04:00 PM', subject: 'Web Development', room: 'Lab 402', students: 31 },
  ];

  const pendingTasks = [
    { task: 'Grade Mid-term Exams', count: 45, priority: 'high' },
    { task: 'Review Assignment Submissions', count: 23, priority: 'medium' },
    { task: 'Update Course Materials', count: 3, priority: 'low' },
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
            {upcomingClasses.map((cls, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm font-medium">
                    {cls.time}
                  </div>
                  <div>
                    <p className="font-medium">{cls.subject}</p>
                    <p className="text-sm text-gray-600">{cls.room} • {cls.students} students</p>
                  </div>
                </div>
                <Button size="sm">Mark Attendance</Button>
              </div>
            ))}
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
              <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
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
          <Button className="h-20 flex flex-col gap-2">
            <Users className="h-6 w-6" />
            <span>Mark Attendance</span>
          </Button>
          <Button className="h-20 flex flex-col gap-2">
            <FileText className="h-6 w-6" />
            <span>Create Assessment</span>
          </Button>
          <Button className="h-20 flex flex-col gap-2">
            <CheckCircle className="h-6 w-6" />
            <span>Grade Submissions</span>
          </Button>
          <Button className="h-20 flex flex-col gap-2">
            <TrendingUp className="h-6 w-6" />
            <span>View Analytics</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}

'use client';

import { useFacultyAssessments, useFacultyTimetable } from '@bitflow/api-client/faculty';
import { Card } from '@bitflow/ui/card';
import { Badge } from '@bitflow/ui/badge';
import { TrendingUp, Users, BookOpen, Award, BarChart3, PieChart } from 'lucide-react';

export default function AnalyticsPage() {
  const { data: assessments } = useFacultyAssessments();
  const { data: timetable } = useFacultyTimetable();

  const assessmentList = assessments?.data || [];
  const totalStudents = timetable?.data?.days
    ? Array.from(
        new Set(
          timetable.data.days
            .flatMap((day: any) => day.blocks)
            .flatMap((block: any) => block.students || [])
            .map((student: any) => student.id)
        )
      ).length
    : 0;

  const completedAssessments = assessmentList.filter((a: any) => a.status === 'completed');
  const averageSubmissionRate = completedAssessments.length > 0
    ? Math.round(
        completedAssessments.reduce(
          (sum: number, a: any) => sum + ((a.submissions_count || 0) / (a.total_students || 1)) * 100,
          0
        ) / completedAssessments.length
      )
    : 0;

  const totalClasses = timetable?.data?.days
    ? timetable.data.days.reduce((sum: number, day: any) => sum + day.blocks.length, 0)
    : 0;

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Overview of your teaching performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <Badge variant="outline">Total</Badge>
          </div>
          <div className="text-3xl font-bold">{totalStudents}</div>
          <p className="text-sm text-muted-foreground">Students</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <BookOpen className="h-5 w-5 text-muted-foreground" />
            <Badge variant="outline">Weekly</Badge>
          </div>
          <div className="text-3xl font-bold">{totalClasses}</div>
          <p className="text-sm text-muted-foreground">Classes</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Award className="h-5 w-5 text-muted-foreground" />
            <Badge variant="outline">Total</Badge>
          </div>
          <div className="text-3xl font-bold">{assessmentList.length}</div>
          <p className="text-sm text-muted-foreground">Assessments</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <Badge variant="default">Avg</Badge>
          </div>
          <div className="text-3xl font-bold">{averageSubmissionRate}%</div>
          <p className="text-sm text-muted-foreground">Submission Rate</p>
        </Card>
      </div>

      {/* Assessment Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Assessment Status</h2>
          </div>
          <div className="space-y-3">
            {['draft', 'published', 'ongoing', 'completed', 'archived'].map(status => {
              const count = assessmentList.filter((a: any) => a.status === status).length;
              const percentage = assessmentList.length > 0
                ? Math.round((count / assessmentList.length) * 100)
                : 0;

              return (
                <div key={status} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{status}</span>
                    <span className="font-medium">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Assessment Types</h2>
          </div>
          <div className="space-y-3">
            {['mcq', 'saq', 'laq', 'assignment', 'practical'].map(type => {
              const count = assessmentList.filter((a: any) => a.type === type).length;
              const percentage = assessmentList.length > 0
                ? Math.round((count / assessmentList.length) * 100)
                : 0;

              return (
                <div key={type} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="uppercase">{type}</span>
                    <span className="font-medium">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Assessments</h2>
        <div className="space-y-3">
          {assessmentList.slice(0, 5).map((assessment: any) => (
            <div key={assessment.id} className="flex items-center justify-between border-b pb-3 last:border-0">
              <div>
                <p className="font-medium">{assessment.title}</p>
                <p className="text-sm text-muted-foreground">{assessment.subject}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge>{assessment.status}</Badge>
                <span className="text-sm text-muted-foreground">
                  {assessment.submissions_count || 0}/{assessment.total_students || 0} submitted
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

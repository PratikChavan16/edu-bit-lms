'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useFacultyAssessmentSubmissions, useGradeFacultySubmission } from '@bitflow/api-client/faculty';
import { Button } from '@bitflow/ui/button';
import { Card } from '@bitflow/ui/card';
import { Badge } from '@bitflow/ui/badge';
import { ArrowLeft, Save, Download, Eye } from 'lucide-react';

export default function GradingPage() {
  const router = useRouter();
  const params = useParams();
  const assessmentId = params.id as string;

  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [gradeData, setGradeData] = useState<Record<string, { marks: number; feedback: string }>>({});

  const { data: submissions, isLoading, error } = useFacultyAssessmentSubmissions(assessmentId);
  const gradeSubmission = useGradeFacultySubmission({
    onSuccess: () => {
      setSelectedSubmission(null);
      setGradeData({});
    },
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading submissions...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error || !submissions?.success) {
    return (
      <div className="p-8">
        <Card className="p-6">
          <p className="text-destructive mb-4">Failed to load submissions</p>
          <Button onClick={() => router.push('/assessments')} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Assessments
          </Button>
        </Card>
      </div>
    );
  }

  const submissionsList = submissions.data || [];
  const gradedCount = submissionsList.filter((s: any) => s.status === 'graded').length;
  const pendingCount = submissionsList.filter((s: any) => s.status === 'submitted').length;

  const handleGrade = (submissionId: string) => {
    const data = gradeData[submissionId];
    if (!data || data.marks === undefined) return;

    gradeSubmission.mutate({
      assessmentId,
      submissionId,
      marks: data.marks,
      feedback: data.feedback,
    });
  };

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Button variant="ghost" size="sm" onClick={() => router.push('/assessments')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">Grade Submissions</h1>
          </div>
          <p className="text-muted-foreground">Review and grade student submissions</p>
        </div>
        <Button variant="outline" onClick={() => window.print()}>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="text-2xl font-bold">{submissionsList.length}</div>
          <p className="text-sm text-muted-foreground">Total Submissions</p>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-orange-600">{pendingCount}</div>
          <p className="text-sm text-muted-foreground">Pending Grading</p>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">{gradedCount}</div>
          <p className="text-sm text-muted-foreground">Graded</p>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold">
            {submissionsList.length > 0
              ? Math.round((gradedCount / submissionsList.length) * 100)
              : 0}
            %
          </div>
          <p className="text-sm text-muted-foreground">Progress</p>
        </Card>
      </div>

      {/* Submissions List */}
      <div className="grid gap-4 md:grid-cols-2">
        {submissionsList.map((submission: any) => {
          const isSelected = selectedSubmission === submission.id;
          const currentGrade = gradeData[submission.id] || { marks: submission.marks || 0, feedback: submission.feedback || '' };

          return (
            <Card key={submission.id} className={`p-6 ${isSelected ? 'ring-2 ring-primary' : ''}`}>
              <div className="space-y-4">
                {/* Student Info */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{submission.student_name}</p>
                    <p className="text-sm text-muted-foreground">{submission.enrollment_number}</p>
                  </div>
                  <Badge variant={submission.status === 'graded' ? 'default' : 'secondary'}>
                    {submission.status}
                  </Badge>
                </div>

                {/* Submission Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Submitted At:</span>
                    <span>{new Date(submission.submitted_at).toLocaleString()}</span>
                  </div>
                  {submission.file_url && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Attachment:</span>
                      <a
                        href={submission.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        View File
                      </a>
                    </div>
                  )}
                </div>

                {/* Answer/Response */}
                {submission.answer && (
                  <div>
                    <label className="text-sm font-medium mb-1 block">Student Answer:</label>
                    <div className="rounded-md bg-muted p-3 text-sm">
                      {submission.answer}
                    </div>
                  </div>
                )}

                {/* Grading Section */}
                <div className="space-y-3 border-t pt-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Marks (out of {submission.max_marks})
                    </label>
                    <input
                      type="number"
                      value={currentGrade.marks}
                      onChange={e => {
                        const marks = parseFloat(e.target.value);
                        setGradeData({
                          ...gradeData,
                          [submission.id]: { ...currentGrade, marks },
                        });
                      }}
                      onFocus={() => setSelectedSubmission(submission.id)}
                      className="w-full rounded-md border px-3 py-2 text-sm"
                      min="0"
                      max={submission.max_marks}
                      step="0.5"
                      disabled={submission.status === 'graded'}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Feedback</label>
                    <textarea
                      value={currentGrade.feedback}
                      onChange={e =>
                        setGradeData({
                          ...gradeData,
                          [submission.id]: { ...currentGrade, feedback: e.target.value },
                        })
                      }
                      onFocus={() => setSelectedSubmission(submission.id)}
                      className="w-full rounded-md border px-3 py-2 text-sm"
                      rows={3}
                      placeholder="Provide feedback to the student..."
                      disabled={submission.status === 'graded'}
                    />
                  </div>
                  {submission.status !== 'graded' && (
                    <Button
                      onClick={() => handleGrade(submission.id)}
                      disabled={
                        gradeSubmission.isPending ||
                        currentGrade.marks === undefined ||
                        currentGrade.marks < 0 ||
                        currentGrade.marks > submission.max_marks
                      }
                      className="w-full"
                      size="sm"
                    >
                      {gradeSubmission.isPending ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Grade
                        </>
                      )}
                    </Button>
                  )}
                  {submission.status === 'graded' && (
                    <div className="text-sm text-green-600 flex items-center gap-2">
                      <Badge variant="default">Graded</Badge>
                      <span>
                        {submission.marks}/{submission.max_marks} marks
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {submissionsList.length === 0 && (
        <Card className="p-12">
          <div className="text-center text-muted-foreground">
            <p className="text-lg mb-2">No submissions yet</p>
            <p className="text-sm">Students haven't submitted their work yet</p>
          </div>
        </Card>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useLearnerAssessments } from '@bitflow/api-client/learner';
import { Badge } from "@bitflow/ui/badge";
import { Button } from "@bitflow/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitflow/ui/card";
import { Input } from "@bitflow/ui/input";
import { Select } from "@bitflow/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@bitflow/ui/table";
import { AlertCircle, FileText, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ResultsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');

  const { data, isLoading, error } = useLearnerAssessments({
    status: 'completed',
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-32 animate-pulse rounded-lg bg-muted" />
        <div className="h-96 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
          <h2 className="mt-4 text-lg font-semibold">Failed to load results</h2>
          <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const assessments = data?.data || [];

  // Filter completed assessments with grades
  const gradedAssessments = assessments.filter(
    (a) => a.submission_status === 'graded' && a.score !== undefined
  );

  // Apply filters
  const filteredResults = gradedAssessments.filter((a) => {
    const matchesSearch = searchQuery
      ? a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.subject.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesType = typeFilter ? a.type === typeFilter : true;
    return matchesSearch && matchesType;
  });

  // Calculate statistics
  const totalAssessments = gradedAssessments.length;
  const passedAssessments = gradedAssessments.filter(
    (a) => a.score !== undefined && a.score >= (a.passing_marks || 0)
  ).length;
  const averageScore =
    gradedAssessments.length > 0
      ? gradedAssessments.reduce((sum, a) => sum + (a.score || 0), 0) / gradedAssessments.length
      : 0;
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Results</h1>
          <p className="text-muted-foreground">
            Review assessments, scores, and teacher feedback • {totalAssessments} results
          </p>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Search..."
            className="md:max-w-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            options={[
              { value: '', label: 'All Types' },
              { value: 'mcq', label: 'MCQ' },
              { value: 'saq', label: 'Short Answer' },
              { value: 'laq', label: 'Long Answer' },
              { value: 'assignment', label: 'Assignment' },
            ]}
          />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-blue-100 p-3">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Assessments</p>
                <p className="text-2xl font-bold">{totalAssessments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-green-100 p-3">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pass Rate</p>
                <p className="text-2xl font-bold">
                  {totalAssessments > 0 ? ((passedAssessments / totalAssessments) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-purple-100 p-3">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className="text-2xl font-bold">{averageScore.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Assessment history</CardTitle>
          <CardDescription>
            {filteredResults.length} {filteredResults.length === 1 ? 'result' : 'results'} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredResults.length === 0 ? (
            <div className="flex min-h-64 items-center justify-center rounded-lg border border-dashed">
              <div className="text-center">
                <p className="text-lg font-medium text-muted-foreground">No results found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchQuery || typeFilter ? 'Try adjusting your filters' : 'Complete some assessments to see results here'}
                </p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assessment</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.map((assessment) => {
                  const isPassed = assessment.score !== undefined && assessment.score >= (assessment.passing_marks || 0);
                  const scorePercentage = assessment.total_marks
                    ? ((assessment.score || 0) / assessment.total_marks * 100).toFixed(1)
                    : assessment.score?.toFixed(1) || 'N/A';

                  return (
                    <TableRow key={assessment.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{assessment.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{assessment.type.toUpperCase()}</Badge>
                      </TableCell>
                      <TableCell>{assessment.subject}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{scorePercentage}%</span>
                          {assessment.score !== undefined && (
                            <span className="text-xs text-muted-foreground">
                              ({assessment.score}/{assessment.total_marks})
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={isPassed ? 'success' : 'destructive'}>
                          {isPassed ? 'Pass' : 'Fail'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {assessment.ends_at ? new Date(assessment.ends_at).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/assessments/${assessment.id}`)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

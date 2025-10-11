'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLearnerAssessment, useSubmitAssessment } from '@bitflow/api-client/learner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitflow/ui/card";
import { Button } from "@bitflow/ui/button";
import { FileUpload } from "@bitflow/ui/file-upload";
import { AlertCircle, CheckCircle, FileText, Upload } from 'lucide-react';

export default function SubmitAssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const assessmentId = params.id as string;
  
  const { data, isLoading, error } = useLearnerAssessment(assessmentId);
  const submitMutation = useSubmitAssessment();
  
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const assessment = data?.data;

  const handleFilesChange = (files: File[]) => {
    // In production, upload files to server and get URLs
    const fileNames = files.map(f => f.name);
    setUploadedFiles(fileNames);
  };

  const handleSubmit = async () => {
    if (uploadedFiles.length === 0) {
      alert('Please upload at least one file');
      return;
    }

    try {
      await submitMutation.mutateAsync({
        assessmentId,
        answers: {},
        uploaded_files: uploadedFiles,
      });
      
      setShowSuccess(true);
      setTimeout(() => {
        router.push('/assessments');
      }, 2000);
    } catch (error) {
      console.error('Submission failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 animate-bounce text-primary" />
          <p className="mt-4">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
          <h2 className="mt-4 text-lg font-semibold">Failed to load assessment</h2>
          <Button onClick={() => router.push('/assessments')} className="mt-4">
            Back to Assessments
          </Button>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-600" />
          <h2 className="mt-4 text-2xl font-semibold">Submission Successful!</h2>
          <p className="mt-2 text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-6 px-4 py-8">
      {/* Header */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle>{assessment.title}</CardTitle>
          </div>
          <CardDescription>
            {assessment.subject} • Due: {new Date(assessment.ends_at).toLocaleString()}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Instructions */}
      {assessment.instructions && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {assessment.instructions}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Assessment Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Assessment Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm font-medium">Total Marks</p>
            <p className="text-2xl font-bold text-primary">{assessment.total_marks}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Passing Marks</p>
            <p className="text-2xl font-bold">{assessment.passing_marks}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Type</p>
            <p className="capitalize">{assessment.type}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Attempts Remaining</p>
            <p>
              {assessment.attempt_limit
                ? `${(assessment.attempt_limit || 0) - (assessment.attempts_made || 0)} of ${assessment.attempt_limit}`
                : 'Unlimited'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Submit Your Work</CardTitle>
          <CardDescription>
            Upload your assignment files. Accepted formats: PDF, DOC, DOCX, ZIP
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FileUpload
            onFilesChange={handleFilesChange}
            maxFiles={5}
            acceptedFileTypes={['.pdf', '.doc', '.docx', '.zip', '.png', '.jpg', '.jpeg']}
            maxSizeMB={10}
          />

          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Uploaded Files:</p>
              <ul className="space-y-1">
                {uploadedFiles.map((file, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    {file}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Card className="bg-gradient-to-br from-primary/10 to-surface">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Ready to submit?</p>
              <p className="text-sm text-muted-foreground">
                Make sure you've uploaded all required files
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => router.push('/assessments')}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={uploadedFiles.length === 0 || submitMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {submitMutation.isPending ? 'Submitting...' : 'Submit Assessment'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {submitMutation.isError && (
        <Card className="border-l-4 border-l-destructive">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">
                {submitMutation.error?.message || 'Submission failed. Please try again.'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

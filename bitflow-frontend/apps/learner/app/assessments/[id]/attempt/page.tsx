'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLearnerAssessment, useSubmitAssessment } from '@bitflow/api-client/learner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitflow/ui/card";
import { Button } from "@bitflow/ui/button";
import { Badge } from "@bitflow/ui/badge";
import { Modal } from "@bitflow/ui/modal";
import { AlertCircle, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

export default function AttemptAssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const assessmentId = params.id as string;
  
  const { data, isLoading, error } = useLearnerAssessment(assessmentId);
  const submitMutation = useSubmitAssessment();
  
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');

  const assessment = data?.data;
  const questions = assessment?.questions || [];

  // Timer
  useEffect(() => {
    if (!assessment?.duration_minutes) return;
    
    setTimeRemaining(assessment.duration_minutes * 60);
    
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 0) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [assessment]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (Object.keys(answers).length > 0) {
        setAutoSaveStatus('saving');
        // Simulate save
        setTimeout(() => setAutoSaveStatus('saved'), 500);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [answers]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    try {
      await submitMutation.mutateAsync({
        assessmentId,
        answers,
      });
      
      router.push('/assessments?submitted=true');
    } catch (error) {
      console.error('Submission failed:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Clock className="mx-auto h-12 w-12 animate-spin text-primary" />
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
          <p className="mt-2 text-sm text-muted-foreground">{error?.message}</p>
          <Button onClick={() => router.push('/assessments')} className="mt-4">
            Back to Assessments
          </Button>
        </div>
      </div>
    );
  }

  if (!assessment.can_submit) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-600" />
          <h2 className="mt-4 text-lg font-semibold">Assessment Not Available</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This assessment is not available for submission.
          </p>
          <Button onClick={() => router.push('/assessments')} className="mt-4">
            Back to Assessments
          </Button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header - Fixed */}
      <div className="sticky top-0 z-10 border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">{assessment.title}</h1>
              <p className="text-sm text-muted-foreground">{assessment.subject}</p>
            </div>
            <div className="flex items-center gap-4">
              {timeRemaining !== null && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2">
                  <Clock className="h-5 w-5 text-red-600" />
                  <span className="font-mono text-lg font-semibold text-red-600">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                {autoSaveStatus === 'saving' && (
                  <span className="text-sm text-muted-foreground">Saving...</span>
                )}
                {autoSaveStatus === 'saved' && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Progress: {answeredCount} of {questions.length} answered
              </span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-6 px-4">
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* Main Question Area */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Question {currentQuestion + 1} of {questions.length}</CardTitle>
                  <CardDescription>
                    Marks: {currentQ?.marks || 0}
                  </CardDescription>
                </div>
                <Badge variant={answers[currentQ?.id] ? 'success' : 'secondary'}>
                  {answers[currentQ?.id] ? 'Answered' : 'Not Answered'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Question Text */}
              <div className="rounded-lg bg-gray-50 p-6">
                <p className="text-lg">{currentQ?.question_text}</p>
              </div>

              {/* Answer Options */}
              <div className="space-y-3">
                {currentQ?.question_type === 'mcq' && currentQ.options?.map((option, idx) => (
                  <label
                    key={idx}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-colors ${
                      answers[currentQ.id] === option
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQ.id}`}
                      value={option}
                      checked={answers[currentQ.id] === option}
                      onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                      className="h-4 w-4"
                    />
                    <span>{option}</span>
                  </label>
                ))}

                {currentQ?.question_type === 'true_false' && (
                  <>
                    {['True', 'False'].map((option) => (
                      <label
                        key={option}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-colors ${
                          answers[currentQ.id] === option
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${currentQ.id}`}
                          value={option}
                          checked={answers[currentQ.id] === option}
                          onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                          className="h-4 w-4"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </>
                )}

                {(currentQ?.question_type === 'short_answer' || currentQ?.question_type === 'long_answer') && (
                  <textarea
                    value={answers[currentQ.id] || ''}
                    onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full rounded-lg border-2 border-gray-200 p-4 focus:border-primary focus:outline-none"
                    rows={currentQ.question_type === 'long_answer' ? 8 : 4}
                  />
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </Button>
                
                {currentQuestion < questions.length - 1 ? (
                  <Button
                    onClick={() => setCurrentQuestion((prev) => prev + 1)}
                  >
                    Next Question
                  </Button>
                ) : (
                  <Button
                    onClick={() => setShowSubmitModal(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Submit Assessment
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Sidebar - Question Navigator */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Question Navigator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((q, idx) => (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestion(idx)}
                      className={`aspect-square rounded-lg border-2 text-sm font-medium transition-colors ${
                        idx === currentQuestion
                          ? 'border-primary bg-primary text-white'
                          : answers[q.id]
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-300 bg-white hover:bg-gray-50'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-green-500" />
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full border-2 border-gray-300 bg-white" />
                    <span>Not Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-primary" />
                    <span>Current</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="Submit Assessment?"
        description={`You have answered ${answeredCount} out of ${questions.length} questions. Are you sure you want to submit?`}
      >
        <div className="mt-4 flex gap-3">
          <Button
            variant="outline"
            onClick={() => setShowSubmitModal(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitMutation.isPending}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {submitMutation.isPending ? 'Submitting...' : 'Yes, Submit'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

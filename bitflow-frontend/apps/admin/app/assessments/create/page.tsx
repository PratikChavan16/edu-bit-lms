'use client';

import { useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Textarea,
  Select,
  RadioGroup,
  Checkbox,
  Badge,
  Alert,
} from '@bitflow/ui';

// Types
interface Question {
  id: string;
  type: 'mcq' | 'multi-select' | 'short-answer' | 'long-answer';
  questionText: string;
  marks: number;
  options?: QuestionOption[];
  correctAnswer?: string | string[];
}

interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface AssessmentData {
  title: string;
  description: string;
  duration: number;
  totalMarks: number;
  passingMarks: number;
  randomizeQuestions: boolean;
  showResultsImmediately: boolean;
  questions: Question[];
}

export default function AssessmentBuilderPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [assessment, setAssessment] = useState<AssessmentData>({
    title: '',
    description: '',
    duration: 60,
    totalMarks: 0,
    passingMarks: 0,
    randomizeQuestions: false,
    showResultsImmediately: false,
    questions: [],
  });

  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    type: 'mcq',
    questionText: '',
    marks: 1,
    options: [
      { id: '1', text: '', isCorrect: false },
      { id: '2', text: '', isCorrect: false },
      { id: '3', text: '', isCorrect: false },
      { id: '4', text: '', isCorrect: false },
    ],
  });

  const [showPreview, setShowPreview] = useState(false);

  // Step 1: Basic Info
  const handleBasicInfoNext = () => {
    if (!assessment.title || !assessment.description) {
      alert('Please fill in all required fields');
      return;
    }
    setCurrentStep(2);
  };

  // Step 2: Settings
  const handleSettingsNext = () => {
    setCurrentStep(3);
  };

  // Step 3: Add Questions
  const handleAddQuestion = () => {
    if (!currentQuestion.questionText || !currentQuestion.marks) {
      alert('Please fill in question text and marks');
      return;
    }

    if (currentQuestion.type === 'mcq' || currentQuestion.type === 'multi-select') {
      const validOptions = currentQuestion.options?.filter(opt => opt.text.trim() !== '');
      if (!validOptions || validOptions.length < 2) {
        alert('Please add at least 2 options');
        return;
      }
      const hasCorrectAnswer = validOptions.some(opt => opt.isCorrect);
      if (!hasCorrectAnswer) {
        alert('Please mark at least one correct answer');
        return;
      }
    }

    const newQuestion: Question = {
      id: Date.now().toString(),
      type: currentQuestion.type as Question['type'],
      questionText: currentQuestion.questionText,
      marks: currentQuestion.marks || 1,
      options: currentQuestion.options,
      correctAnswer: currentQuestion.type === 'mcq' 
        ? currentQuestion.options?.find(o => o.isCorrect)?.id 
        : currentQuestion.options?.filter(o => o.isCorrect).map(o => o.id),
    };

    const newQuestions = [...assessment.questions, newQuestion];
    const totalMarks = newQuestions.reduce((sum, q) => sum + q.marks, 0);

    setAssessment({
      ...assessment,
      questions: newQuestions,
      totalMarks,
    });

    // Reset current question
    setCurrentQuestion({
      type: 'mcq',
      questionText: '',
      marks: 1,
      options: [
        { id: '1', text: '', isCorrect: false },
        { id: '2', text: '', isCorrect: false },
        { id: '3', text: '', isCorrect: false },
        { id: '4', text: '', isCorrect: false },
      ],
    });
  };

  const handleDeleteQuestion = (id: string) => {
    const newQuestions = assessment.questions.filter(q => q.id !== id);
    const totalMarks = newQuestions.reduce((sum, q) => sum + q.marks, 0);
    setAssessment({
      ...assessment,
      questions: newQuestions,
      totalMarks,
    });
  };

  const handleAddOption = () => {
    const newOption: QuestionOption = {
      id: Date.now().toString(),
      text: '',
      isCorrect: false,
    };
    setCurrentQuestion({
      ...currentQuestion,
      options: [...(currentQuestion.options || []), newOption],
    });
  };

  const handleRemoveOption = (optionId: string) => {
    setCurrentQuestion({
      ...currentQuestion,
      options: currentQuestion.options?.filter(o => o.id !== optionId),
    });
  };

  const handleOptionTextChange = (optionId: string, text: string) => {
    setCurrentQuestion({
      ...currentQuestion,
      options: currentQuestion.options?.map(o => 
        o.id === optionId ? { ...o, text } : o
      ),
    });
  };

  const handleOptionCorrectChange = (optionId: string) => {
    if (currentQuestion.type === 'mcq') {
      // Single selection
      setCurrentQuestion({
        ...currentQuestion,
        options: currentQuestion.options?.map(o => ({
          ...o,
          isCorrect: o.id === optionId,
        })),
      });
    } else {
      // Multi-select
      setCurrentQuestion({
        ...currentQuestion,
        options: currentQuestion.options?.map(o => 
          o.id === optionId ? { ...o, isCorrect: !o.isCorrect } : o
        ),
      });
    }
  };

  const handlePublish = () => {
    if (assessment.questions.length === 0) {
      alert('Please add at least one question');
      return;
    }
    alert('Assessment published successfully! 🎉');
    // Reset or redirect
  };

  const renderBasicInfo = () => (
    <Card className="bg-white border-2 border-gray-200">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
            1
          </div>
          <CardTitle className="text-gray-900">Basic Information</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          label="Assessment Title"
          placeholder="e.g., Mid-Term Exam - Mathematics"
          value={assessment.title}
          onChange={(e) => setAssessment({ ...assessment, title: e.target.value })}
          required
        />
        <Textarea
          label="Description"
          placeholder="Brief description of this assessment..."
          rows={4}
          value={assessment.description}
          onChange={(e) => setAssessment({ ...assessment, description: e.target.value })}
          required
        />
        <Input
          label="Duration (minutes)"
          type="number"
          placeholder="60"
          value={assessment.duration.toString()}
          onChange={(e) => setAssessment({ ...assessment, duration: parseInt(e.target.value) || 0 })}
          required
        />
        <Button onClick={handleBasicInfoNext} className="w-full">
          Next: Settings
        </Button>
      </CardContent>
    </Card>
  );

  const renderSettings = () => (
    <Card className="bg-white border-2 border-gray-200">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
            2
          </div>
          <CardTitle className="text-gray-900">Assessment Settings</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          label="Passing Marks"
          type="number"
          placeholder="40"
          value={assessment.passingMarks.toString()}
          onChange={(e) => setAssessment({ ...assessment, passingMarks: parseInt(e.target.value) || 0 })}
          helperText="Minimum marks required to pass"
        />
        <Checkbox
          label="Randomize Questions"
          checked={assessment.randomizeQuestions}
          onChange={(e) => setAssessment({ ...assessment, randomizeQuestions: e.target.checked })}
          helperText="Questions will appear in random order for each student"
        />
        <Checkbox
          label="Show Results Immediately"
          checked={assessment.showResultsImmediately}
          onChange={(e) => setAssessment({ ...assessment, showResultsImmediately: e.target.checked })}
          helperText="Students can see their scores right after submission"
        />
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setCurrentStep(1)}>
            Back
          </Button>
          <Button onClick={handleSettingsNext} className="flex-1">
            Next: Add Questions
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderQuestionBuilder = () => (
    <div className="space-y-6">
      {/* Question Input */}
      <Card className="bg-white border-2 border-gray-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <CardTitle className="text-gray-900">Add Questions ({assessment.questions.length})</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            label="Question Type"
            value={currentQuestion.type}
            onChange={(e) => setCurrentQuestion({ 
              ...currentQuestion, 
              type: e.target.value as Question['type'],
              options: e.target.value === 'mcq' || e.target.value === 'multi-select' 
                ? [
                    { id: '1', text: '', isCorrect: false },
                    { id: '2', text: '', isCorrect: false },
                    { id: '3', text: '', isCorrect: false },
                    { id: '4', text: '', isCorrect: false },
                  ]
                : undefined
            })}
            options={[
              { value: 'mcq', label: 'Multiple Choice (Single Answer)' },
              { value: 'multi-select', label: 'Multiple Choice (Multiple Answers)' },
              { value: 'short-answer', label: 'Short Answer' },
              { value: 'long-answer', label: 'Long Answer (Essay)' },
            ]}
          />

          <Textarea
            label="Question Text"
            placeholder="Enter your question here..."
            rows={3}
            value={currentQuestion.questionText}
            onChange={(e) => setCurrentQuestion({ ...currentQuestion, questionText: e.target.value })}
            required
          />

          {(currentQuestion.type === 'mcq' || currentQuestion.type === 'multi-select') && (
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-900">
                Options {currentQuestion.type === 'multi-select' && '(Select all correct answers)'}
              </label>
              {currentQuestion.options?.map((option, index) => (
                <div key={option.id} className="flex gap-2 items-start">
                  <Checkbox
                    checked={option.isCorrect}
                    onChange={() => handleOptionCorrectChange(option.id)}
                  />
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option.text}
                    onChange={(e) => handleOptionTextChange(option.id, e.target.value)}
                    className="flex-1"
                  />
                  {(currentQuestion.options?.length || 0) > 2 && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemoveOption(option.id)}
                    >
                      ✕
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="secondary" size="sm" onClick={handleAddOption}>
                + Add Option
              </Button>
            </div>
          )}

          <Input
            label="Marks"
            type="number"
            placeholder="1"
            value={currentQuestion.marks?.toString()}
            onChange={(e) => setCurrentQuestion({ ...currentQuestion, marks: parseInt(e.target.value) || 1 })}
          />

          <div className="flex gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setCurrentStep(2)}>
              Back
            </Button>
            <Button onClick={handleAddQuestion} className="flex-1">
              Add Question
            </Button>
            {assessment.questions.length > 0 && (
              <Button variant="primary" onClick={() => setCurrentStep(4)}>
                Review →
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      {assessment.questions.length > 0 && (
        <Card className="bg-white border-2 border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Questions Added ({assessment.questions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assessment.questions.map((q, index) => (
                <div key={q.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="info">Q{index + 1}</Badge>
                      <Badge variant="secondary">{q.type.toUpperCase()}</Badge>
                      <Badge>{q.marks} marks</Badge>
                    </div>
                    <p className="text-sm text-gray-900 font-medium">{q.questionText}</p>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteQuestion(q.id)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-semibold text-gray-900">
                Total Marks: {assessment.totalMarks}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderReview = () => (
    <Card className="bg-white border-2 border-gray-200">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
            4
          </div>
          <CardTitle className="text-gray-900">Review & Publish</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{assessment.title}</h3>
            <p className="text-gray-700">{assessment.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Duration</p>
              <p className="text-lg font-bold text-gray-900">{assessment.duration} minutes</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Marks</p>
              <p className="text-lg font-bold text-gray-900">{assessment.totalMarks}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Passing Marks</p>
              <p className="text-lg font-bold text-gray-900">{assessment.passingMarks}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Questions</p>
              <p className="text-lg font-bold text-gray-900">{assessment.questions.length}</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-900">Settings:</p>
            <div className="flex gap-2">
              {assessment.randomizeQuestions && <Badge variant="info">Randomized</Badge>}
              {assessment.showResultsImmediately && <Badge variant="info">Instant Results</Badge>}
            </div>
          </div>
        </div>

        <Alert variant="info" title="Ready to Publish">
          <p className="text-gray-700">Once published, students will be able to attempt this assessment.</p>
        </Alert>

        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setCurrentStep(3)}>
            Back to Questions
          </Button>
          <Button variant="ghost" onClick={() => setShowPreview(!showPreview)}>
            {showPreview ? 'Hide' : 'Show'} Preview
          </Button>
          <Button variant="primary" onClick={handlePublish} className="flex-1">
            Publish Assessment
          </Button>
        </div>

        {showPreview && (
          <div className="mt-6 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
            <h4 className="font-bold text-gray-900 mb-4">Student View Preview:</h4>
            <div className="space-y-4">
              {assessment.questions.map((q, index) => (
                <div key={q.id} className="p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="font-bold text-gray-900">Q{index + 1}.</span>
                    <span className="text-gray-900">{q.questionText}</span>
                    <Badge size="sm">{q.marks}m</Badge>
                  </div>
                  {q.options && (
                    <div className="ml-6 space-y-2">
                      {q.options.map((opt) => (
                        <div key={opt.id} className="flex items-center gap-2">
                          <input
                            type={q.type === 'mcq' ? 'radio' : 'checkbox'}
                            disabled
                            className="text-blue-600"
                          />
                          <span className="text-gray-700">{opt.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {(q.type === 'short-answer' || q.type === 'long-answer') && (
                    <div className="ml-6">
                      <textarea
                        disabled
                        placeholder="Student answer will appear here..."
                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50"
                        rows={q.type === 'long-answer' ? 4 : 2}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assessment Builder</h1>
          <p className="text-gray-700 mt-1">Create exams, quizzes, and assignments with multiple question types</p>
        </div>
        <div className="flex gap-2">
          <Badge variant={currentStep === 1 ? 'info' : 'secondary'}>1. Basic Info</Badge>
          <Badge variant={currentStep === 2 ? 'info' : 'secondary'}>2. Settings</Badge>
          <Badge variant={currentStep === 3 ? 'info' : 'secondary'}>3. Questions</Badge>
          <Badge variant={currentStep === 4 ? 'info' : 'secondary'}>4. Review</Badge>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
          style={{ width: `${(currentStep / 4) * 100}%` }}
        />
      </div>

      {/* Content */}
      {currentStep === 1 && renderBasicInfo()}
      {currentStep === 2 && renderSettings()}
      {currentStep === 3 && renderQuestionBuilder()}
      {currentStep === 4 && renderReview()}
    </div>
  );
}

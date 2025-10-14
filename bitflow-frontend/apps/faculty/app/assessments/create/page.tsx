'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateFacultyAssessment } from '@bitflow/api-client/faculty';
import { Button } from '@bitflow/ui/button';
import { Card } from '@bitflow/ui/card';
import { Badge } from '@bitflow/ui/badge';
import { ArrowLeft, Save, Plus, Trash2, FileText } from 'lucide-react';

interface Question {
  id: string;
  question_text: string;
  type: 'mcq' | 'saq' | 'laq';
  marks: number;
  options?: string[];
  correct_answer?: string;
}

export default function CreateAssessmentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'mcq',
    subject: '',
    course: '',
    year: 1,
    max_marks: 100,
    duration_minutes: 60,
    due_date: '',
    instructions: '',
    status: 'draft',
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    question_text: '',
    type: 'mcq',
    marks: 1,
    options: ['', '', '', ''],
    correct_answer: '',
  });

  const createAssessment = useCreateFacultyAssessment({
    onSuccess: () => {
      router.push('/assessments');
    },
  });

  const handleAddQuestion = () => {
    if (!currentQuestion.question_text) return;

    const newQuestion: Question = {
      id: Math.random().toString(36).substr(2, 9),
      question_text: currentQuestion.question_text,
      type: currentQuestion.type || 'mcq',
      marks: currentQuestion.marks || 1,
      options: currentQuestion.options,
      correct_answer: currentQuestion.correct_answer,
    };

    setQuestions([...questions, newQuestion]);
    setCurrentQuestion({
      question_text: '',
      type: 'mcq',
      marks: 1,
      options: ['', '', '', ''],
      correct_answer: '',
    });
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleSubmit = async (status: 'draft' | 'published') => {
    const payload = {
      ...formData,
      status,
      questions: questions.map(q => ({
        question_text: q.question_text,
        type: q.type,
        marks: q.marks,
        options: q.options,
        correct_answer: q.correct_answer,
      })),
    };

    createAssessment.mutate(payload);
  };

  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Button variant="ghost" size="sm" onClick={() => router.push('/assessments')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">Create Assessment</h1>
          </div>
          <p className="text-muted-foreground">Design a new assessment for your students</p>
        </div>
      </div>

      {/* Basic Info */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-md border px-3 py-2"
              placeholder="e.g., Mid-term Examination"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Type *</label>
            <select
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value })}
              className="w-full rounded-md border px-3 py-2"
            >
              <option value="mcq">Multiple Choice (MCQ)</option>
              <option value="saq">Short Answer (SAQ)</option>
              <option value="laq">Long Answer (LAQ)</option>
              <option value="assignment">Assignment</option>
              <option value="practical">Practical</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Subject *</label>
            <input
              type="text"
              value={formData.subject}
              onChange={e => setFormData({ ...formData, subject: e.target.value })}
              className="w-full rounded-md border px-3 py-2"
              placeholder="e.g., Mathematics"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Course *</label>
            <input
              type="text"
              value={formData.course}
              onChange={e => setFormData({ ...formData, course: e.target.value })}
              className="w-full rounded-md border px-3 py-2"
              placeholder="e.g., BSc Computer Science"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Year *</label>
            <select
              value={formData.year}
              onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) })}
              className="w-full rounded-md border px-3 py-2"
            >
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Duration (minutes) *</label>
            <input
              type="number"
              value={formData.duration_minutes}
              onChange={e => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
              className="w-full rounded-md border px-3 py-2"
              placeholder="60"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Due Date *</label>
            <input
              type="datetime-local"
              value={formData.due_date}
              onChange={e => setFormData({ ...formData, due_date: e.target.value })}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Max Marks</label>
            <input
              type="number"
              value={formData.max_marks}
              onChange={e => setFormData({ ...formData, max_marks: parseInt(e.target.value) })}
              className="w-full rounded-md border px-3 py-2"
              placeholder="100"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            className="w-full rounded-md border px-3 py-2"
            rows={3}
            placeholder="Brief description of the assessment"
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Instructions</label>
          <textarea
            value={formData.instructions}
            onChange={e => setFormData({ ...formData, instructions: e.target.value })}
            className="w-full rounded-md border px-3 py-2"
            rows={3}
            placeholder="Instructions for students"
          />
        </div>
      </Card>

      {/* Questions Builder */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Questions</h2>
            <p className="text-sm text-muted-foreground">
              {questions.length} questions · {totalMarks} marks total
            </p>
          </div>
        </div>

        {/* Add Question Form */}
        <div className="border rounded-lg p-4 mb-4 bg-muted/50">
          <h3 className="font-medium mb-3">Add Question</h3>
          <div className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1">Question Type</label>
                <select
                  value={currentQuestion.type}
                  onChange={e => setCurrentQuestion({ ...currentQuestion, type: e.target.value as any })}
                  className="w-full rounded-md border px-3 py-2"
                >
                  <option value="mcq">Multiple Choice</option>
                  <option value="saq">Short Answer</option>
                  <option value="laq">Long Answer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Marks</label>
                <input
                  type="number"
                  value={currentQuestion.marks}
                  onChange={e => setCurrentQuestion({ ...currentQuestion, marks: parseInt(e.target.value) })}
                  className="w-full rounded-md border px-3 py-2"
                  min="1"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Question Text</label>
              <textarea
                value={currentQuestion.question_text}
                onChange={e => setCurrentQuestion({ ...currentQuestion, question_text: e.target.value })}
                className="w-full rounded-md border px-3 py-2"
                rows={2}
                placeholder="Enter your question here..."
              />
            </div>
            {currentQuestion.type === 'mcq' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Options</label>
                  {currentQuestion.options?.map((option, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={option}
                      onChange={e => {
                        const newOptions = [...(currentQuestion.options || [])];
                        newOptions[idx] = e.target.value;
                        setCurrentQuestion({ ...currentQuestion, options: newOptions });
                      }}
                      className="w-full rounded-md border px-3 py-2 mb-2"
                      placeholder={`Option ${idx + 1}`}
                    />
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Correct Answer</label>
                  <select
                    value={currentQuestion.correct_answer}
                    onChange={e => setCurrentQuestion({ ...currentQuestion, correct_answer: e.target.value })}
                    className="w-full rounded-md border px-3 py-2"
                  >
                    <option value="">Select correct option</option>
                    {currentQuestion.options?.map((option, idx) => (
                      <option key={idx} value={option}>
                        Option {idx + 1}: {option}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
            <Button onClick={handleAddQuestion} disabled={!currentQuestion.question_text}>
              <Plus className="mr-2 h-4 w-4" />
              Add Question
            </Button>
          </div>
        </div>

        {/* Questions List */}
        {questions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="mx-auto h-12 w-12 mb-2 opacity-50" />
            <p>No questions added yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {questions.map((question, index) => (
              <div key={question.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">Q{index + 1}.</span>
                      <Badge>{question.type.toUpperCase()}</Badge>
                      <Badge variant="outline">{question.marks} marks</Badge>
                    </div>
                    <p className="text-sm">{question.question_text}</p>
                    {question.type === 'mcq' && question.options && (
                      <div className="mt-2 space-y-1">
                        {question.options.map((option, idx) => (
                          <div key={idx} className="text-sm text-muted-foreground">
                            {idx + 1}. {option}
                            {option === question.correct_answer && (
                              <Badge className="ml-2" variant="default">Correct</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveQuestion(question.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Submit Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => router.push('/assessments')}>
          Cancel
        </Button>
        <Button
          variant="outline"
          onClick={() => handleSubmit('draft')}
          disabled={createAssessment.isPending || !formData.title || questions.length === 0}
        >
          <Save className="mr-2 h-4 w-4" />
          Save as Draft
        </Button>
        <Button
          onClick={() => handleSubmit('published')}
          disabled={createAssessment.isPending || !formData.title || questions.length === 0}
        >
          {createAssessment.isPending ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
              Publishing...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Publish Assessment
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

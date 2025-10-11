'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Textarea,
  Select,
  Badge,
  Alert,
  Checkbox,
} from '@bitflow/ui';

// Types
interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  submittedAt: string;
  status: 'graded' | 'pending' | 'reviewing';
  score?: number;
  totalMarks: number;
}

interface Question {
  id: string;
  type: 'mcq' | 'multi-select' | 'short-answer' | 'long-answer';
  questionText: string;
  marks: number;
  correctAnswer?: string | string[];
  studentAnswer?: string | string[];
  marksAwarded?: number;
  feedback?: string;
}

interface Submission {
  student: Student;
  questions: Question[];
  autoGradedScore: number;
  manualGradingRequired: number;
}

// Mock data
const mockAssessment = {
  id: '1',
  title: 'Mid-Term Exam - Mathematics',
  totalMarks: 100,
  totalSubmissions: 45,
  graded: 12,
  pending: 33,
};

const mockStudents: Student[] = [
  { id: '1', name: 'Alice Johnson', rollNumber: 'CS001', email: 'alice@edu.com', submittedAt: '2025-10-11 09:30', status: 'pending', totalMarks: 100 },
  { id: '2', name: 'Bob Smith', rollNumber: 'CS002', email: 'bob@edu.com', submittedAt: '2025-10-11 09:45', status: 'pending', totalMarks: 100 },
  { id: '3', name: 'Carol Davis', rollNumber: 'CS003', email: 'carol@edu.com', submittedAt: '2025-10-11 10:00', status: 'graded', score: 85, totalMarks: 100 },
  { id: '4', name: 'David Wilson', rollNumber: 'CS004', email: 'david@edu.com', submittedAt: '2025-10-11 10:15', status: 'pending', totalMarks: 100 },
  { id: '5', name: 'Emma Brown', rollNumber: 'CS005', email: 'emma@edu.com', submittedAt: '2025-10-11 10:30', status: 'graded', score: 92, totalMarks: 100 },
];

const mockQuestions: Question[] = [
  {
    id: '1',
    type: 'mcq',
    questionText: 'What is the derivative of x²?',
    marks: 5,
    correctAnswer: '2x',
    studentAnswer: '2x',
    marksAwarded: 5,
  },
  {
    id: '2',
    type: 'short-answer',
    questionText: 'Explain the Pythagorean theorem.',
    marks: 10,
    studentAnswer: 'In a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides.',
  },
  {
    id: '3',
    type: 'long-answer',
    questionText: 'Derive the quadratic formula from the general quadratic equation ax² + bx + c = 0.',
    marks: 20,
    studentAnswer: 'Starting with ax² + bx + c = 0, we divide by a to get x² + (b/a)x + c/a = 0. Then complete the square: x² + (b/a)x + (b/2a)² = (b/2a)² - c/a. This gives us (x + b/2a)² = (b² - 4ac)/4a². Taking square root and solving for x gives x = (-b ± √(b² - 4ac))/2a.',
  },
  {
    id: '4',
    type: 'short-answer',
    questionText: 'What is the integral of 1/x?',
    marks: 5,
    studentAnswer: 'ln|x| + C',
  },
  {
    id: '5',
    type: 'long-answer',
    questionText: 'Explain the concept of limits and provide an example.',
    marks: 15,
    studentAnswer: 'A limit describes the value that a function approaches as the input approaches some value. For example, lim(x→2) of (x² - 4)/(x - 2) = 4, even though the function is undefined at x = 2.',
  },
];

export default function GradingInterfacePage() {
  const params = useParams();
  const [view, setView] = useState<'list' | 'grading'>('list');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [currentSubmission, setCurrentSubmission] = useState<Submission | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'graded'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = mockStudents.filter(student => {
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStartGrading = (studentId: string) => {
    const student = mockStudents.find(s => s.id === studentId);
    if (student) {
      setCurrentSubmission({
        student,
        questions: mockQuestions.map(q => ({ ...q })),
        autoGradedScore: 5,
        manualGradingRequired: 50,
      });
      setView('grading');
    }
  };

  const handleMarksChange = (questionId: string, marks: number) => {
    if (!currentSubmission) return;
    setCurrentSubmission({
      ...currentSubmission,
      questions: currentSubmission.questions.map(q =>
        q.id === questionId ? { ...q, marksAwarded: marks } : q
      ),
    });
  };

  const handleFeedbackChange = (questionId: string, feedback: string) => {
    if (!currentSubmission) return;
    setCurrentSubmission({
      ...currentSubmission,
      questions: currentSubmission.questions.map(q =>
        q.id === questionId ? { ...q, feedback } : q
      ),
    });
  };

  const handleSubmitGrades = () => {
    if (!currentSubmission) return;
    const totalScore = currentSubmission.questions.reduce((sum, q) => sum + (q.marksAwarded || 0), 0);
    alert(`Grading submitted! Total Score: ${totalScore}/${mockAssessment.totalMarks}`);
    setView('list');
    setCurrentSubmission(null);
  };

  const handleBulkGrade = () => {
    if (selectedStudents.length === 0) {
      alert('Please select students to grade');
      return;
    }
    alert(`Bulk grading initiated for ${selectedStudents.length} students`);
  };

  const handleExportResults = () => {
    alert('Exporting results as CSV...');
  };

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s.id));
    }
  };

  const renderStudentList = () => (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-6">
            <p className="text-sm opacity-90">Total Submissions</p>
            <p className="text-3xl font-bold mt-2">{mockAssessment.totalSubmissions}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-6">
            <p className="text-sm opacity-90">Graded</p>
            <p className="text-3xl font-bold mt-2">{mockAssessment.graded}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
          <CardContent className="p-6">
            <p className="text-sm opacity-90">Pending</p>
            <p className="text-3xl font-bold mt-2">{mockAssessment.pending}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <p className="text-sm opacity-90">Progress</p>
            <p className="text-3xl font-bold mt-2">
              {Math.round((mockAssessment.graded / mockAssessment.totalSubmissions) * 100)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="bg-white border-2 border-gray-200">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <Input
              label="Search Students"
              placeholder="Name or roll number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Select
              label="Filter by Status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              options={[
                { value: 'all', label: 'All Submissions' },
                { value: 'pending', label: 'Pending Only' },
                { value: 'graded', label: 'Graded Only' },
              ]}
              className="w-48"
            />
            <Button
              variant="secondary"
              onClick={handleBulkGrade}
              disabled={selectedStudents.length === 0}
            >
              Bulk Grade ({selectedStudents.length})
            </Button>
            <Button variant="ghost" onClick={handleExportResults}>
              Export Results
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card className="bg-white border-2 border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Student Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                  <th className="p-3 text-left">
                    <Checkbox
                      checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="p-3 text-left font-bold">Roll No.</th>
                  <th className="p-3 text-left font-bold">Student Name</th>
                  <th className="p-3 text-left font-bold">Email</th>
                  <th className="p-3 text-left font-bold">Submitted At</th>
                  <th className="p-3 text-left font-bold">Status</th>
                  <th className="p-3 text-left font-bold">Score</th>
                  <th className="p-3 text-left font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3">
                      <Checkbox
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => toggleStudentSelection(student.id)}
                      />
                    </td>
                    <td className="p-3 font-medium text-gray-900">{student.rollNumber}</td>
                    <td className="p-3 text-gray-900">{student.name}</td>
                    <td className="p-3 text-gray-700">{student.email}</td>
                    <td className="p-3 text-gray-700">{student.submittedAt}</td>
                    <td className="p-3">
                      <Badge
                        variant={
                          student.status === 'graded'
                            ? 'success'
                            : student.status === 'reviewing'
                            ? 'info'
                            : 'warning'
                        }
                      >
                        {student.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-gray-900 font-semibold">
                      {student.score !== undefined
                        ? `${student.score}/${student.totalMarks}`
                        : '-'}
                    </td>
                    <td className="p-3">
                      <Button
                        size="sm"
                        onClick={() => handleStartGrading(student.id)}
                        disabled={student.status === 'graded'}
                      >
                        {student.status === 'graded' ? 'View' : 'Grade'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredStudents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No submissions found matching your filters.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderGradingView = () => {
    if (!currentSubmission) return null;

    const totalAwarded = currentSubmission.questions.reduce((sum, q) => sum + (q.marksAwarded || 0), 0);
    const totalPossible = currentSubmission.questions.reduce((sum, q) => sum + q.marks, 0);

    return (
      <div className="space-y-6">
        {/* Student Header */}
        <Card className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{currentSubmission.student.name}</h2>
                <p className="opacity-90 mt-1">
                  Roll No: {currentSubmission.student.rollNumber} • Submitted: {currentSubmission.student.submittedAt}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">Current Score</p>
                <p className="text-4xl font-bold">
                  {totalAwarded}/{totalPossible}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Auto-graded Info */}
        <Alert variant="info" title="Auto-Grading Complete">
          <p className="text-gray-700">
            MCQ questions automatically graded: <strong>{currentSubmission.autoGradedScore} marks</strong>.
            Manual grading required for subjective answers: <strong>{currentSubmission.manualGradingRequired} marks</strong>.
          </p>
        </Alert>

        {/* Questions */}
        {currentSubmission.questions.map((question, index) => (
          <Card key={question.id} className="bg-white border-2 border-gray-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="info">Question {index + 1}</Badge>
                    <Badge variant="secondary">{question.type.toUpperCase()}</Badge>
                    <Badge>{question.marks} marks</Badge>
                    {question.marksAwarded !== undefined && (
                      <Badge variant="success">Awarded: {question.marksAwarded}</Badge>
                    )}
                  </div>
                  <p className="text-gray-900 font-medium">{question.questionText}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Student Answer */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-semibold text-gray-900 mb-2">Student's Answer:</p>
                <p className="text-gray-900 whitespace-pre-wrap">{question.studentAnswer}</p>
              </div>

              {/* Correct Answer (if applicable) */}
              {question.correctAnswer && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Correct Answer:</p>
                  <p className="text-gray-900">{question.correctAnswer}</p>
                </div>
              )}

              {/* Grading Controls */}
              {(question.type === 'short-answer' || question.type === 'long-answer') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <Input
                    label="Marks Awarded"
                    type="number"
                    min={0}
                    max={question.marks}
                    placeholder={`Out of ${question.marks}`}
                    value={question.marksAwarded?.toString() || ''}
                    onChange={(e) => handleMarksChange(question.id, parseFloat(e.target.value) || 0)}
                  />
                  <div className="md:col-span-2">
                    <Textarea
                      label="Feedback (Optional)"
                      placeholder="Provide feedback to the student..."
                      rows={3}
                      value={question.feedback || ''}
                      onChange={(e) => handleFeedbackChange(question.id, e.target.value)}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {/* Submit Actions */}
        <Card className="bg-white border-2 border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Total Score</h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {totalAwarded} / {totalPossible}
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setView('list');
                    setCurrentSubmission(null);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmitGrades}>
                  Submit Grades
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6 min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{mockAssessment.title}</h1>
          <p className="text-gray-700 mt-1">
            Grade student submissions • Total Marks: {mockAssessment.totalMarks}
          </p>
        </div>
        {view === 'grading' && (
          <Button
            variant="ghost"
            onClick={() => {
              setView('list');
              setCurrentSubmission(null);
            }}
          >
            ← Back to List
          </Button>
        )}
      </div>

      {/* Content */}
      {view === 'list' ? renderStudentList() : renderGradingView()}
    </div>
  );
}

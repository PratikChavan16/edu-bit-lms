// Admin API Types (simplified from OpenAPI spec)

export interface DashboardSummary {
  welcome: {
    operatorName: string;
    pendingTasks: number;
    message: string;
  };
  metrics: DashboardMetric[];
  activities: DashboardActivity[];
  provisioningQueue: {
    slaBreached?: number;
    items: ProvisioningTask[];
  };
}

export interface DashboardMetric {
  label: string;
  value: string;
  delta?: string;
}

export interface DashboardActivity {
  title: string;
  description: string;
  occurredAt: string;
  actor?: string;
}

export interface ProvisioningTask {
  id: string;
  summary: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  universityName?: string;
  slaDueAt: string;
}

export interface Alert {
  id: string;
  title: string;
  severity: 'info' | 'warning' | 'danger' | 'success';
  description: string;
  source?: string;
  detectedAt: string;
}

export interface UniversityListItem {
  id: string;
  name: string;
  domain: string;
  status: 'provisioning' | 'live' | 'suspended' | 'archived';
  collegesCount: number;
  storageUsedGb: number;
  lastBackupAt: string;
  subscriptionTier?: 'basic' | 'standard' | 'premium' | 'custom';
  featureFlagsEnabled?: number;
}

export interface FeatureToggle {
  code: string;
  name: string;
  description: string;
  category?: string;
  state: 'on' | 'off' | 'preview';
  defaultState: 'on' | 'off' | 'preview';
  scope: 'global' | 'university' | 'college';
  rolloutType?: 'gradual' | 'toggle' | 'beta';
  dependencies?: string[];
  locked: boolean;
  audit?: AuditLogEntry[];
}

export interface AuditLogEntry {
  id: string;
  actor: string;
  role: string;
  action: string;
  occurredAt: string;
  target: {
    type: string;
    id: string;
    label?: string;
  };
  details?: Record<string, unknown>;
}

// Learner API Types

export interface LearnerDashboard {
  date: string;
  greeting: string;
  stats: StatPill[];
  upcomingLectures: LectureSummary[];
  libraryQuickLinks: LibraryResource[];
  notices: Notice[];
  recentResults: Result[];
}

export interface StatPill {
  label: string;
  value: string;
  trend: string;
}

export interface LectureSummary {
  subject: string;
  faculty: string;
  venue: string;
  startAt: string;
  endAt: string;
}

export interface LibraryResource {
  id: string;
  title: string;
  type: 'note' | 'video' | 'assessment' | 'ebook';
  subject: string;
  tags?: string[];
  updatedAt: string;
  fileSizeBytes?: number;
  previewUrl?: string;
  bookmarked?: boolean;
}

export interface Notice {
  id: string;
  text: string;
  priority: 'high' | 'normal';
  category?: string;
  createdAt: string;
  expiresAt?: string;
}

export interface Result {
  id: string;
  assessmentTitle: string;
  assessmentType: 'mcq' | 'saq' | 'laq' | 'assignment';
  subject: string;
  score: string;
  status: 'pass' | 'fail' | 'pending' | 'in_review';
  publishedAt: string;
}

export interface LearnerTimetable {
  current_week: {
    [key: string]: TimetableBlock[];
  };
  total_classes: number;
}

export interface TimetableBlock {
  id: string;
  subject: string;
  faculty: string;
  start_time: string;
  end_time: string;
  room_number: string;
  type: 'lecture' | 'lab' | 'tutorial';
}

export interface Assessment {
  id: string;
  title: string;
  description?: string;
  type: 'mcq' | 'saq' | 'laq' | 'assignment' | 'quiz';
  subject: string;
  total_marks: number;
  passing_marks: number;
  duration_minutes?: number;
  starts_at: string;
  ends_at: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'missed';
  submission_status?: 'not_started' | 'in_progress' | 'submitted' | 'graded';
  score?: number;
  grade?: string;
}

export interface AssessmentDetail extends Assessment {
  instructions?: string;
  questions?: AssessmentQuestion[];
  attachments?: string[];
  attempt_limit?: number;
  attempts_made?: number;
  can_submit: boolean;
}

export interface AssessmentQuestion {
  id: string;
  question_text: string;
  question_type: 'mcq' | 'true_false' | 'short_answer' | 'long_answer' | 'file_upload';
  marks: number;
  options?: string[];
  correct_answer?: string;
  answer?: string;
}

export interface AssessmentSubmission {
  id: string;
  assessment_id: string;
  student_id: string;
  answers: Record<string, string>;
  uploaded_files?: string[];
  submitted_at: string;
  score?: number;
  feedback?: string;
  graded_at?: string;
  graded_by?: string;
}

// Library Types (Extended)
export interface LibraryResourceDetailed extends LibraryResource {
  description?: string;
  url: string;
  file_size?: number;
  author?: string;
  published_at?: string;
  downloads?: number;
}

// Document Types
export interface DocumentFolder {
  id: string;
  name: string;
  type: 'assignment' | 'notes' | 'projects' | 'other';
  parent_id?: string;
  documents_count: number;
  created_at: string;
}

export interface Document {
  id: string;
  name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  folder_id: string;
  uploaded_by?: string;
  uploaded_at: string;
  status?: 'pending' | 'approved' | 'rejected';
}

// Attendance Types
export interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  subject: string;
  faculty: string;
  remarks?: string;
}

export interface AttendanceSummary {
  total_classes: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  percentage: number;
  subject_wise?: {
    subject: string;
    total: number;
    present: number;
    percentage: number;
  }[];
}

// Fees Types
export interface FeeInvoice {
  id: string;
  invoice_number: string;
  academic_year: string;
  semester: string;
  amount: number;
  paid_amount: number;
  balance: number;
  due_date: string;
  status: 'pending' | 'partially_paid' | 'paid' | 'overdue';
  items: FeeItem[];
  payments?: FeePayment[];
  generated_at: string;
}

export interface FeeItem {
  id: string;
  description: string;
  amount: number;
  category: string;
}

export interface FeePayment {
  id: string;
  invoice_id: string;
  amount: number;
  payment_method: 'cash' | 'card' | 'upi' | 'bank_transfer' | 'cheque';
  transaction_id?: string;
  payment_date: string;
  receipt_url?: string;
}

export interface FeeSummary {
  total_fees: number;
  paid_fees: number;
  pending_fees: number;
  overdue_fees: number;
  invoices: FeeInvoice[];
}

// Profile Types
export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  roll_number: string;
  enrollment_number: string;
  department: string;
  course: string;
  semester: string;
  academic_year: string;
  profile_picture?: string;
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  date_of_birth?: string;
  blood_group?: string;
  emergency_contact?: {
    name: string;
    relation: string;
    phone: string;
  };
}

// Faculty Types
export interface FacultyProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  employee_code: string;
  department: string;
  designation: string;
  experience_years: number;
  subjects: string[];
  office_location?: string;
  profile_picture?: string;
  office_hours?: {
    day: string;
    start_time: string;
    end_time: string;
  }[];
}

export interface FacultyScheduleBlock {
  id: string;
  subject: string;
  course: string;
  year: number;
  section?: string | null;
  faculty_id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  location?: string | null;
  type: 'lecture' | 'lab' | 'tutorial' | 'seminar' | 'workshop';
  effective_from: string;
  effective_to?: string | null;
  college_id: string;
  faculty?: {
    id: string;
    user?: {
      id: string;
      name: string;
      email: string;
    };
  };
  exceptions?: FacultyScheduleException[];
}

export interface FacultyScheduleException {
  id: string;
  date: string;
  action: string;
  reason?: string | null;
  alternate_faculty_id?: string | null;
  alternate_location?: string | null;
  start_time?: string | null;
  end_time?: string | null;
}

export interface FacultyAttendanceEntry {
  id: string;
  student_id: string;
  timetable_block_id: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  marked_by: string;
  notes?: string | null;
  student?: {
    id: string;
    roll_number?: string | null;
    enrollment_number?: string | null;
    user?: {
      id: string;
      name: string;
      email: string;
      avatar_url?: string | null;
    };
  };
}

export interface FacultyAttendanceCorrection {
  id: string;
  attendance_id: string;
  original_status: 'present' | 'absent' | 'late' | 'excused';
  requested_status: 'present' | 'absent' | 'late' | 'excused';
  reason?: string | null;
  requested_by: string;
  status: 'pending' | 'approved' | 'rejected';
  review_notes?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
}

export interface FacultyAssessmentSummary {
  id: string;
  title: string;
  description?: string | null;
  type: 'mcq' | 'saq' | 'laq' | 'practical' | 'project';
  subject: string;
  course: string;
  year: number;
  total_marks: number;
  passing_marks: number;
  duration_minutes?: number | null;
  starts_at?: string | null;
  ends_at?: string | null;
  submission_type: 'typed' | 'upload' | 'both';
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'archived';
}

export interface FacultyAssessmentDetail extends FacultyAssessmentSummary {
  questions?: AssessmentQuestion[];
  faculty_id: string;
  college_id: string;
}

export interface FacultySubmissionSummary {
  id: string;
  assessment_id: string;
  student_id: string;
  status: 'pending' | 'submitted' | 'graded' | 'in_review';
  submitted_at?: string | null;
  graded_at?: string | null;
  marks_obtained?: number | null;
  feedback?: string | null;
  student?: {
    id: string;
    roll_number?: string | null;
    user?: {
      id: string;
      name: string;
      email: string;
    };
  };
}

export interface FacultyNotification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  type: 'system' | 'assessment' | 'attendance' | 'general';
  read: boolean;
}

export interface FacultyReportDefinition {
  code: string;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'on_demand';
  export_formats: ('pdf' | 'csv' | 'xlsx')[];
}

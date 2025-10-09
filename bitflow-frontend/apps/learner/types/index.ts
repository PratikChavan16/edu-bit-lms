export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student' | 'faculty';
  profile_picture?: string;
}

export interface Profile {
  id: string;
  user: {
    name: string;
    email: string;
    profile_picture: string | null;
  };
  roll_number: string;
  admission_number: string;
  course: {
    id: string;
    name: string;
  };
  year: number;
  semester: number;
  batch: string;
  status: string;
  phone: string;
  emergency_contact: string;
  address: string;
  bio: string;
  quick_stats: {
    attendance_percentage: number;
    pending_fees: number;
    average_performance: number;
    total_assessments: number;
  };
}

export interface AttendanceData {
  summary: {
    total_days: number;
    present_days: number;
    absent_days: number;
    excused_days: number;
    attendance_percentage: number;
    status: 'good' | 'average' | 'low';
  };
  graph_data: {
    daily: Array<{
      date: string;
      total: number;
      present: number;
      absent: number;
      percentage: number;
    }>;
    colors: {
      present: string;
      absent: string;
      late: string;
      excused: string;
    };
  };
  subject_wise: Array<{
    subject_id: string;
    subject_name: string;
    total: number;
    present: number;
    absent: number;
    percentage: number;
  }>;
}

export interface FeeStatus {
  summary: {
    total_amount: number;
    paid_amount: number;
    pending_amount: number;
    discount_amount: number;
    late_fee_amount: number;
    payment_progress: number;
    status: 'paid' | 'partial' | 'pending' | 'unpaid';
  };
  widget_data: {
    progress_percentage: number;
    amount_paid: number;
    amount_pending: number;
    next_due_date: string | null;
  };
  invoices: Array<{
    id: string;
    invoice_number: string;
    fee_structure: string;
    academic_year: string;
    total_amount: number;
    paid_amount: number;
    pending_amount: number;
    due_date: string;
    status: string;
    is_overdue: boolean;
  }>;
  upcoming_payments: Array<{
    invoice_number: string;
    amount_due: number;
    due_date: string;
    days_remaining: number;
  }>;
  overdue_invoices: Array<{
    invoice_number: string;
    amount_due: number;
    due_date: string;
    days_overdue: number;
    late_fee: number;
  }>;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'academic' | 'event' | 'holiday' | 'emergency';
  priority: 'low' | 'medium' | 'high';
  published_at: string;
  expires_at: string | null;
  is_read: boolean;
}

export interface LibraryResource {
  id: string;
  title: string;
  author: string;
  type: 'book' | 'journal' | 'magazine' | 'ebook' | 'reference';
  isbn: string;
  status: 'available' | 'issued' | 'reserved';
  category: {
    id: string;
    name: string;
  };
  is_bookmarked: boolean;
  description?: string;
  publisher?: string;
  published_year?: number;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  subject: {
    id: string;
    name: string;
  };
  type: 'quiz' | 'assignment' | 'exam' | 'project';
  total_marks: number;
  due_date: string;
  status: 'pending' | 'submitted' | 'graded';
  submission?: {
    id: string;
    marks_obtained: number;
    submitted_at: string;
    graded_at: string | null;
  };
}

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

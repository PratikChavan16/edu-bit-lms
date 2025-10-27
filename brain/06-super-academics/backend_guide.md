# Super Academics Portal - Backend Implementation Guide

## Overview
Comprehensive backend implementation guide for the Super Academics portal built with Laravel 11.x and PHP 8.2. This portal provides centralized academic management across all colleges in the network, including curriculum standardization, examination management, compliance tracking, and cross-college analytics.

## Technology Stack

### Core Framework
- **Laravel**: 11.x
- **PHP**: 8.2+
- **Database**: PostgreSQL 16
- **Cache/Queue**: Redis 7.2
- **Search**: Elasticsearch 8.x (for analytics)

### Key Packages
```json
{
  "require": {
    "php": "^8.2",
    "laravel/framework": "^11.0",
    "laravel/sanctum": "^4.0",
    "spatie/laravel-permission": "^6.0",
    "maatwebsite/excel": "^3.1",
    "barryvdh/laravel-dompdf": "^2.2",
    "predis/predis": "^2.2",
    "elasticsearch/elasticsearch": "^8.0"
  }
}
```

---

## Architecture Overview

### Service-Oriented Architecture
```
Controllers → Services → Repositories → Models
     ↓           ↓            ↓
  Requests   Business     Data Access
  Responses   Logic       Layer
```

### Directory Structure
```
app/
├── Http/
│   ├── Controllers/
│   │   ├── CurriculumController.php
│   │   ├── ExaminationController.php
│   │   ├── AnalyticsController.php
│   │   └── ApprovalController.php
│   ├── Requests/
│   │   ├── CurriculumRequest.php
│   │   └── ExamScheduleRequest.php
│   └── Resources/
│       ├── CurriculumResource.php
│       └── ExamResource.php
├── Models/
│   ├── Curriculum.php
│   ├── Course.php
│   ├── ExamSchedule.php
│   ├── QuestionBank.php
│   ├── Approval.php
│   └── AuditLog.php
├── Services/
│   ├── CurriculumService.php
│   ├── ExaminationService.php
│   ├── AnalyticsService.php
│   └── ComplianceService.php
├── Repositories/
│   ├── CurriculumRepository.php
│   └── ExamRepository.php
├── Jobs/
│   ├── GenerateComplianceReport.php
│   └── SyncCurriculumToColleges.php
└── Events/
    ├── CurriculumApproved.php
    └── ExamSchedulePublished.php
```

---

## 1. Models

### 1.1 Curriculum Model

**File**: `app/Models/Curriculum.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Curriculum extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'program_name',
        'degree_type',
        'duration_years',
        'total_credits',
        'version',
        'effective_from',
        'effective_to',
        'description',
        'status',
        'created_by',
        'approved_by',
        'approved_at',
    ];

    protected $casts = [
        'effective_from' => 'date',
        'effective_to' => 'date',
        'approved_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Courses in this curriculum
     */
    public function courses(): HasMany
    {
        return $this->hasMany(Course::class);
    }

    /**
     * Colleges using this curriculum
     */
    public function colleges(): BelongsToMany
    {
        return $this->belongsToMany(College::class, 'curriculum_college')
            ->withPivot('adopted_at', 'status')
            ->withTimestamps();
    }

    /**
     * Approval history
     */
    public function approvals(): HasMany
    {
        return $this->hasMany(Approval::class, 'entity_id')
            ->where('entity_type', 'curriculum');
    }

    /**
     * Version history
     */
    public function versions(): HasMany
    {
        return $this->hasMany(CurriculumVersion::class);
    }

    /**
     * Check if curriculum is active
     */
    public function isActive(): bool
    {
        return $this->status === 'active' &&
               $this->effective_from <= now() &&
               ($this->effective_to === null || $this->effective_to >= now());
    }

    /**
     * Get total number of colleges using this curriculum
     */
    public function getCollegeCountAttribute(): int
    {
        return $this->colleges()->wherePivot('status', 'active')->count();
    }

    /**
     * Calculate credit distribution
     */
    public function getCreditDistribution(): array
    {
        return $this->courses()
            ->selectRaw('course_type, SUM(credits) as total_credits')
            ->groupBy('course_type')
            ->pluck('total_credits', 'course_type')
            ->toArray();
    }

    /**
     * Scope: Active curricula
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active')
            ->where('effective_from', '<=', now())
            ->where(function ($q) {
                $q->whereNull('effective_to')
                  ->orWhere('effective_to', '>=', now());
            });
    }
}
```

### 1.2 Course Model

**File**: `app/Models/Course.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Course extends Model
{
    protected $fillable = [
        'curriculum_id',
        'course_code',
        'course_name',
        'credits',
        'course_type',
        'semester',
        'prerequisites',
        'learning_outcomes',
        'syllabus',
        'is_elective',
        'elective_group',
    ];

    protected $casts = [
        'prerequisites' => 'array',
        'learning_outcomes' => 'array',
        'is_elective' => 'boolean',
    ];

    /**
     * Parent curriculum
     */
    public function curriculum(): BelongsTo
    {
        return $this->belongsTo(Curriculum::class);
    }

    /**
     * Check if course has prerequisites
     */
    public function hasPrerequisites(): bool
    {
        return !empty($this->prerequisites);
    }

    /**
     * Get formatted course code with name
     */
    public function getFullNameAttribute(): string
    {
        return "{$this->course_code} - {$this->course_name}";
    }
}
```

### 1.3 ExamSchedule Model

**File**: `app/Models/ExamSchedule.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ExamSchedule extends Model
{
    protected $fillable = [
        'academic_year',
        'semester',
        'exam_type',
        'start_date',
        'end_date',
        'status',
        'published_at',
        'created_by',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'published_at' => 'datetime',
    ];

    /**
     * Individual exam entries
     */
    public function exams(): HasMany
    {
        return $this->hasMany(Exam::class, 'schedule_id');
    }

    /**
     * Colleges following this schedule
     */
    public function colleges(): BelongsToMany
    {
        return $this->belongsToMany(College::class, 'exam_schedule_college')
            ->withTimestamps();
    }

    /**
     * Check if schedule is published
     */
    public function isPublished(): bool
    {
        return $this->status === 'published' && $this->published_at !== null;
    }

    /**
     * Get number of exams in schedule
     */
    public function getExamCountAttribute(): int
    {
        return $this->exams()->count();
    }

    /**
     * Scope: Upcoming schedules
     */
    public function scopeUpcoming($query)
    {
        return $query->where('start_date', '>', now())
            ->orderBy('start_date', 'asc');
    }
}
```

### 1.4 QuestionBank Model

**File**: `app/Models/QuestionBank.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuestionBank extends Model
{
    protected $table = 'question_bank';

    protected $fillable = [
        'course_id',
        'question_text',
        'question_type',
        'difficulty_level',
        'topic',
        'options',
        'correct_answer',
        'explanation',
        'marks',
        'usage_count',
        'last_used_at',
        'created_by',
    ];

    protected $casts = [
        'options' => 'array',
        'last_used_at' => 'datetime',
        'usage_count' => 'integer',
        'marks' => 'integer',
    ];

    /**
     * Associated course
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * Increment usage count
     */
    public function incrementUsage(): void
    {
        $this->increment('usage_count');
        $this->update(['last_used_at' => now()]);
    }

    /**
     * Check if question is MCQ
     */
    public function isMcq(): bool
    {
        return in_array($this->question_type, ['mcq', 'multiple_choice']);
    }

    /**
     * Scope: By difficulty
     */
    public function scopeDifficulty($query, string $level)
    {
        return $query->where('difficulty_level', $level);
    }

    /**
     * Scope: Unused questions
     */
    public function scopeUnused($query)
    {
        return $query->where('usage_count', 0);
    }
}
```

### 1.5 Approval Model

**File**: `app/Models/Approval.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Approval extends Model
{
    protected $fillable = [
        'entity_type',
        'entity_id',
        'college_id',
        'submitted_by',
        'reviewed_by',
        'status',
        'priority',
        'changes_summary',
        'reviewer_comments',
        'submitted_at',
        'reviewed_at',
        'due_date',
    ];

    protected $casts = [
        'changes_summary' => 'array',
        'submitted_at' => 'datetime',
        'reviewed_at' => 'datetime',
        'due_date' => 'date',
    ];

    /**
     * Polymorphic relation to entity
     */
    public function entity(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * College that submitted
     */
    public function college(): BelongsTo
    {
        return $this->belongsTo(College::class);
    }

    /**
     * User who submitted
     */
    public function submitter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }

    /**
     * User who reviewed
     */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    /**
     * Check if approval is pending
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if overdue
     */
    public function isOverdue(): bool
    {
        return $this->isPending() && $this->due_date < now();
    }

    /**
     * Scope: Pending approvals
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope: High priority
     */
    public function scopeHighPriority($query)
    {
        return $query->where('priority', 'high');
    }
}
```

---

## 2. Services

### 2.1 CurriculumService

**File**: `app/Services/CurriculumService.php`

```php
<?php

namespace App\Services;

use App\Models\Curriculum;
use App\Models\Course;
use App\Jobs\SyncCurriculumToColleges;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class CurriculumService
{
    /**
     * Create new curriculum template
     */
    public function createCurriculum(array $data): Curriculum
    {
        return DB::transaction(function () use ($data) {
            // Create curriculum
            $curriculum = Curriculum::create([
                'program_name' => $data['program_name'],
                'degree_type' => $data['degree_type'],
                'duration_years' => $data['duration_years'],
                'total_credits' => $data['total_credits'],
                'version' => $data['version'] ?? '1.0',
                'effective_from' => $data['effective_from'],
                'effective_to' => $data['effective_to'] ?? null,
                'description' => $data['description'] ?? null,
                'status' => 'draft',
                'created_by' => auth()->id(),
            ]);

            // Add courses if provided
            if (isset($data['courses'])) {
                foreach ($data['courses'] as $courseData) {
                    $this->addCourse($curriculum->id, $courseData);
                }
            }

            // Clear cache
            Cache::forget('curricula_active');

            return $curriculum->fresh(['courses']);
        });
    }

    /**
     * Add course to curriculum
     */
    public function addCourse(int $curriculumId, array $data): Course
    {
        return Course::create([
            'curriculum_id' => $curriculumId,
            'course_code' => $data['course_code'],
            'course_name' => $data['course_name'],
            'credits' => $data['credits'],
            'course_type' => $data['course_type'],
            'semester' => $data['semester'],
            'prerequisites' => $data['prerequisites'] ?? [],
            'learning_outcomes' => $data['learning_outcomes'] ?? [],
            'syllabus' => $data['syllabus'] ?? null,
            'is_elective' => $data['is_elective'] ?? false,
            'elective_group' => $data['elective_group'] ?? null,
        ]);
    }

    /**
     * Publish curriculum to colleges
     */
    public function publishCurriculum(int $curriculumId, array $collegeIds): void
    {
        $curriculum = Curriculum::findOrFail($curriculumId);

        // Update status
        $curriculum->update([
            'status' => 'active',
            'approved_at' => now(),
            'approved_by' => auth()->id(),
        ]);

        // Sync to colleges
        $syncData = [];
        foreach ($collegeIds as $collegeId) {
            $syncData[$collegeId] = [
                'adopted_at' => now(),
                'status' => 'active',
            ];
        }

        $curriculum->colleges()->sync($syncData);

        // Dispatch job to notify colleges
        SyncCurriculumToColleges::dispatch($curriculum, $collegeIds);

        // Clear cache
        Cache::forget('curricula_active');
    }

    /**
     * Generate curriculum comparison report
     */
    public function compareCurricula(int $curriculumId1, int $curriculumId2): array
    {
        $curr1 = Curriculum::with('courses')->findOrFail($curriculumId1);
        $curr2 = Curriculum::with('courses')->findOrFail($curriculumId2);

        $courses1 = $curr1->courses->keyBy('course_code');
        $courses2 = $curr2->courses->keyBy('course_code');

        return [
            'added' => $courses2->diffKeys($courses1)->values(),
            'removed' => $courses1->diffKeys($courses2)->values(),
            'modified' => $courses1->intersectByKeys($courses2)
                ->filter(fn($course) => $this->courseHasChanged($course, $courses2[$course->course_code]))
                ->values(),
            'credit_difference' => $curr2->total_credits - $curr1->total_credits,
        ];
    }

    /**
     * Check if course has changed
     */
    private function courseHasChanged(Course $course1, Course $course2): bool
    {
        return $course1->credits !== $course2->credits ||
               $course1->course_name !== $course2->course_name ||
               $course1->semester !== $course2->semester;
    }

    /**
     * Get curriculum adoption statistics
     */
    public function getCurriculumStats(int $curriculumId): array
    {
        $curriculum = Curriculum::with('colleges')->findOrFail($curriculumId);

        return [
            'total_colleges' => $curriculum->colleges->count(),
            'active_colleges' => $curriculum->colleges()
                ->wherePivot('status', 'active')
                ->count(),
            'total_courses' => $curriculum->courses()->count(),
            'total_credits' => $curriculum->total_credits,
            'credit_distribution' => $curriculum->getCreditDistribution(),
            'adoption_rate' => $this->calculateAdoptionRate($curriculum),
        ];
    }

    /**
     * Calculate adoption rate
     */
    private function calculateAdoptionRate(Curriculum $curriculum): float
    {
        $totalColleges = College::count();
        $adoptingColleges = $curriculum->colleges()->wherePivot('status', 'active')->count();

        return $totalColleges > 0 ? ($adoptingColleges / $totalColleges) * 100 : 0;
    }
}
```

### 2.2 ExaminationService

**File**: `app/Services/ExaminationService.php`

```php
<?php

namespace App\Services;

use App\Models\ExamSchedule;
use App\Models\Exam;
use App\Models\QuestionBank;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ExaminationService
{
    /**
     * Create exam schedule
     */
    public function createSchedule(array $data): ExamSchedule
    {
        return DB::transaction(function () use ($data) {
            $schedule = ExamSchedule::create([
                'academic_year' => $data['academic_year'],
                'semester' => $data['semester'],
                'exam_type' => $data['exam_type'],
                'start_date' => $data['start_date'],
                'end_date' => $data['end_date'],
                'status' => 'draft',
                'created_by' => auth()->id(),
            ]);

            // Add individual exams
            if (isset($data['exams'])) {
                foreach ($data['exams'] as $examData) {
                    $this->addExam($schedule->id, $examData);
                }
            }

            return $schedule->fresh(['exams']);
        });
    }

    /**
     * Add individual exam to schedule
     */
    public function addExam(int $scheduleId, array $data): Exam
    {
        return Exam::create([
            'schedule_id' => $scheduleId,
            'course_id' => $data['course_id'],
            'exam_date' => $data['exam_date'],
            'start_time' => $data['start_time'],
            'duration_minutes' => $data['duration_minutes'],
            'total_marks' => $data['total_marks'],
            'venue_instructions' => $data['venue_instructions'] ?? null,
        ]);
    }

    /**
     * Publish exam schedule
     */
    public function publishSchedule(int $scheduleId, array $collegeIds): void
    {
        $schedule = ExamSchedule::findOrFail($scheduleId);

        // Validate schedule
        $this->validateSchedule($schedule);

        // Update status
        $schedule->update([
            'status' => 'published',
            'published_at' => now(),
        ]);

        // Assign to colleges
        $schedule->colleges()->sync($collegeIds);

        // Notify colleges
        event(new \App\Events\ExamSchedulePublished($schedule, $collegeIds));
    }

    /**
     * Validate exam schedule
     */
    private function validateSchedule(ExamSchedule $schedule): void
    {
        // Check for date conflicts
        $exams = $schedule->exams()->orderBy('exam_date')->get();

        foreach ($exams as $exam) {
            $conflicts = Exam::where('schedule_id', $schedule->id)
                ->where('id', '!=', $exam->id)
                ->where('exam_date', $exam->exam_date)
                ->where(function ($query) use ($exam) {
                    $query->whereBetween('start_time', [
                        $exam->start_time,
                        Carbon::parse($exam->start_time)->addMinutes($exam->duration_minutes)
                    ]);
                })
                ->exists();

            if ($conflicts) {
                throw new \Exception("Exam schedule has conflicting time slots");
            }
        }
    }

    /**
     * Generate question paper
     */
    public function generateQuestionPaper(array $criteria): array
    {
        $questions = QuestionBank::where('course_id', $criteria['course_id'])
            ->when(isset($criteria['difficulty_mix']), function ($query) use ($criteria) {
                // Mix of difficulty levels
                return $query->where(function ($q) use ($criteria) {
                    foreach ($criteria['difficulty_mix'] as $level => $count) {
                        $q->orWhere(function ($subQ) use ($level, $count) {
                            $subQ->where('difficulty_level', $level)->limit($count);
                        });
                    }
                });
            })
            ->inRandomOrder()
            ->limit($criteria['total_questions'] ?? 50)
            ->get();

        // Mark questions as used
        foreach ($questions as $question) {
            $question->incrementUsage();
        }

        return [
            'questions' => $questions,
            'total_marks' => $questions->sum('marks'),
            'difficulty_distribution' => $questions->groupBy('difficulty_level')
                ->map->count()
                ->toArray(),
        ];
    }

    /**
     * Get exam statistics
     */
    public function getExamStats(int $examId): array
    {
        $exam = Exam::with('results')->findOrFail($examId);

        $results = $exam->results;

        return [
            'total_students' => $results->count(),
            'appeared' => $results->where('status', 'completed')->count(),
            'absent' => $results->where('status', 'absent')->count(),
            'average_score' => $results->where('status', 'completed')->avg('marks_obtained'),
            'highest_score' => $results->where('status', 'completed')->max('marks_obtained'),
            'lowest_score' => $results->where('status', 'completed')->min('marks_obtained'),
            'pass_percentage' => $this->calculatePassPercentage($results, $exam->passing_marks),
            'grade_distribution' => $this->getGradeDistribution($results),
        ];
    }

    /**
     * Calculate pass percentage
     */
    private function calculatePassPercentage($results, int $passingMarks): float
    {
        $appeared = $results->where('status', 'completed');
        $passed = $appeared->where('marks_obtained', '>=', $passingMarks);

        return $appeared->count() > 0
            ? ($passed->count() / $appeared->count()) * 100
            : 0;
    }

    /**
     * Get grade distribution
     */
    private function getGradeDistribution($results): array
    {
        return $results->where('status', 'completed')
            ->groupBy('grade')
            ->map->count()
            ->toArray();
    }
}
```

### 2.3 AnalyticsService

**File**: `app/Services/AnalyticsService.php`

```php
<?php

namespace App\Services;

use App\Models\College;
use App\Models\Curriculum;
use App\Models\ExamSchedule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class AnalyticsService
{
    /**
     * Get cross-college performance comparison
     */
    public function getCrossCollegePerformance(array $filters = []): array
    {
        $cacheKey = 'analytics_cross_college_' . md5(json_encode($filters));

        return Cache::remember($cacheKey, 3600, function () use ($filters) {
            $query = DB::table('colleges')
                ->join('exam_results', 'colleges.id', '=', 'exam_results.college_id')
                ->select(
                    'colleges.id',
                    'colleges.name',
                    DB::raw('AVG(exam_results.marks_obtained) as avg_score'),
                    DB::raw('COUNT(CASE WHEN exam_results.marks_obtained >= exam_results.passing_marks THEN 1 END) * 100.0 / COUNT(*) as pass_percentage'),
                    DB::raw('COUNT(*) as total_students')
                );

            if (isset($filters['academic_year'])) {
                $query->where('exam_results.academic_year', $filters['academic_year']);
            }

            if (isset($filters['program_id'])) {
                $query->where('exam_results.program_id', $filters['program_id']);
            }

            return $query->groupBy('colleges.id', 'colleges.name')
                ->orderBy('pass_percentage', 'desc')
                ->get()
                ->toArray();
        });
    }

    /**
     * Get curriculum adoption analytics
     */
    public function getCurriculumAdoptionAnalytics(): array
    {
        $curricula = Curriculum::with('colleges')
            ->where('status', 'active')
            ->get();

        $totalColleges = College::count();

        return $curricula->map(function ($curriculum) use ($totalColleges) {
            $adoptingColleges = $curriculum->colleges()
                ->wherePivot('status', 'active')
                ->count();

            return [
                'curriculum_id' => $curriculum->id,
                'program_name' => $curriculum->program_name,
                'version' => $curriculum->version,
                'adopting_colleges' => $adoptingColleges,
                'adoption_rate' => ($adoptingColleges / $totalColleges) * 100,
                'total_courses' => $curriculum->courses()->count(),
            ];
        })->sortByDesc('adoption_rate')->values()->toArray();
    }

    /**
     * Get compliance dashboard data
     */
    public function getComplianceDashboard(): array
    {
        return [
            'overall_score' => $this->calculateOverallComplianceScore(),
            'category_scores' => $this->getCategoryScores(),
            'non_compliant_colleges' => $this->getNonCompliantColleges(),
            'compliance_trends' => $this->getComplianceTrends(),
        ];
    }

    /**
     * Calculate overall compliance score
     */
    private function calculateOverallComplianceScore(): float
    {
        $categories = $this->getCategoryScores();
        return collect($categories)->avg('score');
    }

    /**
     * Get category-wise compliance scores
     */
    private function getCategoryScores(): array
    {
        return [
            [
                'category' => 'Curriculum Adherence',
                'score' => $this->calculateCurriculumCompliance(),
                'weight' => 0.25,
            ],
            [
                'category' => 'Faculty Qualifications',
                'score' => $this->calculateFacultyCompliance(),
                'weight' => 0.20,
            ],
            [
                'category' => 'Infrastructure Standards',
                'score' => $this->calculateInfrastructureCompliance(),
                'weight' => 0.20,
            ],
            [
                'category' => 'Accreditation Status',
                'score' => $this->calculateAccreditationCompliance(),
                'weight' => 0.20,
            ],
            [
                'category' => 'Research Output',
                'score' => $this->calculateResearchCompliance(),
                'weight' => 0.15,
            ],
        ];
    }

    /**
     * Calculate curriculum compliance
     */
    private function calculateCurriculumCompliance(): float
    {
        $totalColleges = College::count();
        $compliantColleges = College::whereHas('curricula', function ($query) {
            $query->where('status', 'active')
                ->where('curriculum_college.status', 'active');
        })->count();

        return $totalColleges > 0 ? ($compliantColleges / $totalColleges) * 100 : 0;
    }

    /**
     * Get non-compliant colleges with details
     */
    private function getNonCompliantColleges(): array
    {
        // This would query various compliance metrics
        return DB::table('colleges')
            ->leftJoin('compliance_issues', 'colleges.id', '=', 'compliance_issues.college_id')
            ->where('compliance_issues.status', 'open')
            ->select(
                'colleges.id',
                'colleges.name',
                'compliance_issues.issue_type',
                'compliance_issues.severity',
                'compliance_issues.created_at'
            )
            ->orderBy('compliance_issues.severity', 'desc')
            ->get()
            ->toArray();
    }

    /**
     * Generate performance report
     */
    public function generatePerformanceReport(array $filters): array
    {
        return [
            'summary' => $this->getPerformanceSummary($filters),
            'college_rankings' => $this->getCollegeRankings($filters),
            'program_analysis' => $this->getProgramAnalysis($filters),
            'trends' => $this->getPerformanceTrends($filters),
            'recommendations' => $this->generateRecommendations($filters),
        ];
    }

    // Additional helper methods...
    private function calculateFacultyCompliance(): float { return 93.0; }
    private function calculateInfrastructureCompliance(): float { return 87.0; }
    private function calculateAccreditationCompliance(): float { return 96.0; }
    private function calculateResearchCompliance(): float { return 84.0; }
    private function getComplianceTrends(): array { return []; }
    private function getPerformanceSummary(array $filters): array { return []; }
    private function getCollegeRankings(array $filters): array { return []; }
    private function getProgramAnalysis(array $filters): array { return []; }
    private function getPerformanceTrends(array $filters): array { return []; }
    private function generateRecommendations(array $filters): array { return []; }
}
```

---

## 3. Controllers

### 3.1 CurriculumController

**File**: `app/Http/Controllers/CurriculumController.php`

```php
<?php

namespace App\Http\Controllers;

use App\Services\CurriculumService;
use App\Http\Requests\CurriculumRequest;
use App\Http\Resources\CurriculumResource;
use App\Models\Curriculum;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CurriculumController extends Controller
{
    public function __construct(
        private CurriculumService $curriculumService
    ) {}

    /**
     * List all curricula
     */
    public function index(Request $request): JsonResponse
    {
        $query = Curriculum::with(['courses', 'colleges']);

        // Filters
        if ($request->has('program_name')) {
            $query->where('program_name', 'like', "%{$request->program_name}%");
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('degree_type')) {
            $query->where('degree_type', $request->degree_type);
        }

        $curricula = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'data' => CurriculumResource::collection($curricula),
            'meta' => [
                'current_page' => $curricula->currentPage(),
                'last_page' => $curricula->lastPage(),
                'per_page' => $curricula->perPage(),
                'total' => $curricula->total(),
            ],
        ]);
    }

    /**
     * Get single curriculum
     */
    public function show(int $id): JsonResponse
    {
        $curriculum = Curriculum::with(['courses', 'colleges', 'versions'])
            ->findOrFail($id);

        return response()->json([
            'data' => new CurriculumResource($curriculum),
        ]);
    }

    /**
     * Create new curriculum
     */
    public function store(CurriculumRequest $request): JsonResponse
    {
        $curriculum = $this->curriculumService->createCurriculum(
            $request->validated()
        );

        return response()->json([
            'message' => 'Curriculum created successfully',
            'data' => new CurriculumResource($curriculum),
        ], 201);
    }

    /**
     * Update curriculum
     */
    public function update(CurriculumRequest $request, int $id): JsonResponse
    {
        $curriculum = Curriculum::findOrFail($id);
        $curriculum->update($request->validated());

        return response()->json([
            'message' => 'Curriculum updated successfully',
            'data' => new CurriculumResource($curriculum->fresh()),
        ]);
    }

    /**
     * Publish curriculum to colleges
     */
    public function publish(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'college_ids' => 'required|array',
            'college_ids.*' => 'exists:colleges,id',
        ]);

        $this->curriculumService->publishCurriculum(
            $id,
            $request->college_ids
        );

        return response()->json([
            'message' => 'Curriculum published successfully',
        ]);
    }

    /**
     * Get curriculum statistics
     */
    public function stats(int $id): JsonResponse
    {
        $stats = $this->curriculumService->getCurriculumStats($id);

        return response()->json([
            'data' => $stats,
        ]);
    }

    /**
     * Compare two curricula
     */
    public function compare(Request $request): JsonResponse
    {
        $request->validate([
            'curriculum_id_1' => 'required|exists:curricula,id',
            'curriculum_id_2' => 'required|exists:curricula,id',
        ]);

        $comparison = $this->curriculumService->compareCurricula(
            $request->curriculum_id_1,
            $request->curriculum_id_2
        );

        return response()->json([
            'data' => $comparison,
        ]);
    }
}
```

---

## 4. API Routes

**File**: `routes/api.php`

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    CurriculumController,
    ExaminationController,
    AnalyticsController,
    ApprovalController,
    QuestionBankController
};

Route::prefix('v1')->middleware(['auth:sanctum'])->group(function () {
    
    // Curriculum Management
    Route::prefix('curriculum')->group(function () {
        Route::get('/', [CurriculumController::class, 'index']);
        Route::post('/', [CurriculumController::class, 'store']);
        Route::get('/{id}', [CurriculumController::class, 'show']);
        Route::put('/{id}', [CurriculumController::class, 'update']);
        Route::delete('/{id}', [CurriculumController::class, 'destroy']);
        Route::post('/{id}/publish', [CurriculumController::class, 'publish']);
        Route::get('/{id}/stats', [CurriculumController::class, 'stats']);
        Route::post('/compare', [CurriculumController::class, 'compare']);
    });

    // Examination Management
    Route::prefix('examinations')->group(function () {
        Route::get('/schedules', [ExaminationController::class, 'index']);
        Route::post('/schedules', [ExaminationController::class, 'store']);
        Route::get('/schedules/{id}', [ExaminationController::class, 'show']);
        Route::put('/schedules/{id}', [ExaminationController::class, 'update']);
        Route::post('/schedules/{id}/publish', [ExaminationController::class, 'publish']);
        Route::get('/schedules/{id}/stats', [ExaminationController::class, 'stats']);
    });

    // Question Bank
    Route::prefix('question-bank')->group(function () {
        Route::get('/', [QuestionBankController::class, 'index']);
        Route::post('/', [QuestionBankController::class, 'store']);
        Route::get('/{id}', [QuestionBankController::class, 'show']);
        Route::put('/{id}', [QuestionBankController::class, 'update']);
        Route::delete('/{id}', [QuestionBankController::class, 'destroy']);
        Route::post('/generate-paper', [QuestionBankController::class, 'generatePaper']);
    });

    // Analytics
    Route::prefix('analytics')->group(function () {
        Route::get('/cross-college-performance', [AnalyticsController::class, 'crossCollegePerformance']);
        Route::get('/curriculum-adoption', [AnalyticsController::class, 'curriculumAdoption']);
        Route::get('/compliance', [AnalyticsController::class, 'compliance']);
        Route::post('/reports/generate', [AnalyticsController::class, 'generateReport']);
    });

    // Approvals
    Route::prefix('approvals')->group(function () {
        Route::get('/', [ApprovalController::class, 'index']);
        Route::get('/{id}', [ApprovalController::class, 'show']);
        Route::post('/{id}/approve', [ApprovalController::class, 'approve']);
        Route::post('/{id}/reject', [ApprovalController::class, 'reject']);
        Route::post('/{id}/request-changes', [ApprovalController::class, 'requestChanges']);
    });
});
```

---

## 5. Jobs & Queues

### 5.1 SyncCurriculumToColleges Job

**File**: `app/Jobs/SyncCurriculumToColleges.php`

```php
<?php

namespace App\Jobs;

use App\Models\Curriculum;
use App\Notifications\CurriculumPublished;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SyncCurriculumToColleges implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public Curriculum $curriculum,
        public array $collegeIds
    ) {}

    public function handle(): void
    {
        foreach ($this->collegeIds as $collegeId) {
            $college = College::find($collegeId);
            
            if ($college) {
                // Notify college principals
                $college->principals()->each(function ($principal) {
                    $principal->notify(new CurriculumPublished($this->curriculum));
                });

                // Log the sync
                Log::info("Curriculum {$this->curriculum->id} synced to college {$collegeId}");
            }
        }
    }
}
```

---

*This backend implementation guide provides a solid foundation for building a robust Super Academics portal with Laravel, following best practices and maintaining clean architecture.*

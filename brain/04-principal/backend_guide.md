# Principal Portal - Backend Guide (Laravel 11)

Version: 2.0
Last Updated: October 25, 2025

Overview
- Stack: PHP 8.3 + Laravel 11, PostgreSQL 16, Redis 7, Horizon for queues, Swoole/RoadRunner optional.
- Scope: All data access and actions are scoped by university_id + college_id.
- Domains: Faculty, Students (view), Departments, Programs, Admissions, Exams, Reports, Infrastructure, Finance, Communication.

Key Principles
- College isolation first: global Eloquent scopes + middleware header verification.
- Contracts in code: dedicated Request classes, Policies, Resources; follow API spec in `api_spec.yaml`.
- Async for heavy tasks: merit list generation, seat allocation, report scheduling → queued jobs.
- Audit by default: approvals, escalations, unmasking PII all emit events and write audit records.

Directory Structure (selected)
```
app/
	Http/Controllers/Principal/
		DashboardController.php
		FacultyController.php
		FacultyLeaveController.php
		FacultyEvaluationController.php
		StudentController.php
		DepartmentController.php
		ProgramController.php
		AdmissionsController.php
		ExamsController.php
		ReportsController.php
		InfrastructureController.php
		FinanceController.php
		CommunicationController.php
	Http/Middleware/EnsureCollegeScoped.php
	Models/Traits/CollegeScoped.php
	Models/Faculty.php
	Models/FacultyLeave.php
	Models/FacultyEvaluation.php
	Models/Department.php
	Models/Program.php
	Models/AdmissionApplication.php
	Models/ExpenseRequest.php
	Services/RecruitmentService.php
	Services/AdmissionsService.php
	Services/BudgetApprovalService.php
	Services/ReportsService.php
	Services/CommunicationService.php
	Jobs/GenerateMeritList.php
	Jobs/AllocateSeats.php
	Jobs/ScheduleReportEmail.php
	Events/ExpenseApproved.php
	Events/FacultyHired.php
	Events/ResultBatchApproved.php
	Listeners/NotifyFinanceOnEscalation.php
```

Middleware: EnsureCollegeScoped
```php
namespace App\Http\Middleware;

use Closure; use Illuminate\Http\Request;

class EnsureCollegeScoped {
	public function handle(Request $request, Closure $next) {
		$user = $request->user();
		if (!$user || !isset($user->university_id, $user->college_id)) {
			abort(401, 'Missing scope');
		}
		// Header consistency (if provided)
		if ($request->hasHeader('X-University-Id') && (int)$request->header('X-University-Id') !== (int)$user->university_id) {
			abort(403, 'University mismatch');
		}
		if ($request->hasHeader('X-College-Id') && (int)$request->header('X-College-Id') !== (int)$user->college_id) {
			abort(403, 'College mismatch');
		}
		app()->instance('scope.university_id', (int)$user->university_id);
		app()->instance('scope.college_id', (int)$user->college_id);
		return $next($request);
	}
}
```

Trait: CollegeScoped
```php
namespace App\Models\Traits;

use Illuminate\Database\Eloquent\Builder;

trait CollegeScoped {
	protected static function booted() {
		static::addGlobalScope('college', function (Builder $builder) {
			$builder->where('university_id', app('scope.university_id'))
							->where('college_id', app('scope.college_id'));
		});
	}
}
```

Example Model
```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\CollegeScoped;

class ExpenseRequest extends Model {
	use CollegeScoped;
	protected $fillable = ['university_id','college_id','department_id','amount','category','status','remarks'];
}
```

Controllers (examples)
```php
// app/Http/Controllers/Principal/FinanceController.php
class FinanceController {
	public function index() {
		return ExpenseRequest::query()->latest()->paginate(25);
	}

	public function approve(int $id) {
		$req = ExpenseRequest::findOrFail($id);
		// Threshold: < ₹5L approve, >= ₹5L escalate
		if ($req->amount >= 500000) {
			return response()->json(['error' => 'Use escalate endpoint'], 422);
		}
		$req->status = 'approved';
		$req->save();
		event(new \App\Events\ExpenseApproved($req->id));
		audit()->actor(auth()->id())->on($req)->with(['reason' => request('remarks')])->log('finance.expense.approve');
		return response()->json(['status' => 'approved']);
	}
}
```

Admissions Service + Jobs
```php
// app/Services/AdmissionsService.php
class AdmissionsService {
	public function generateMeritList(int $programId, array $criteria): void {
		dispatch(new \App\Jobs\GenerateMeritList($programId, $criteria))->onQueue('high');
	}
}

// app/Jobs/GenerateMeritList.php
class GenerateMeritList implements ShouldQueue {
	use InteractsWithQueue, Queueable, SerializesModels;
	public function __construct(public int $programId, public array $criteria) {}
	public function handle() {
		// 1) Fetch verified applications
		// 2) Compute weighted scores (entrance, academics, interview)
		// 3) Persist ranked entries in merit_list_entries
		// 4) Emit domain event
	}
}
```

Routing (api.php)
```php
Route::middleware(['auth:api','scope.college'])->prefix('principal')->group(function () {
	Route::get('dashboard/summary', [DashboardController::class,'summary']);
	Route::apiResource('faculty', FacultyController::class)->only(['index','show','store']);
	Route::get('faculty-leaves', [FacultyLeaveController::class,'index']);
	Route::post('faculty-leaves/{id}/approve', [FacultyLeaveController::class,'approve']);
	Route::post('faculty-leaves/{id}/reject', [FacultyLeaveController::class,'reject']);
	Route::get('students', [StudentController::class,'index']);
	Route::get('departments', [DepartmentController::class,'index']);
	Route::post('departments/hod', [DepartmentController::class,'assignHod']);
	Route::get('programs', [ProgramController::class,'index']);
	Route::post('admissions/merit-list', [AdmissionsController::class,'generateMerit']);
	Route::post('admissions/seat-allocation', [AdmissionsController::class,'allocate']);
	Route::get('exams/timetables', [ExamsController::class,'timetables']);
	Route::post('exams/timetables/{id}/approve', [ExamsController::class,'approveTimetable']);
	Route::get('exams/results/batches', [ExamsController::class,'resultBatches']);
	Route::post('exams/results/batches/{id}/approve', [ExamsController::class,'approveResults']);
	Route::get('infrastructure/rooms', [InfrastructureController::class,'rooms']);
	Route::get('infrastructure/maintenance', [InfrastructureController::class,'index']);
	Route::post('infrastructure/maintenance', [InfrastructureController::class,'store']);
	Route::get('finance/expenses', [FinanceController::class,'index']);
	Route::post('finance/expenses/{id}/approve', [FinanceController::class,'approve']);
	Route::post('finance/expenses/{id}/escalate', [FinanceController::class,'escalate']);
	Route::apiResource('communication/announcements', CommunicationController::class)->only(['index','store','show']);
	Route::post('communication/announcements/{id}/send', [CommunicationController::class,'send']);
	Route::get('reports/summary', [ReportsController::class,'summary']);
	Route::post('reports/schedules', [ReportsController::class,'schedule']);
});
```

Validation & Policy
- Use FormRequest classes for create/update operations (e.g., StoreExpenseRequest).
- Gate permissions with policies using permission slugs (e.g., `finance.expense.approve`).
- Enforce attribute thresholds inside policies or service layer.

Caching & Performance
- Cache dashboard summary for 30–60s with college scope key.
- Use partial indexes and pagination defaults of 25.
- Prevent N+1: always `with()` relations for lists.

Observability
- Use Laravel Telescope in dev; Sentry/OTel in prod.
- Add context: university_id, college_id, principal_id on log scope.

Events & Integrations
- ExpenseApproved, FacultyHired, ResultBatchApproved → broadcast internally; optional webhooks configured by super admin.
- On escalation, listener NotifyFinanceOnEscalation notifies University Owner channel.

Queues & Horizon
- Queues: high (admissions, reports), default (general), low (emails).
- Configure concurrency based on cores; implement retries with exponential backoff.

Security
- Strict use of prepared statements (Eloquent default).
- Mask sensitive PII in resources unless explicit unmask permission and purpose provided.
- Deny-by-default policies; 403 on permission failure.

Testing
- Feature tests: approval thresholds; cross-college isolation; admissions job dispatch.
- Contract tests: validate responses against OpenAPI (stoplight/spectral suggestion).

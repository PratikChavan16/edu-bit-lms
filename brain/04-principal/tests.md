# Principal Portal - Testing Strategy

Version: 2.0  
Last Updated: October 25, 2025

---

## Testing Pyramid

```
				/\
			 /E2E\         10% - End-to-End (Playwright)
			/------\
		 /Integration\   20% - Integration Tests
		/------------\
	 /  Unit Tests  \  70% - Unit Tests (PHPUnit, Jest)
	/----------------\
```

Coverage Targets
- Backend: ≥80%
- Frontend: ≥70%
- Critical Paths: 100% (approvals, admissions, exams)

---

## 1. Backend Testing (PHPUnit)

### 1.1 Unit & Feature Tests

Expense Approval Thresholds
```php
/** @test */
public function principal_can_approve_expense_below_threshold() {
	$principal = User::factory()->withRole('principal')->create(['university_id'=>1,'college_id'=>10]);
	$req = ExpenseRequest::factory()->create(['university_id'=>1,'college_id'=>10,'amount'=>499999,'status'=>'pending']);
	$res = $this->actingAs($principal)->postJson("/api/principal/finance/expenses/{$req->id}/approve", ['remarks' => 'ok']);
	$res->assertStatus(200);
	$this->assertDatabaseHas('expense_requests', ['id'=>$req->id, 'status'=>'approved']);
}

/** @test */
public function expense_equal_or_above_threshold_requires_escalation() {
	$principal = User::factory()->withRole('principal')->create(['university_id'=>1,'college_id'=>10]);
	$req = ExpenseRequest::factory()->create(['university_id'=>1,'college_id'=>10,'amount'=>500000,'status'=>'pending']);
	$res = $this->actingAs($principal)->postJson("/api/principal/finance/expenses/{$req->id}/approve", ['remarks' => 'nope']);
	$res->assertStatus(422);
}
```

College Isolation
```php
/** @test */
public function principal_cannot_access_other_college_records() {
	$principal = User::factory()->withRole('principal')->create(['university_id'=>1,'college_id'=>10]);
	$foreign = ExpenseRequest::factory()->create(['university_id'=>1,'college_id'=>99]);
	$res = $this->actingAs($principal)->getJson("/api/principal/finance/expenses?status=pending");
	$res->assertStatus(200);
	$this->assertFalse(collect($res->json())->pluck('id')->contains($foreign->id));
}
```

Admissions Jobs
```php
/** @test */
public function generating_merit_list_dispatches_job() {
	Bus::fake();
	$principal = User::factory()->withRole('principal')->create(['university_id'=>1,'college_id'=>10]);
	$payload = ['program_id'=>4,'criteria'=>['entrance_weight'=>0.6,'academics_weight'=>0.3,'interview_weight'=>0.1]];
	$res = $this->actingAs($principal)->postJson('/api/principal/admissions/merit-list', $payload);
	$res->assertStatus(202);
	Bus::assertDispatched(\App\Jobs\GenerateMeritList::class);
}
```

Leave Approvals
```php
/** @test */
public function principal_can_approve_faculty_leave() {
	$principal = User::factory()->withRole('principal')->create(['university_id'=>1,'college_id'=>10]);
	$leave = FacultyLeave::factory()->create(['university_id'=>1,'college_id'=>10, 'status'=>'pending']);
	$res = $this->actingAs($principal)->postJson("/api/principal/faculty-leaves/{$leave->id}/approve", ['remarks' => 'approved']);
	$res->assertStatus(200);
	$this->assertDatabaseHas('faculty_leaves', ['id'=>$leave->id,'status'=>'approved']);
}
```

---

## 2. Frontend Testing (Jest + Playwright)

Unit (Jest)
```ts
// stores/faculty.test.ts
it('approves leave and refreshes list', async () => {
	const mock = vi.spyOn(api, 'post').mockResolvedValue({ data: { status: 'approved' }});
	const store = useFacultyStore.getState();
	await store.approveLeave(123, 'ok');
	expect(mock).toHaveBeenCalledWith('/faculty-leaves/123/approve', { remarks: 'ok' });
});
```

E2E (Playwright)
```ts
test('Principal approves expense under threshold', async ({ page }) => {
	await page.goto('http://localhost:3004');
	await page.getByLabel('Email').fill('principal@college.edu');
	await page.getByLabel('Password').fill('Principal@123');
	await page.getByRole('button', { name: 'Sign in' }).click();
	await page.getByRole('link', { name: 'Finance' }).click();
	const row = page.getByRole('row', { name: /₹(4|3)[0-9]{5}/ }).first();
	await row.getByRole('button', { name: 'Approve' }).click();
	await expect(row).toContainText('approved');
});
```

---

## 3. Contract Testing

- Validate API responses against OpenAPI (`api_spec.yaml`) using spectral/Prism.
- Generate client types (optional) and ensure no drift in fields.

---

## 4. Test Data & Fixtures

- Factory blueprints for departments, programs, faculty, expense_requests.
- Seeded principal user with role=principal, scoped ids.

---

## 5. CI Configuration (reference)

- Backend job: composer install, php artisan test, publish coverage.
- Frontend job: npm ci, npm run build, npm run test, playwright e2e on preview env.

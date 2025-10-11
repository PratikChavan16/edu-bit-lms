<?php

namespace Tests\Feature\Fees;

use App\Models\College;
use App\Models\FeeInvoice;
use App\Models\FeePayment;
use App\Models\FeeStructure;
use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FeesTest extends TestCase
{
    use RefreshDatabase;

    protected User $adminUser;
    protected User $studentUser;
    protected College $college;
    protected Student $student;
    protected string $adminToken;
    protected string $studentToken;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->seed(\Database\Seeders\RBACSeeder::class);
        
        $this->college = College::factory()->create();
        
        // Admin user
        $this->adminUser = User::factory()->create(['status' => 'active']);
        $adminRole = \App\Models\Role::where('name', 'college-fee-admin')->first();
        $this->adminUser->roles()->attach($adminRole->id, [
            'college_id' => $this->college->id,
        ]);
        $this->adminToken = $this->adminUser->createToken('test-device')->plainTextToken;
        
        // Student user
        $this->studentUser = User::factory()->create(['status' => 'active']);
        $this->student = Student::factory()->create([
            'user_id' => $this->studentUser->id,
            'college_id' => $this->college->id,
        ]);
        $studentRole = \App\Models\Role::where('name', 'student')->first();
        $this->studentUser->roles()->attach($studentRole->id, [
            'college_id' => $this->college->id,
        ]);
        $this->studentToken = $this->studentUser->createToken('test-device')->plainTextToken;
    }

    public function test_admin_can_list_fee_structures(): void
    {
        FeeStructure::factory()->count(3)->create([
            'college_id' => $this->college->id,
        ]);

        $response = $this->getJson("/api/admin/fees/structures?college_id={$this->college->id}", [
            'Authorization' => 'Bearer ' . $this->adminToken,
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => ['id', 'course', 'year', 'amount'],
                ],
            ]);
    }

    public function test_admin_can_create_fee_structure(): void
    {
        $data = [
            'course' => 'BSc Computer Science',
            'year' => 2,
            'semester' => 1,
            'amount' => 50000,
            'component_name' => 'Tuition Fee',
            'frequency' => 'semester',
            'effective_from' => now()->toDateString(),
            'components' => [
                'tuition' => 35000,
                'library' => 5000,
                'lab' => 10000,
            ],
        ];

        $response = $this->postJson("/api/admin/fees/structures?college_id={$this->college->id}", $data, [
            'Authorization' => 'Bearer ' . $this->adminToken,
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('fee_structures', [
            'college_id' => $this->college->id,
            'course' => 'BSc Computer Science',
            'amount' => 50000,
        ]);
    }

    public function test_admin_can_list_invoices(): void
    {
        FeeInvoice::factory()->count(5)->create([
            'college_id' => $this->college->id,
        ]);

        $response = $this->getJson("/api/admin/fees/invoices?college_id={$this->college->id}", [
            'Authorization' => 'Bearer ' . $this->adminToken,
        ]);

        $response->assertStatus(200);
    }

    public function test_admin_can_record_payment(): void
    {
        $invoice = FeeInvoice::factory()->create([
            'college_id' => $this->college->id,
            'student_id' => $this->student->id,
            'total_amount' => 50000,
            'paid_amount' => 0,
            'status' => 'pending',
        ]);

        $data = [
            'amount' => 25000,
            'payment_method' => 'online',
            'reference_number' => 'TXN123456',
            'payment_date' => now()->toDateString(),
        ];

        $response = $this->postJson("/api/admin/fees/invoices/{$invoice->id}/payments?college_id={$this->college->id}", $data, [
            'Authorization' => 'Bearer ' . $this->adminToken,
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('fee_payments', [
            'invoice_id' => $invoice->id,
            'amount' => 25000,
            'reference_number' => 'TXN123456',
        ]);
    }

    public function test_student_can_view_own_invoices(): void
    {
        FeeInvoice::factory()->count(3)->create([
            'college_id' => $this->college->id,
            'student_id' => $this->student->id,
        ]);

        $response = $this->getJson('/api/learner/fees/invoices', [
            'Authorization' => 'Bearer ' . $this->studentToken,
        ]);

        $response->assertStatus(200);
    }

    public function test_student_can_view_fee_summary(): void
    {
        $invoice1 = FeeInvoice::factory()->create([
            'college_id' => $this->college->id,
            'student_id' => $this->student->id,
            'total_amount' => 50000,
            'paid_amount' => 30000,
        ]);

        $invoice2 = FeeInvoice::factory()->create([
            'college_id' => $this->college->id,
            'student_id' => $this->student->id,
            'total_amount' => 50000,
            'paid_amount' => 50000,
        ]);

        $response = $this->getJson('/api/learner/fees/summary', [
            'Authorization' => 'Bearer ' . $this->studentToken,
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'total_fees',
                    'paid_amount',
                    'pending_amount',
                ],
            ]);
    }

    public function test_payment_updates_invoice_status(): void
    {
        $invoice = FeeInvoice::factory()->create([
            'college_id' => $this->college->id,
            'student_id' => $this->student->id,
            'total_amount' => 50000,
            'paid_amount' => 0,
            'status' => 'pending',
        ]);

        $data = [
            'amount' => 50000,
            'payment_method' => 'cash',
            'payment_date' => now()->toDateString(),
        ];

        $response = $this->postJson("/api/admin/fees/invoices/{$invoice->id}/payments?college_id={$this->college->id}", $data, [
            'Authorization' => 'Bearer ' . $this->adminToken,
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('fee_invoices', [
            'id' => $invoice->id,
            'status' => 'paid',
            'paid_amount' => 50000,
        ]);
    }

    public function test_requires_authentication(): void
    {
        $response = $this->getJson('/api/learner/fees/invoices');

        $response->assertStatus(401);
    }

    public function test_validates_payment_amount(): void
    {
        $invoice = FeeInvoice::factory()->create([
            'college_id' => $this->college->id,
            'total_amount' => 50000,
        ]);

        $data = [
            'amount' => -1000, // Invalid negative amount
            'payment_method' => 'cash',
        ];

        $response = $this->postJson("/api/admin/fees/invoices/{$invoice->id}/payments?college_id={$this->college->id}", $data, [
            'Authorization' => 'Bearer ' . $this->adminToken,
        ]);

        $response->assertStatus(422);
    }
}

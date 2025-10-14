<?php

namespace Tests\Feature\Admin;

use App\Models\College;
use App\Models\Role;
use App\Models\University;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CollegeControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected Role $adminRole;
    protected University $university;

    protected function setUp(): void
    {
        parent::setUp();

        // Create admin role
        $this->adminRole = Role::create([
            'name' => 'Admin',
            'slug' => 'admin',
            'scope' => 'system',
            'description' => 'System Administrator',
        ]);

        // Create admin user
        $this->admin = User::create([
            'username' => 'admin',
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
            'first_name' => 'Admin',
            'last_name' => 'User',
            'status' => 'active',
        ]);

        // Attach admin role
        $this->admin->roles()->attach($this->adminRole->id);

        // Create university
        $this->university = University::create([
            'name' => 'Test University',
            'slug' => 'test-university',
            'code' => 'TU001',
            'type' => 'public',
            'status' => 'active',
            'established_year' => 2000,
            'state' => 'Test State',
        ]);
    }

    /** @test */
    public function unauthenticated_users_cannot_access_colleges()
    {
        $response = $this->getJson('/api/admin/colleges');
        $response->assertStatus(401);
    }

    /** @test */
    public function admin_can_list_colleges()
    {
        Sanctum::actingAs($this->admin);

        College::create([
            'university_id' => $this->university->id,
            'name' => 'Engineering College',
            'slug' => 'engineering-college',
            'code' => 'ENG001',
            'type' => 'engineering',
            'status' => 'active',
        ]);

        College::create([
            'university_id' => $this->university->id,
            'name' => 'Arts College',
            'slug' => 'arts-college',
            'code' => 'ART001',
            'type' => 'arts',
            'status' => 'pending',
        ]);

        $response = $this->getJson('/api/admin/colleges');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonStructure([
                'success',
                'data' => [
                    'data' => [
                        '*' => ['id', 'name', 'code', 'type', 'status'],
                    ],
                ],
            ]);
    }

    /** @test */
    public function admin_can_filter_colleges_by_university()
    {
        Sanctum::actingAs($this->admin);

        $anotherUniversity = University::create([
            'name' => 'Another University',
            'slug' => 'another-university',
            'code' => 'AU001',
            'type' => 'private',
            'status' => 'active',
            'established_year' => 2010,
            'state' => 'Another State',
        ]);

        College::create([
            'university_id' => $this->university->id,
            'name' => 'College 1',
            'slug' => 'college-1',
            'code' => 'COL001',
            'type' => 'engineering',
            'status' => 'active',
        ]);

        College::create([
            'university_id' => $anotherUniversity->id,
            'name' => 'College 2',
            'slug' => 'college-2',
            'code' => 'COL002',
            'type' => 'arts',
            'status' => 'active',
        ]);

        $response = $this->getJson("/api/admin/colleges?university_id={$this->university->id}");

        $response->assertStatus(200);
        $this->assertEquals(1, count($response->json('data.data')));
    }

    /** @test */
    public function admin_can_filter_colleges_by_status()
    {
        Sanctum::actingAs($this->admin);

        College::create([
            'university_id' => $this->university->id,
            'name' => 'Active College',
            'slug' => 'active-college',
            'code' => 'ACT001',
            'type' => 'engineering',
            'status' => 'active',
        ]);

        College::create([
            'university_id' => $this->university->id,
            'name' => 'Pending College',
            'slug' => 'pending-college',
            'code' => 'PEN001',
            'type' => 'arts',
            'status' => 'pending',
        ]);

        $response = $this->getJson('/api/admin/colleges?status=active');

        $response->assertStatus(200);
        $this->assertEquals(1, count($response->json('data.data')));
    }

    /** @test */
    public function admin_can_search_colleges()
    {
        Sanctum::actingAs($this->admin);

        College::create([
            'university_id' => $this->university->id,
            'name' => 'Engineering College',
            'slug' => 'engineering-college',
            'code' => 'ENG001',
            'type' => 'engineering',
            'status' => 'active',
        ]);

        College::create([
            'university_id' => $this->university->id,
            'name' => 'Medical College',
            'slug' => 'medical-college',
            'code' => 'MED001',
            'type' => 'medical',
            'status' => 'active',
        ]);

        $response = $this->getJson('/api/admin/colleges?search=Engineering');

        $response->assertStatus(200);
        $this->assertEquals(1, count($response->json('data.data')));
    }

    /** @test */
    public function admin_can_view_college_details()
    {
        Sanctum::actingAs($this->admin);

        $college = College::create([
            'university_id' => $this->university->id,
            'name' => 'Test College',
            'slug' => 'test-college',
            'code' => 'TC001',
            'type' => 'engineering',
            'status' => 'active',
        ]);

        $response = $this->getJson("/api/admin/colleges/{$college->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $college->id,
                    'name' => 'Test College',
                    'code' => 'TC001',
                ],
            ]);
    }

    /** @test */
    public function admin_can_create_college()
    {
        Sanctum::actingAs($this->admin);

        $collegeData = [
            'university_id' => $this->university->id,
            'name' => 'New Engineering College',
            'code' => 'NEC001',
            'type' => 'engineering',
            'motto' => 'Excellence in Education',
            'storage_quota_gb' => 100,
            'student_storage_quota_mb' => 500,
        ];

        $response = $this->postJson('/api/admin/colleges', $collegeData);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'College created successfully',
            ]);

        $this->assertDatabaseHas('colleges', [
            'name' => 'New Engineering College',
            'code' => 'NEC001',
            'status' => 'pending',
        ]);
    }

    /** @test */
    public function college_code_must_be_unique()
    {
        Sanctum::actingAs($this->admin);

        College::create([
            'university_id' => $this->university->id,
            'name' => 'Existing College',
            'slug' => 'existing-college',
            'code' => 'EXC001',
            'type' => 'engineering',
            'status' => 'active',
        ]);

        $collegeData = [
            'university_id' => $this->university->id,
            'name' => 'Another College',
            'code' => 'EXC001', // Same code
            'type' => 'arts',
        ];

        $response = $this->postJson('/api/admin/colleges', $collegeData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['code']);
    }

    /** @test */
    public function admin_can_update_college()
    {
        Sanctum::actingAs($this->admin);

        $college = College::create([
            'university_id' => $this->university->id,
            'name' => 'Original Name',
            'slug' => 'original-name',
            'code' => 'ORG001',
            'type' => 'engineering',
            'status' => 'active',
        ]);

        $updateData = [
            'name' => 'Updated Name',
            'motto' => 'New Motto',
        ];

        $response = $this->patchJson("/api/admin/colleges/{$college->id}", $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'College updated successfully',
            ]);

        $this->assertDatabaseHas('colleges', [
            'id' => $college->id,
            'name' => 'Updated Name',
            'motto' => 'New Motto',
        ]);
    }

    /** @test */
    public function admin_can_approve_pending_college()
    {
        Sanctum::actingAs($this->admin);

        $college = College::create([
            'university_id' => $this->university->id,
            'name' => 'Pending College',
            'slug' => 'pending-college',
            'code' => 'PEN001',
            'type' => 'engineering',
            'status' => 'pending',
        ]);

        $response = $this->patchJson("/api/admin/colleges/{$college->id}/approve");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'College approved successfully',
            ]);

        $this->assertDatabaseHas('colleges', [
            'id' => $college->id,
            'status' => 'active',
        ]);
    }

    /** @test */
    public function cannot_approve_already_active_college()
    {
        Sanctum::actingAs($this->admin);

        $college = College::create([
            'university_id' => $this->university->id,
            'name' => 'Active College',
            'slug' => 'active-college',
            'code' => 'ACT001',
            'type' => 'engineering',
            'status' => 'active',
        ]);

        $response = $this->patchJson("/api/admin/colleges/{$college->id}/approve");

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
                'error' => 'College is not in pending status',
            ]);
    }

    /** @test */
    public function admin_can_delete_college_without_students_or_faculty()
    {
        Sanctum::actingAs($this->admin);

        $college = College::create([
            'university_id' => $this->university->id,
            'name' => 'Empty College',
            'slug' => 'empty-college',
            'code' => 'EMP001',
            'type' => 'engineering',
            'status' => 'active',
        ]);

        $response = $this->deleteJson("/api/admin/colleges/{$college->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'College deleted successfully',
            ]);

        $this->assertSoftDeleted('colleges', [
            'id' => $college->id,
        ]);
    }

    /** @test */
    public function admin_can_get_college_statistics()
    {
        Sanctum::actingAs($this->admin);

        $college = College::create([
            'university_id' => $this->university->id,
            'name' => 'Stats College',
            'slug' => 'stats-college',
            'code' => 'STA001',
            'type' => 'engineering',
            'status' => 'active',
            'storage_quota_gb' => 100,
        ]);

        $response = $this->getJson("/api/admin/colleges/{$college->id}/statistics");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonStructure([
                'success',
                'data' => [
                    'students_count',
                    'faculty_count',
                    'departments_count',
                    'courses_count',
                    'storage_used_gb',
                    'storage_quota_gb',
                    'storage_percentage',
                ],
            ]);
    }

    /** @test */
    public function college_type_must_be_valid()
    {
        Sanctum::actingAs($this->admin);

        $collegeData = [
            'university_id' => $this->university->id,
            'name' => 'Invalid College',
            'code' => 'INV001',
            'type' => 'invalid-type',
        ];

        $response = $this->postJson('/api/admin/colleges', $collegeData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['type']);
    }

    /** @test */
    public function university_id_is_required_for_college_creation()
    {
        Sanctum::actingAs($this->admin);

        $collegeData = [
            'name' => 'College Without University',
            'code' => 'CWU001',
            'type' => 'engineering',
        ];

        $response = $this->postJson('/api/admin/colleges', $collegeData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['university_id']);
    }
}

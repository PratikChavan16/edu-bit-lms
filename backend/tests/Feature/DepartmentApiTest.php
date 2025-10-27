<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\University;
use App\Models\College;
use App\Models\Department;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tymon\JWTAuth\Facades\JWTAuth;

class DepartmentApiTest extends TestCase
{
    use RefreshDatabase;

    protected University $university;
    protected College $college;
    protected User $bitflowAdmin;
    protected string $token;

    protected function setUp(): void
    {
        parent::setUp();

        // Create test university
        $this->university = University::create([
            'name' => 'Test University',
            'slug' => 'test-university',
            'domain' => 'testuni.edu',
            'email' => 'admin@testuni.edu',
            'phone' => '+1234567890',
            'status' => 'active',
        ]);

        // Create test college
        $this->college = College::create([
            'university_id' => $this->university->id,
            'name' => 'Test College',
            'code' => 'TC001',
            'type' => 'autonomous',
            'email' => 'info@testcollege.edu',
            'phone' => '+1234567891',
            'established_year' => 2000,
            'status' => 'active',
        ]);

        // Create Bitflow Admin user
        $this->bitflowAdmin = User::create([
            'university_id' => $this->university->id,
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@bitflow.com',
            'password' => bcrypt('password'),
            'role' => 'bitflow_owner',
            'status' => 'active',
        ]);

        // Generate JWT token
        $this->token = JWTAuth::fromUser($this->bitflowAdmin);
    }

    public function test_can_list_departments(): void
    {
        // Create test departments
        Department::create([
            'university_id' => $this->university->id,
            'college_id' => $this->college->id,
            'name' => 'Computer Science',
            'code' => 'CS',
            'description' => 'Computer Science Department',
            'status' => 'active',
        ]);

        Department::create([
            'university_id' => $this->university->id,
            'college_id' => $this->college->id,
            'name' => 'Mechanical Engineering',
            'code' => 'ME',
            'description' => 'Mechanical Engineering Department',
            'status' => 'active',
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson("/api/v1/admin/universities/{$this->university->id}/colleges/{$this->college->id}/departments");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'code',
                        'description',
                        'status',
                    ]
                ]
            ])
            ->assertJsonCount(2, 'data');
    }

    public function test_can_create_department(): void
    {
        $departmentData = [
            'name' => 'Computer Science',
            'code' => 'CS',
            'description' => 'Computer Science Department',
            'status' => 'active',
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson(
            "/api/v1/admin/universities/{$this->university->id}/colleges/{$this->college->id}/departments",
            $departmentData
        );

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'id',
                    'name',
                    'code',
                    'description',
                    'status',
                ]
            ])
            ->assertJson([
                'success' => true,
                'data' => [
                    'name' => 'Computer Science',
                    'code' => 'CS',
                ]
            ]);

        $this->assertDatabaseHas('departments', [
            'university_id' => $this->university->id,
            'college_id' => $this->college->id,
            'name' => 'Computer Science',
            'code' => 'CS',
        ]);
    }

    public function test_can_get_single_department(): void
    {
        $department = Department::create([
            'university_id' => $this->university->id,
            'college_id' => $this->college->id,
            'name' => 'Computer Science',
            'code' => 'CS',
            'description' => 'Computer Science Department',
            'status' => 'active',
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson("/api/v1/admin/universities/{$this->university->id}/colleges/{$this->college->id}/departments/{$department->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id',
                    'name',
                    'code',
                    'description',
                    'status',
                ]
            ])
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $department->id,
                    'name' => 'Computer Science',
                    'code' => 'CS',
                ]
            ]);
    }

    public function test_can_update_department(): void
    {
        $department = Department::create([
            'university_id' => $this->university->id,
            'college_id' => $this->college->id,
            'name' => 'Computer Science',
            'code' => 'CS',
            'description' => 'Computer Science Department',
            'status' => 'active',
        ]);

        $updateData = [
            'name' => 'Computer Science and Engineering',
            'description' => 'Updated description',
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->putJson(
            "/api/v1/admin/universities/{$this->university->id}/colleges/{$this->college->id}/departments/{$department->id}",
            $updateData
        );

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'id',
                    'name',
                    'description',
                ]
            ])
            ->assertJson([
                'success' => true,
                'data' => [
                    'name' => 'Computer Science and Engineering',
                    'description' => 'Updated description',
                ]
            ]);

        $this->assertDatabaseHas('departments', [
            'id' => $department->id,
            'name' => 'Computer Science and Engineering',
            'description' => 'Updated description',
        ]);
    }

    public function test_can_delete_department(): void
    {
        $department = Department::create([
            'university_id' => $this->university->id,
            'college_id' => $this->college->id,
            'name' => 'Computer Science',
            'code' => 'CS',
            'description' => 'Computer Science Department',
            'status' => 'active',
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->deleteJson("/api/v1/admin/universities/{$this->university->id}/colleges/{$this->college->id}/departments/{$department->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertSoftDeleted('departments', [
            'id' => $department->id,
        ]);
    }

    public function test_cannot_create_department_with_duplicate_code(): void
    {
        // Create first department
        Department::create([
            'university_id' => $this->university->id,
            'college_id' => $this->college->id,
            'name' => 'Computer Science',
            'code' => 'CS',
            'description' => 'Computer Science Department',
            'status' => 'active',
        ]);

        // Try to create second department with same code
        $departmentData = [
            'name' => 'Computer Studies',
            'code' => 'CS', // Duplicate code
            'description' => 'Another CS Department',
            'status' => 'active',
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson(
            "/api/v1/admin/universities/{$this->university->id}/colleges/{$this->college->id}/departments",
            $departmentData
        );

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['code']);
    }

    public function test_cannot_create_department_without_required_fields(): void
    {
        $departmentData = [
            'description' => 'Missing required fields',
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson(
            "/api/v1/admin/universities/{$this->university->id}/colleges/{$this->college->id}/departments",
            $departmentData
        );

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'code']);
    }

    public function test_cannot_access_departments_without_authentication(): void
    {
        $response = $this->getJson("/api/v1/admin/universities/{$this->university->id}/colleges/{$this->college->id}/departments");

        $response->assertStatus(401);
    }

    public function test_cannot_access_departments_with_invalid_role(): void
    {
        // Create a student user (not authorized for department management)
        $student = User::create([
            'university_id' => $this->university->id,
            'first_name' => 'Student',
            'last_name' => 'User',
            'email' => 'student@testuni.edu',
            'password' => bcrypt('password'),
            'role' => 'student',
            'status' => 'active',
        ]);

        $studentToken = JWTAuth::fromUser($student);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $studentToken,
        ])->getJson("/api/v1/admin/universities/{$this->university->id}/colleges/{$this->college->id}/departments");

        $response->assertStatus(403);
    }

    public function test_can_filter_active_departments(): void
    {
        // Create active and inactive departments
        Department::create([
            'university_id' => $this->university->id,
            'college_id' => $this->college->id,
            'name' => 'Active Department',
            'code' => 'AD',
            'description' => 'Active',
            'status' => 'active',
        ]);

        Department::create([
            'university_id' => $this->university->id,
            'college_id' => $this->college->id,
            'name' => 'Inactive Department',
            'code' => 'ID',
            'description' => 'Inactive',
            'status' => 'inactive',
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson("/api/v1/admin/universities/{$this->university->id}/colleges/{$this->college->id}/departments?status=active");

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJson([
                'data' => [
                    [
                        'status' => 'active',
                    ]
                ]
            ]);
    }

    public function test_department_belongs_to_correct_college(): void
    {
        // Create another college
        $otherCollege = College::create([
            'university_id' => $this->university->id,
            'name' => 'Other College',
            'code' => 'OC001',
            'type' => 'autonomous',
            'email' => 'info@othercollege.edu',
            'phone' => '+1234567899',
            'established_year' => 2005,
            'status' => 'active',
        ]);

        // Create department in first college
        $department = Department::create([
            'university_id' => $this->university->id,
            'college_id' => $this->college->id,
            'name' => 'Computer Science',
            'code' => 'CS',
            'description' => 'CS Department',
            'status' => 'active',
        ]);

        // Try to access department from wrong college endpoint
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson("/api/v1/admin/universities/{$this->university->id}/colleges/{$otherCollege->id}/departments/{$department->id}");

        $response->assertStatus(404);
    }

    public function test_rate_limiting_on_department_endpoints(): void
    {
        $url = "/api/v1/admin/universities/{$this->university->id}/colleges/{$this->college->id}/departments";

        // Make requests up to the rate limit (60 per minute)
        for ($i = 0; $i < 61; $i++) {
            $response = $this->withHeaders([
                'Authorization' => 'Bearer ' . $this->token,
            ])->getJson($url);

            if ($i < 60) {
                $response->assertStatus(200);
            } else {
                // 61st request should be rate limited
                $response->assertStatus(429);
                break;
            }
        }
    }
}

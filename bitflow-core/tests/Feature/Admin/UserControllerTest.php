<?php

namespace Tests\Feature\Admin;

use App\Models\Role;
use App\Models\University;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected Role $adminRole;
    protected Role $studentRole;
    protected Role $facultyRole;
    protected University $university;

    protected function setUp(): void
    {
        parent::setUp();

        // Create roles
        $this->adminRole = Role::create([
            'name' => 'Admin',
            'slug' => 'admin',
            'scope' => 'system',
            'description' => 'System Administrator',
        ]);

        $this->studentRole = Role::create([
            'name' => 'Student',
            'slug' => 'student',
            'scope' => 'college',
            'description' => 'Student',
        ]);

        $this->facultyRole = Role::create([
            'name' => 'Faculty',
            'slug' => 'faculty',
            'scope' => 'college',
            'description' => 'Faculty Member',
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
    public function unauthenticated_users_cannot_access_users()
    {
        $response = $this->getJson('/api/admin/users');
        $response->assertStatus(401);
    }

    /** @test */
    public function admin_can_list_users()
    {
        Sanctum::actingAs($this->admin);

        User::create([
            'username' => 'student1',
            'email' => 'student1@test.com',
            'password' => bcrypt('password'),
            'first_name' => 'John',
            'last_name' => 'Doe',
            'status' => 'active',
        ]);

        User::create([
            'username' => 'faculty1',
            'email' => 'faculty1@test.com',
            'password' => bcrypt('password'),
            'first_name' => 'Jane',
            'last_name' => 'Smith',
            'status' => 'active',
        ]);

        $response = $this->getJson('/api/admin/users');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonStructure([
                'success',
                'data' => [
                    'data' => [
                        '*' => ['id', 'username', 'email', 'first_name', 'last_name', 'status'],
                    ],
                ],
            ]);
    }

    /** @test */
    public function admin_can_filter_users_by_role()
    {
        Sanctum::actingAs($this->admin);

        $student = User::create([
            'username' => 'student1',
            'email' => 'student1@test.com',
            'password' => bcrypt('password'),
            'first_name' => 'John',
            'last_name' => 'Doe',
            'status' => 'active',
        ]);
        $student->roles()->attach($this->studentRole->id);

        $faculty = User::create([
            'username' => 'faculty1',
            'email' => 'faculty1@test.com',
            'password' => bcrypt('password'),
            'first_name' => 'Jane',
            'last_name' => 'Smith',
            'status' => 'active',
        ]);
        $faculty->roles()->attach($this->facultyRole->id);

        $response = $this->getJson('/api/admin/users?role=student');

        $response->assertStatus(200);
        $data = $response->json('data.data');
        $this->assertGreaterThanOrEqual(1, count($data));
    }

    /** @test */
    public function admin_can_filter_users_by_status()
    {
        Sanctum::actingAs($this->admin);

        User::create([
            'username' => 'active_user',
            'email' => 'active@test.com',
            'password' => bcrypt('password'),
            'first_name' => 'Active',
            'last_name' => 'User',
            'status' => 'active',
        ]);

        User::create([
            'username' => 'inactive_user',
            'email' => 'inactive@test.com',
            'password' => bcrypt('password'),
            'first_name' => 'Inactive',
            'last_name' => 'User',
            'status' => 'inactive',
        ]);

        $response = $this->getJson('/api/admin/users?status=active');

        $response->assertStatus(200);
        $data = $response->json('data.data');
        $this->assertGreaterThanOrEqual(1, count($data));
    }

    /** @test */
    public function admin_can_search_users()
    {
        Sanctum::actingAs($this->admin);

        User::create([
            'username' => 'john_doe',
            'email' => 'john@test.com',
            'password' => bcrypt('password'),
            'first_name' => 'John',
            'last_name' => 'Doe',
            'status' => 'active',
        ]);

        User::create([
            'username' => 'jane_smith',
            'email' => 'jane@test.com',
            'password' => bcrypt('password'),
            'first_name' => 'Jane',
            'last_name' => 'Smith',
            'status' => 'active',
        ]);

        $response = $this->getJson('/api/admin/users?search=john');

        $response->assertStatus(200);
        $data = $response->json('data.data');
        $this->assertGreaterThanOrEqual(1, count($data));
    }

    /** @test */
    public function admin_can_view_user_details()
    {
        Sanctum::actingAs($this->admin);

        $user = User::create([
            'username' => 'testuser',
            'email' => 'test@test.com',
            'password' => bcrypt('password'),
            'first_name' => 'Test',
            'last_name' => 'User',
            'status' => 'active',
        ]);

        $response = $this->getJson("/api/admin/users/{$user->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $user->id,
                    'username' => 'testuser',
                    'email' => 'test@test.com',
                ],
            ]);
    }

    /** @test */
    public function admin_can_create_user_with_role()
    {
        Sanctum::actingAs($this->admin);

        $userData = [
            'username' => 'newuser',
            'email' => 'newuser@test.com',
            'password' => 'SecurePass123!',
            'first_name' => 'New',
            'last_name' => 'User',
            'phone' => '1234567890',
            'role' => 'student',
            'university_id' => $this->university->id,
        ];

        $response = $this->postJson('/api/admin/users', $userData);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'User created successfully',
            ]);

        $this->assertDatabaseHas('users', [
            'username' => 'newuser',
            'email' => 'newuser@test.com',
        ]);

        // Verify password is hashed
        $user = User::where('username', 'newuser')->first();
        $this->assertTrue(Hash::check('SecurePass123!', $user->password));
    }

    /** @test */
    public function username_must_be_unique()
    {
        Sanctum::actingAs($this->admin);

        User::create([
            'username' => 'existing',
            'email' => 'existing@test.com',
            'password' => bcrypt('password'),
            'first_name' => 'Existing',
            'last_name' => 'User',
            'status' => 'active',
        ]);

        $userData = [
            'username' => 'existing',
            'email' => 'new@test.com',
            'password' => 'SecurePass123!',
            'first_name' => 'New',
            'last_name' => 'User',
            'role' => 'student',
        ];

        $response = $this->postJson('/api/admin/users', $userData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['username']);
    }

    /** @test */
    public function email_must_be_unique()
    {
        Sanctum::actingAs($this->admin);

        User::create([
            'username' => 'user1',
            'email' => 'duplicate@test.com',
            'password' => bcrypt('password'),
            'first_name' => 'User',
            'last_name' => 'One',
            'status' => 'active',
        ]);

        $userData = [
            'username' => 'user2',
            'email' => 'duplicate@test.com',
            'password' => 'SecurePass123!',
            'first_name' => 'User',
            'last_name' => 'Two',
            'role' => 'student',
        ];

        $response = $this->postJson('/api/admin/users', $userData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    /** @test */
    public function password_must_meet_complexity_requirements()
    {
        Sanctum::actingAs($this->admin);

        $userData = [
            'username' => 'testuser',
            'email' => 'test@test.com',
            'password' => 'weak', // Too simple
            'first_name' => 'Test',
            'last_name' => 'User',
            'role' => 'student',
        ];

        $response = $this->postJson('/api/admin/users', $userData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    /** @test */
    public function admin_can_update_user()
    {
        Sanctum::actingAs($this->admin);

        $user = User::create([
            'username' => 'oldname',
            'email' => 'old@test.com',
            'password' => bcrypt('password'),
            'first_name' => 'Old',
            'last_name' => 'Name',
            'status' => 'active',
        ]);

        $updateData = [
            'first_name' => 'New',
            'last_name' => 'Name',
            'phone' => '9876543210',
        ];

        $response = $this->patchJson("/api/admin/users/{$user->id}", $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'User updated successfully',
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'first_name' => 'New',
            'last_name' => 'Name',
            'phone' => '9876543210',
        ]);
    }

    /** @test */
    public function admin_can_update_user_password()
    {
        Sanctum::actingAs($this->admin);

        $user = User::create([
            'username' => 'testuser',
            'email' => 'test@test.com',
            'password' => bcrypt('oldpassword'),
            'first_name' => 'Test',
            'last_name' => 'User',
            'status' => 'active',
        ]);

        $updateData = [
            'password' => 'NewSecure123!',
        ];

        $response = $this->patchJson("/api/admin/users/{$user->id}", $updateData);

        $response->assertStatus(200);

        $user->refresh();
        $this->assertTrue(Hash::check('NewSecure123!', $user->password));
    }

    /** @test */
    public function admin_can_update_user_roles()
    {
        Sanctum::actingAs($this->admin);

        $user = User::create([
            'username' => 'testuser',
            'email' => 'test@test.com',
            'password' => bcrypt('password'),
            'first_name' => 'Test',
            'last_name' => 'User',
            'status' => 'active',
        ]);

        $rolesData = [
            'roles' => [
                [
                    'slug' => 'student',
                    'university_id' => $this->university->id,
                ],
            ],
        ];

        $response = $this->patchJson("/api/admin/users/{$user->id}/roles", $rolesData);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'User roles updated successfully',
            ]);

        $this->assertDatabaseHas('user_roles', [
            'user_id' => $user->id,
            'role_id' => $this->studentRole->id,
            'university_id' => $this->university->id,
        ]);
    }

    /** @test */
    public function admin_can_assign_multiple_roles()
    {
        Sanctum::actingAs($this->admin);

        $user = User::create([
            'username' => 'testuser',
            'email' => 'test@test.com',
            'password' => bcrypt('password'),
            'first_name' => 'Test',
            'last_name' => 'User',
            'status' => 'active',
        ]);

        $rolesData = [
            'roles' => [
                [
                    'slug' => 'student',
                    'university_id' => $this->university->id,
                ],
                [
                    'slug' => 'faculty',
                    'university_id' => $this->university->id,
                ],
            ],
        ];

        $response = $this->patchJson("/api/admin/users/{$user->id}/roles", $rolesData);

        $response->assertStatus(200);

        $user->refresh();
        $this->assertEquals(2, $user->roles()->count());
    }

    /** @test */
    public function admin_can_delete_user()
    {
        Sanctum::actingAs($this->admin);

        $user = User::create([
            'username' => 'deleteuser',
            'email' => 'delete@test.com',
            'password' => bcrypt('password'),
            'first_name' => 'Delete',
            'last_name' => 'User',
            'status' => 'active',
        ]);

        $response = $this->deleteJson("/api/admin/users/{$user->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'User deactivated successfully',
            ]);

        $this->assertSoftDeleted('users', [
            'id' => $user->id,
        ]);
    }

    /** @test */
    public function admin_cannot_delete_own_account()
    {
        Sanctum::actingAs($this->admin);

        $response = $this->deleteJson("/api/admin/users/{$this->admin->id}");

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
                'error' => 'Cannot delete your own account',
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $this->admin->id,
            'deleted_at' => null,
        ]);
    }

    /** @test */
    public function admin_can_restore_deleted_user()
    {
        Sanctum::actingAs($this->admin);

        $user = User::create([
            'username' => 'restoreuser',
            'email' => 'restore@test.com',
            'password' => bcrypt('password'),
            'first_name' => 'Restore',
            'last_name' => 'User',
            'status' => 'active',
        ]);

        // Delete user
        $user->delete();

        $response = $this->postJson("/api/admin/users/{$user->id}/restore");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'User restored successfully',
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'deleted_at' => null,
        ]);
    }

    /** @test */
    public function cannot_restore_active_user()
    {
        Sanctum::actingAs($this->admin);

        $user = User::create([
            'username' => 'activeuser',
            'email' => 'active@test.com',
            'password' => bcrypt('password'),
            'first_name' => 'Active',
            'last_name' => 'User',
            'status' => 'active',
        ]);

        $response = $this->postJson("/api/admin/users/{$user->id}/restore");

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
                'error' => 'User is not deactivated',
            ]);
    }

    /** @test */
    public function admin_can_reset_user_password()
    {
        Sanctum::actingAs($this->admin);

        $user = User::create([
            'username' => 'testuser',
            'email' => 'test@test.com',
            'password' => bcrypt('oldpassword'),
            'first_name' => 'Test',
            'last_name' => 'User',
            'status' => 'active',
        ]);

        $resetData = [
            'password' => 'NewSecurePass123!',
        ];

        $response = $this->postJson("/api/admin/users/{$user->id}/reset-password", $resetData);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Password reset successfully',
            ]);

        $user->refresh();
        $this->assertTrue(Hash::check('NewSecurePass123!', $user->password));
    }

    /** @test */
    public function admin_can_get_available_roles()
    {
        Sanctum::actingAs($this->admin);

        $response = $this->getJson('/api/admin/users/roles');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => ['id', 'name', 'slug', 'description'],
                ],
            ]);
    }
}

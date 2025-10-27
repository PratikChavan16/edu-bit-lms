<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\University;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    protected University $university;
    protected Role $role;
    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        // Create test university
        $this->university = University::create([
            'name' => 'Test University',
            'slug' => 'test-university',
            'domain' => 'test.bitflow.edu',
            'email' => 'admin@test.bitflow.edu',
            'phone' => '+1-555-0100',
            'status' => 'active',
            'storage_quota_gb' => 100,
        ]);

        // Create test role
        $this->role = Role::create([
            'name' => 'Test Role',
            'slug' => 'test_role',
            'level' => 5,
            'scope' => 'individual',
        ]);

        // Create test user
        $this->user = User::create([
            'university_id' => $this->university->id,
            'username' => 'testuser',
            'email' => 'test@test.bitflow.edu',
            'password' => Hash::make('Password@123'),
            'first_name' => 'Test',
            'last_name' => 'User',
            'status' => 'active',
            'email_verified_at' => now(),
        ]);

        $this->user->roles()->attach($this->role->id);
    }

    public function test_user_can_login_with_valid_credentials(): void
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'test@test.bitflow.edu',
            'password' => 'Password@123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'access_token',
                    'refresh_token',
                    'token_type',
                    'expires_in',
                    'user' => [
                        'id',
                        'email',
                        'full_name',
                        'university_id',
                        'roles',
                        'permissions',
                    ],
                ],
            ])
            ->assertJson([
                'success' => true,
                'message' => 'Login successful',
                'data' => [
                    'token_type' => 'Bearer',
                    'expires_in' => 900,
                ],
            ]);

        $this->assertDatabaseHas('sessions', [
            'user_id' => $this->user->id,
        ]);
    }

    public function test_login_fails_with_invalid_email(): void
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'wrong@test.bitflow.edu',
            'password' => 'Password@123',
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
            ]);
    }

    public function test_login_fails_with_invalid_password(): void
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'test@test.bitflow.edu',
            'password' => 'WrongPassword',
        ]);

        $response->assertStatus(401);
    }

    public function test_login_fails_with_inactive_user(): void
    {
        $this->user->update(['status' => 'inactive']);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'test@test.bitflow.edu',
            'password' => 'Password@123',
        ]);

        $response->assertStatus(401);
    }

    public function test_login_fails_with_unverified_email(): void
    {
        $this->user->update(['email_verified_at' => null]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'test@test.bitflow.edu',
            'password' => 'Password@123',
        ]);

        $response->assertStatus(401);
    }

    public function test_login_requires_email_field(): void
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'password' => 'Password@123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_login_requires_password_field(): void
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'test@test.bitflow.edu',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    public function test_user_can_get_profile_with_valid_token(): void
    {
        $loginResponse = $this->postJson('/api/v1/auth/login', [
            'email' => 'test@test.bitflow.edu',
            'password' => 'Password@123',
        ]);

        $token = $loginResponse->json('data.access_token');

        $response = $this->getJson('/api/v1/auth/me', [
            'Authorization' => 'Bearer ' . $token,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'email' => 'test@test.bitflow.edu',
                    'university_id' => $this->university->id,
                ],
            ]);
    }

    public function test_get_profile_fails_without_token(): void
    {
        $response = $this->getJson('/api/v1/auth/me');

        $response->assertStatus(401);
    }

    public function test_user_can_refresh_token(): void
    {
        $loginResponse = $this->postJson('/api/v1/auth/login', [
            'email' => 'test@test.bitflow.edu',
            'password' => 'Password@123',
        ]);

        $refreshToken = $loginResponse->json('data.refresh_token');

        $response = $this->postJson('/api/v1/auth/refresh', [
            'refresh_token' => $refreshToken,
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'access_token',
                    'token_type',
                    'expires_in',
                ],
            ]);
    }

    public function test_refresh_fails_with_invalid_token(): void
    {
        $response = $this->postJson('/api/v1/auth/refresh', [
            'refresh_token' => 'invalid-token',
        ]);

        $response->assertStatus(401);
    }

    public function test_user_can_logout(): void
    {
        $loginResponse = $this->postJson('/api/v1/auth/login', [
            'email' => 'test@test.bitflow.edu',
            'password' => 'Password@123',
        ]);

        $token = $loginResponse->json('data.access_token');

        $response = $this->postJson('/api/v1/auth/logout', [], [
            'Authorization' => 'Bearer ' . $token,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Logged out successfully',
            ]);

        // Session should be deleted
        $this->assertDatabaseMissing('sessions', [
            'user_id' => $this->user->id,
        ]);
    }

    public function test_user_can_update_profile(): void
    {
        $loginResponse = $this->postJson('/api/v1/auth/login', [
            'email' => 'test@test.bitflow.edu',
            'password' => 'Password@123',
        ]);

        $token = $loginResponse->json('data.access_token');

        $response = $this->putJson('/api/v1/auth/profile', [
            'first_name' => 'Updated',
            'last_name' => 'Name',
            'phone' => '+1-555-9999',
        ], [
            'Authorization' => 'Bearer ' . $token,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'full_name' => 'Updated Name',
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $this->user->id,
            'first_name' => 'Updated',
            'last_name' => 'Name',
        ]);
    }

    public function test_user_can_change_password(): void
    {
        $loginResponse = $this->postJson('/api/v1/auth/login', [
            'email' => 'test@test.bitflow.edu',
            'password' => 'Password@123',
        ]);

        $token = $loginResponse->json('data.access_token');

        $response = $this->putJson('/api/v1/auth/password', [
            'current_password' => 'Password@123',
            'new_password' => 'NewPassword@123',
            'new_password_confirmation' => 'NewPassword@123',
        ], [
            'Authorization' => 'Bearer ' . $token,
        ]);

        $response->assertStatus(200);

        // All sessions should be deleted
        $this->assertDatabaseMissing('sessions', [
            'user_id' => $this->user->id,
        ]);

        // Should be able to login with new password
        $newLogin = $this->postJson('/api/v1/auth/login', [
            'email' => 'test@test.bitflow.edu',
            'password' => 'NewPassword@123',
        ]);

        $newLogin->assertStatus(200);
    }

    public function test_change_password_fails_with_wrong_current_password(): void
    {
        $loginResponse = $this->postJson('/api/v1/auth/login', [
            'email' => 'test@test.bitflow.edu',
            'password' => 'Password@123',
        ]);

        $token = $loginResponse->json('data.access_token');

        $response = $this->putJson('/api/v1/auth/password', [
            'current_password' => 'WrongPassword',
            'new_password' => 'NewPassword@123',
            'new_password_confirmation' => 'NewPassword@123',
        ], [
            'Authorization' => 'Bearer ' . $token,
        ]);

        $response->assertStatus(400);
    }
}

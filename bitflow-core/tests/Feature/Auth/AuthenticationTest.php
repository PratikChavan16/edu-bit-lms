<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RBACSeeder::class);
    }

    public function test_user_can_login_with_valid_credentials(): void
    {
        $user = User::factory()->create([
            'username' => 'testuser',
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
            'status' => 'active',
        ]);

        $response = $this->postJson('/api/auth/login', [
            'username' => 'testuser',
            'password' => 'password123',
            'device_name' => 'test-device',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'user' => [
                        'id',
                        'username',
                        'email',
                        'first_name',
                        'last_name',
                        'full_name',
                        'status',
                        'roles',
                    ],
                    'token',
                ],
            ]);

        $this->assertDatabaseHas('personal_access_tokens', [
            'tokenable_id' => $user->id,
            'tokenable_type' => User::class,
        ]);
    }

    public function test_user_can_login_with_email(): void
    {
        User::factory()->create([
            'username' => 'testuser',
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
            'status' => 'active',
        ]);

        $response = $this->postJson('/api/auth/login', [
            'username' => 'test@example.com', // Using email as username
            'password' => 'password123',
        ]);

        $response->assertStatus(200);
    }

    public function test_login_fails_with_invalid_credentials(): void
    {
        User::factory()->create([
            'username' => 'testuser',
            'password' => Hash::make('password123'),
            'status' => 'active',
        ]);

        $response = $this->postJson('/api/auth/login', [
            'username' => 'testuser',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'error' => 'The provided credentials are incorrect.',
            ]);
    }

    public function test_login_fails_for_inactive_user(): void
    {
        User::factory()->create([
            'username' => 'testuser',
            'password' => Hash::make('password123'),
            'status' => 'inactive',
        ]);

        $response = $this->postJson('/api/auth/login', [
            'username' => 'testuser',
            'password' => 'password123',
        ]);

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'error' => 'Your account is not active. Please contact administrator.',
            ]);
    }

    public function test_login_rate_limiting(): void
    {
        $user = User::factory()->create([
            'username' => 'testuser',
            'password' => Hash::make('password123'),
            'status' => 'active',
        ]);

        // Make 5 failed login attempts
        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/auth/login', [
                'username' => 'testuser',
                'password' => 'wrongpassword',
            ]);
        }

        // 6th attempt should be rate limited
        $response = $this->postJson('/api/auth/login', [
            'username' => 'testuser',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(429)
            ->assertJsonStructure([
                'success',
                'error',
            ]);
    }

    public function test_user_can_logout(): void
    {
        $user = User::factory()->create(['status' => 'active']);
        $token = $user->createToken('test-device')->plainTextToken;

        $response = $this->postJson('/api/auth/logout', [], [
            'Authorization' => 'Bearer ' . $token,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Logged out successfully.',
            ]);

        $this->assertDatabaseMissing('personal_access_tokens', [
            'tokenable_id' => $user->id,
        ]);
    }

    public function test_user_can_logout_from_all_devices(): void
    {
        $user = User::factory()->create(['status' => 'active']);
        
        // Create multiple tokens
        $user->createToken('device-1');
        $user->createToken('device-2');
        $token = $user->createToken('device-3')->plainTextToken;

        $response = $this->postJson('/api/auth/logout-all', [], [
            'Authorization' => 'Bearer ' . $token,
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseMissing('personal_access_tokens', [
            'tokenable_id' => $user->id,
        ]);
    }

    public function test_authenticated_user_can_get_profile(): void
    {
        $user = User::factory()->create(['status' => 'active']);
        $token = $user->createToken('test-device')->plainTextToken;

        $response = $this->getJson('/api/auth/me', [
            'Authorization' => 'Bearer ' . $token,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                ],
            ]);
    }

    public function test_user_can_refresh_token(): void
    {
        $user = User::factory()->create(['status' => 'active']);
        $oldToken = $user->createToken('test-device')->plainTextToken;

        $response = $this->postJson('/api/auth/refresh', [], [
            'Authorization' => 'Bearer ' . $oldToken,
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => ['token'],
            ]);

        // Old token should be revoked
        $newToken = $response->json('data.token');
        $this->assertNotEquals($oldToken, $newToken);
    }

    public function test_user_can_change_password(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('oldpassword123'),
            'status' => 'active',
        ]);
        $token = $user->createToken('test-device')->plainTextToken;

        $response = $this->postJson('/api/auth/change-password', [
            'current_password' => 'oldpassword123',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ], [
            'Authorization' => 'Bearer ' . $token,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Password changed successfully.',
            ]);

        // Verify password was actually changed
        $user->refresh();
        $this->assertTrue(Hash::check('newpassword123', $user->password));
    }

    public function test_change_password_fails_with_wrong_current_password(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('oldpassword123'),
            'status' => 'active',
        ]);
        $token = $user->createToken('test-device')->plainTextToken;

        $response = $this->postJson('/api/auth/change-password', [
            'current_password' => 'wrongpassword',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ], [
            'Authorization' => 'Bearer ' . $token,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['current_password']);
    }

    public function test_user_can_request_password_reset(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'status' => 'active',
        ]);

        Password::shouldReceive('sendResetLink')
            ->once()
            ->andReturn(Password::RESET_LINK_SENT);

        $response = $this->postJson('/api/auth/forgot-password', [
            'email' => 'test@example.com',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Password reset link sent to your email.',
            ]);
    }

    public function test_password_reset_rate_limiting(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
        ]);

        Password::shouldReceive('sendResetLink')
            ->times(3)
            ->andReturn(Password::RESET_LINK_SENT);

        // Make 3 requests
        for ($i = 0; $i < 3; $i++) {
            $this->postJson('/api/auth/forgot-password', [
                'email' => 'test@example.com',
            ]);
        }

        // 4th request should be rate limited
        $response = $this->postJson('/api/auth/forgot-password', [
            'email' => 'test@example.com',
        ]);

        $response->assertStatus(429);
    }

    public function test_unauthenticated_user_cannot_access_protected_routes(): void
    {
        $response = $this->getJson('/api/auth/me');
        $response->assertStatus(401);

        $response = $this->postJson('/api/auth/logout');
        $response->assertStatus(401);

        $response = $this->postJson('/api/auth/refresh');
        $response->assertStatus(401);
    }

    public function test_validation_errors_for_login(): void
    {
        $response = $this->postJson('/api/auth/login', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['username', 'password']);
    }

    public function test_validation_errors_for_change_password(): void
    {
        $user = User::factory()->create(['status' => 'active']);
        $token = $user->createToken('test-device')->plainTextToken;

        $response = $this->postJson('/api/auth/change-password', [
            'password' => 'short',
        ], [
            'Authorization' => 'Bearer ' . $token,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['current_password', 'password']);
    }
}

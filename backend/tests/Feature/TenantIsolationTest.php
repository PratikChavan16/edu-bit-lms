<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\University;
use App\Models\College;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

class TenantIsolationTest extends TestCase
{
    use RefreshDatabase;

    protected University $university1;
    protected University $university2;
    protected User $user1;
    protected User $user2;
    protected College $college1;
    protected College $college2;
    protected Role $role;

    protected function setUp(): void
    {
        parent::setUp();

        // Create two separate universities
        $this->university1 = University::create([
            'name' => 'University One',
            'slug' => 'university-one',
            'domain' => 'one.bitflow.edu',
            'email' => 'admin@one.bitflow.edu',
            'phone' => '+1-555-0001',
            'status' => 'active',
            'storage_quota_gb' => 100,
        ]);

        $this->university2 = University::create([
            'name' => 'University Two',
            'slug' => 'university-two',
            'domain' => 'two.bitflow.edu',
            'email' => 'admin@two.bitflow.edu',
            'phone' => '+1-555-0002',
            'status' => 'active',
            'storage_quota_gb' => 100,
        ]);

        // Create role
        $this->role = Role::create([
            'name' => 'Test Role',
            'slug' => 'test_role',
            'level' => 5,
            'scope' => 'individual',
        ]);

        // Create users for each university
        $this->user1 = User::create([
            'university_id' => $this->university1->id,
            'username' => 'user1',
            'email' => 'user1@one.bitflow.edu',
            'password' => Hash::make('Password@123'),
            'first_name' => 'User',
            'last_name' => 'One',
            'status' => 'active',
            'email_verified_at' => now(),
        ]);
        $this->user1->roles()->attach($this->role->id);

        $this->user2 = User::create([
            'university_id' => $this->university2->id,
            'username' => 'user2',
            'email' => 'user2@two.bitflow.edu',
            'password' => Hash::make('Password@123'),
            'first_name' => 'User',
            'last_name' => 'Two',
            'status' => 'active',
            'email_verified_at' => now(),
        ]);
        $this->user2->roles()->attach($this->role->id);

        // Create colleges for each university
        $this->college1 = College::create([
            'university_id' => $this->university1->id,
            'name' => 'College One',
            'code' => 'COL1',
            'type' => 'government',
            'status' => 'active',
            'capacity' => 1000,
            'current_enrollment' => 500,
        ]);

        $this->college2 = College::create([
            'university_id' => $this->university2->id,
            'name' => 'College Two',
            'code' => 'COL2',
            'type' => 'private',
            'status' => 'active',
            'capacity' => 1500,
            'current_enrollment' => 750,
        ]);
    }

    public function test_user_jwt_contains_university_id(): void
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'user1@one.bitflow.edu',
            'password' => 'Password@123',
        ]);

        $response->assertStatus(200);

        $token = $response->json('data.access_token');
        $this->assertNotEmpty($token);

        // Decode JWT (without verification for testing)
        $parts = explode('.', $token);
        $payload = json_decode(base64_decode(strtr($parts[1], '-_', '+/')), true);

        $this->assertEquals($this->university1->id, $payload['university_id']);
    }

    public function test_user_can_only_see_own_university_colleges(): void
    {
        // Login as user from university 1
        $loginResponse = $this->postJson('/api/v1/auth/login', [
            'email' => 'user1@one.bitflow.edu',
            'password' => 'Password@123',
        ]);

        $token = $loginResponse->json('data.access_token');

        // This test assumes we have a colleges endpoint (to be implemented later)
        // For now, we'll test the model directly

        // Mock the request with tenant context
        request()->merge(['university_id' => $this->university1->id]);

        $colleges = College::all();

        // Should only see colleges from university 1
        $this->assertCount(1, $colleges);
        $this->assertEquals($this->college1->id, $colleges->first()->id);
        $this->assertEquals($this->university1->id, $colleges->first()->university_id);
    }

    public function test_user_cannot_access_other_university_data(): void
    {
        // Mock tenant context for university 1
        request()->merge(['university_id' => $this->university1->id]);

        // Try to find college from university 2
        $college = College::find($this->college2->id);

        // Should return null because of UniversityScope
        $this->assertNull($college);
    }

    public function test_global_scope_filters_queries_automatically(): void
    {
        // Set tenant context to university 1
        request()->merge(['university_id' => $this->university1->id]);

        $users = User::all();
        $colleges = College::all();

        // Should only get data from university 1
        $this->assertCount(1, $users);
        $this->assertCount(1, $colleges);

        $this->assertEquals($this->university1->id, $users->first()->university_id);
        $this->assertEquals($this->university1->id, $colleges->first()->university_id);

        // Change tenant context to university 2
        request()->merge(['university_id' => $this->university2->id]);

        $users = User::all();
        $colleges = College::all();

        // Should only get data from university 2
        $this->assertCount(1, $users);
        $this->assertCount(1, $colleges);

        $this->assertEquals($this->university2->id, $users->first()->university_id);
        $this->assertEquals($this->university2->id, $colleges->first()->university_id);
    }

    public function test_university_scope_can_be_disabled_if_needed(): void
    {
        // Set tenant context
        request()->merge(['university_id' => $this->university1->id]);

        // Get all colleges without global scope
        $allColleges = College::withoutGlobalScopes()->get();

        // Should get colleges from both universities
        $this->assertCount(2, $allColleges);
    }

    public function test_tenant_context_is_set_in_middleware(): void
    {
        $loginResponse = $this->postJson('/api/v1/auth/login', [
            'email' => 'user1@one.bitflow.edu',
            'password' => 'Password@123',
        ]);

        $token = $loginResponse->json('data.access_token');

        // Make request to /me endpoint which uses tenant middleware
        $response = $this->getJson('/api/v1/auth/me', [
            'Authorization' => 'Bearer ' . $token,
        ]);

        $response->assertStatus(200);

        // The fact that we got a successful response means tenant context was set
        // and UniversityScope didn't filter out the user
        $this->assertEquals($this->user1->id, $response->json('data.id'));
    }

    public function test_colleges_relationship_respects_tenant_isolation(): void
    {
        request()->merge(['university_id' => $this->university1->id]);

        $university = University::with('colleges')->find($this->university1->id);

        // Should only have colleges from this university
        $this->assertCount(1, $university->colleges);
        $this->assertEquals($this->college1->id, $university->colleges->first()->id);
    }

    public function test_users_relationship_respects_tenant_isolation(): void
    {
        request()->merge(['university_id' => $this->university1->id]);

        $university = University::with('users')->find($this->university1->id);

        // Should only have users from this university
        $this->assertCount(1, $university->users);
        $this->assertEquals($this->user1->id, $university->users->first()->id);
    }
}

<?php

namespace Tests\Feature\Library;

use App\Models\College;
use App\Models\Faculty;
use App\Models\LibraryResource;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LibraryResourcesTest extends TestCase
{
    use RefreshDatabase;

    protected User $adminUser;
    protected College $college;
    protected string $token;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->seed(\Database\Seeders\RBACSeeder::class);
        
        $this->college = College::factory()->create();
        
        $this->adminUser = User::factory()->create([
            'status' => 'active',
        ]);
        
        // Assign college admin role
        $adminRole = \App\Models\Role::where('name', 'college-admin')->first();
        $this->adminUser->roles()->attach($adminRole->id, [
            'college_id' => $this->college->id,
        ]);
        
        $this->token = $this->adminUser->createToken('test-device')->plainTextToken;
    }

    public function test_admin_can_list_resources(): void
    {
        LibraryResource::factory()->count(5)->create([
            'college_id' => $this->college->id,
            'uploaded_by' => $this->adminUser->id,
        ]);

        $response = $this->getJson("/api/admin/library/resources?college_id={$this->college->id}", [
            'Authorization' => 'Bearer ' . $this->token,
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'data' => [
                        '*' => [
                            'id',
                            'title',
                            'type',
                            'file_url',
                        ],
                    ],
                ],
            ]);
    }

    public function test_admin_can_create_resource(): void
    {
        $data = [
            'title' => 'Introduction to Programming',
            'type' => 'notes',
            'subject' => 'Computer Science',
            'course' => 'BSc Computer Science',
            'year' => 1,
            'file_url' => 'https://example.com/intro-to-programming.pdf',
            'description' => 'Basic programming concepts',
        ];

        $response = $this->postJson("/api/admin/library/resources?college_id={$this->college->id}", $data, [
            'Authorization' => 'Bearer ' . $this->token,
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id',
                    'title',
                    'type',
                ],
            ]);

        $this->assertDatabaseHas('library_resources', [
            'title' => 'Introduction to Programming',
            'college_id' => $this->college->id,
        ]);
    }

    public function test_admin_can_update_resource(): void
    {
        $resource = LibraryResource::factory()->create([
            'college_id' => $this->college->id,
            'uploaded_by' => $this->adminUser->id,
            'title' => 'Old Title',
        ]);

        $data = [
            'title' => 'Updated Title',
            'description' => 'Updated description',
        ];

        $response = $this->patchJson("/api/admin/library/resources/{$resource->id}?college_id={$this->college->id}", $data, [
            'Authorization' => 'Bearer ' . $this->token,
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('library_resources', [
            'id' => $resource->id,
            'title' => 'Updated Title',
        ]);
    }

    public function test_admin_can_delete_resource(): void
    {
        $resource = LibraryResource::factory()->create([
            'college_id' => $this->college->id,
            'uploaded_by' => $this->adminUser->id,
        ]);

        $response = $this->deleteJson("/api/admin/library/resources/{$resource->id}?college_id={$this->college->id}", [], [
            'Authorization' => 'Bearer ' . $this->token,
        ]);

        $response->assertStatus(200);

        $this->assertSoftDeleted('library_resources', [
            'id' => $resource->id,
        ]);
    }

    public function test_admin_can_approve_resource(): void
    {
        $resource = LibraryResource::factory()->create([
            'college_id' => $this->college->id,
            'uploaded_by' => $this->adminUser->id,
            'approval_status' => 'pending',
        ]);

        $response = $this->patchJson("/api/admin/library/resources/{$resource->id}/approve?college_id={$this->college->id}", [
            'approval_status' => 'approved',
        ], [
            'Authorization' => 'Bearer ' . $this->token,
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('library_resources', [
            'id' => $resource->id,
            'approval_status' => 'approved',
            'approved_by' => $this->adminUser->id,
        ]);
    }

    public function test_admin_can_filter_resources_by_type(): void
    {
        LibraryResource::factory()->count(3)->create([
            'college_id' => $this->college->id,
            'type' => 'notes',
        ]);
        
        LibraryResource::factory()->count(2)->create([
            'college_id' => $this->college->id,
            'type' => 'video',
        ]);

        $response = $this->getJson("/api/admin/library/resources?college_id={$this->college->id}&type=notes", [
            'Authorization' => 'Bearer ' . $this->token,
        ]);

        $response->assertStatus(200);
        $this->assertCount(3, $response->json('data.data'));
    }

    public function test_requires_authentication(): void
    {
        $response = $this->getJson("/api/admin/library/resources?college_id={$this->college->id}");

        $response->assertStatus(401);
    }

    public function test_validates_required_fields_on_create(): void
    {
        $response = $this->postJson("/api/admin/library/resources?college_id={$this->college->id}", [], [
            'Authorization' => 'Bearer ' . $this->token,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'type']);
    }
}

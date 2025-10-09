<?php

namespace Tests\Feature\Documents;

use App\Models\College;
use App\Models\Document;
use App\Models\DocumentFolder;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DocumentsTest extends TestCase
{
    use RefreshDatabase;

    protected User $adminUser;
    protected College $college;
    protected DocumentFolder $folder;
    protected string $token;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->seed(\Database\Seeders\RBACSeeder::class);
        
        $this->college = College::factory()->create();
        
        $this->adminUser = User::factory()->create(['status' => 'active']);
        
        $adminRole = \App\Models\Role::where('name', 'college-admin')->first();
        $this->adminUser->roles()->attach($adminRole->id, [
            'college_id' => $this->college->id,
        ]);
        
        $this->folder = DocumentFolder::factory()->create([
            'college_id' => $this->college->id,
            'name' => 'Policies',
        ]);
        
        $this->token = $this->adminUser->createToken('test-device')->plainTextToken;
    }

    public function test_admin_can_list_documents(): void
    {
        Document::factory()->count(5)->create([
            'college_id' => $this->college->id,
            'folder_id' => $this->folder->id,
        ]);

        $response = $this->getJson("/api/admin/documents?college_id={$this->college->id}", [
            'Authorization' => 'Bearer ' . $this->token,
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'data' => [
                        '*' => ['id', 'name', 'file_url'],
                    ],
                ],
            ]);
    }

    public function test_admin_can_create_document(): void
    {
        $data = [
            'name' => 'Student Handbook',
            'folder_id' => $this->folder->id,
            'file_url' => 'https://example.com/handbook.pdf',
            'description' => 'Official student handbook',
            'visibility' => 'public',
        ];

        $response = $this->postJson("/api/admin/documents?college_id={$this->college->id}", $data, [
            'Authorization' => 'Bearer ' . $this->token,
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('documents', [
            'name' => 'Student Handbook',
            'college_id' => $this->college->id,
        ]);
    }

    public function test_admin_can_update_document(): void
    {
        $document = Document::factory()->create([
            'college_id' => $this->college->id,
            'folder_id' => $this->folder->id,
            'name' => 'Old Name',
        ]);

        $data = ['name' => 'Updated Name'];

        $response = $this->patchJson("/api/admin/documents/{$document->id}?college_id={$this->college->id}", $data, [
            'Authorization' => 'Bearer ' . $this->token,
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('documents', [
            'id' => $document->id,
            'name' => 'Updated Name',
        ]);
    }

    public function test_admin_can_delete_document(): void
    {
        $document = Document::factory()->create([
            'college_id' => $this->college->id,
            'folder_id' => $this->folder->id,
        ]);

        $response = $this->deleteJson("/api/admin/documents/{$document->id}?college_id={$this->college->id}", [], [
            'Authorization' => 'Bearer ' . $this->token,
        ]);

        $response->assertStatus(200);

        $this->assertSoftDeleted('documents', [
            'id' => $document->id,
        ]);
    }

    public function test_admin_can_create_folder(): void
    {
        $data = [
            'name' => 'Exam Papers',
            'description' => 'Previous year exam papers',
        ];

        $response = $this->postJson("/api/admin/documents/folders?college_id={$this->college->id}", $data, [
            'Authorization' => 'Bearer ' . $this->token,
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('document_folders', [
            'name' => 'Exam Papers',
            'college_id' => $this->college->id,
        ]);
    }

    public function test_student_can_view_public_documents(): void
    {
        $studentUser = User::factory()->create(['status' => 'active']);
        $studentRole = \App\Models\Role::where('name', 'student')->first();
        $studentUser->roles()->attach($studentRole->id, [
            'college_id' => $this->college->id,
        ]);
        $studentToken = $studentUser->createToken('test-device')->plainTextToken;

        Document::factory()->create([
            'college_id' => $this->college->id,
            'folder_id' => $this->folder->id,
            'visibility' => 'public',
        ]);

        $response = $this->getJson('/api/learner/documents', [
            'Authorization' => 'Bearer ' . $studentToken,
        ]);

        $response->assertStatus(200);
    }

    public function test_requires_authentication(): void
    {
        $response = $this->getJson("/api/admin/documents?college_id={$this->college->id}");

        $response->assertStatus(401);
    }

    public function test_validates_required_fields(): void
    {
        $response = $this->postJson("/api/admin/documents?college_id={$this->college->id}", [], [
            'Authorization' => 'Bearer ' . $this->token,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'file_url']);
    }
}

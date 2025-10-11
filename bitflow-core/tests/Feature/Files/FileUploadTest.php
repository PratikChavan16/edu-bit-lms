<?php

namespace Tests\Feature\Files;

use App\Models\User;
use App\Models\Student;
use App\Models\College;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class FileUploadTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected string $token;

    protected function setUp(): void
    {
        parent::setUp();
        
        Storage::fake('local');
        
        $this->seed(\Database\Seeders\RBACSeeder::class);
        
        $this->user = User::factory()->create(['status' => 'active']);
        $this->token = $this->user->createToken('test-device')->plainTextToken;
    }

    public function test_user_can_upload_single_file(): void
    {
        $file = UploadedFile::fake()->create('document.pdf', 1024); // 1MB

        $response = $this->postJson('/api/files/upload', [
            'file' => $file,
            'folder' => 'documents',
            'visibility' => 'private',
        ], [
            'Authorization' => 'Bearer ' . $this->token,
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id',
                    'user_id',
                    'path',
                    'original_name',
                    'filename',
                    'mime_type',
                    'size',
                    'folder',
                    'visibility',
                ],
            ]);

        $this->assertEquals('document.pdf', $response->json('data.original_name'));
    }

    public function test_user_can_upload_multiple_files(): void
    {
        if (!extension_loaded('gd')) {
            $this->markTestSkipped('GD extension is not installed. Skipping image upload test.');
        }

        $files = [
            UploadedFile::fake()->create('doc1.pdf', 500),
            UploadedFile::fake()->create('doc2.pdf', 500),
            UploadedFile::fake()->image('image.jpg'),
        ];

        $response = $this->postJson('/api/files/upload-multiple', [
            'files' => $files,
            'folder' => 'documents',
        ], [
            'Authorization' => 'Bearer ' . $this->token,
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => [
                        'id',
                        'original_name',
                        'size',
                    ],
                ],
                'errors',
            ]);

        $this->assertCount(3, $response->json('data'));
    }

    public function test_upload_validates_file_size(): void
    {
        // Create a file larger than 100MB (will be rejected)
        $file = UploadedFile::fake()->create('large.pdf', 102401); // 100MB + 1KB

        $response = $this->postJson('/api/files/upload', [
            'file' => $file,
        ], [
            'Authorization' => 'Bearer ' . $this->token,
        ]);

        $response->assertStatus(422);
    }

    public function test_upload_requires_authentication(): void
    {
        $file = UploadedFile::fake()->create('document.pdf', 100);

        $response = $this->postJson('/api/files/upload', [
            'file' => $file,
        ]);

        $response->assertStatus(401);
    }

    public function test_user_can_get_storage_usage(): void
    {
        // Create student with college
        $college = College::factory()->create([
            'student_storage_quota_mb' => 2048, // 2GB
        ]);
        
        Student::factory()->create([
            'user_id' => $this->user->id,
            'college_id' => $college->id,
        ]);

        $response = $this->getJson('/api/files/storage/usage', [
            'Authorization' => 'Bearer ' . $this->token,
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'user_id',
                    'used_bytes',
                    'used_mb',
                    'quota_bytes',
                    'quota_mb',
                    'available_bytes',
                    'percentage_used',
                    'file_count',
                ],
            ]);

        $this->assertEquals(2048, $response->json('data.quota_mb'));
    }

    public function test_upload_validates_required_fields(): void
    {
        $response = $this->postJson('/api/files/upload', [], [
            'Authorization' => 'Bearer ' . $this->token,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['file']);
    }

    public function test_multiple_upload_validates_file_array(): void
    {
        $response = $this->postJson('/api/files/upload-multiple', [
            'files' => 'not-an-array',
        ], [
            'Authorization' => 'Bearer ' . $this->token,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['files']);
    }

    public function test_user_can_upload_image(): void
    {
        if (!extension_loaded('gd')) {
            $this->markTestSkipped('GD extension is not installed. Skipping image upload test.');
        }

        $file = UploadedFile::fake()->image('avatar.jpg', 800, 600);

        $response = $this->postJson('/api/files/upload', [
            'file' => $file,
            'folder' => 'avatars',
            'visibility' => 'public',
        ], [
            'Authorization' => 'Bearer ' . $this->token,
        ]);

        $response->assertStatus(201);
        $this->assertEquals('image/jpeg', $response->json('data.mime_type'));
    }

    public function test_validates_maximum_files_in_batch(): void
    {
        $files = [];
        for ($i = 0; $i < 11; $i++) { // More than 10
            $files[] = UploadedFile::fake()->create("doc{$i}.pdf", 100);
        }

        $response = $this->postJson('/api/files/upload-multiple', [
            'files' => $files,
        ], [
            'Authorization' => 'Bearer ' . $this->token,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['files']);
    }
}

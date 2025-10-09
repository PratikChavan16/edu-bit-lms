<?php

namespace Database\Factories;

use App\Models\College;
use App\Models\Document;
use App\Models\DocumentFolder;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Document>
 */
class DocumentFactory extends Factory
{
    protected $model = Document::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        $fileName = fake()->unique()->lexify('document-????') . '.' . fake()->randomElement([
            'pdf',
            'docx',
            'xlsx',
            'pptx',
        ]);

        return [
            'college_id' => College::factory(),
            'folder_id' => DocumentFolder::factory(),
            'student_id' => null,
            'name' => fake()->sentence(3),
            'description' => fake()->optional()->sentence(),
            'file_path' => 'documents/' . fake()->year() . '/' . $fileName,
            'file_url' => fake()->optional()->url(),
            'file_size_bytes' => fake()->numberBetween(1024, 52 * 1024 * 1024),
            'mime_type' => fake()->randomElement([
                'application/pdf',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            ]),
            'visibility' => 'private',
            'uploaded_by' => User::factory(),
            'verification_status' => 'pending',
            'verified_by' => null,
            'verified_at' => null,
            'rejection_reason' => null,
        ];
    }

    public function public(): static
    {
        return $this->state(fn () => [
            'visibility' => 'public',
        ]);
    }

    public function forStudent(string $studentId): static
    {
        return $this->state(fn () => [
            'student_id' => $studentId,
        ]);
    }

    public function verified(User $verifier): static
    {
        return $this->state(fn () => [
            'verification_status' => 'verified',
            'verified_by' => $verifier->id,
            'verified_at' => now(),
        ]);
    }
}

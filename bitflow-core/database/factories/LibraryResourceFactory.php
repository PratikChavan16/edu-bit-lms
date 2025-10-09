<?php

namespace Database\Factories;

use App\Models\College;
use App\Models\LibraryResource;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\LibraryResource>
 */
class LibraryResourceFactory extends Factory
{
    protected $model = LibraryResource::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = ['book', 'notes', 'video', 'assignment', 'question_paper', 'reference'];
        $type = fake()->randomElement($types);

        return [
            'college_id' => College::factory(),
            'title' => fake()->sentence(4),
            'description' => fake()->paragraph(2),
            'type' => $type,
            'subject' => fake()->randomElement([
                'Computer Science',
                'Mathematics',
                'Physics',
                'Chemistry',
                'English',
                'Data Structures',
            ]),
            'course' => fake()->randomElement([
                'BSc Computer Science',
                'BCA',
                'MSc IT',
                'BTech CS',
            ]),
            'year' => fake()->randomElement([1, 2, 3, 4]),
            'file_path' => 'library/' . fake()->uuid() . '.pdf',
            'file_url' => fake()->url() . '/resource.pdf',
            'file_size_bytes' => fake()->numberBetween(100000, 50000000),
            'mime_type' => 'application/pdf',
            'tags' => fake()->words(3),
            'uploaded_by' => User::factory(),
            'approval_status' => fake()->randomElement(['pending', 'approved', 'rejected']),
            'approved_by' => null,
            'approved_at' => null,
        ];
    }

    /**
     * Indicate that the resource is approved.
     */
    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'approval_status' => 'approved',
            'approved_by' => User::factory(),
            'approved_at' => now(),
        ]);
    }

    /**
     * Indicate that the resource is pending approval.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'approval_status' => 'pending',
            'approved_by' => null,
            'approved_at' => null,
        ]);
    }

    /**
     * Set a specific type.
     */
    public function ofType(string $type): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => $type,
        ]);
    }

    /**
     * Set for a specific college.
     */
    public function forCollege(College $college): static
    {
        return $this->state(fn (array $attributes) => [
            'college_id' => $college->id,
        ]);
    }
}

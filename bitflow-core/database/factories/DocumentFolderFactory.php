<?php

namespace Database\Factories;

use App\Models\College;
use App\Models\DocumentFolder;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DocumentFolder>
 */
class DocumentFolderFactory extends Factory
{
    protected $model = DocumentFolder::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'college_id' => College::factory(),
            'name' => fake()->words(2, true),
            'description' => fake()->optional()->sentence(),
            'owner_type' => 'admin',
            'owner_id' => null,
            'required_file_types' => fake()->optional()->randomElements([
                'pdf',
                'docx',
                'xlsx',
                'png',
                'jpg',
            ], fake()->numberBetween(1, 3)),
            'due_date' => fake()->optional()->dateTimeBetween('now', '+6 months'),
            'is_required' => fake()->boolean(),
        ];
    }

    public function required(): static
    {
        return $this->state(fn () => [
            'is_required' => true,
        ]);
    }

    public function forOwner(string $ownerId): static
    {
        return $this->state(fn () => [
            'owner_type' => 'student',
            'owner_id' => $ownerId,
        ]);
    }
}

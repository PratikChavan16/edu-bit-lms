<?php

namespace Database\Factories;

use App\Models\College;
use App\Models\University;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\College>
 */
class CollegeFactory extends Factory
{
    protected $model = College::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->company() . ' College';
        return [
            'name' => $name,
            'slug' => \Illuminate\Support\Str::slug($name),
            'university_id' => University::factory()->live(),
            'type' => $this->faker->randomElement(['university', 'college', 'school']),
            'code' => 'college_' . strtoupper($this->faker->unique()->lexify('???')),
            'status' => 'active',
            'branding' => json_encode([
                'logo_url' => $this->faker->imageUrl(150, 150),
                'primary_color' => $this->faker->hexColor(),
            ]),
            'motto' => $this->faker->sentence(4),
            'storage_quota_gb' => $this->faker->numberBetween(20, 200),
            'student_storage_quota_mb' => $this->faker->numberBetween(512, 2048),
        ];
    }

    /**
     * Indicate that the college is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'inactive',
        ]);
    }

    /**
     * Indicate that the college is suspended.
     */
    public function suspended(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'suspended',
        ]);
    }

    /**
     * Associate the college with a specific university.
     */
    public function forUniversity(University $university): static
    {
        return $this->state(fn (array $attributes) => [
            'university_id' => $university->id,
        ]);
    }
}

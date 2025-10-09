<?php

namespace Database\Factories;

use App\Models\University;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\University>
 */
class UniversityFactory extends Factory
{
    protected $model = University::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->words(3, true) . ' University';
        return [
            'name' => $name,
            'slug' => \Illuminate\Support\Str::slug($name),
            'domain' => $this->faker->unique()->domainName(),
            'status' => $this->faker->randomElement(['live', 'staging']),
            'timezone' => $this->faker->randomElement(['Asia/Kolkata', 'Asia/Mumbai', 'Asia/Delhi']),
            'branding' => json_encode([
                'logo_url' => $this->faker->imageUrl(200, 200),
                'primary_color' => $this->faker->hexColor(),
            ]),
            'storage_quota_gb' => $this->faker->numberBetween(50, 500),
            'storage_used_mb' => $this->faker->numberBetween(10, 1000),
        ];
    }

    /**
     * Indicate that the university is suspended.
     */
    public function suspended(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'suspended',
        ]);
    }

    /**
     * Indicate that the university is in staging.
     */
    public function staging(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'staging',
        ]);
    }

    /**
     * Indicate that the university is live.
     */
    public function live(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'live',
        ]);
    }
}

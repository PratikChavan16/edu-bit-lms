<?php

namespace Database\Factories;

use App\Models\Announcement;
use App\Models\College;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Announcement>
 */
class AnnouncementFactory extends Factory
{
    protected $model = Announcement::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'college_id' => College::factory(),
            'title' => fake()->sentence(),
            'content' => fake()->paragraphs(3, true),
            'type' => fake()->randomElement(['general', 'academic', 'event', 'holiday', 'emergency']),
            'priority' => fake()->randomElement(['low', 'medium', 'high']),
            'target_audience' => fake()->randomElement([
                ['all'],
                ['students'],
                ['faculty'],
                ['parents'],
                ['staff'],
                ['students', 'parents']
            ]),
            'course_id' => null,
            'year' => null,
            'status' => 'draft',
            'published_at' => null,
            'expires_at' => fake()->optional(0.3)->dateTimeBetween('+1 week', '+1 month'),
            'published_by' => User::factory(),
        ];
    }

    /**
     * Indicate that the announcement is published.
     */
    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
            'published_at' => now(),
        ]);
    }

    /**
     * Indicate that the announcement is archived.
     */
    public function archived(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'archived',
        ]);
    }

    /**
     * Indicate that the announcement is for students only.
     */
    public function forStudents(): static
    {
        return $this->state(fn (array $attributes) => [
            'target_audience' => ['students'],
        ]);
    }

    /**
     * Indicate that the announcement is high priority.
     */
    public function highPriority(): static
    {
        return $this->state(fn (array $attributes) => [
            'priority' => 'high',
        ]);
    }

    /**
     * Indicate that the announcement is expired.
     */
    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
            'published_at' => now()->subDays(10),
            'expires_at' => now()->subDay(),
        ]);
    }
}

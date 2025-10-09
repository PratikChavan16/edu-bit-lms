<?php

namespace Database\Factories;

use App\Models\Assessment;
use App\Models\College;
use App\Models\Faculty;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Assessment>
 */
class AssessmentFactory extends Factory
{
    protected $model = Assessment::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startTime = $this->faker->dateTimeBetween('+1 day', '+30 days');
        $duration = $this->faker->numberBetween(30, 180);
        $endTime = clone $startTime;
        $endTime->modify("+{$duration} minutes");

        return [
            'college_id' => College::factory(),
            'faculty_id' => Faculty::factory(),
            'title' => $this->faker->sentence(4),
            'description' => $this->faker->paragraph(3),
            'type' => $this->faker->randomElement(['mcq', 'saq', 'laq', 'practical', 'project']),
            'subject' => $this->faker->randomElement([
                'Mathematics',
                'Physics',
                'Chemistry',
                'Computer Science',
                'English',
                'History',
                'Biology',
                'Economics',
            ]),
            'course' => $this->faker->randomElement([
                'Computer Science Engineering',
                'Information Technology',
                'Electronics and Communication',
                'Mechanical Engineering',
                'Civil Engineering',
                'Electrical Engineering',
            ]),
            'year' => $this->faker->numberBetween(1, 4),
            'total_marks' => $this->faker->randomElement([50, 75, 100, 150, 200]),
            'passing_marks' => function (array $attributes) {
                return (int) ($attributes['total_marks'] * 0.4);
            },
            'duration_minutes' => $duration,
            'starts_at' => $startTime,
            'ends_at' => $endTime,
            'submission_type' => $this->faker->randomElement(['typed', 'upload', 'both']),
            'status' => $this->faker->randomElement(['draft', 'scheduled', 'active']),
        ];
    }

    /**
     * Indicate that the assessment is scheduled.
     */
    public function scheduled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'scheduled',
        ]);
    }

    /**
     * Indicate that the assessment is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
        ]);
    }

    /**
     * Indicate that the assessment is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'ends_at' => $this->faker->dateTimeBetween('-30 days', 'now'),
        ]);
    }

    /**
     * Set the assessment for a specific college and faculty.
     */
    public function forCollegeAndFaculty(College $college, Faculty $faculty): static
    {
        return $this->state(fn (array $attributes) => [
            'college_id' => $college->id,
            'faculty_id' => $faculty->id,
        ]);
    }
}
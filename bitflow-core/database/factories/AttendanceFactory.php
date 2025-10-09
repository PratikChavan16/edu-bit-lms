<?php

namespace Database\Factories;

use App\Models\Attendance;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Faculty;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Attendance>
 */
class AttendanceFactory extends Factory
{
    protected $model = Attendance::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'student_id' => Student::factory(),
            'subject_id' => Subject::factory(),
            'faculty_id' => Faculty::factory(),
            'date' => fake()->dateTimeBetween('-3 months', 'now'),
            'status' => fake()->randomElement(['present', 'absent', 'late', 'excused']),
            'marked_at' => now(),
            'marked_by' => Faculty::factory(),
            'remarks' => fake()->optional(0.2)->sentence(),
        ];
    }

    /**
     * Indicate that the student is present.
     */
    public function present(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'present',
        ]);
    }

    /**
     * Indicate that the student is absent.
     */
    public function absent(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'absent',
        ]);
    }

    /**
     * Indicate that the student is late.
     */
    public function late(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'late',
            'remarks' => 'Arrived ' . fake()->numberBetween(5, 30) . ' minutes late',
        ]);
    }

    /**
     * Indicate that the absence is excused.
     */
    public function excused(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'excused',
            'remarks' => fake()->randomElement([
                'Medical leave',
                'Family emergency',
                'Official college event',
                'Sports competition'
            ]),
        ]);
    }

    /**
     * Indicate attendance for a specific date.
     */
    public function onDate(string $date): static
    {
        return $this->state(fn (array $attributes) => [
            'date' => $date,
        ]);
    }
}

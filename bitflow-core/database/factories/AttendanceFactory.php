<?php

namespace Database\Factories;

use App\Models\Attendance;
use App\Models\Student;
use App\Models\TimetableBlock;
use App\Models\User;
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
        // Try to use existing records to avoid constraint violations
        $student = Student::inRandomOrder()->first();
        $timetableBlock = TimetableBlock::inRandomOrder()->first();
        $marker = User::inRandomOrder()->first();

        // Fall back to creating new records if none exist
        if (!$student) {
            $student = Student::factory()->create();
        }
        if (!$timetableBlock) {
            $timetableBlock = TimetableBlock::factory()->create();
        }
        if (!$marker) {
            $marker = User::factory()->create();
        }

        return [
            'student_id' => $student->id,
            'timetable_block_id' => $timetableBlock->id,
            'date' => fake()->dateTimeBetween('-30 days', 'now')->format('Y-m-d'),
            'status' => fake()->randomElement(['present', 'absent', 'late', 'excused']),
            'marked_by' => $marker->id,
            'notes' => fake()->optional(0.3)->sentence(),
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
            'notes' => 'Arrived ' . fake()->numberBetween(5, 30) . ' minutes late',
        ]);
    }

    /**
     * Indicate that the absence is excused.
     */
    public function excused(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'excused',
            'notes' => fake()->randomElement([
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

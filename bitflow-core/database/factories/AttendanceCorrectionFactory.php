<?php

namespace Database\Factories;

use App\Models\Attendance;
use App\Models\AttendanceCorrection;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AttendanceCorrection>
 */
class AttendanceCorrectionFactory extends Factory
{
    protected $model = AttendanceCorrection::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Try to use existing records
        $attendance = Attendance::inRandomOrder()->first();
        $requester = User::inRandomOrder()->first();

        // Fall back to creating new records if none exist
        if (!$attendance) {
            $attendance = Attendance::factory()->create();
        }
        if (!$requester) {
            $requester = User::factory()->create();
        }

        return [
            'attendance_id' => $attendance->id,
            'original_status' => fake()->randomElement(['present', 'absent', 'late', 'excused']),
            'requested_status' => fake()->randomElement(['present', 'absent', 'late', 'excused']),
            'reason' => fake()->sentence(),
            'requested_by' => $requester->id,
            'status' => 'pending',
            'reviewed_by' => null,
            'review_notes' => null,
            'reviewed_at' => null,
        ];
    }

    /**
     * Indicate that the correction is approved.
     */
    public function approved(): static
    {
        return $this->state(function (array $attributes) {
            $reviewer = User::inRandomOrder()->first() ?? User::factory()->create();
            
            return [
                'status' => 'approved',
                'reviewed_by' => $reviewer->id,
                'review_notes' => 'Approved by admin',
                'reviewed_at' => now(),
            ];
        });
    }

    /**
     * Indicate that the correction is rejected.
     */
    public function rejected(): static
    {
        return $this->state(function (array $attributes) {
            $reviewer = User::inRandomOrder()->first() ?? User::factory()->create();
            
            return [
                'status' => 'rejected',
                'reviewed_by' => $reviewer->id,
                'review_notes' => fake()->sentence(),
                'reviewed_at' => now(),
            ];
        });
    }
}

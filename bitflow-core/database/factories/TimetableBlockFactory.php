<?php

namespace Database\Factories;

use App\Models\TimetableBlock;
use App\Models\College;
use App\Models\Faculty;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TimetableBlock>
 */
class TimetableBlockFactory extends Factory
{
    protected $model = TimetableBlock::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startTime = fake()->time('H:i:s', '16:00:00');
        $endTime = date('H:i:s', strtotime($startTime) + 3600); // 1 hour duration
        
        return [
            'college_id' => College::factory(),
            'subject' => fake()->randomElement([
                'Data Structures',
                'Algorithms',
                'Database Management',
                'Web Development',
                'Operating Systems',
                'Computer Networks',
            ]),
            'course' => fake()->randomElement([
                'BSc Computer Science',
                'BCA',
                'MSc IT',
                'BTech CS',
            ]),
            'year' => fake()->randomElement([1, 2, 3, 4]),
            'section' => fake()->randomElement(['A', 'B', 'C', null]),
            'faculty_id' => Faculty::factory(),
            'day_of_week' => fake()->randomElement(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']),
            'start_time' => $startTime,
            'end_time' => $endTime,
            'location' => 'Room ' . fake()->numberBetween(101, 505),
            'type' => fake()->randomElement(['lecture', 'lab', 'tutorial', 'practical']),
            'effective_from' => now()->startOfMonth(),
            'effective_to' => now()->endOfMonth()->addMonths(3),
        ];
    }

    /**
     * Indicate that the timetable block is a lecture.
     */
    public function lecture(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'lecture',
        ]);
    }

    /**
     * Indicate that the timetable block is a lab session.
     */
    public function lab(): static
    {
        return $this->state(function (array $attributes) {
            $startTime = $attributes['start_time'];
            $endTime = date('H:i:s', strtotime($startTime) + 7200); // 2 hours for lab
            
            return [
                'type' => 'lab',
                'end_time' => $endTime,
            ];
        });
    }

    /**
     * Indicate that the timetable block is on Monday.
     */
    public function monday(): static
    {
        return $this->state(fn (array $attributes) => [
            'day_of_week' => 'monday',
        ]);
    }
    
    /**
     * Set specific course and year.
     */
    public function forCourseYear(string $course, int $year): static
    {
        return $this->state(fn (array $attributes) => [
            'course' => $course,
            'year' => $year,
        ]);
    }
}

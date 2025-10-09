<?php

namespace Database\Factories;

use App\Models\FeeStructure;
use App\Models\College;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FeeStructure>
 */
class FeeStructureFactory extends Factory
{
    protected $model = FeeStructure::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'college_id' => College::factory(),
            'course' => fake()->randomElement(['BSc Computer Science', 'BCA', 'MSc IT', 'BTech CS']),
            'year' => fake()->randomElement([1, 2, 3, 4]),
            'component_name' => fake()->randomElement(['Tuition Fee', 'Lab Fee', 'Library Fee', 'Sports Fee', 'Exam Fee', 'Development Fee']),
            'amount' => fake()->randomFloat(2, 5000, 100000),
            'frequency' => fake()->randomElement(['annual', 'semester', 'monthly']),
            'effective_from' => now()->startOfYear(),
            'effective_to' => now()->endOfYear(),
        ];
    }

    /**
     * Set for a specific course and year.
     */
    public function forCourseYear(string $course, int $year): static
    {
        return $this->state(fn (array $attributes) => [
            'course' => $course,
            'year' => $year,
            'installment_plan' => [
                ['installment_number' => 1, 'percentage' => 40, 'due_date' => now()->addMonth()],
                ['installment_number' => 2, 'percentage' => 30, 'due_date' => now()->addMonths(2)],
                ['installment_number' => 3, 'percentage' => 30, 'due_date' => now()->addMonths(3)],
            ],
        ]);
    }

    /**
     * Indicate that the fee structure is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}

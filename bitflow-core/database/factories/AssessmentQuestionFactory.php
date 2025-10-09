<?php

namespace Database\Factories;

use App\Models\AssessmentQuestion;
use App\Models\Assessment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AssessmentQuestion>
 */
class AssessmentQuestionFactory extends Factory
{
    protected $model = AssessmentQuestion::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $hasMcqOptions = fake()->boolean(70); // 70% chance of MCQ
        
        $options = $hasMcqOptions ? [
            'A',
            'B',
            'C',
            'D',
        ] : null;

        $correctAnswer = $hasMcqOptions ? 'A' : null;

        return [
            'assessment_id' => Assessment::factory(),
            'question_number' => fake()->numberBetween(1, 50),
            'question_text' => fake()->sentence() . '?',
            'options' => $options,
            'correct_answer' => $correctAnswer,
            'marks' => fake()->numberBetween(1, 10),
        ];
    }

    /**
     * Indicate that the question is MCQ type.
     */
    public function mcq(): static
    {
        return $this->state(fn (array $attributes) => [
            'options' => ['A', 'B', 'C', 'D'],
            'correct_answer' => 'A',
        ]);
    }

    /**
     * Indicate that the question is subjective (no options).
     */
    public function subjective(): static
    {
        return $this->state(fn (array $attributes) => [
            'options' => null,
            'correct_answer' => null,
            'marks' => fake()->numberBetween(5, 20),
        ]);
    }
    
    /**
     * Set question number.
     */
    public function number(int $number): static
    {
        return $this->state(fn (array $attributes) => [
            'question_number' => $number,
        ]);
    }
}

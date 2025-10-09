<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\LibraryCategory>
 */
class LibraryCategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = [
            ['name' => 'Computer Science', 'code' => 'CS'],
            ['name' => 'Information Technology', 'code' => 'IT'],
            ['name' => 'Engineering', 'code' => 'ENG'],
            ['name' => 'Mathematics', 'code' => 'MATH'],
            ['name' => 'Physics', 'code' => 'PHY'],
            ['name' => 'Chemistry', 'code' => 'CHEM'],
            ['name' => 'Business Management', 'code' => 'BM'],
            ['name' => 'Literature', 'code' => 'LIT'],
            ['name' => 'General Knowledge', 'code' => 'GK'],
            ['name' => 'Reference Books', 'code' => 'REF'],
        ];

        $category = $this->faker->randomElement($categories);

        return [
            'name' => $category['name'],
            'code' => $category['code'] . $this->faker->unique()->numberBetween(1, 999),
            'description' => $this->faker->paragraph(2),
            'is_active' => true,
        ];
    }

    /**
     * Indicate that the category is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}

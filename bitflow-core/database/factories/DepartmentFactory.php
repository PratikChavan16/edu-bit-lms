<?php

namespace Database\Factories;

use App\Models\Department;
use App\Models\College;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Department>
 */
class DepartmentFactory extends Factory
{
    protected $model = Department::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $departments = [
            ['name' => 'Computer Science', 'code' => 'CSE'],
            ['name' => 'Information Technology', 'code' => 'IT'],
            ['name' => 'Electronics and Communication', 'code' => 'ECE'],
            ['name' => 'Mechanical Engineering', 'code' => 'MECH'],
            ['name' => 'Civil Engineering', 'code' => 'CIVIL'],
            ['name' => 'Electrical Engineering', 'code' => 'EEE'],
            ['name' => 'Mathematics', 'code' => 'MATH'],
            ['name' => 'Physics', 'code' => 'PHY'],
            ['name' => 'Chemistry', 'code' => 'CHEM'],
        ];

        $department = $this->faker->randomElement($departments);

        return [
            'name' => $department['name'],
            'code' => $department['code'],
            'college_id' => College::factory(),
            'type' => $this->faker->randomElement(['academic', 'administrative', 'support']),
            'status' => $this->faker->randomElement(['active', 'inactive']),
        ];
    }

    /**
     * Indicate that the department is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'inactive',
        ]);
    }

    /**
     * Indicate that the department is administrative.
     */
    public function administrative(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'administrative',
        ]);
    }

    /**
     * Associate the department with a specific college.
     */
    public function forCollege(College $college): static
    {
        return $this->state(fn (array $attributes) => [
            'college_id' => $college->id,
        ]);
    }
}

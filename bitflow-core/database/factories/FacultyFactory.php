<?php

namespace Database\Factories;

use App\Models\Faculty;
use App\Models\User;
use App\Models\College;
use App\Models\Department;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Faculty>
 */
class FacultyFactory extends Factory
{
    protected $model = Faculty::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'college_id' => College::factory(),
            'department_id' => Department::factory(),
            'employee_id' => strtoupper($this->faker->unique()->bothify('EMP####')),
            'employment_type' => $this->faker->randomElement(['permanent', 'contract', 'visiting']),
            'joining_date' => $this->faker->dateTimeBetween('-10 years', '-1 year'),
            'teaching_load_hours' => $this->faker->randomFloat(2, 5, 25),
            'status' => $this->faker->randomElement(['active', 'on_leave']),
        ];
    }

    /**
     * Indicate that the faculty is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Indicate that the faculty is HOD.
     */
    public function hod(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_hod' => true,
        ]);
    }

    /**
     * Associate the faculty with a specific college.
     */
    public function forCollege(College $college): static
    {
        return $this->state(fn (array $attributes) => [
            'college_id' => $college->id,
        ]);
    }

    /**
     * Associate the faculty with a specific department.
     */
    public function forDepartment(Department $department): static
    {
        return $this->state(fn (array $attributes) => [
            'department_id' => $department->id,
        ]);
    }

    /**
     * Set as Professor.
     */
    public function professor(): static
    {
        return $this->state(fn (array $attributes) => [
            'designation' => 'Professor',
            'qualification' => 'Ph.D.',
            'experience_years' => $this->faker->numberBetween(10, 25),
        ]);
    }

    /**
     * Set as Assistant Professor.
     */
    public function assistantProfessor(): static
    {
        return $this->state(fn (array $attributes) => [
            'designation' => 'Assistant Professor',
            'experience_years' => $this->faker->numberBetween(1, 5),
        ]);
    }
}

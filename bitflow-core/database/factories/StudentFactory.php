<?php

namespace Database\Factories;

use App\Models\Student;
use App\Models\User;
use App\Models\College;
use App\Models\Course;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Student>
 */
class StudentFactory extends Factory
{
    protected $model = Student::class;

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
            'roll_number' => $this->faker->unique()->numerify('ROLL####'),
            'admission_number' => strtoupper($this->faker->unique()->bothify('ADM####????')),
            'course' => $this->faker->randomElement([
                'Computer Science Engineering',
                'Information Technology',
                'Electronics and Communication',
                'Mechanical Engineering',
                'Civil Engineering',
                'Electrical Engineering',
                'Master of Business Administration',
                'Bachelor of Arts',
                'Bachelor of Science',
            ]),
            'year' => $this->faker->numberBetween(1, 4),
            'section' => $this->faker->randomElement(['A', 'B', 'C']),
            'admission_date' => $this->faker->dateTimeBetween('-3 years', 'now'),
            'status' => $this->faker->randomElement(['active', 'alumni']),
            'emergency_contact' => json_encode([
                'name' => $this->faker->name(),
                'phone' => $this->faker->phoneNumber(),
                'email' => $this->faker->safeEmail(),
                'relationship' => $this->faker->randomElement(['Father', 'Mother', 'Guardian']),
            ]),
            'storage_used_mb' => $this->faker->numberBetween(10, 500),
        ];
    }

    /**
     * Indicate that the student is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Indicate that the student is an alumni.
     */
    public function alumni(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_alumni' => true,
            'is_active' => false,
        ]);
    }

    /**
     * Associate the student with a specific college.
     */
    public function forCollege(College $college): static
    {
        return $this->state(fn (array $attributes) => [
            'college_id' => $college->id,
        ]);
    }

    /**
     * Associate the student with a specific course.
     */
    public function forCourse(Course $course): static
    {
        return $this->state(fn (array $attributes) => [
            'course_id' => $course->id,
        ]);
    }

    /**
     * Set specific semester.
     */
    public function semester(int $semester): static
    {
        return $this->state(fn (array $attributes) => [
            'current_semester' => $semester,
        ]);
    }

    /**
     * Set specific batch.
     */
    public function batch(string $batch): static
    {
        return $this->state(fn (array $attributes) => [
            'batch' => $batch,
        ]);
    }
}

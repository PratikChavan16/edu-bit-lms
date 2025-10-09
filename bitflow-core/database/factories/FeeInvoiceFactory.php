<?php

namespace Database\Factories;

use App\Models\FeeInvoice;
use App\Models\FeeStructure;
use App\Models\Student;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FeeInvoice>
 */
class FeeInvoiceFactory extends Factory
{
    protected $model = FeeInvoice::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $totalAmount = fake()->randomFloat(2, 60000, 200000);
        $paidAmount = 0;
        $student = Student::factory();
        
        return [
            'invoice_number' => 'INV-' . now()->year . '-' . fake()->unique()->numberBetween(10000, 99999),
            'student_id' => $student,
            'college_id' => function (array $attributes) {
                return Student::find($attributes['student_id'])->college_id ?? \App\Models\College::factory();
            },
            'academic_year' => now()->year . '-' . (now()->year + 1),
            'term' => fake()->randomElement(['semester_1', 'semester_2', 'annual']),
            'total_amount' => $totalAmount,
            'paid_amount' => $paidAmount,
            'discount' => 0,
            'due_date' => now()->addMonth(),
            'status' => 'pending',
            'components' => [
                ['name' => 'Tuition', 'amount' => $totalAmount * 0.7],
                ['name' => 'Lab Fee', 'amount' => $totalAmount * 0.2],
                ['name' => 'Library Fee', 'amount' => $totalAmount * 0.1],
            ],
        ];
    }

    /**
     * Indicate that the invoice is partially paid.
     */
    public function partiallyPaid(): static
    {
        return $this->state(function (array $attributes) {
            $totalAmount = $attributes['total_amount'];
            $paidAmount = fake()->randomFloat(2, 1000, $totalAmount - 1000);
            
            return [
                'paid_amount' => $paidAmount,
                'status' => 'partial',
            ];
        });
    }

    /**
     * Indicate that the invoice is fully paid.
     */
    public function paid(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'paid_amount' => $attributes['total_amount'],
                'status' => 'paid',
                'payment_mode' => fake()->randomElement(['cash', 'online', 'cheque', 'bank_transfer']),
            ];
        });
    }

    /**
     * Indicate that the invoice is overdue.
     */
    public function overdue(): static
    {
        return $this->state(fn (array $attributes) => [
            'due_date' => now()->subDays(fake()->numberBetween(1, 30)),
            'status' => 'overdue',
            'late_fee_amount' => fake()->numberBetween(500, 5000),
        ]);
    }

    /**
     * Indicate that the invoice has a discount.
     */
    public function withDiscount(): static
    {
        return $this->state(function (array $attributes) {
            $discountAmount = fake()->numberBetween(1000, 10000);
            
            return [
                'discount_amount' => $discountAmount,
            ];
        });
    }
}

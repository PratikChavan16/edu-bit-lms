<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\University;
use App\Models\Subscription;
use App\Models\Invoice;
use Illuminate\Support\Str;

class BillingSeeder extends Seeder
{
    public function run(): void
    {
        // Get first 3 universities
        $universities = University::limit(3)->get();

        foreach ($universities as $university) {
            // Create subscription
            $plans = ['basic', 'pro', 'enterprise'];
            $mrrs = [1000, 1500, 2500];
            $planIndex = array_rand($plans);

            $subscription = Subscription::create([
                'id' => Str::uuid(),
                'university_id' => $university->id,
                'plan' => $plans[$planIndex],
                'status' => ['active', 'past_due'][array_rand(['active', 'past_due'])],
                'mrr' => $mrrs[$planIndex],
                'next_billing_date' => now()->addDays(rand(1, 30)),
            ]);

            // Create 3 invoices per subscription
            for ($i = 0; $i < 3; $i++) {
                Invoice::create([
                    'id' => Str::uuid(),
                    'university_id' => $university->id,
                    'subscription_id' => $subscription->id,
                    'amount' => $subscription->mrr,
                    'status' => ['paid', 'pending', 'failed'][array_rand(['paid', 'pending', 'failed'])],
                    'due_date' => now()->subMonths($i)->addDays(rand(1, 15)),
                    'paid_at' => $i === 0 ? null : now()->subMonths($i),
                ]);
            }
        }

        $this->command->info('Billing data seeded successfully!');
    }
}

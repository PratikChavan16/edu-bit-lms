<?php

namespace Database\Seeders;

use App\Models\University;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class UniversitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $universities = [
            [
                'name' => 'Demo University',
                'slug' => 'demo-university',
                'domain' => 'demo.bitflow.edu',
                'email' => 'admin@demo.bitflow.edu',
                'phone' => '+1-555-0100',
                'address' => '123 Education Street, Demo City, DC 12345',
                'established_year' => 2020,
                'timezone' => 'UTC',
                'status' => 'active',
                'storage_quota_gb' => 100,
                'storage_used_mb' => 0,
                'branding' => [
                    'logo_url' => '/images/demo-logo.png',
                    'primary_color' => '#1e40af',
                    'secondary_color' => '#64748b',
                ],
                'settings' => [
                    'academic_year_start_month' => 'August',
                    'working_days' => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                    'class_start_time' => '08:00',
                    'class_end_time' => '17:00',
                ],
            ],
        ];

        foreach ($universities as $university) {
            University::create($university);
            $this->command->info("Created university: {$university['name']}");
        }
    }
}

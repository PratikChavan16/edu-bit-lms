<?php

namespace Database\Seeders;

use App\Models\ReportTemplate;
use App\Models\User;
use Illuminate\Database\Seeder;

class ReportTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get system admin user
        $admin = User::where('email', 'admin@bitflow.app')->first();
        
        if (!$admin) {
            $this->command->warn('Admin user not found. Skipping template seeding.');
            return;
        }

        // System templates
        $templates = [
            [
                'name' => 'Active Universities Overview',
                'description' => 'Quick overview of all active universities with basic stats',
                'category' => 'system',
                'report_type' => 'universities',
                'filters' => ['status' => ['active']],
                'options' => ['paper' => 'a4', 'orientation' => 'portrait'],
                'icon' => '🏛️',
                'color' => 'blue',
            ],
            [
                'name' => 'Universities with High Storage Usage',
                'description' => 'List universities approaching or exceeding storage limits',
                'category' => 'system',
                'report_type' => 'universities',
                'filters' => ['status' => ['active']],
                'options' => ['paper' => 'a4', 'orientation' => 'landscape'],
                'icon' => '💾',
                'color' => 'orange',
            ],
            [
                'name' => 'Inactive Universities Report',
                'description' => 'All inactive or suspended universities requiring attention',
                'category' => 'system',
                'report_type' => 'universities',
                'filters' => ['status' => ['inactive', 'suspended']],
                'options' => ['paper' => 'a4', 'orientation' => 'portrait'],
                'icon' => '⚠️',
                'color' => 'red',
            ],
            [
                'name' => 'All Colleges Directory',
                'description' => 'Complete directory of all colleges across universities',
                'category' => 'system',
                'report_type' => 'colleges',
                'filters' => [],
                'options' => ['paper' => 'a4', 'orientation' => 'landscape'],
                'icon' => '🎓',
                'color' => 'purple',
            ],
            [
                'name' => 'Active Colleges by Type',
                'description' => 'Active colleges categorized by type (Engineering, Medical, Arts, etc.)',
                'category' => 'system',
                'report_type' => 'colleges',
                'filters' => ['status' => ['active']],
                'options' => ['paper' => 'a4', 'orientation' => 'portrait'],
                'icon' => '📚',
                'color' => 'indigo',
            ],
            [
                'name' => 'Platform Administrators',
                'description' => 'All Bitflow Owners and Admins managing the platform',
                'category' => 'system',
                'report_type' => 'users',
                'filters' => ['role' => ['super_admin', 'bitflow_owner', 'bitflow_admin']],
                'options' => ['paper' => 'a4', 'orientation' => 'portrait'],
                'icon' => '👑',
                'color' => 'yellow',
            ],
            [
                'name' => 'University Owners Report',
                'description' => 'All university owners and their contact information',
                'category' => 'system',
                'report_type' => 'users',
                'filters' => ['role' => ['university_owner']],
                'options' => ['paper' => 'a4', 'orientation' => 'portrait'],
                'icon' => '👨‍💼',
                'color' => 'green',
            ],
            [
                'name' => 'Active Users Summary',
                'description' => 'Overview of all active users across the platform',
                'category' => 'system',
                'report_type' => 'users',
                'filters' => ['status' => ['active']],
                'options' => ['paper' => 'a4', 'orientation' => 'landscape'],
                'icon' => '👥',
                'color' => 'teal',
            ],
            [
                'name' => 'Monthly Platform Summary',
                'description' => 'Comprehensive monthly summary of all universities',
                'category' => 'featured',
                'report_type' => 'universities',
                'filters' => ['status' => ['active']],
                'options' => ['paper' => 'a4', 'orientation' => 'landscape'],
                'icon' => '📊',
                'color' => 'blue',
            ],
            [
                'name' => 'Quarterly Performance Report',
                'description' => 'Quarterly overview of active universities and colleges',
                'category' => 'featured',
                'report_type' => 'universities',
                'filters' => ['status' => ['active']],
                'options' => ['paper' => 'letter', 'orientation' => 'portrait'],
                'icon' => '📈',
                'color' => 'green',
            ],
        ];

        foreach ($templates as $template) {
            ReportTemplate::firstOrCreate(
                [
                    'name' => $template['name'],
                    'is_system' => true,
                ],
                [
                    'university_id' => null,
                    'created_by' => $admin->id,
                    'description' => $template['description'],
                    'category' => $template['category'],
                    'report_type' => $template['report_type'],
                    'filters' => $template['filters'],
                    'options' => $template['options'],
                    'icon' => $template['icon'],
                    'color' => $template['color'],
                    'is_public' => true,
                    'is_system' => true,
                ]
            );
        }

        $this->command->info('Report templates seeded successfully!');
    }
}

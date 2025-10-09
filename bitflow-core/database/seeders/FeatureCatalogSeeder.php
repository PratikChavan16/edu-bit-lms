<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FeatureCatalog;

class FeatureCatalogSeeder extends Seeder
{
    /**
     * Seed feature catalog with system features.
     */
    public function run(): void
    {
        $features = [
            // HRMS Module
            [
                'code' => 'HRMS',
                'name' => 'Human Resource Management System',
                'category' => 'hrms',
                'description' => 'Core HRMS functionality for employee management',
                'dependencies' => null,
                'impact_level' => 'high',
                'default_enabled' => false,
                'billing_model' => 'per_user',
            ],
            [
                'code' => 'HRMS_PAYROLL',
                'name' => 'Payroll Management',
                'category' => 'hrms',
                'description' => 'Automated payroll processing and salary management',
                'dependencies' => ['HRMS'],
                'impact_level' => 'high',
                'default_enabled' => false,
                'billing_model' => 'flat',
            ],
            [
                'code' => 'HRMS_ATTENDANCE',
                'name' => 'Staff Attendance Tracking',
                'category' => 'hrms',
                'description' => 'Attendance management for non-teaching staff',
                'dependencies' => ['HRMS'],
                'impact_level' => 'medium',
                'default_enabled' => false,
                'billing_model' => 'per_user',
            ],

            // Finance Module
            [
                'code' => 'FINANCE',
                'name' => 'Finance Module',
                'category' => 'finance',
                'description' => 'Core finance and accounting features',
                'dependencies' => null,
                'impact_level' => 'high',
                'default_enabled' => true,
                'billing_model' => 'flat',
            ],
            [
                'code' => 'FINANCE_FEES',
                'name' => 'Fee Management',
                'category' => 'finance',
                'description' => 'Student fee collection and invoicing',
                'dependencies' => ['FINANCE'],
                'impact_level' => 'high',
                'default_enabled' => true,
                'billing_model' => 'flat',
            ],
            [
                'code' => 'FINANCE_AUTO_REMINDERS',
                'name' => 'Automated Fee Reminders',
                'category' => 'finance',
                'description' => 'Automatic SMS/Email reminders for pending fees',
                'dependencies' => ['FINANCE_FEES'],
                'impact_level' => 'low',
                'default_enabled' => false,
                'billing_model' => 'usage_based',
            ],

            // Library Module
            [
                'code' => 'LIBRARY',
                'name' => 'Digital Library',
                'category' => 'library',
                'description' => 'Notes, resources, and content management',
                'dependencies' => null,
                'impact_level' => 'medium',
                'default_enabled' => true,
                'billing_model' => 'flat',
            ],
            [
                'code' => 'LIBRARY_VIDEO_STREAMING',
                'name' => 'Video Lecture Streaming',
                'category' => 'library',
                'description' => 'Host and stream video lectures',
                'dependencies' => ['LIBRARY'],
                'impact_level' => 'high',
                'default_enabled' => false,
                'billing_model' => 'usage_based',
            ],
            [
                'code' => 'LIBRARY_EBOOKS',
                'name' => 'E-Book Library',
                'category' => 'library',
                'description' => 'Integrated e-book reader and management',
                'dependencies' => ['LIBRARY'],
                'impact_level' => 'medium',
                'default_enabled' => false,
                'billing_model' => 'flat',
            ],

            // Assessments
            [
                'code' => 'ASSESSMENTS',
                'name' => 'Online Assessments',
                'category' => 'academics',
                'description' => 'MCQ, SAQ, LAQ online test platform',
                'dependencies' => null,
                'impact_level' => 'high',
                'default_enabled' => true,
                'billing_model' => 'flat',
            ],
            [
                'code' => 'ASSESSMENTS_AUTO_GRADE',
                'name' => 'Auto-Grading for MCQs',
                'category' => 'academics',
                'description' => 'Automatic grading of multiple-choice questions',
                'dependencies' => ['ASSESSMENTS'],
                'impact_level' => 'low',
                'default_enabled' => true,
                'billing_model' => 'flat',
            ],

            // Documents
            [
                'code' => 'DOCUMENTS',
                'name' => 'Document Management',
                'category' => 'administration',
                'description' => 'Student document storage and verification',
                'dependencies' => null,
                'impact_level' => 'medium',
                'default_enabled' => true,
                'billing_model' => 'flat',
            ],
            [
                'code' => 'STUDENT_STORAGE_QUOTA_MB',
                'name' => 'Student Storage Quota',
                'category' => 'administration',
                'description' => 'Per-student storage limit in MB',
                'dependencies' => ['DOCUMENTS'],
                'impact_level' => 'low',
                'default_enabled' => true,
                'billing_model' => 'per_user',
            ],

            // Communication
            [
                'code' => 'CHAT',
                'name' => 'Internal Chat System',
                'category' => 'communication',
                'description' => 'Department and class-based messaging',
                'dependencies' => null,
                'impact_level' => 'medium',
                'default_enabled' => false,
                'billing_model' => 'flat',
            ],
            [
                'code' => 'PARENT_PORTAL',
                'name' => 'Parent Portal',
                'category' => 'communication',
                'description' => 'Parent access for attendance, results, and fees',
                'dependencies' => null,
                'impact_level' => 'medium',
                'default_enabled' => false,
                'billing_model' => 'per_user',
            ],

            // Accessibility
            [
                'code' => 'ACCESSIBILITY_HIGH_CONTRAST',
                'name' => 'High Contrast Theme',
                'category' => 'accessibility',
                'description' => 'High contrast UI mode for accessibility',
                'dependencies' => null,
                'impact_level' => 'low',
                'default_enabled' => true,
                'billing_model' => null,
            ],
        ];

        foreach ($features as $feature) {
            FeatureCatalog::firstOrCreate(
                ['code' => $feature['code']],
                $feature
            );
        }

        $this->command->info('✓ Feature catalog seeded: ' . count($features) . ' features');
    }
}

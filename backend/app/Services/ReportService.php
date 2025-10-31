<?php

namespace App\Services;

use App\Models\University;
use App\Models\College;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class ReportService
{
    /**
     * Generate a university report (PDF)
     */
    public function generateUniversityReport(
        array $filters = [],
        array $options = []
    ): string {
        // Fetch universities with filters
        $query = University::query();
        
        // Apply filters
        if (!empty($filters['status'])) {
            $query->whereIn('status', (array) $filters['status']);
        }
        
        if (!empty($filters['established_year'])) {
            if (isset($filters['established_year']['min'])) {
                $query->where('established_year', '>=', $filters['established_year']['min']);
            }
            if (isset($filters['established_year']['max'])) {
                $query->where('established_year', '<=', $filters['established_year']['max']);
            }
        }
        
        if (!empty($filters['name'])) {
            $query->where('name', 'like', "%{$filters['name']}%");
        }
        
        $universities = $query->get();
        
        // Prepare report data
        $reportData = [
            'title' => 'Universities Report',
            'generated_at' => Carbon::now()->format('F d, Y h:i A'),
            'generated_by' => auth()->user()->name ?? 'System',
            'universities' => $universities,
            'total_count' => $universities->count(),
            'filters_applied' => $filters,
            'summary' => [
                'active' => $universities->where('status', 'active')->count(),
                'inactive' => $universities->where('status', 'inactive')->count(),
                'suspended' => $universities->where('status', 'suspended')->count(),
                'total_storage' => $universities->sum('storage_quota_gb'),
            ],
        ];
        
        // Generate PDF
        $pdf = Pdf::loadView('reports.universities', $reportData);
        
        // Configure PDF options
        $pdf->setPaper($options['paper'] ?? 'a4', $options['orientation'] ?? 'portrait');
        
        // Save or return
        if ($options['save'] ?? false) {
            $filename = 'universities_report_' . Carbon::now()->format('Y-m-d_His') . '.pdf';
            $path = 'reports/' . $filename;
            Storage::put($path, $pdf->output());
            return $path;
        }
        
        return $pdf->output();
    }
    
    /**
     * Generate a college report (PDF)
     */
    public function generateCollegeReport(
        array $filters = [],
        array $options = []
    ): string {
        $query = College::with('university');
        
        // Apply filters
        if (!empty($filters['university_id'])) {
            $query->where('university_id', $filters['university_id']);
        }
        
        if (!empty($filters['type'])) {
            $query->whereIn('type', (array) $filters['type']);
        }
        
        if (!empty($filters['status'])) {
            $query->whereIn('status', (array) $filters['status']);
        }
        
        if (!empty($filters['name'])) {
            $query->where('name', 'like', "%{$filters['name']}%");
        }
        
        $colleges = $query->get();
        
        $reportData = [
            'title' => 'Colleges Report',
            'generated_at' => Carbon::now()->format('F d, Y h:i A'),
            'generated_by' => auth()->user()->name ?? 'System',
            'colleges' => $colleges,
            'total_count' => $colleges->count(),
            'filters_applied' => $filters,
            'summary' => [
                'active' => $colleges->where('status', 'active')->count(),
                'inactive' => $colleges->where('status', 'inactive')->count(),
                'by_type' => $colleges->groupBy('type')->map->count()->toArray(),
            ],
        ];
        
        $pdf = Pdf::loadView('reports.colleges', $reportData);
        $pdf->setPaper($options['paper'] ?? 'a4', $options['orientation'] ?? 'portrait');
        
        if ($options['save'] ?? false) {
            $filename = 'colleges_report_' . Carbon::now()->format('Y-m-d_His') . '.pdf';
            $path = 'reports/' . $filename;
            Storage::put($path, $pdf->output());
            return $path;
        }
        
        return $pdf->output();
    }
    
    /**
     * Generate a users report (PDF)
     */
    public function generateUsersReport(
        array $filters = [],
        array $options = []
    ): string {
        $query = User::with('roles');
        
        // Apply filters
        if (!empty($filters['role'])) {
            $query->whereHas('roles', function ($q) use ($filters) {
                $q->whereIn('name', (array) $filters['role']);
            });
        }
        
        if (!empty($filters['status'])) {
            $query->whereIn('status', (array) $filters['status']);
        }
        
        if (!empty($filters['created_at'])) {
            if (isset($filters['created_at']['from'])) {
                $query->where('created_at', '>=', $filters['created_at']['from']);
            }
            if (isset($filters['created_at']['to'])) {
                $query->where('created_at', '<=', $filters['created_at']['to']);
            }
        }
        
        $users = $query->get();
        
        $reportData = [
            'title' => 'Users Report',
            'generated_at' => Carbon::now()->format('F d, Y h:i A'),
            'generated_by' => auth()->user()->name ?? 'System',
            'users' => $users,
            'total_count' => $users->count(),
            'filters_applied' => $filters,
            'summary' => [
                'active' => $users->where('status', 'active')->count(),
                'inactive' => $users->where('status', 'inactive')->count(),
                'by_role' => $users->pluck('roles')->flatten()->groupBy('name')->map->count()->toArray(),
            ],
        ];
        
        $pdf = Pdf::loadView('reports.users', $reportData);
        $pdf->setPaper($options['paper'] ?? 'a4', $options['orientation'] ?? 'portrait');
        
        if ($options['save'] ?? false) {
            $filename = 'users_report_' . Carbon::now()->format('Y-m-d_His') . '.pdf';
            $path = 'reports/' . $filename;
            Storage::put($path, $pdf->output());
            return $path;
        }
        
        return $pdf->output();
    }
    
    /**
     * Generate a custom report based on template
     */
    public function generateCustomReport(
        string $templateName,
        array $data,
        array $options = []
    ): string {
        $reportData = array_merge($data, [
            'generated_at' => Carbon::now()->format('F d, Y h:i A'),
            'generated_by' => auth()->user()->name ?? 'System',
        ]);
        
        $pdf = Pdf::loadView("reports.custom.{$templateName}", $reportData);
        $pdf->setPaper($options['paper'] ?? 'a4', $options['orientation'] ?? 'portrait');
        
        if ($options['save'] ?? false) {
            $filename = "{$templateName}_report_" . Carbon::now()->format('Y-m-d_His') . '.pdf';
            $path = 'reports/' . $filename;
            Storage::put($path, $pdf->output());
            return $path;
        }
        
        return $pdf->output();
    }
}

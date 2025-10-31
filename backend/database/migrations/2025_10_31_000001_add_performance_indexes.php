<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Add performance indexes to frequently queried columns across all tables.
     * These indexes significantly improve query performance for:
     * - List/filter operations (status, type, created_at)
     * - Relationship lookups (foreign keys)
     * - Search operations (name, email, domain)
     * - God Mode analytics (cross-university queries)
     */
    public function up(): void
    {
        // Universities table indexes
        Schema::table('universities', function (Blueprint $table) {
            // Status filtering (very common in queries)
            $table->index('status', 'idx_universities_status');
            
            // Date range queries for analytics
            $table->index('created_at', 'idx_universities_created_at');
            $table->index('established_year', 'idx_universities_established_year');
            
            // Search by domain (unique lookups)
            $table->index('domain', 'idx_universities_domain');
            
            // Storage monitoring queries
            $table->index('storage_used_gb', 'idx_universities_storage_used');
            
            // Composite index for common filter combinations
            $table->index(['status', 'created_at'], 'idx_universities_status_created');
        });

        // Colleges table indexes
        Schema::table('colleges', function (Blueprint $table) {
            // Status filtering
            $table->index('status', 'idx_colleges_status');
            
            // Type filtering (engineering, medical, etc.)
            $table->index('type', 'idx_colleges_type');
            
            // Date range queries
            $table->index('created_at', 'idx_colleges_created_at');
            
            // Foreign key already indexed, but composite with status helps
            $table->index(['university_id', 'status'], 'idx_colleges_university_status');
            
            // Type + Status combination (common filter)
            $table->index(['type', 'status'], 'idx_colleges_type_status');
        });

        // Users table indexes
        Schema::table('users', function (Blueprint $table) {
            // Status filtering
            $table->index('status', 'idx_users_status');
            
            // Email search (if not already unique)
            if (!Schema::hasColumn('users', 'email_index')) {
                $table->index('email', 'idx_users_email');
            }
            
            // Date range queries
            $table->index('created_at', 'idx_users_created_at');
            $table->index('last_login_at', 'idx_users_last_login');
            
            // University filtering
            $table->index(['university_id', 'status'], 'idx_users_university_status');
            
            // Name search (partial match optimization)
            // Full-text index for better search performance
            if (config('database.default') === 'mysql') {
                DB::statement('ALTER TABLE users ADD FULLTEXT idx_users_name_fulltext (name)');
            }
        });

        // Scheduled Reports table indexes
        Schema::table('scheduled_reports', function (Blueprint $table) {
            // Active schedules lookup
            $table->index('is_active', 'idx_scheduled_reports_active');
            
            // Next run queries (scheduler)
            $table->index('next_run_at', 'idx_scheduled_reports_next_run');
            
            // Report type filtering
            $table->index('report_type', 'idx_scheduled_reports_type');
            
            // Composite for scheduler query optimization
            $table->index(['is_active', 'next_run_at'], 'idx_scheduled_reports_due');
            
            // University filtering
            $table->index(['university_id', 'is_active'], 'idx_scheduled_reports_uni_active');
        });

        // Scheduled Report Executions table indexes
        Schema::table('scheduled_report_executions', function (Blueprint $table) {
            // Status filtering
            $table->index('status', 'idx_executions_status');
            
            // Date range for history
            $table->index('started_at', 'idx_executions_started_at');
            $table->index('completed_at', 'idx_executions_completed_at');
            
            // Success/failure analysis
            $table->index(['scheduled_report_id', 'status'], 'idx_executions_report_status');
            
            // Recent executions
            $table->index(['started_at', 'status'], 'idx_executions_recent');
        });

        // Report Templates table indexes
        Schema::table('report_templates', function (Blueprint $table) {
            // System vs custom templates
            $table->index('is_system', 'idx_templates_system');
            $table->index('is_public', 'idx_templates_public');
            
            // Report type filtering
            $table->index('report_type', 'idx_templates_type');
            
            // Category filtering
            $table->index('category', 'idx_templates_category');
            
            // Popular templates (usage tracking)
            $table->index('usage_count', 'idx_templates_usage_count');
            $table->index('last_used_at', 'idx_templates_last_used');
            
            // Composite for common queries
            $table->index(['is_system', 'report_type'], 'idx_templates_system_type');
            $table->index(['university_id', 'is_public'], 'idx_templates_uni_public');
        });

        // Report History table indexes
        Schema::table('report_history', function (Blueprint $table) {
            // Report type filtering
            $table->index('report_type', 'idx_history_type');
            
            // Date range queries (most common)
            $table->index('generated_at', 'idx_history_generated_at');
            
            // User's report history
            $table->index(['generated_by', 'generated_at'], 'idx_history_user_date');
            
            // Template-based reports
            $table->index('template_id', 'idx_history_template');
            
            // University filtering
            $table->index(['university_id', 'generated_at'], 'idx_history_uni_date');
            
            // Recent reports by type
            $table->index(['report_type', 'generated_at'], 'idx_history_type_date');
        });

        // Departments table indexes (if exists)
        if (Schema::hasTable('departments')) {
            Schema::table('departments', function (Blueprint $table) {
                // Status filtering
                $table->index('status', 'idx_departments_status');
                
                // College association
                $table->index(['college_id', 'status'], 'idx_departments_college_status');
                
                // HOD lookup
                $table->index('hod_id', 'idx_departments_hod');
            });
        }

        // Faculty table indexes (if exists)
        if (Schema::hasTable('faculty')) {
            Schema::table('faculty', function (Blueprint $table) {
                // Status filtering
                $table->index('status', 'idx_faculty_status');
                
                // Department association
                $table->index(['department_id', 'status'], 'idx_faculty_dept_status');
                
                // User association
                $table->index('user_id', 'idx_faculty_user');
                
                // Date queries
                $table->index('joined_date', 'idx_faculty_joined_date');
            });
        }

        // Audit Logs table indexes (if exists)
        if (Schema::hasTable('audit_logs')) {
            Schema::table('audit_logs', function (Blueprint $table) {
                // Most recent logs
                $table->index('created_at', 'idx_audit_logs_created_at');
                
                // User activity
                $table->index('user_id', 'idx_audit_logs_user');
                
                // Event type filtering
                $table->index('event_type', 'idx_audit_logs_event_type');
                
                // Resource tracking
                $table->index(['auditable_type', 'auditable_id'], 'idx_audit_logs_auditable');
                
                // Composite for common queries
                $table->index(['user_id', 'created_at'], 'idx_audit_logs_user_date');
                $table->index(['event_type', 'created_at'], 'idx_audit_logs_event_date');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop all indexes in reverse order
        
        if (Schema::hasTable('audit_logs')) {
            Schema::table('audit_logs', function (Blueprint $table) {
                $table->dropIndex('idx_audit_logs_created_at');
                $table->dropIndex('idx_audit_logs_user');
                $table->dropIndex('idx_audit_logs_event_type');
                $table->dropIndex('idx_audit_logs_auditable');
                $table->dropIndex('idx_audit_logs_user_date');
                $table->dropIndex('idx_audit_logs_event_date');
            });
        }

        if (Schema::hasTable('faculty')) {
            Schema::table('faculty', function (Blueprint $table) {
                $table->dropIndex('idx_faculty_status');
                $table->dropIndex('idx_faculty_dept_status');
                $table->dropIndex('idx_faculty_user');
                $table->dropIndex('idx_faculty_joined_date');
            });
        }

        if (Schema::hasTable('departments')) {
            Schema::table('departments', function (Blueprint $table) {
                $table->dropIndex('idx_departments_status');
                $table->dropIndex('idx_departments_college_status');
                $table->dropIndex('idx_departments_hod');
            });
        }

        Schema::table('report_history', function (Blueprint $table) {
            $table->dropIndex('idx_history_type');
            $table->dropIndex('idx_history_generated_at');
            $table->dropIndex('idx_history_user_date');
            $table->dropIndex('idx_history_template');
            $table->dropIndex('idx_history_uni_date');
            $table->dropIndex('idx_history_type_date');
        });

        Schema::table('report_templates', function (Blueprint $table) {
            $table->dropIndex('idx_templates_system');
            $table->dropIndex('idx_templates_public');
            $table->dropIndex('idx_templates_type');
            $table->dropIndex('idx_templates_category');
            $table->dropIndex('idx_templates_usage_count');
            $table->dropIndex('idx_templates_last_used');
            $table->dropIndex('idx_templates_system_type');
            $table->dropIndex('idx_templates_uni_public');
        });

        Schema::table('scheduled_report_executions', function (Blueprint $table) {
            $table->dropIndex('idx_executions_status');
            $table->dropIndex('idx_executions_started_at');
            $table->dropIndex('idx_executions_completed_at');
            $table->dropIndex('idx_executions_report_status');
            $table->dropIndex('idx_executions_recent');
        });

        Schema::table('scheduled_reports', function (Blueprint $table) {
            $table->dropIndex('idx_scheduled_reports_active');
            $table->dropIndex('idx_scheduled_reports_next_run');
            $table->dropIndex('idx_scheduled_reports_type');
            $table->dropIndex('idx_scheduled_reports_due');
            $table->dropIndex('idx_scheduled_reports_uni_active');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex('idx_users_status');
            if (Schema::hasIndex('users', 'idx_users_email')) {
                $table->dropIndex('idx_users_email');
            }
            $table->dropIndex('idx_users_created_at');
            $table->dropIndex('idx_users_last_login');
            $table->dropIndex('idx_users_university_status');
            
            if (config('database.default') === 'mysql') {
                DB::statement('ALTER TABLE users DROP INDEX idx_users_name_fulltext');
            }
        });

        Schema::table('colleges', function (Blueprint $table) {
            $table->dropIndex('idx_colleges_status');
            $table->dropIndex('idx_colleges_type');
            $table->dropIndex('idx_colleges_created_at');
            $table->dropIndex('idx_colleges_university_status');
            $table->dropIndex('idx_colleges_type_status');
        });

        Schema::table('universities', function (Blueprint $table) {
            $table->dropIndex('idx_universities_status');
            $table->dropIndex('idx_universities_created_at');
            $table->dropIndex('idx_universities_established_year');
            $table->dropIndex('idx_universities_domain');
            $table->dropIndex('idx_universities_storage_used');
            $table->dropIndex('idx_universities_status_created');
        });
    }
};

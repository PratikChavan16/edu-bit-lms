<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('feature_catalog', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('code')->unique(); // HRMS_PAYROLL, LIBRARY_VIDEO_STREAMING
            $table->string('name');
            $table->string('category'); // hrms, finance, academics, library
            $table->text('description')->nullable();
            $table->json('dependencies')->nullable(); // ["HRMS"]
            $table->enum('impact_level', ['low', 'medium', 'high'])->default('medium');
            $table->boolean('default_enabled')->default(false);
            $table->string('billing_model')->nullable(); // per_user, flat, usage_based
            $table->timestamps();
        });

        Schema::create('feature_toggles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('feature_id')->constrained('feature_catalog')->cascadeOnDelete();
            $table->string('scope'); // university, college
            $table->foreignUuid('university_id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignUuid('college_id')->nullable()->constrained()->cascadeOnDelete();
            $table->boolean('enabled')->default(false);
            $table->json('parameters')->nullable(); // storage_quota_gb, etc.
            $table->enum('approval_status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->foreignUuid('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();

            $table->unique(['feature_id', 'scope', 'university_id', 'college_id'], 'feature_scope_unique');
        });

        Schema::create('feature_change_requests', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('feature_id')->constrained('feature_catalog')->cascadeOnDelete();
            $table->string('scope');
            $table->foreignUuid('university_id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignUuid('college_id')->nullable()->constrained()->cascadeOnDelete();
            $table->boolean('desired_state');
            $table->json('parameters')->nullable();
            $table->text('notes')->nullable();
            $table->decimal('cost_impact', 10, 2)->nullable();
            $table->enum('status', ['pending', 'in_review', 'approved', 'rejected'])->default('pending');
            $table->foreignUuid('requested_by')->constrained('users')->cascadeOnDelete();
            $table->foreignUuid('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('review_notes')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('feature_change_requests');
        Schema::dropIfExists('feature_toggles');
        Schema::dropIfExists('feature_catalog');
    }
};

<?php
/**
 * Batch update migrations 8-13 for SQLite compatibility
 */

$replacements = [
    '2024_01_01_000008_create_colleges_table.php' => [
        'search' => <<<'EOT'
            $table->uuid('id')->primary()->default(DB::raw('uuid_generate_v4()'));
            $table->uuid('university_id');
            $table->string('name', 255);
            $table->string('slug', 255);
            $table->string('code', 20)->unique();
            $table->string('email', 255);
            $table->string('phone', 20)->nullable();
            $table->text('address')->nullable();
            $table->integer('established_year')->nullable();
            $table->uuid('principal_id')->nullable();
            $table->string('accreditation_body', 100)->nullable();
            $table->date('accreditation_valid_until')->nullable();
            $table->string('status', 20)->default('active');
            $table->jsonb('accreditation')->nullable(); // {body, valid_until, certificate_url}
            $table->timestampTz('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestampTz('updated_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestampTz('deleted_at')->nullable();
EOT,
        'replace' => <<<'EOT'
            if (DB::getDriverName() === 'pgsql') {
                $table->uuid('id')->primary()->default(DB::raw('uuid_generate_v4()'));
            } else {
                $table->uuid('id')->primary();
            }
            $table->uuid('university_id');
            $table->string('name', 255);
            $table->string('slug', 255);
            $table->string('code', 20)->unique();
            $table->string('email', 255);
            $table->string('phone', 20)->nullable();
            $table->text('address')->nullable();
            $table->integer('established_year')->nullable();
            $table->uuid('principal_id')->nullable();
            $table->string('accreditation_body', 100)->nullable();
            $table->date('accreditation_valid_until')->nullable();
            $table->string('status', 20)->default('active');
            $table->json('accreditation')->nullable(); // {body, valid_until, certificate_url}
            $table->timestamps();
            $table->softDeletes();
EOT
    ],
    '2024_01_01_000009_create_departments_table.php' => [
        'search' => <<<'EOT'
            $table->uuid('id')->primary()->default(DB::raw('uuid_generate_v4()'));
            $table->uuid('college_id');
            $table->string('name', 255);
            $table->string('slug', 255);
            $table->string('code', 20);
            $table->uuid('head_of_department_id')->nullable();
            $table->string('email', 255)->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('status', 20)->default('active');
            $table->timestampTz('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestampTz('updated_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestampTz('deleted_at')->nullable();
EOT,
        'replace' => <<<'EOT'
            if (DB::getDriverName() === 'pgsql') {
                $table->uuid('id')->primary()->default(DB::raw('uuid_generate_v4()'));
            } else {
                $table->uuid('id')->primary();
            }
            $table->uuid('college_id');
            $table->string('name', 255);
            $table->string('slug', 255);
            $table->string('code', 20);
            $table->uuid('head_of_department_id')->nullable();
            $table->string('email', 255)->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('status', 20)->default('active');
            $table->timestamps();
            $table->softDeletes();
EOT
    ],
    '2024_01_01_000010_create_courses_table.php' => [
        'search' => <<<'EOT'
            $table->uuid('id')->primary()->default(DB::raw('uuid_generate_v4()'));
            $table->uuid('department_id');
            $table->string('name', 255);
            $table->string('code', 20);
            $table->text('description')->nullable();
            $table->integer('credits')->default(0);
            $table->integer('duration_years')->default(4);
            $table->string('degree_type', 50); // 'diploma', 'bachelor', 'master', 'phd'
            $table->string('status', 20)->default('active');
            $table->jsonb('prerequisites')->nullable(); // Array of course IDs
            $table->string('syllabus_url', 500)->nullable();
            $table->integer('total_seats')->nullable();
            $table->timestampTz('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestampTz('updated_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestampTz('deleted_at')->nullable();
EOT,
        'replace' => <<<'EOT'
            if (DB::getDriverName() === 'pgsql') {
                $table->uuid('id')->primary()->default(DB::raw('uuid_generate_v4()'));
            } else {
                $table->uuid('id')->primary();
            }
            $table->uuid('department_id');
            $table->string('name', 255);
            $table->string('code', 20);
            $table->text('description')->nullable();
            $table->integer('credits')->default(0);
            $table->integer('duration_years')->default(4);
            $table->string('degree_type', 50); // 'diploma', 'bachelor', 'master', 'phd'
            $table->string('status', 20)->default('active');
            $table->json('prerequisites')->nullable(); // Array of course IDs
            $table->string('syllabus_url', 500)->nullable();
            $table->integer('total_seats')->nullable();
            $table->timestamps();
            $table->softDeletes();
EOT
    ],
    '2024_01_01_000011_create_academic_years_table.php' => [
        'search' => <<<'EOT'
            $table->uuid('id')->primary()->default(DB::raw('uuid_generate_v4()'));
            $table->uuid('university_id');
            $table->string('year', 20); // e.g., "2024-2025"
            $table->date('start_date');
            $table->date('end_date');
            $table->boolean('is_current')->default(false);
            $table->string('status', 20)->default('upcoming');
            $table->timestampTz('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestampTz('updated_at')->default(DB::raw('CURRENT_TIMESTAMP'));
EOT,
        'replace' => <<<'EOT'
            if (DB::getDriverName() === 'pgsql') {
                $table->uuid('id')->primary()->default(DB::raw('uuid_generate_v4()'));
            } else {
                $table->uuid('id')->primary();
            }
            $table->uuid('university_id');
            $table->string('year', 20); // e.g., "2024-2025"
            $table->date('start_date');
            $table->date('end_date');
            $table->boolean('is_current')->default(false);
            $table->string('status', 20)->default('upcoming');
            $table->timestamps();
EOT
    ],
    '2024_01_01_000012_create_students_table.php' => [
        'search' => <<<'EOT'
            $table->uuid('id')->primary()->default(DB::raw('uuid_generate_v4()'));
            $table->uuid('user_id')->unique();
            $table->uuid('college_id');
            $table->uuid('department_id');
            $table->uuid('course_id');
            $table->string('student_id', 50)->unique(); // University student number
            $table->string('admission_number', 50)->unique();
            $table->date('admission_date');
            $table->uuid('academic_year_id'); // Year of admission
            $table->integer('current_semester')->default(1);
            $table->string('admission_type', 50)->nullable(); // 'regular', 'lateral', 'transfer'
            $table->string('category', 50)->nullable(); // 'general', 'obc', 'sc', 'st', etc.
            $table->date('date_of_birth')->nullable();
            $table->string('gender', 10)->nullable();
            $table->string('blood_group', 5)->nullable();
            $table->text('permanent_address')->nullable();
            $table->text('current_address')->nullable();
            $table->jsonb('emergency_contact')->nullable(); // {name, relation, phone}
            $table->string('parent_email', 255)->nullable();
            $table->string('parent_phone', 20)->nullable();
            $table->string('status', 20)->default('active');
            $table->date('graduation_date')->nullable();
            $table->timestampTz('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestampTz('updated_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestampTz('deleted_at')->nullable();
EOT,
        'replace' => <<<'EOT'
            if (DB::getDriverName() === 'pgsql') {
                $table->uuid('id')->primary()->default(DB::raw('uuid_generate_v4()'));
            } else {
                $table->uuid('id')->primary();
            }
            $table->uuid('user_id')->unique();
            $table->uuid('college_id');
            $table->uuid('department_id');
            $table->uuid('course_id');
            $table->string('student_id', 50)->unique(); // University student number
            $table->string('admission_number', 50)->unique();
            $table->date('admission_date');
            $table->uuid('academic_year_id'); // Year of admission
            $table->integer('current_semester')->default(1);
            $table->string('admission_type', 50)->nullable(); // 'regular', 'lateral', 'transfer'
            $table->string('category', 50)->nullable(); // 'general', 'obc', 'sc', 'st', etc.
            $table->date('date_of_birth')->nullable();
            $table->string('gender', 10)->nullable();
            $table->string('blood_group', 5)->nullable();
            $table->text('permanent_address')->nullable();
            $table->text('current_address')->nullable();
            $table->json('emergency_contact')->nullable(); // {name, relation, phone}
            $table->string('parent_email', 255)->nullable();
            $table->string('parent_phone', 20)->nullable();
            $table->string('status', 20)->default('active');
            $table->date('graduation_date')->nullable();
            $table->timestamps();
            $table->softDeletes();
EOT
    ],
    '2024_01_01_000013_create_enrollments_table.php' => [
        'search' => <<<'EOT'
            $table->uuid('id')->primary()->default(DB::raw('uuid_generate_v4()'));
            $table->uuid('student_id');
            $table->uuid('course_id');
            $table->uuid('academic_year_id');
            $table->integer('semester');
            $table->timestampTz('enrolled_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->string('status', 20)->default('enrolled');
            $table->decimal('grade_point', 4, 2)->nullable();
            $table->string('grade', 5)->nullable(); // 'A+', 'A', 'B+', etc.
            $table->text('remarks')->nullable();
            $table->timestampTz('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestampTz('updated_at')->default(DB::raw('CURRENT_TIMESTAMP'));
EOT,
        'replace' => <<<'EOT'
            if (DB::getDriverName() === 'pgsql') {
                $table->uuid('id')->primary()->default(DB::raw('uuid_generate_v4()'));
            } else {
                $table->uuid('id')->primary();
            }
            $table->uuid('student_id');
            $table->uuid('course_id');
            $table->uuid('academic_year_id');
            $table->integer('semester');
            $table->timestamp('enrolled_at')->useCurrent();
            $table->string('status', 20)->default('enrolled');
            $table->decimal('grade_point', 4, 2)->nullable();
            $table->string('grade', 5)->nullable(); // 'A+', 'A', 'B+', etc.
            $table->text('remarks')->nullable();
            $table->timestamps();
EOT
    ],
];

foreach ($replacements as $file => $data) {
    $path = __DIR__ . '/database/migrations/' . $file;
    $content = file_get_contents($path);
    $content = str_replace($data['search'], $data['replace'], $content);
    file_put_contents($path, $content);
    echo "✓ Fixed: $file\n";
}

echo "\nDone! Run: php artisan migrate:fresh\n";

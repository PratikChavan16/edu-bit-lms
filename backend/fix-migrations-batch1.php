<?php
/**
 * Batch update all migrations for SQLite compatibility
 */

$replacements = [
    // Files 3-13: permissions, users, role_user, role_permissions, sessions, colleges, departments, courses, academic_years, students, enrollments
    '2024_01_01_000003_create_permissions_table.php' => [
        'search' => <<<'EOT'
    public function up(): void
    {
        Schema::create('permissions', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw('uuid_generate_v4()'));
            $table->string('name', 100);
            $table->string('slug', 100)->unique();
            $table->text('description')->nullable();
            $table->string('category', 50); // e.g., 'users', 'courses', 'finance'
            $table->timestampTz('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            
            $table->index('slug');
            $table->index('category');
        });
    }
EOT,
        'replace' => <<<'EOT'
    public function up(): void
    {
        Schema::create('permissions', function (Blueprint $table) {
            if (DB::getDriverName() === 'pgsql') {
                $table->uuid('id')->primary()->default(DB::raw('uuid_generate_v4()'));
            } else {
                $table->uuid('id')->primary();
            }
            $table->string('name', 100);
            $table->string('slug', 100)->unique();
            $table->text('description')->nullable();
            $table->string('category', 50); // e.g., 'users', 'courses', 'finance'
            $table->timestamps();
            
            $table->index('slug');
            $table->index('category');
        });
    }
EOT
    ],
    '2024_01_01_000004_create_users_table.php' => [
        'search' => <<<'EOT'
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw('uuid_generate_v4()'));
            $table->uuid('university_id')->nullable()->index();
            $table->string('first_name', 100);
            $table->string('last_name', 100);
            $table->string('email', 255)->unique();
            $table->string('password', 255);
            $table->string('phone', 20)->nullable();
            $table->string('avatar_url', 500)->nullable();
            $table->string('status', 20)->default('active');
            $table->timestampTz('email_verified_at')->nullable();
            $table->timestampTz('last_login_at')->nullable();
            $table->timestampTz('password_changed_at')->nullable();
            $table->boolean('must_change_password')->default(false);
            $table->integer('failed_login_attempts')->default(0);
            $table->timestampTz('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestampTz('updated_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestampTz('deleted_at')->nullable(); // Soft delete
            
            $table->foreign('university_id')->references('id')->on('universities')->onDelete('cascade');
            $table->index('email');
            $table->index('status');
        });
        
        // Add CHECK constraint
        DB::statement("ALTER TABLE users ADD CONSTRAINT users_status_check CHECK (status IN ('active', 'inactive', 'suspended', 'locked'))");
    }
EOT,
        'replace' => <<<'EOT'
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            if (DB::getDriverName() === 'pgsql') {
                $table->uuid('id')->primary()->default(DB::raw('uuid_generate_v4()'));
            } else {
                $table->uuid('id')->primary();
            }
            $table->uuid('university_id')->nullable()->index();
            $table->string('first_name', 100);
            $table->string('last_name', 100);
            $table->string('email', 255)->unique();
            $table->string('password', 255);
            $table->string('phone', 20)->nullable();
            $table->string('avatar_url', 500)->nullable();
            $table->string('status', 20)->default('active');
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamp('last_login_at')->nullable();
            $table->timestamp('password_changed_at')->nullable();
            $table->boolean('must_change_password')->default(false);
            $table->integer('failed_login_attempts')->default(0);
            $table->timestamps();
            $table->softDeletes();
            
            $table->foreign('university_id')->references('id')->on('universities')->onDelete('cascade');
            $table->index('email');
            $table->index('status');
        });
        
        // Add CHECK constraint (PostgreSQL only)
        if (DB::getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE users ADD CONSTRAINT users_status_check CHECK (status IN ('active', 'inactive', 'suspended', 'locked'))");
        }
    }
EOT
    ],
    '2024_01_01_000005_create_role_user_table.php' => [
        'search' => <<<'EOT'
    public function up(): void
    {
        Schema::create('role_user', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw('uuid_generate_v4()'));
            $table->uuid('role_id');
            $table->uuid('user_id');
            $table->timestampTz('assigned_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->uuid('assigned_by')->nullable();
            $table->timestampTz('expires_at')->nullable(); // Optional: temporary role assignment
            
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('assigned_by')->references('id')->on('users')->onDelete('set null');
            
            $table->unique(['role_id', 'user_id']);
        });
    }
EOT,
        'replace' => <<<'EOT'
    public function up(): void
    {
        Schema::create('role_user', function (Blueprint $table) {
            if (DB::getDriverName() === 'pgsql') {
                $table->uuid('id')->primary()->default(DB::raw('uuid_generate_v4()'));
            } else {
                $table->uuid('id')->primary();
            }
            $table->uuid('role_id');
            $table->uuid('user_id');
            $table->timestamp('assigned_at')->useCurrent();
            $table->uuid('assigned_by')->nullable();
            $table->timestamp('expires_at')->nullable();
            
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('assigned_by')->references('id')->on('users')->onDelete('set null');
            
            $table->unique(['role_id', 'user_id']);
        });
    }
EOT
    ],
    '2024_01_01_000006_create_role_permissions_table.php' => [
        'search' => <<<'EOT'
    public function up(): void
    {
        Schema::create('role_permissions', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw('uuid_generate_v4()'));
            $table->uuid('role_id');
            $table->uuid('permission_id');
            $table->timestampTz('granted_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade');
            $table->foreign('permission_id')->references('id')->on('permissions')->onDelete('cascade');
            
            $table->unique(['role_id', 'permission_id']);
        });
    }
EOT,
        'replace' => <<<'EOT'
    public function up(): void
    {
        Schema::create('role_permissions', function (Blueprint $table) {
            if (DB::getDriverName() === 'pgsql') {
                $table->uuid('id')->primary()->default(DB::raw('uuid_generate_v4()'));
            } else {
                $table->uuid('id')->primary();
            }
            $table->uuid('role_id');
            $table->uuid('permission_id');
            $table->timestamp('granted_at')->useCurrent();
            
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade');
            $table->foreign('permission_id')->references('id')->on('permissions')->onDelete('cascade');
            
            $table->unique(['role_id', 'permission_id']);
        });
    }
EOT
    ],
    '2024_01_01_000007_create_sessions_table.php' => [
        'search' => <<<'EOT'
    public function up(): void
    {
        Schema::create('sessions', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw('uuid_generate_v4()'));
            $table->uuid('user_id');
            $table->uuid('refresh_token')->unique()->default(DB::raw('uuid_generate_v4()'));
            $table->string('ip_address', 45);
            $table->text('user_agent');
            $table->string('device_type', 20)->nullable();
            $table->timestampTz('last_activity_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestampTz('expires_at');
            $table->timestampTz('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->index('refresh_token');
            $table->index('expires_at');
        });
    }
EOT,
        'replace' => <<<'EOT'
    public function up(): void
    {
        Schema::create('sessions', function (Blueprint $table) {
            if (DB::getDriverName() === 'pgsql') {
                $table->uuid('id')->primary()->default(DB::raw('uuid_generate_v4()'));
            } else {
                $table->uuid('id')->primary();
            }
            $table->uuid('user_id');
            $table->uuid('refresh_token')->unique();
            $table->string('ip_address', 45);
            $table->text('user_agent');
            $table->string('device_type', 20)->nullable();
            $table->timestamp('last_activity_at')->useCurrent();
            $table->timestamp('expires_at');
            $table->timestamps();
            
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->index('refresh_token');
            $table->index('expires_at');
        });
    }
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

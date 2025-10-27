<?php
/**
 * Script to make migrations compatible with both PostgreSQL and SQLite
 */

$migrationsPath = __DIR__ . '/database/migrations';
$files = glob($migrationsPath . '/*.php');

foreach ($files as $file) {
    $content = file_get_contents($file);
    $originalContent = $content;
    
    // Fix UUID primary key with default value
    $content = preg_replace(
        '/\$table->uuid\(\'id\'\)->primary\(\)->default\(DB::raw\(\'uuid_generate_v4\(\)\'\)\);/',
        'if (DB::getDriverName() === \'pgsql\') {
                $table->uuid(\'id\')->primary()->default(DB::raw(\'uuid_generate_v4()\'));
            } else {
                $table->uuid(\'id\')->primary();
            }',
        $content
    );
    
    // Fix other UUID columns with default value (like refresh_token)
    $content = preg_replace(
        '/\$table->uuid\(\'([^\']+)\'\)->([^;]+)->default\(DB::raw\(\'uuid_generate_v4\(\)\'\)\);/',
        '$table->uuid(\'$1\')->$2;',
        $content
    );
    
    // Replace jsonb with json
    $content = str_replace('->jsonb(', '->json(', $content);
    
    // Replace timestampTz with timestamp
    $content = str_replace('->timestampTz(', '->timestamp(', $content);
    
    // Remove ->default(DB::raw('CURRENT_TIMESTAMP')) from timestamps as Laravel handles this
    $content = preg_replace(
        '/\$table->timestamp\(\'(created_at|updated_at)\'\)->default\(DB::raw\(\'CURRENT_TIMESTAMP\'\)\);/',
        '// $table->timestamp(\'$1\'); // Handled by $table->timestamps()',
        $content
    );
    
    // Remove standalone created_at/updated_at definitions in favor of $table->timestamps()
    $content = preg_replace(
        '/\/\/ \$table->timestamp\(\'created_at\'\);.*?\n.*?\/\/ \$table->timestamp\(\'updated_at\'\);.*?\n/s',
        '$table->timestamps();' . "\n",
        $content
    );
    
    // Fix other timestamp columns that aren't created_at/updated_at
    $content = preg_replace(
        '/\$table->timestamp\(\'(?!created_at|updated_at)([^\']+)\'\)->default\(DB::raw\(\'CURRENT_TIMESTAMP\'\)\);/',
        '$table->timestamp(\'$1\')->useCurrent();',
        $content
    );
    
    // Replace timestampTz deleted_at with softDeletes()
    $content = preg_replace(
        '/\$table->timestamp\(\'deleted_at\'\)->nullable\(\);.*?(\/\/.*)?/',
        '$table->softDeletes();',
        $content
    );
    
    // Wrap CREATE EXTENSION statements in PostgreSQL check
    if (strpos($content, 'CREATE EXTENSION') !== false && strpos($content, 'if (DB::getDriverName()') === false) {
        $content = preg_replace(
            '/(DB::statement\(\'CREATE EXTENSION.*?\'\);)/',
            'if (DB::getDriverName() === \'pgsql\') {
            $1
        }',
            $content
        );
    }
    
    // Wrap ALTER TABLE CHECK constraints in PostgreSQL check
    if (strpos($content, 'ALTER TABLE') !== false && strpos($content, 'CHECK') !== false) {
        $content = preg_replace(
            '/(\/\/ Add CHECK constraint.*?\n.*?DB::statement\("ALTER TABLE.*?CHECK.*?"\);)/s',
            '$1' . "\n        \n        // Wrap CHECK constraint in PostgreSQL check\n        if (DB::getDriverName() === 'pgsql') {\n            $1\n        }",
            $content
        );
        
        // Clean up duplicate comments
        $content = preg_replace('/\/\/ Add CHECK constraint\s*\/\/ Add CHECK constraint/', '// Add CHECK constraint', $content);
    }
    
    // Save if content changed
    if ($content !== $originalContent) {
        file_put_contents($file, $content);
        echo "✓ Fixed: " . basename($file) . "\n";
    } else {
        echo "- Skipped: " . basename($file) . " (no changes needed)\n";
    }
}

echo "\nAll migrations have been updated for SQLite compatibility!\n";

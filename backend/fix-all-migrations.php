<?php
/**
 * Final comprehensive fix for all migrations
 */

$migrationsPath = __DIR__ . '/database/migrations';
$files = glob($migrationsPath . '/*.php');

foreach ($files as $file) {
    $content = file_get_contents($file);
    $original = $content;
    
    // 1. Fix UUID primary key declarations
    $content = preg_replace(
        '/\$table->uuid\(\'id\'\)->primary\(\)->default\(DB::raw\(\'uuid_generate_v4\(\)\'\)\);/',
        "if (DB::getDriverName() === 'pgsql') {\n                \$table->uuid('id')->primary()->default(DB::raw('uuid_generate_v4()'));\n            } else {\n                \$table->uuid('id')->primary();\n            }",
        $content
    );
    
    // 2. Fix other UUID columns with default
    $content = preg_replace(
        '/\$table->uuid\(\'([^\']+)\'\)->unique\(\)->default\(DB::raw\(\'uuid_generate_v4\(\)\'\)\);/',
        "\$table->uuid('$1')->unique();",
        $content
    );
    
    // 3. Replace jsonb with json
    $content = str_replace('->jsonb(', '->json(', $content);
    
    // 4. Replace timestampTz with timestamp
    $content = str_replace('->timestampTz(', '->timestamp(', $content);
    
    // 5. Replace created_at/updated_at with ->timestamps()
    $pattern = '/\$table->timestamp\(\'created_at\'\)->(?:default\(DB::raw\(\'CURRENT_TIMESTAMP\'\)\)|useCurrent\(\));?\s*\n\s*\$table->timestamp\(\'updated_at\'\)->(?:default\(DB::raw\(\'CURRENT_TIMESTAMP\'\)\)|useCurrent\(\));?/';
    $content = preg_replace($pattern, '$table->timestamps();', $content);
    
    // 6. Replace deleted_at with softDeletes()
    $content = preg_replace(
        '/\$table->timestamp\(\'deleted_at\'\)->nullable\(\);(?:\s*\/\/[^\n]*)?/',
        '$table->softDeletes();',
        $content
    );
    
    // 7. Fix other timestamp columns
    $content = preg_replace(
        '/\$table->timestamp\(\'([^\']+)\'\)->default\(DB::raw\(\'CURRENT_TIMESTAMP\'\)\);/',
        "\$table->timestamp('$1')->useCurrent();",
        $content
    );
    
    if ($content !== $original) {
        file_put_contents($file, $content);
        echo "✓ Updated: " . basename($file) . "\n";
    } else {
        echo "- No changes: " . basename($file) . "\n";
    }
}

echo "\nDone!\n";

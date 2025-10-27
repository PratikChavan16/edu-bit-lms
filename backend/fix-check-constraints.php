<?php
/**
 * Wrap all ALTER TABLE...CHECK statements in PostgreSQL conditionals
 */

$migrationsPath = __DIR__ . '/database/migrations';
$files = glob($migrationsPath . '/*.php');

foreach ($files as $file) {
    $content = file_get_contents($file);
    $original = $content;
    
    // Find all ALTER TABLE ... CHECK statements that aren't already wrapped
    if (preg_match_all('/(.*?)(DB::statement\("ALTER TABLE.*?CHECK.*?"\);)/s', $content, $matches, PREG_SET_ORDER)) {
        foreach ($matches as $match) {
            $before = $match[1];
            $statement = $match[2];
            
            // Check if this statement is already wrapped in an if block
            if (strpos($before, "if (DB::getDriverName() === 'pgsql')") === false || 
                strpos(substr($before, -200), "if (DB::getDriverName() === 'pgsql')") === false) {
                
                // Not wrapped, so wrap it
                $wrapped = "if (DB::getDriverName() === 'pgsql') {\n            " . $statement . "\n        }";
                $content = str_replace($statement, $wrapped, $content);
            }
        }
    }
    
    if ($content !== $original) {
        file_put_contents($file, $content);
        echo "✓ Fixed CHECK constraints in: " . basename($file) . "\n";
    }
}

echo "\nDone!\n";

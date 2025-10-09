<?php

try {
    $pdo = new PDO('mysql:host=127.0.0.1;port=3306', 'root', '');
    echo "✅ MySQL connection successful!\n";
    echo "MySQL Server Version: " . $pdo->getAttribute(PDO::ATTR_SERVER_VERSION) . "\n";
    
    // Check if database exists
    $stmt = $pdo->query("SHOW DATABASES LIKE 'bitflow'");
    $dbExists = $stmt->fetch();
    
    if ($dbExists) {
        echo "✅ Database 'bitflow' exists\n";
    } else {
        echo "❌ Database 'bitflow' does NOT exist\n";
        echo "Creating database...\n";
        $pdo->exec("CREATE DATABASE IF NOT EXISTS bitflow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        echo "✅ Database 'bitflow' created successfully!\n";
    }
    
} catch (PDOException $e) {
    echo "❌ MySQL connection failed!\n";
    echo "Error: " . $e->getMessage() . "\n";
    echo "\nPossible solutions:\n";
    echo "1. Make sure MySQL is running in AMPPS\n";
    echo "2. Check if MySQL is running on port 3306\n";
    echo "3. Verify root user has no password or update .env file\n";
}

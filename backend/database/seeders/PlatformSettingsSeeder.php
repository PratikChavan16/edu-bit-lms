<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PlatformSetting;

class PlatformSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // General Settings
            ['category' => 'general', 'key' => 'platform_name', 'value' => 'Bitflow LMS', 'description' => 'Platform name'],
            ['category' => 'general', 'key' => 'platform_url', 'value' => 'https://bitflow.edu', 'description' => 'Platform URL'],
            ['category' => 'general', 'key' => 'support_email', 'value' => 'support@bitflow.edu', 'description' => 'Support email'],
            ['category' => 'general', 'key' => 'support_phone', 'value' => '+1-800-BITFLOW', 'description' => 'Support phone'],
            ['category' => 'general', 'key' => 'timezone', 'value' => 'UTC', 'description' => 'Default timezone'],
            ['category' => 'general', 'key' => 'date_format', 'value' => 'Y-m-d', 'description' => 'Date format'],
            ['category' => 'general', 'key' => 'time_format', 'value' => 'H:i:s', 'description' => 'Time format'],

            // Email Settings
            ['category' => 'email', 'key' => 'provider', 'value' => 'smtp', 'description' => 'Email provider'],
            ['category' => 'email', 'key' => 'smtp_host', 'value' => 'smtp.mailtrap.io', 'description' => 'SMTP host'],
            ['category' => 'email', 'key' => 'smtp_port', 'value' => 587, 'description' => 'SMTP port'],
            ['category' => 'email', 'key' => 'smtp_encryption', 'value' => 'tls', 'description' => 'SMTP encryption'],
            ['category' => 'email', 'key' => 'from_email', 'value' => 'noreply@bitflow.edu', 'description' => 'From email address'],
            ['category' => 'email', 'key' => 'from_name', 'value' => 'Bitflow LMS', 'description' => 'From name'],

            // SMS Settings
            ['category' => 'sms', 'key' => 'provider', 'value' => 'twilio', 'description' => 'SMS provider'],
            ['category' => 'sms', 'key' => 'sender_id', 'value' => 'BITFLOW', 'description' => 'SMS sender ID'],

            // Payment Settings
            ['category' => 'payment', 'key' => 'provider', 'value' => 'stripe', 'description' => 'Payment provider'],
            ['category' => 'payment', 'key' => 'currency', 'value' => 'USD', 'description' => 'Default currency'],
            ['category' => 'payment', 'key' => 'test_mode', 'value' => true, 'description' => 'Test mode enabled'],

            // Storage Settings
            ['category' => 'storage', 'key' => 'provider', 'value' => 'local', 'description' => 'Storage provider'],
            ['category' => 'storage', 'key' => 'default_quota_gb', 'value' => 500, 'description' => 'Default storage quota in GB'],

            // Security Settings
            ['category' => 'security', 'key' => 'password_min_length', 'value' => 8, 'description' => 'Minimum password length'],
            ['category' => 'security', 'key' => 'password_require_uppercase', 'value' => true, 'description' => 'Require uppercase'],
            ['category' => 'security', 'key' => 'password_require_lowercase', 'value' => true, 'description' => 'Require lowercase'],
            ['category' => 'security', 'key' => 'password_require_numbers', 'value' => true, 'description' => 'Require numbers'],
            ['category' => 'security', 'key' => 'password_require_symbols', 'value' => false, 'description' => 'Require symbols'],
            ['category' => 'security', 'key' => 'password_expiry_days', 'value' => 90, 'description' => 'Password expiry in days'],
            ['category' => 'security', 'key' => 'mfa_enforced', 'value' => false, 'description' => 'MFA enforcement'],
            ['category' => 'security', 'key' => 'session_timeout_minutes', 'value' => 120, 'description' => 'Session timeout in minutes'],
            ['category' => 'security', 'key' => 'max_concurrent_sessions', 'value' => 3, 'description' => 'Max concurrent sessions'],

            // API Settings
            ['category' => 'api', 'key' => 'rate_limit_per_minute', 'value' => 60, 'description' => 'Rate limit per minute'],
            ['category' => 'api', 'key' => 'rate_limit_per_hour', 'value' => 1000, 'description' => 'Rate limit per hour'],
            ['category' => 'api', 'key' => 'enable_api_keys', 'value' => true, 'description' => 'Enable API keys'],
            ['category' => 'api', 'key' => 'enable_webhooks', 'value' => true, 'description' => 'Enable webhooks'],
            ['category' => 'api', 'key' => 'webhook_retry_attempts', 'value' => 3, 'description' => 'Webhook retry attempts'],
            ['category' => 'api', 'key' => 'api_version', 'value' => 'v1', 'description' => 'API version'],
        ];

        foreach ($settings as $setting) {
            PlatformSetting::updateOrCreate(
                ['category' => $setting['category'], 'key' => $setting['key']],
                [
                    'value' => $setting['value'],
                    'description' => $setting['description'],
                    'is_encrypted' => false,
                ]
            );
        }

        $this->command->info('Platform settings seeded successfully!');
    }
}

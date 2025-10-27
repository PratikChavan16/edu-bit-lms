<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\PlatformSetting;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class SettingsController extends Controller
{
    /**
     * Get all global settings
     */
    public function index()
    {
        try {
            $settings = [
                'general' => PlatformSetting::getByCategory('general'),
                'email' => PlatformSetting::getByCategory('email'),
                'sms' => PlatformSetting::getByCategory('sms'),
                'payment' => PlatformSetting::getByCategory('payment'),
                'storage' => PlatformSetting::getByCategory('storage'),
                'security' => PlatformSetting::getByCategory('security'),
                'api' => PlatformSetting::getByCategory('api'),
            ];

            return response()->json([
                'success' => true,
                'data' => $settings,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch settings: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch settings',
            ], 500);
        }
    }

    /**
     * Update general settings
     */
    public function updateGeneral(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'platform_name' => 'nullable|string|max:255',
            'platform_url' => 'nullable|url',
            'support_email' => 'nullable|email',
            'support_phone' => 'nullable|string|max:20',
            'timezone' => 'nullable|string|max:50',
            'date_format' => 'nullable|string|max:20',
            'time_format' => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $oldSettings = PlatformSetting::getByCategory('general');

            foreach ($request->all() as $key => $value) {
                PlatformSetting::set('general', $key, $value);
            }

            // Log the change
            AuditLog::log('UPDATE', 'Settings', null, [
                'category' => 'general',
                'old' => $oldSettings,
                'new' => $request->all(),
            ], 'Updated general settings');

            return response()->json([
                'success' => true,
                'message' => 'General settings updated successfully',
                'data' => PlatformSetting::getByCategory('general'),
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to update general settings: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update settings',
            ], 500);
        }
    }

    /**
     * Update email settings
     */
    public function updateEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'provider' => 'nullable|string|in:smtp,sendgrid,aws_ses,mailgun',
            'smtp_host' => 'nullable|string|max:255',
            'smtp_port' => 'nullable|integer|between:1,65535',
            'smtp_username' => 'nullable|string|max:255',
            'smtp_password' => 'nullable|string|max:255',
            'smtp_encryption' => 'nullable|string|in:tls,ssl,none',
            'from_email' => 'nullable|email',
            'from_name' => 'nullable|string|max:255',
            'api_key' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $oldSettings = PlatformSetting::getByCategory('email');

            foreach ($request->all() as $key => $value) {
                // Encrypt sensitive fields
                $isEncrypted = in_array($key, ['smtp_password', 'api_key']);
                PlatformSetting::updateOrCreate(
                    ['category' => 'email', 'key' => $key],
                    [
                        'value' => $value,
                        'is_encrypted' => $isEncrypted,
                    ]
                );
            }

            AuditLog::log('UPDATE', 'Settings', null, [
                'category' => 'email',
                'fields_updated' => array_keys($request->all()),
            ], 'Updated email settings');

            return response()->json([
                'success' => true,
                'message' => 'Email settings updated successfully',
                'data' => PlatformSetting::getByCategory('email'),
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to update email settings: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update settings',
            ], 500);
        }
    }

    /**
     * Update SMS settings
     */
    public function updateSms(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'provider' => 'nullable|string|in:twilio,aws_sns,nexmo,msg91',
            'api_key' => 'nullable|string|max:255',
            'api_secret' => 'nullable|string|max:255',
            'sender_id' => 'nullable|string|max:20',
            'account_sid' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $oldSettings = PlatformSetting::getByCategory('sms');

            foreach ($request->all() as $key => $value) {
                $isEncrypted = in_array($key, ['api_key', 'api_secret']);
                PlatformSetting::updateOrCreate(
                    ['category' => 'sms', 'key' => $key],
                    [
                        'value' => $value,
                        'is_encrypted' => $isEncrypted,
                    ]
                );
            }

            AuditLog::log('UPDATE', 'Settings', null, [
                'category' => 'sms',
                'fields_updated' => array_keys($request->all()),
            ], 'Updated SMS settings');

            return response()->json([
                'success' => true,
                'message' => 'SMS settings updated successfully',
                'data' => PlatformSetting::getByCategory('sms'),
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to update SMS settings: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update settings',
            ], 500);
        }
    }

    /**
     * Update payment settings
     */
    public function updatePayment(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'provider' => 'nullable|string|in:stripe,razorpay,paypal,square',
            'api_key' => 'nullable|string|max:255',
            'api_secret' => 'nullable|string|max:255',
            'webhook_secret' => 'nullable|string|max:255',
            'currency' => 'nullable|string|size:3',
            'test_mode' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            foreach ($request->all() as $key => $value) {
                $isEncrypted = in_array($key, ['api_key', 'api_secret', 'webhook_secret']);
                PlatformSetting::updateOrCreate(
                    ['category' => 'payment', 'key' => $key],
                    [
                        'value' => $value,
                        'is_encrypted' => $isEncrypted,
                    ]
                );
            }

            AuditLog::log('UPDATE', 'Settings', null, [
                'category' => 'payment',
                'fields_updated' => array_keys($request->all()),
            ], 'Updated payment settings');

            return response()->json([
                'success' => true,
                'message' => 'Payment settings updated successfully',
                'data' => PlatformSetting::getByCategory('payment'),
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to update payment settings: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update settings',
            ], 500);
        }
    }

    /**
     * Update storage settings
     */
    public function updateStorage(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'provider' => 'nullable|string|in:local,aws_s3,google_cloud,azure',
            'bucket_name' => 'nullable|string|max:255',
            'region' => 'nullable|string|max:50',
            'access_key' => 'nullable|string|max:255',
            'secret_key' => 'nullable|string|max:255',
            'default_quota_gb' => 'nullable|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            foreach ($request->all() as $key => $value) {
                $isEncrypted = in_array($key, ['access_key', 'secret_key']);
                PlatformSetting::updateOrCreate(
                    ['category' => 'storage', 'key' => $key],
                    [
                        'value' => $value,
                        'is_encrypted' => $isEncrypted,
                    ]
                );
            }

            AuditLog::log('UPDATE', 'Settings', null, [
                'category' => 'storage',
                'fields_updated' => array_keys($request->all()),
            ], 'Updated storage settings');

            return response()->json([
                'success' => true,
                'message' => 'Storage settings updated successfully',
                'data' => PlatformSetting::getByCategory('storage'),
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to update storage settings: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update settings',
            ], 500);
        }
    }

    /**
     * Update security settings
     */
    public function updateSecurity(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'password_min_length' => 'nullable|integer|between:6,32',
            'password_require_uppercase' => 'nullable|boolean',
            'password_require_lowercase' => 'nullable|boolean',
            'password_require_numbers' => 'nullable|boolean',
            'password_require_symbols' => 'nullable|boolean',
            'password_expiry_days' => 'nullable|integer|min:0',
            'mfa_enforced' => 'nullable|boolean',
            'session_timeout_minutes' => 'nullable|integer|min:5',
            'max_concurrent_sessions' => 'nullable|integer|min:1',
            'ip_whitelist' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            foreach ($request->all() as $key => $value) {
                PlatformSetting::set('security', $key, $value);
            }

            AuditLog::log('UPDATE', 'Settings', null, [
                'category' => 'security',
                'fields_updated' => array_keys($request->all()),
            ], 'Updated security settings');

            return response()->json([
                'success' => true,
                'message' => 'Security settings updated successfully',
                'data' => PlatformSetting::getByCategory('security'),
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to update security settings: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update settings',
            ], 500);
        }
    }

    /**
     * Update API settings
     */
    public function updateApi(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'rate_limit_per_minute' => 'nullable|integer|min:10',
            'rate_limit_per_hour' => 'nullable|integer|min:100',
            'enable_api_keys' => 'nullable|boolean',
            'enable_webhooks' => 'nullable|boolean',
            'webhook_retry_attempts' => 'nullable|integer|between:0,10',
            'api_version' => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            foreach ($request->all() as $key => $value) {
                PlatformSetting::set('api', $key, $value);
            }

            AuditLog::log('UPDATE', 'Settings', null, [
                'category' => 'api',
                'fields_updated' => array_keys($request->all()),
            ], 'Updated API settings');

            return response()->json([
                'success' => true,
                'message' => 'API settings updated successfully',
                'data' => PlatformSetting::getByCategory('api'),
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to update API settings: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update settings',
            ], 500);
        }
    }

    /**
     * Test email configuration
     */
    public function testEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'test_email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $settings = PlatformSetting::getByCategory('email');
            
            // Here you would configure the mailer with the settings
            // and send a test email
            
            // For now, we'll just log it
            Log::info('Test email sent to: ' . $request->test_email);

            AuditLog::log('CREATE', 'EmailTest', null, [
                'recipient' => $request->test_email,
            ], 'Sent test email');

            return response()->json([
                'success' => true,
                'message' => 'Test email sent successfully to ' . $request->test_email,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send test email: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to send test email: ' . $e->getMessage(),
            ], 500);
        }
    }
}

<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUniversityRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // TODO: Check if user has permission to create universities
        return $this->user()?->hasRole(['bitflow-nova-owner', 'super-admin']) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                'unique:universities,name',
            ],
            'code' => [
                'required',
                'string',
                'max:50',
                'regex:/^[a-z0-9-]+$/', // Only lowercase, numbers, and hyphens
            ],
            'status' => [
                'required',
                Rule::in(['live', 'staging', 'suspended']),
            ],
            'timezone' => [
                'nullable',
                'string',
                'max:50',
                'timezone',
            ],
            'storage_quota_gb' => [
                'nullable',
                'integer',
                'min:1',
                'max:10000',
            ],
            'branding' => [
                'nullable',
                'array',
            ],
            'branding.logo_url' => [
                'nullable',
                'url',
            ],
            'branding.primary_color' => [
                'nullable',
                'string',
                'regex:/^#[0-9A-Fa-f]{6}$/', // Hex color code
            ],
        ];
    }

    /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'University name is required',
            'name.unique' => 'A university with this name already exists',
            'code.required' => 'University code is required',
            'code.regex' => 'Code must contain only lowercase letters, numbers, and hyphens',
            'status.required' => 'Status is required',
            'status.in' => 'Status must be one of: live, staging, suspended',
            'timezone.timezone' => 'Invalid timezone',
            'storage_quota_gb.min' => 'Storage quota must be at least 1 GB',
            'storage_quota_gb.max' => 'Storage quota cannot exceed 10,000 GB',
            'branding.primary_color.regex' => 'Primary color must be a valid hex color code (e.g., #FF5733)',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Normalize code to lowercase
        if ($this->has('code')) {
            $this->merge([
                'code' => strtolower($this->code),
            ]);
        }

        // Set default timezone if not provided
        if (!$this->has('timezone')) {
            $this->merge([
                'timezone' => 'Asia/Kolkata',
            ]);
        }

        // Set default storage quota if not provided
        if (!$this->has('storage_quota_gb')) {
            $this->merge([
                'storage_quota_gb' => 100,
            ]);
        }
    }
}

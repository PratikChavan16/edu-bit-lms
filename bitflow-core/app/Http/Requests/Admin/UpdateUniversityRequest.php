<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUniversityRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // TODO: Check if user has permission to update universities
        return $this->user()?->hasRole(['bitflow-nova-owner', 'super-admin']) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $universityId = $this->route('universityId');

        return [
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('universities', 'name')->ignore($universityId),
            ],
            'status' => [
                'sometimes',
                'required',
                Rule::in(['live', 'staging', 'suspended']),
            ],
            'timezone' => [
                'sometimes',
                'nullable',
                'string',
                'max:50',
                'timezone',
            ],
            'storage_quota_gb' => [
                'sometimes',
                'nullable',
                'integer',
                'min:1',
                'max:10000',
            ],
            'branding' => [
                'sometimes',
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
            'status.required' => 'Status is required',
            'status.in' => 'Status must be one of: live, staging, suspended',
            'timezone.timezone' => 'Invalid timezone',
            'storage_quota_gb.min' => 'Storage quota must be at least 1 GB',
            'storage_quota_gb.max' => 'Storage quota cannot exceed 10,000 GB',
            'branding.primary_color.regex' => 'Primary color must be a valid hex color code (e.g., #FF5733)',
        ];
    }
}

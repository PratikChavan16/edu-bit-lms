<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDepartmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $departmentId = $this->route('departmentId');
        $collegeId = $this->route('collegeId');

        return [
            'name' => 'sometimes|required|string|min:3|max:255',
            'code' => "sometimes|required|string|min:2|max:50|unique:departments,code,{$departmentId},id,college_id,{$collegeId}",
            'head_faculty_id' => 'nullable|uuid|exists:faculty,id',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'floor_location' => 'nullable|string|max:100',
            'status' => 'sometimes|required|in:active,inactive',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Department name is required',
            'name.min' => 'Department name must be at least 3 characters',
            'code.required' => 'Department code is required',
            'code.min' => 'Department code must be at least 2 characters',
            'code.unique' => 'This department code already exists in this college',
            'head_faculty_id.exists' => 'The selected faculty member does not exist',
            'email.email' => 'Please provide a valid email address',
            'status.in' => 'Status must be either active or inactive',
        ];
    }
}

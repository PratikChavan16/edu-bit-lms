<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFacultyRequest extends FormRequest
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
        return [
            'user_id' => 'required|uuid|exists:users,id|unique:faculty,user_id',
            'department_id' => 'nullable|uuid|exists:departments,id',
            'employee_id' => 'required|string|max:50|unique:faculty,employee_id',
            'designation' => 'required|string|max:100',
            'qualification' => 'nullable|string|max:255',
            'specialization' => 'nullable|string',
            'experience_years' => 'nullable|integer|min:0|max:50',
            'employment_type' => 'required|in:full-time,part-time,visiting,contract',
            'joining_date' => 'required|date',
            'salary' => 'nullable|numeric|min:0',
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
            'user_id.required' => 'User account is required',
            'user_id.exists' => 'The selected user does not exist',
            'user_id.unique' => 'This user already has a faculty profile',
            'employee_id.required' => 'Employee ID is required',
            'employee_id.unique' => 'This employee ID already exists',
            'designation.required' => 'Designation is required',
            'employment_type.required' => 'Employment type is required',
            'employment_type.in' => 'Employment type must be one of: full-time, part-time, visiting, contract',
            'joining_date.required' => 'Joining date is required',
        ];
    }
}

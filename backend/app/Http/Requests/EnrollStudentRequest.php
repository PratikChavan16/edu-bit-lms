<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EnrollStudentRequest extends FormRequest
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
            'user_id' => 'required|uuid|exists:users,id',
            'department_id' => 'nullable|uuid|exists:departments,id',
            'admission_number' => 'required|string|max:50|unique:students,admission_number',
            'admission_date' => 'required|date',
            'course' => 'required|string|max:100',
            'year' => 'required|integer|min:1|max:6',
            'section' => 'nullable|string|max:10',
            'roll_number' => 'nullable|string|max:50',
            'blood_group' => 'nullable|string|max:5',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|string|max:20',
            'nationality' => 'nullable|string|max:100',
            'emergency_contact' => 'nullable|array',
            'guardian_name' => 'nullable|string|max:255',
            'guardian_phone' => 'nullable|string|max:20',
            'guardian_email' => 'nullable|email|max:255',
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
            'admission_number.required' => 'Admission number is required',
            'admission_number.unique' => 'This admission number already exists',
            'admission_date.required' => 'Admission date is required',
            'course.required' => 'Course is required',
            'year.required' => 'Year/semester is required',
            'year.min' => 'Year must be between 1 and 6',
            'year.max' => 'Year must be between 1 and 6',
        ];
    }
}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStudentRequest extends FormRequest
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
        $studentId = $this->route('studentId');

        return [
            'department_id' => 'sometimes|nullable|uuid|exists:departments,id',
            'admission_number' => "sometimes|required|string|max:50|unique:students,admission_number,{$studentId},id",
            'admission_date' => 'sometimes|required|date',
            'course' => 'sometimes|required|string|max:100',
            'year' => 'sometimes|required|integer|min:1|max:6',
            'section' => 'sometimes|nullable|string|max:10',
            'roll_number' => 'sometimes|nullable|string|max:50',
            'blood_group' => 'sometimes|nullable|string|max:5',
            'date_of_birth' => 'sometimes|nullable|date',
            'gender' => 'sometimes|nullable|string|max:20',
            'nationality' => 'sometimes|nullable|string|max:100',
            'emergency_contact' => 'sometimes|nullable|array',
            'guardian_name' => 'sometimes|nullable|string|max:255',
            'guardian_phone' => 'sometimes|nullable|string|max:20',
            'guardian_email' => 'sometimes|nullable|email|max:255',
            'status' => 'sometimes|required|in:active,suspended,graduated,dropped',
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
            'admission_number.unique' => 'This admission number already exists',
            'year.min' => 'Year must be between 1 and 6',
            'year.max' => 'Year must be between 1 and 6',
            'status.in' => 'Status must be one of: active, suspended, graduated, dropped',
        ];
    }
}

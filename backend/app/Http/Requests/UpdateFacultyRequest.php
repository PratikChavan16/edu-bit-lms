<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFacultyRequest extends FormRequest
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
        $staffId = $this->route('staffId');

        return [
            'department_id' => 'sometimes|nullable|uuid|exists:departments,id',
            'employee_id' => "sometimes|required|string|max:50|unique:faculty,employee_id,{$staffId},id",
            'designation' => 'sometimes|required|string|max:100',
            'qualification' => 'sometimes|nullable|string|max:255',
            'specialization' => 'sometimes|nullable|string',
            'experience_years' => 'sometimes|nullable|integer|min:0|max:50',
            'employment_type' => 'sometimes|required|in:full-time,part-time,visiting,contract',
            'joining_date' => 'sometimes|required|date',
            'salary' => 'sometimes|nullable|numeric|min:0',
            'status' => 'sometimes|required|in:active,on_leave,inactive,terminated',
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
            'employee_id.unique' => 'This employee ID already exists',
            'employment_type.in' => 'Employment type must be one of: full-time, part-time, visiting, contract',
            'status.in' => 'Status must be one of: active, on_leave, inactive, terminated',
        ];
    }
}

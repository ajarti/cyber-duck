<?php

namespace App\Http\Requests;

use Auth;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;


class UpdateEmployeeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return Auth::check();
    }


    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'id'         => 'required|integer|exists:employees,id',
            'first_name' => 'required|max:75',
            'last_name'  => 'required|max:75',
            'email'      => ['max:64|email', Rule::unique('employees')->ignore($this->id)],
            'phone'      => 'max:50',
            'company_id' => 'required|integer|exists:companies,id',
        ];
    }
}

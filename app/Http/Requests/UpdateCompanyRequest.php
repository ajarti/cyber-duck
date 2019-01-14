<?php

namespace App\Http\Requests;

use Auth;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;


class UpdateCompanyRequest extends FormRequest
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
            'id'       => 'required|integer|exists:companies,id',
            'name'     => 'required|max:75',
            'email'    => ['max:64|email', Rule::unique('companies')->ignore($this->id)],
            'logo'     => 'max:250',
            'new_logo' => 'max:250',
            'website'  => 'nullable|max:50|url'
        ];
    }
}

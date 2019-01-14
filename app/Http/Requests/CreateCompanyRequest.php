<?php

namespace App\Http\Requests;

use Auth;
use Illuminate\Foundation\Http\FormRequest;


class CreateCompanyRequest extends FormRequest
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
            'name'     => 'required|max:75|unique:companies,name',
            'email'    => 'max:64|email|unique:companies,email',
            'logo'     => 'max:250',
            'new_logo' => 'max:250',
            'website'  => 'nullable|max:50|url'
        ];
    }
}

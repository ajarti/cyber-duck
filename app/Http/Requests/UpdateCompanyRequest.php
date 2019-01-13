<?php

namespace App\Http\Requests;

use Auth;
use Illuminate\Foundation\Http\FormRequest;


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
            'id'      => 'required|integer|exists:companies,id',
            'name'    => 'required|max:75',
            'email'   => 'max:64|email',
            'logo'    => 'max:250',
            'website' => 'max:50|url'
        ];
    }


    /**
     * Get the validation messages that apply to the request.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'id.required' => 'The company id does not exist',
            'id.integer'  => 'The company id must be a number',
            'id.exists'   => 'The company id does not exist',
        ];
    }
}

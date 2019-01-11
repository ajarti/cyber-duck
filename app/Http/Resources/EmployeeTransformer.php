<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeTransformer extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request $request
     *
     * @return array
     */
    public function toArray($request)
    {
        $data = [
            'id'         => $this->id,
            'first_name' => $this->first_name,
            'last_name'  => $this->last_name,
            'email'      => $this->email,
            'phone'      => $this->phone,
            'deleted'    => $this->trashed(),
            'created_ts' => ( isset($this->created_at) && is_a($this->created_at, Carbon::class) ) ? $this->created_at->getTimestamp() : '',
            'updated_ts' => ( isset($this->updated_at) && is_a($this->updated_at, Carbon::class) ) ? $this->updated_at->getTimestamp() : '',
            'deleted_ts' => ( isset($this->deleted_at) && is_a($this->deleted_at, Carbon::class) ) ? $this->deleted_at->getTimestamp() : '',
        ];

        // Company
        $data['company'] = new CompanyTransformer($this->company);

        // Return Transformed.
        return $data;
    }
}

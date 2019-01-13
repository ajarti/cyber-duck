<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model
{
    use softDeletes;

    /**
     * Disable Mass Assignment protection.
     *
     * @var array
     */
    protected $guarded = [];


    // ---------------------------  Relationships ----------------------------- //

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}

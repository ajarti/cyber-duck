<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model
{
    use softDeletes;


    // ---------------------------  Relationships ----------------------------- //

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}

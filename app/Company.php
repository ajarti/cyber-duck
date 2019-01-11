<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Company extends Model
{
    use softDeletes;

    // ---------------------------  Relationships ----------------------------- //

    public function employees()
    {
        return $this->hasMany(Employee::class);
    }

}

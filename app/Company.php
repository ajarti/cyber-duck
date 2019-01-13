<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Company extends Model
{
    use softDeletes;

    /**
     * Disable Mass Assignment protection.
     *
     * @var array
     */
    protected $guarded = [];

    // ---------------------------  Relationships ----------------------------- //

    public function employees()
    {
        return $this->hasMany(Employee::class);
    }

}

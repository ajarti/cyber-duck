<?php

namespace App;

use Illuminate\Support\Facades\Hash;
use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];


    // ---------------------------  Mutators ---------------------------------- //


    /**
     * Checks if password needs hashing.
     *
     * @param $password
     */
    public function setPasswordAttribute($password)
    {
        if ( Hash::needsRehash($password) ) {
            $this->attributes['password'] = Hash::make($password);
        }
    }

}

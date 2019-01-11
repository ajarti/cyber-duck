<?php

use App\User;
use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Clear the table and allow bulk inserts.
        DB::table('users')->truncate();
        User::unguard();

        // Create the sample user.
        User::create([
            'name'     => 'Admin',
            'email'    => 'admin@admin.com',
            'password' => 'password'
        ]);

    }
}

<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(UsersTableSeeder::class);

        factory(App\Company::class, 20)->create()->each(function ($company) {
            for ( $i = 0; $i < 10; $i++ ) {
                $company->employees()->save(factory(App\Employee::class)->make());
            }
        });

        // Create random colour logos.
//        $companies = \App\Company::all();
//        foreach ( $companies as $company ) {
//            $url = 'https://via.placeholder.com/500/' . mt_rand(555555, 999999) . '/000000?text=' . preg_replace("/[^A-Za-z0-9]/", '', $company->name);
//            $contents = file_get_contents($url);
//            Storage::disk('public')->put('logos/square_logo_' . $company->id . '.png', $contents);
//            $company->logo = 'logo_'.$company->id . '.png';
//            $company->save();
//        }
    }
}

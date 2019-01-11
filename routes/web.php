<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return redirect('app');
});

/**
 * Auth routes (N.B. no registration)
 */
Auth::routes(['register' => false]);

/**
 * Protected Pages.
 */
Route::group(['middleware' => 'auth'], function () {

    // Dashboard
    Route::get('/app', 'AppController@index');

    // Companies
    Route::post('/companies/search', 'CompanyController@search');

    // Employees
    Route::post('/employees/search', 'EmployeeController@search');

});


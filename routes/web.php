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
 * TUS Server Routes
 */
Route::any('/tus/{any?}', function () {
    $response = app('tus-server')->serve();
    return $response->send();
})->where('any', '.*');

/**
 * Protected Pages.
 */
Route::group(['middleware' => 'auth'], function () {

    // Base
    Route::get('/app', 'AppController@index');

    // Images
    Route::get('/logo/{logo}', 'AppController@logo');

    // Companies
    Route::post('/companies/search', 'CompanyController@search');
    Route::post('/company/create', 'CompanyController@store');
    Route::post('/company/delete', 'CompanyController@delete');
    Route::post('/company/restore', 'CompanyController@restore');
    Route::post('/company/update', 'CompanyController@update');
    Route::post('/company/upload/logo', 'CompanyController@uploadLogo'); // May be other types in future.

    // Employees
    Route::post('/employees/search', 'EmployeeController@search');
    Route::post('/employee/create', 'EmployeeController@store');
    Route::post('/employee/delete', 'EmployeeController@delete');
    Route::post('/employee/restore', 'EmployeeController@restore');
    Route::post('/employee/update', 'EmployeeController@update');

});


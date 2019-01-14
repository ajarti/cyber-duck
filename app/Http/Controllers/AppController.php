<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Intervention\Image\Facades\Image;

class AppController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }


    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        return view('app');
    }


    /**
     * Proxy logos and inject placeholder if missing.
     *
     * @param null $logo
     *
     * @return mixed
     */
    public function logo($logo = null)
    {
        $logosPath = public_path('storage/logos');
        $img = Image::make($logosPath . 'logo-placeholder.png');

        if ( !is_null($logo) && strlen($logo) && File::exists($logosPath . $logo) ) {
            $img = Image::make($logosPath . $logo);
            return $img->response();
        } else {
            $img = Image::make($logosPath . 'logo-placeholder.png');
            return $img->response();
        }
    }

}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;


class ViewController extends Controller
{
    public function dashboard(){

    return inertia('admin/dashboard/page');

    }
}
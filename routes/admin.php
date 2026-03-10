<?php

use App\Http\Controllers\Admin\ViewController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group( function(){
    Route::get('/admin/dashboard/', [ViewController::class, 'dashboard']);
});

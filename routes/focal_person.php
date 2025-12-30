<?php

use App\Http\Controllers\FocalPerson\ViewController;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:focal_person'])->group(function () {
    Route::get('/focal-person/dashboard', [ViewController::class, 'dashboard'])->name('focal-person.dashboard');
    Route::get('/focal-person/programs',[ViewController::class, 'programs'])->name('focal-person.programs');
    Route::get('/focal-person/programs/{program}/reports',[ViewController::class, 'reports'])->name('focal-person.programs.reports');

    //POST
    Route::post('/focal-person/programs/reports',[ReportController::class, 'store'])->name('focal-person.programs.reports.create');
});

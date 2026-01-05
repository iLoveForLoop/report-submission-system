<?php

use App\Http\Controllers\ProgramController;
use App\Http\Controllers\ProgramHead\ViewController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:program_head'])->group(function () {
    Route::get('/program-head/dashboard', [ViewController::class, 'dashboard'])->name('program-head.dashboard');
    Route::get('/program-head/programs', [ViewController::class, 'programs'])->name('program-head.programs');
    Route::get('/program-head/programs/{program}/reports', [ViewController::class, 'reports'])->name('program-head.programs.reports');


    // POST
    Route::post('/program-head/programs',[ProgramController::class, 'store'])->name('program-head.programs.store');


    // DELETE
    Route::delete('/program-head/programs/{program}',[ProgramController::class, 'destroy'])->name('program-head.programs.destroy');
});

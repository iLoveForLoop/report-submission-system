<?php

use App\Http\Controllers\ProvincialDirector\ViewController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:provincial_director'])->group(function () {

    Route::get('/provincial-director/dashboard', [ViewController::class, 'dashboard'])->name('provincial-director.dashboard');
    Route::get('/provincial-director/programs',[ViewController::class, 'programs'])->name('provincial-director.programs');
    Route::get('/provincial-director/programs/{program}/reports',[ViewController::class, 'reports'])->name('provincial-director.programs.reports');
    Route::get('/provincial-director/submission-logs',[ViewController::class, 'submissionLogs'])->name('provincial-director.programs');
    Route::get('/provincial-director/programs/{report}/submissions', [ViewController::class, 'submissions'])->name('program-head.programs.reports.submissions');

});

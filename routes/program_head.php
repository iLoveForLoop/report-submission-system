<?php

use App\Http\Controllers\ProgramController;
use App\Http\Controllers\ProgramHead\ViewController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:program_head'])->group(function () {
    Route::get('/program-head/dashboard', [ViewController::class, 'dashboard'])->name('program-head.dashboard');
    Route::get('/program-head/programs', [ViewController::class, 'programs'])->name('program-head.programs');
    Route::get('/program-head/programs/{program}/reports', [ViewController::class, 'reports'])->name('program-head.programs.reports');
    Route::get('/program-head/programs/{report}/submissions', [ViewController::class, 'submissions'])->name('program-head.programs.reports.submissions');
    Route::get('/program-head/manage-users',[ViewController::class, 'manageUsers'])->name('prgram-head.manage-users');
    Route::get('/program-head/manage-users/{user}', [ViewController::class, 'viewUser'])->name('program-head.manage-users.view');
    Route::get('/program-head/notifications', [ViewController::class, 'notifications'])->name('program-head.notifications');

    // POST
    Route::post('/program-head/manage-users', [UserController::class, 'store'])->name('program-head.store');
    Route::post('/program-head/programs',[ProgramController::class, 'store'])->name('program-head.programs.store');


    // DELETE
    Route::delete('/program-head/programs/manage-users', [UserController::class, 'deleteMultipleUsers'])->name('program-head.programs.delete-multiple-users');
    Route::delete('/program-head/programs/{program}',[ProgramController::class, 'destroy'])->name('program-head.programs.destroy');
});

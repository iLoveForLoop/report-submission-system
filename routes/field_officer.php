<?php

use App\Http\Controllers\FieldOfficer\ViewController;
use App\Http\Controllers\ReportSubmissionController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:field_officer'])->group(function () {

    Route::get('/field-officer/dashboard', [ViewController::class, 'dashboard'])->name('field-officer.dashboard');
    Route::get('/field-officer/programs', [ViewController::class, 'programs'])->name('field-officer.programs');
    Route::get('/field-officer/programs/{program}/reports', [ViewController::class, 'reports'])->name('field-officer.programs.reports');
    Route::get('/field-officer/programs/{program}/reports/{report}/reports-submissions', [ViewController::class, 'reportSubmissions'])->name('field-officer.programs.reports.report-submissions');
    Route::get('/field-officer/my-reports-submissions',[ViewController::class, 'myReportSubmissions'])->name('field-officer.my-reports');


    //POST
    Route::post('/field-officer/reports', [ReportSubmissionController::class, 'store'])->name('field-officer.reports.store');

});
<?php

use App\Http\Controllers\FocalPerson\ViewController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ReportSubmissionController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:focal_person'])->group(function () {
    Route::get('/focal-person/dashboard', [ViewController::class, 'dashboard'])->name('focal-person.dashboard');
    Route::get('/focal-person/programs',[ViewController::class, 'programs'])->name('focal-person.programs');
    Route::get('/focal-person/programs/{program}/reports',[ViewController::class, 'reports'])->name('focal-person.programs.reports');
    Route::get('/focal-person/programs/{program}/reports/{report}/report-submissions',[ViewController::class, 'reportSubmissions'])->name('focal-person.programs.reports.report-submissions');
    Route::get('/focal-person/notifications', [ViewController::class, 'notifications'])->name('focal-person.notifications');
    Route::get('/focal-person/submission-logs', [ViewController::class, 'submissionPage'])->name('focal-person.submission-logs');
    Route::get('/focal-person/review-queue', [ViewController::class, 'reviewQueuePage'])->name('focal-person.review-queue');

    //POST
    Route::post('/focal-person/programs/reports',[ReportController::class, 'store'])->name('focal-person.programs.reports.create');

    //patch
    Route::patch('/focal-person/report-submissions/{reportSubmission}/update-status', [ReportSubmissionController::class, 'updateStatus'])->name('focal-person.programs.reports.report-submissions.update-status');

});
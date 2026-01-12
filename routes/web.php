<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;


Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

 Route::get('/downloads/folder/{report}', function (\App\Models\Report $report) {

    $zipFileName = 'report-' . $report->id . '-templates.zip';
    
    // Create temporary file
    $tempFile = tempnam(sys_get_temp_dir(), 'zip');

    $zip = new ZipArchive();
    if ($zip->open($tempFile, ZipArchive::CREATE) !== true) {
        abort(500, 'Could not create ZIP file');
    }

    // Add all templates
    foreach ($report->getMedia('templates') as $media) {
        $filePath = $media->getPath(); // local path
        if (file_exists($filePath)) {
            $zip->addFile($filePath, $media->file_name);
        }
    }

    $zip->close();


    // Return the ZIP for download and delete after sending
    return response()->download($tempFile, $zipFileName)->deleteFileAfterSend(true);
})->middleware('auth');

Route::middleware(['auth', 'verified', 'role.redirect'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

   


});

require __DIR__.'/settings.php';
require __DIR__.'/field_officer.php';
require __DIR__.'/focal_person.php';
require __DIR__.'/program_head.php';
require __DIR__.'/provincial_director.php';

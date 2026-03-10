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
    $zipFileName = 'report-' . $report->id . '-submissions.zip';

    $tempFile = tempnam(sys_get_temp_dir(), 'zip') . '.zip';

    $zip = new ZipArchive();
    if ($zip->open($tempFile, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
        abort(500, 'Could not create ZIP file');
    }

    $filesAdded = 0;

    foreach ($report->submissions as $submission) {
        // Create readable folder name with officer name
        $officerName = $submission->fieldOfficer ?
            \Illuminate\Support\Str::slug($submission->fieldOfficer->name) :
            'unknown-officer';

        foreach ($submission->getMedia('submission_attachments') as $media) {
            $filePath = $media->getPath();
            if (file_exists($filePath)) {
                // Example: john-doe/filename.pdf
                $zip->addFile($filePath, $officerName . '/' . $media->file_name);
                $filesAdded++;
            }
        }
    }

    $zip->close();

    if ($filesAdded === 0) {
        unlink($tempFile);
        abort(404, 'No submission attachments found');
    }

    return response()->download($tempFile, $zipFileName)->deleteFileAfterSend(true);
})->middleware('auth');

Route::middleware(['auth', 'verified', 'role.redirect'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');


});

Route::get('/media/{media}/download', function (\Spatie\MediaLibrary\MediaCollections\Models\Media $media) {
    return response()->download($media->getPath(), $media->file_name);
})->name('media.download');



require __DIR__.'/settings.php';
require __DIR__.'/notifications.php';
require __DIR__.'/admin.php';
require __DIR__.'/field_officer.php';
require __DIR__.'/focal_person.php';
require __DIR__.'/program_head.php';
require __DIR__.'/provincial_director.php';
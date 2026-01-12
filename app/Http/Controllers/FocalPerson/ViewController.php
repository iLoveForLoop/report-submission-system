<?php

namespace App\Http\Controllers\FocalPerson;

use App\Http\Controllers\Controller;
use App\Models\Program;
use App\Models\Report;
use Illuminate\Http\Request;

class ViewController extends Controller
{
    public function dashboard(){

        return inertia('focal-person/dashboard/page');
    }

    public function programs(){
         $programs = auth()->user()
        ->programsAsCoordinator()
        ->with('coordinator')
        ->get()
        ->map(fn ($program) => [
            'id' => $program->id,
            'name' => $program->name,
            'description' => $program->description,
            'created_at' => $program->created_at->toISOString(),
            'updated_at' => $program->updated_at->toISOString(),
            'coordinator' => [
                'id' => $program->coordinator->id,
                'name' => $program->coordinator->name,
                'email' => $program->coordinator->email,
                'avatar' => $program->coordinator->avatar,
                'email_verified_at' => $program->coordinator->email_verified_at,
                'two_factor_enabled' => $program->coordinator->two_factor_enabled ?? false,
                'created_at' => $program->coordinator->created_at->toISOString(),
                'updated_at' => $program->coordinator->updated_at->toISOString(),
                'role' => $program->coordinator->role,
            ],
        ]);
        return inertia('focal-person/programs/page', [
            'programs' => $programs,
        ]);
    }

    public function reports(Program $program)
{
    $reports = auth()->user()
        ->createdReports()
        ->where('program_id', $program->id)
        ->with(['program', 'coordinator', 'media'])
        ->get()
        ->map(fn ($report) => [
            'id' => $report->id,
            'title' => $report->title,
            'content' => $report->content,
            'form_schema' => $report->form_schema,  


            'program' => [
                'id' => $report->program->id,
                'name' => $report->program->name,
                'description' => $report->program->description,
            ],

            'coordinator' => [
                'id' => $report->coordinator->id,
                'name' => $report->coordinator->name,
                'email' => $report->coordinator->email,
                'avatar' => $report->coordinator->avatar,
            ],

            'templates' => $report
                ->getMedia('templates')
                ->map(fn ($media) => [
                    'id' => $media->id,
                    'name' => $media->name,
                    'file_name' => $media->file_name,
                    'mime_type' => $media->mime_type,
                    'size' => $media->size,
                    'url' => $media->getFullUrl(),
                ]),

            'created_at' => $report->created_at->toISOString(),
            'updated_at' => $report->updated_at->toISOString(),
        ]);

    return inertia('focal-person/programs/reports/page', [
        'program' => $program,
        'reports' => $reports,
    ]);
}


    public function reportSubmissions(Program $program, Report $report){

        $report->load('submissions.fieldOfficer');

        $submissions = $report->submissions()->with(['fieldOfficer:id,name,email,avatar', 'media'])->get();

        return inertia('focal-person/programs/reports/report-submissions/page', [
            'program' => $program,
            'reportSubmissions' => $submissions,
            'report' => $report
        ]);

    }
}

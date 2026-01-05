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
        ->with('program', 'coordinator')
        ->get()
        ->map(fn ($report) => [
            'id' => $report->id,
            'title' => $report->title,
            'content' => $report->content,
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
            'created_at' => $report->created_at->toISOString(),
            'updated_at' => $report->updated_at->toISOString(),
        ]);

        return inertia('focal-person/programs/reports/page',[
            "program" => $program,
            "reports" => $reports,
        ]);
    }

    public function reportSubmissions(Program $program, Report $report){

        $report->load('submissions.fieldOfficer');

        return inertia('focal-person/programs/reports/report-submissions/page', [
            'program' => $program,
            'reportSubmissions' => $report->submissions,
            'report' => $report
        ]);

    }
}

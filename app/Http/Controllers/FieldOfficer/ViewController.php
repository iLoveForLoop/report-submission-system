<?php

namespace App\Http\Controllers\FieldOfficer;

use App\Http\Controllers\Controller;
use App\Models\Program;
use App\Models\Report;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class ViewController extends Controller
{
    public function dashboard(){
        return inertia('field-officer/dashboard/page');
    }

    public function programs(){

        $programs = Program::with('coordinator')->get();

        return inertia('field-officer/programs/page', compact('programs'));
    }

    public function reports(Program $program){

        $reports = $program->reports()->get();

        return inertia('field-officer/programs/reports/page', compact('reports', 'program'));
    }

    public function reportSubmissions(Program $program, Report $report){

        $hasSubmitted = $report->hasSubmissionFromUser(Auth::id());

        $report->load('submissions.fieldOfficer');

        return inertia('field-officer/programs/reports/report-submissions/page', [
            'program' => $program,
            'report' => $report,
            'reportSubmissions' => $report->submissions,
            'hasSubmitted' => $hasSubmitted
        ]);
    }
}
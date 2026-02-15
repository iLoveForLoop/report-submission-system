<?php

namespace App\Http\Controllers\FieldOfficer;

use App\Http\Controllers\Controller;
use App\Models\Program;
use App\Models\Report;
use App\Models\ReportSubmission;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class ViewController extends Controller
{
    public function dashboard()
    {
        return inertia('field-officer/dashboard/page');
    }

    public function programs(Request $request)
    {
        $perPage = $request->get('per_page', 12);

        $programs = Program::with('coordinator')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return inertia('field-officer/programs/page', compact('programs'));
    }

    public function reports(Program $program)
    {
        $reports = $program->reports()->get();

        return inertia('field-officer/programs/reports/page', compact('reports', 'program'));
    }

    public function reportSubmissions(Program $program, Report $report)
    {
        $hasSubmitted = $report->hasSubmissionFromUser(Auth::id());

        $report->load([
            'submissions.fieldOfficer',
            'media',
        ]);

        $serializedReport = [
            'id' => $report->id,
            'title' => $report->title,
            'content' => $report->content,
            'deadline' => $report->deadline,
            'final_deadline' => $report->final_deadline,
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
                ->map(fn($media) => [
                    'id' => $media->id,
                    'name' => $media->name,
                    'file_name' => $media->file_name,
                    'mime_type' => $media->mime_type,
                    'size' => $media->size,
                    'original_url' => $media->original_url,
                ]),

            'created_at' => $report->created_at->toISOString(),
            'updated_at' => $report->updated_at->toISOString(),
        ];

        $submission = $report->submissions()
            ->select('id', 'report_id', 'field_officer_id', 'status', 'created_at', 'updated_at')
            ->whereBelongsTo(auth()->user(), 'fieldOfficer')
            ->with([
                'fieldOfficer:id,name,email',
                'media'
            ])
            ->first();

        return inertia('field-officer/programs/reports/report-submissions/page', [
            'program' => $program,
            'report' => $serializedReport,
            'reportSubmission' => $submission,
            'hasSubmitted' => $hasSubmitted
        ]);
    }

    public function myReportSubmissions(Request $request)
    {
        $perPage = $request->get('per_page', 12);
        $filter = $request->get('filter', 'all');

        $query = ReportSubmission::query()
            ->select('id', 'report_id', 'field_officer_id', 'status', 'created_at', 'updated_at')
            ->whereBelongsTo(auth()->user(), 'fieldOfficer')
            ->with([
                'fieldOfficer:id,name,email',
                'media',
                'report' // Eager load the report relationship
            ])
            ->orderBy('created_at', 'desc');

        // Apply filter - We'll implement this later
        // if ($filter !== 'all') {
        //     switch ($filter) {
        //         case 'pending':
        //             $query->whereIn('status', ['pending', 'submitted']);
        //             break;
        //         case 'accepted':
        //             $query->whereIn('status', ['accepted', 'approved']);
        //             break;
        //         case 'rejected':
        //             $query->where('status', 'rejected');
        //             break;
        //     }
        // }

        // Get paginated results using Laravel's built-in paginator
        $submissions = $query->paginate($perPage);

        return inertia('field-officer/my-report-submissions/page', [
            'mySubmissions' => $submissions, // Pass the full paginator object
            'filter' => $filter
        ]);
    }

    public function notifications()
    {
        return inertia('field-officer/notifications/page');
    }
}

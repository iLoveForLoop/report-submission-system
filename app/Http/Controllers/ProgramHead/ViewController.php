<?php

namespace App\Http\Controllers\ProgramHead;

use App\Http\Controllers\Controller;
use App\Models\Program;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ViewController extends Controller
{
    public function dashboard(){
        return inertia('program-head/dashboard/page');
    }

    public function programs()
    {
        $programs = Program::with('coordinator')
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

        $coordinators = User::role('focal_person')
                        ->select('id', 'name', 'email')
                        ->get();



        return Inertia::render('program-head/programs/page', [
            'programs' => Inertia::defer(fn () => $programs),
            'coordinators' => $coordinators,
        ]);
    }

    public function reports(Program $program)
    {
        $reports = $program->load("reports");

        return Inertia::render('program-head/programs/reports/page', [
            'program' => $program,
            'reports' => Inertia::defer(fn () => $reports->reports)
        ]);
    }

    public function submissions(Report $report)
{
    // Load submissions with relationships
    $report->load(['submissions' => function($query) {
        $query->with([
            'fieldOfficer',
            'media' // Load Spatie media
        ])->latest();
    }]);

    // Format the submissions to ensure media matches your interface
    $formattedSubmissions = $report->submissions->map(function ($submission) {
        return [
            'id' => $submission->id,
            'report_id' => $submission->report_id,
            'field_officer' => $submission->fieldOfficer,
            'status' => $submission->status,
            'timeliness' => $submission->timeliness,
            'description' => $submission->description,
            'remarks' => $submission->remarks,
            'created_at' => $submission->created_at,
            'updated_at' => $submission->updated_at,
            'media' => $submission->media->map(function ($media) {
                return [
                    'id' => (string) $media->id,
                    'name' => $media->name,
                    'file_name' => $media->file_name,
                    'mime_type' => $media->mime_type,
                    'size' => $media->size,
                    'original_url' => $media->getUrl(),
                ];
            }),
        ];
    });

    return Inertia::render('program-head/programs/reports/submissions/page', [
        'report' => $report,
        'submissions' => Inertia::defer(fn () => $formattedSubmissions)
    ]);
}

    public function manageUsers()
    {
           $users = User::query()
        ->select([
            'id',
            'employee_code',
            'first_name',
            'middle_name',
            'last_name',
            'gender',
            'department',
            'position',
            'cluster',
            'birthday',
            'email',
            'email_verified_at',
            'created_at',
            'updated_at',
        ])
        ->with('media') // required for Spatie
        ->latest()
        ->paginate(10)
        ->through(fn (User $user) => [
            'id' => $user->id,
            'employee_code' => $user->employee_code,
            'name' => trim("{$user->first_name} {$user->last_name}"),
            'first_name' => $user->first_name,
            'middle_name' => $user->middle_name,
            'last_name' => $user->last_name,
            'gender' => $user->gender,
            'department' => $user->department,
            'position' => $user->position,
            'cluster' => $user->cluster,
            'birthday' => $user->birthday?->toDateString(),
            'email' => $user->email,
            'email_verified_at' => $user->email_verified_at,
            'avatar_url' => $user->getFirstMediaUrl('avatar'),
            'created_at' => $user->created_at->toISOString(),
            'updated_at' => $user->updated_at->toISOString(),
            'role' => $user->roles->pluck('name')->first(), // if using Spatie Roles
        ]);

    return inertia('program-head/manage-users/page', [
        'users' => $users,
    ]);
    }

    public function viewUser(User $user){
        return inertia('program-head/manage-users/view', [
            'user' => $user,
        ]);
    }

    public function notifications(){
        return inertia('program-head/notifications/page');
    }

}

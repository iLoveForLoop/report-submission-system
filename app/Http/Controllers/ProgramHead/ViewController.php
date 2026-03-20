<?php

namespace App\Http\Controllers\ProgramHead;

use App\Http\Controllers\Controller;
use App\Models\Program;
use App\Models\Report;
use App\Models\ReportSubmission;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ViewController extends Controller
{
    public function dashboard(Request $request): \Inertia\Response
    {
        return inertia('program-head/dashboard/page', [
            'total_submissions'   => $this->getTotalSubmissions(),
            'active_officers'     => $this->getActiveOfficers(),
            'approved_count'      => $this->getApprovedCount(),
            'pending_count'       => $this->getPendingCount(),
            'cluster_chart_data'  => $this->getClusterChartData($request->month),
            'recent_submissions'  => $this->getRecentSubmissions(),
            'top_programs'        => $this->getTopPrograms(),
        ]);
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

    public function manageUsers(Request $request)
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
            ->with('media')
            ->with('roles') // needed for role filter

            // ── Search: name, email, employee_code ────────────────────────────
            ->when($request->input('search'), function ($q, $search) {
                $q->where(function ($inner) use ($search) {
                    $inner->whereRaw("CONCAT(first_name, ' ', last_name) LIKE ?", ["%{$search}%"])
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('employee_code', 'like', "%{$search}%");
                });
            })

            // ── Role ──────────────────────────────────────────────────────────
            ->when($request->input('role'), function ($q, $role) {
                $q->whereHas('roles', fn ($r) => $r->where('name', $role));
            })

            // ── Cluster ───────────────────────────────────────────────────────
            ->when($request->input('cluster'), function ($q, $cluster) {
                $q->where('cluster', $cluster);
            })

            // ── Department ────────────────────────────────────────────────────
            ->when($request->input('department'), function ($q, $department) {
                $q->where('department', $department);
            })

            // ── Position ──────────────────────────────────────────────────────
            ->when($request->input('position'), function ($q, $position) {
                $q->where('position', $position);
            })

            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(fn (User $user) => [
                'id'                 => $user->id,
                'employee_code'      => $user->employee_code,
                'name'               => trim("{$user->first_name} {$user->last_name}"),
                'first_name'         => $user->first_name,
                'middle_name'        => $user->middle_name,
                'last_name'          => $user->last_name,
                'gender'             => $user->gender,
                'department'         => $user->department,
                'position'           => $user->position,
                'cluster'            => $user->cluster,
                'birthday'           => $user->birthday?->toDateString(),
                'email'              => $user->email,
                'email_verified_at'  => $user->email_verified_at,
                'avatar_url'         => $user->getFirstMediaUrl('avatar'),
                'created_at'         => $user->created_at->toISOString(),
                'updated_at'         => $user->updated_at->toISOString(),
                'role'               => $user->roles->pluck('name')->first(),
            ]);

        // Distinct values for filter dropdowns — scoped to existing data
        $departments = User::whereNotNull('department')
            ->distinct()
            ->orderBy('department')
            ->pluck('department');

        $positions = User::whereNotNull('position')
            ->distinct()
            ->orderBy('position')
            ->pluck('position');

        return inertia('program-head/manage-users/page', [
            'users'       => $users,
            'departments' => $departments,
            'positions'   => $positions,
            'filters'     => $request->only(['search', 'role', 'cluster', 'department', 'position']),
        ]);
    }

    public function viewUser(User $user){
        return inertia('program-head/manage-users/view', [
            'user' => $user,
        ]);
    }

    public function submissionLogs() {

        $reports = $this->getReports();

        return inertia('provincial-director/submission-logs/page', [
            'reports' => $reports,
            'summary' => $this->getSummary($reports),
        ]);
    }

    public function notifications(){
        return inertia('program-head/notifications/page');
    }






    // PRIVATE FUNCTION

    // DASHBOARD

    private function getTotalSubmissions(): int
    {
        return ReportSubmission::count();
    }

    private function getActiveOfficers(): int
    {
        return User::role('field_officer')->count();
    }

    private function getApprovedCount(): int
    {
        return ReportSubmission::where('status', 'accepted')->count();
    }

    private function getPendingCount(): int
    {
        return ReportSubmission::where('status', 'submitted')->count();
    }


    private function getClusterChartData(?string $month): array
    {
        $clusters = ["M&M", "D'ONE"];

        return collect($clusters)->map(function (string $cluster) use ($month) {
            $base = ReportSubmission::whereHas('fieldOfficer', fn ($q) =>
                $q->where('cluster', $cluster)
            );

            if ($month) {
                $base->whereYear('created_at', substr($month, 0, 4))
                    ->whereMonth('created_at', substr($month, 5, 2));
            }

            $total    = (clone $base)->count();
            $approved = (clone $base)->where('status', 'accepted')->count();
            $pending  = (clone $base)->where('status', 'submitted')->count();
            $returned = (clone $base)->where('status', 'returned')->count();

            return [
                'cluster'   => $cluster,
                'shortName' => $cluster,
                'total'     => $total,
                'approved'  => $approved,
                'pending'   => $pending,
                'rejected'  => $returned,
            ];
        })->all();
    }


    private function getRecentSubmissions(): array
    {
        return ReportSubmission::with(['fieldOfficer', 'report.program'])
            ->latest()
            ->take(10)
            ->get()
            ->map(fn ($submission) => [
                'id'      => $submission->id,
                'officer' => $submission->fieldOfficer?->name ?? 'N/A',
                'avatar'  => $this->getInitials($submission->fieldOfficer?->name),
                'cluster' => $submission->fieldOfficer?->cluster ?? 'N/A',
                'program' => $submission->report?->program?->name ?? 'N/A',
                'status'  => $submission->status,
                'time'    => $submission->created_at->diffForHumans(),
            ])
            ->all();
    }


    private function getTopPrograms(): array
    {
        return Program::with(['reports.submissions'])
            ->get()
            ->map(function (Program $program) {
                $allSubmissions = $program->reports
                    ->flatMap(fn ($r) => $r->submissions);

                $total    = $allSubmissions->count();
                $approved = $allSubmissions->where('status', 'approved')->count();

                $completion = $total > 0
                    ? (int) round(($approved / $total) * 100)
                    : 0;

                return [
                    'name'        => $program->name,
                    'submissions' => $total,
                    'completion'  => $completion,
                ];
            })
            ->sortByDesc('submissions')
            ->take(4)
            ->values()
            ->all();
    }

    private function getInitials(?string $name): string
    {
        if (!$name) return '??';

        $words = explode(' ', trim($name));

        if (count($words) >= 2) {
            return strtoupper(substr($words[0], 0, 1) . substr($words[1], 0, 1));
        }

        return strtoupper(substr($name, 0, 2));
    }

    // SUBMISSION LOGS
    private function getReports(): array
    {
        // All field officers — the denominator for "not submitted"
        $allOfficers = User::role('field_officer')
            ->select('id', 'name', 'email', 'cluster')
            ->get();

        $totalOfficers = $allOfficers->count();

        return Report::with(['program', 'submissions.fieldOfficer'])
            ->orderByDesc('deadline')
            ->get()
            ->map(fn ($report) => $this->formatReport($report, $allOfficers, $totalOfficers))
            ->all();
    }

    private function formatReport(Report $report, \Illuminate\Support\Collection $allOfficers, int $totalOfficers): array
    {
        $submissions       = $report->submissions;
        $submittedOfficerIds = $submissions->pluck('field_officer_id')->all();

        // Officers who have NOT submitted
        $notSubmitted = $allOfficers
            ->whereNotIn('id', $submittedOfficerIds)
            ->map(fn ($officer) => [
                'id'           => $officer->id,
                'name'         => $officer->name,
                'email'        => $officer->email,
                'cluster'      => $officer->cluster,
                'submitted_at' => null,
                'reviewed_at'  => null,
                'status'       => 'not_submitted',
            ])
            ->values()
            ->all();

        $submitted = $submissions->map(function ($sub) use ($report) {
            $isLate = $report->deadline && $sub->created_at->gt($report->deadline);

            return [
                'id'           => $sub->fieldOfficer?->id,
                'name'         => $sub->fieldOfficer?->name ?? 'N/A',
                'email'        => $sub->fieldOfficer?->email ?? 'N/A',
                'cluster'      => $sub->fieldOfficer?->cluster ?? 'N/A',
                'submitted_at' => $sub->created_at->toISOString(),
                'reviewed_at'  => $sub->reviewed_at?->toISOString(),
                'status'       => match ($sub->status) {
                    'approved' => $isLate ? 'submitted_late' : 'submitted_on_time',
                    'returned' => 'returned',
                    default    => $isLate ? 'submitted_late' : 'pending',
                },
                'submission_status' => $sub->status, // raw: pending | approved | returned
            ];
        })->all();

        $submittedCount = $submissions->count();
        $isOverdue      = $report->deadline && now()->gt($report->deadline);
        $reportStatus   = match (true) {
            $submittedCount === $totalOfficers => 'completed',
            $isOverdue                         => 'overdue',
            default                            => 'open',
        };

        return [
            'id'              => $report->id,
            'title'           => $report->title,
            'program'         => $report->program?->name ?? 'N/A',
            'deadline'        => $report->deadline?->toDateString(),
            'final_deadline'  => $report->final_deadline?->toDateString(),
            'submitted_count' => $submittedCount,
            'total_officers'  => $totalOfficers,
            'report_status'   => $reportStatus,
            'officers'        => array_merge($submitted, $notSubmitted),
        ];
    }

    private function getSummary(array $reports): array
    {
        $statuses = collect($reports)->pluck('report_status');

        return [
            'total'     => count($reports),
            'open'      => $statuses->filter(fn ($s) => $s === 'open')->count(),
            'overdue'   => $statuses->filter(fn ($s) => $s === 'overdue')->count(),
            'completed' => $statuses->filter(fn ($s) => $s === 'completed')->count(),
        ];
    }

}

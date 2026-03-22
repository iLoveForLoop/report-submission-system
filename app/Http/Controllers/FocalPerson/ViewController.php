<?php

namespace App\Http\Controllers\FocalPerson;

use App\Http\Controllers\Controller;
use App\Models\Program;
use App\Models\Report;
use App\Models\ReportSubmission;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ViewController extends Controller
{
    public function dashboard(): \Inertia\Response
    {
        $user = auth()->user();

        return inertia('focal-person/dashboard/page', [
            'pending_count'           => $this->getPendingCount($user->id),
            'approved_today'          => $this->getApprovedToday($user->id),
            'approved_this_week'      => $this->getApprovedThisWeek($user->id),
            'returned_count'          => $this->getReturnedCount($user->id),
            'overdue_count'           => $this->getOverdueCount($user->id),
            'assigned_programs_count' => $this->getAssignedProgramsCount($user->id),
            'pending_submissions'     => $this->getPendingSubmissions($user->id),
            'overdue_reports'         => $this->getOverdueReports($user->id),
            'recent_activity'         => $this->getRecentActivity($user->id),
            'assigned_programs'       => $this->getAssignedPrograms($user->id),
        ]);
    }

    public function programs(Request $request)
    {
        $query = Program::query()
            ->where('coordinator_id', auth()->id())
            ->withCount([
                'pendingSubmissions as pending_submissions_count',
            ])
            ->with(['coordinator:id,name']);

        // ── Search by program name ────────────────────────────────────────────
        if ($search = $request->input('search')) {
            $query->where('name', 'like', "%{$search}%");
        }

        // ── Created year ──────────────────────────────────────────────────────
        if ($year = $request->integer('year', 0)) {
            $query->whereYear('created_at', $year);
        }

        // ── Created month (only applied when year is also set) ────────────────
        if ($year && $month = $request->integer('month', 0)) {
            $query->whereMonth('created_at', $month);
        }

        // ── Has pending submissions quick toggle ──────────────────────────────
        if ($request->boolean('pending_only')) {
            $query->has('pendingSubmissions');
        }

        $programs = $query
            ->latest()
            ->paginate(12)
            ->withQueryString();

        // Build year options from the focal person's own programs
        $availableYears = Program::where('coordinator_id', auth()->id())
            ->selectRaw('YEAR(created_at) as year')
            ->distinct()
            ->orderByDesc('year')
            ->pluck('year');

        return inertia('focal-person/programs/page', [
            'programs'       => $programs,
            'available_years' => $availableYears,
            'filters'        => $request->only(['search', 'year', 'month', 'pending_only']),
        ]);
    }

    public function reviewQueuePage()
    {
        $userId     = auth()->id();
        $programIds = $this->assignedProgramIds($userId);

        $submissions = ReportSubmission::with([
                'report.program',
                'fieldOfficer:id,name,first_name,last_name,email,cluster',
            ])
            ->whereHas('report', fn ($q) =>
                $q->whereIn('program_id', $programIds)
            )
            ->where('status', 'submitted')
            ->oldest() // oldest submitted first by default
            ->get();

        $queue = $submissions->map(fn ($sub) => [
            'id'             => $sub->id,
            'report_id'      => $sub->report_id,
            'report_title'   => $sub->report?->title ?? 'N/A',
            'program_id'     => $sub->report?->program_id ?? null,
            'program'        => $sub->report?->program?->name ?? 'N/A',
            'officer'        => $sub->fieldOfficer?->name ? $sub->fieldOfficer->first_name . ' ' . $sub->fieldOfficer->last_name : 'N/A',
            'officer_id'     => $sub->fieldOfficer?->id,
            'officer_avatar' => $this->getInitials($sub->fieldOfficer?->name),
            'cluster'        => $sub->fieldOfficer?->cluster ?? 'N/A',
            'submitted_at'   => $sub->created_at->toISOString(),
            'deadline'       => $sub->report?->deadline?->toDateString(),
            'is_overdue'     => $sub->report?->deadline
                                    ? $sub->report->deadline->isPast()
                                    : false,
        ])->values()->all();

        // Stats for the header cards
        $oldestDays = $submissions->isNotEmpty()
            ? (int) now()->diffInDays($submissions->first()->created_at)
            : 0;

        $overdueCount = $submissions->filter(
            fn ($sub) => $sub->report?->deadline?->isPast()
        )->count();

        $stats = [
            'total'       => $submissions->count(),
            'overdue'     => $overdueCount,
            'oldest_days' => $oldestDays,
        ];

        return inertia('focal-person/review-queue/page', [
            'queue' => $queue,
            'stats' => $stats,
        ]);
    }

    public function reports(Program $program)
    {

        $reports = auth()->user()
            ->createdReports()
            ->where('program_id', $program->id)
            ->latest()
            ->with(['program', 'coordinator', 'media'])
            ->withCount([

                'submissions as submitted_count' => fn ($q) =>
                    $q->where('status', 'submitted'),


                'submissions as accepted_count' => fn ($q) =>
                    $q->where('status', 'accepted'),


                'submissions as total_count',
            ])
            ->get()
            ->map(fn ($report) => [
                'id'          => $report->id,
                'title'       => $report->title,
                'content'     => $report->content,
                'form_schema' => $report->form_schema,
                'deadline'    => $report->deadline?->toISOString(),

                'submitted_count' => $report->submitted_count,
                'accepted_count'  => $report->accepted_count,
                'total_count'     => $report->total_count,

                'program' => [
                    'id'          => $report->program->id,
                    'name'        => $report->program->name,
                    'description' => $report->program->description,
                ],

                'coordinator' => [
                    'id'     => $report->coordinator->id,
                    'name'   => $report->coordinator->name,
                    'email'  => $report->coordinator->email,
                    'avatar' => $report->coordinator->avatar,
                ],

                'templates' => $report
                    ->getMedia('templates')
                    ->map(fn ($media) => [
                        'id'           => $media->id,
                        'name'         => $media->name,
                        'file_name'    => $media->file_name,
                        'mime_type'    => $media->mime_type,
                        'size'         => $media->size,
                        'original_url' => $media->getFullUrl(),
                    ]),

                'created_at' => $report->created_at->toISOString(),
                'updated_at' => $report->updated_at->toISOString(),
            ]);

        return inertia('focal-person/programs/reports/page', [
            'program' => $program,
            'reports' => $reports,
        ]);
    }

    public function submissionPage() {

        $reports = $this->getReports();

        return inertia('focal-person/submission-logs/page', [
            'reports' => $reports,
            'summary' => $this->getSummary($reports),
        ]);
    }


    public function reportSubmissions(Program $program, Report $report){

        $report->load([ 'submissions.fieldOfficer', ]);

        $submissions = $report->submissions()->with(['fieldOfficer:id,name,first_name,last_name,email', 'media', 'activities.causer'])
        ->orderBy('updated_at', 'desc')->get();


        return inertia('focal-person/programs/reports/report-submissions/page', [
            'program' => $program,
            'reportSubmissions' => $submissions,
            'report' => $report
        ]);

    }

    public function notifications(){

        $notifications = auth()->user()
            ->notifications()
            ->latest()
            ->paginate(20)
            ->through(function ($notification){
                return [
                    'id' => $notification->id,
                    'title' => $notification->data['title'] ?? '',
                    'message' => $notification->data['message'] ?? '',
                    'created_at' => $notification->created_at,
                    'read_at' => $notification->read_at,
                    'action_url' => $notification->data['action_url']
                ];
            });

        return inertia('focal-person/notifications/page', [
            'notifications' => Inertia::scroll($notifications)
        ]);
    }










    // PRIVATE FUNCTIONS

    private function assignedProgramIds(int $userId): array
    {
        return Program::where('coordinator_id', $userId)->pluck('id')->all();
    }

    // ── Stats ─────────────────────────────────────────────────────────────────────

    private function getPendingCount(int $userId): int
    {
        return ReportSubmission::whereHas('report', fn ($q) =>
            $q->whereIn('program_id', $this->assignedProgramIds($userId))
        )
        ->where('status', 'submitted')
        ->count();
    }

    private function getApprovedToday(int $userId): int
    {
        return ReportSubmission::whereHas('report', fn ($q) =>
            $q->whereIn('program_id', $this->assignedProgramIds($userId))
        )
        ->where('status', 'accepted')
        ->whereDate('updated_at', today())
        ->count();
    }

    private function getApprovedThisWeek(int $userId): int
    {
        return ReportSubmission::whereHas('report', fn ($q) =>
            $q->whereIn('program_id', $this->assignedProgramIds($userId))
        )
        ->where('status', 'accepted')
        ->whereBetween('updated_at', [now()->startOfWeek(), now()->endOfWeek()])
        ->count();
    }

    private function getReturnedCount(int $userId): int
    {
        return ReportSubmission::whereHas('report', fn ($q) =>
            $q->whereIn('program_id', $this->assignedProgramIds($userId))
        )
        ->where('status', 'returned')
        ->count();
    }

    private function getOverdueCount(int $userId): int
    {
        return Report::whereIn('program_id', $this->assignedProgramIds($userId))
            ->where('deadline', '<', now())
            ->count();
    }

    private function getAssignedProgramsCount(int $userId): int
    {
        return Program::where('coordinator_id', $userId)->count();
    }

    // ── Pending submissions queue ─────────────────────────────────────────────────

    private function getPendingSubmissions(int $userId): array
    {
        return ReportSubmission::with(['report.program', 'fieldOfficer'])
            ->whereHas('report', fn ($q) =>
                $q->whereIn('program_id', $this->assignedProgramIds($userId))
            )
            ->where('status', 'submitted')
            ->latest()
            ->take(8)
            ->get()
            ->map(fn ($sub) => [
                'id'             => $sub->id,
                'report_title'   => $sub->report?->title ?? 'N/A',
                'program'        => $sub->report?->program?->name ?? 'N/A',
                'officer'        => $sub->fieldOfficer?->name ?? 'N/A',
                'officer_avatar' => $this->getInitials($sub->fieldOfficer?->name),
                'cluster'        => $sub->fieldOfficer?->cluster ?? 'N/A',
                'submitted_at'   => $sub->created_at->toISOString(),
                'deadline'       => $sub->report?->deadline?->toDateString(),
                'is_overdue'     => $sub->report?->deadline
                                        ? $sub->report->deadline->isPast()
                                        : false,
            ])
            ->all();
    }

    // ── Overdue reports ───────────────────────────────────────────────────────────

    private function getOverdueReports(int $userId): array
    {
        $totalOfficers = User::role('field_officer')->count();

        return Report::with(['program', 'submissions'])
            ->whereIn('program_id', $this->assignedProgramIds($userId))
            ->where('deadline', '<', now())
            ->orderBy('deadline')
            ->take(5)
            ->get()
            ->map(fn ($report) => [
                'id'             => $report->id,
                'report_title'   => $report->title,
                'program'        => $report->program?->name ?? 'N/A',
                'deadline'       => $report->deadline->toDateString(),
                'days_overdue'   => (int) now()->diffInDays($report->deadline),
                'submitted'      => $report->submissions()
                                        ->where('status', '!=', 'returned')
                                        ->count(),
                'total_officers' => $totalOfficers,
            ])
            ->all();
    }


    private function getRecentActivity(int $userId): array
    {
        return ReportSubmission::with(['report', 'fieldOfficer'])
            ->whereHas('report', fn ($q) =>
                $q->whereIn('program_id', $this->assignedProgramIds($userId))
            )
            ->whereIn('status', ['accepted', 'returned'])
            ->latest('updated_at')
            ->take(8)
            ->get()
            ->map(fn ($sub) => [
                'id'             => $sub->id,
                'type'           => $sub->status,
                'report_title'   => $sub->report?->title ?? 'N/A',
                'officer'        => $sub->fieldOfficer?->name ?? 'N/A',
                'officer_avatar' => $this->getInitials($sub->fieldOfficer?->name),
                'program'        => $sub->report?->program?->name ?? 'N/A',
                'actioned_at'    => $sub->updated_at->toISOString(),
            ])
            ->all();
    }


    private function getAssignedPrograms(int $userId): array
    {
        return Program::with(['reports.submissions'])
            ->where('coordinator_id', $userId)
            ->get()
            ->map(fn ($program) => [
                'id'            => $program->id,
                'name'          => $program->name,
                'total_reports' => $program->reports->count(),
                'pending_count' => $program->reports
                    ->flatMap(fn ($r) => $r->submissions)
                    ->where('status', 'pending')
                    ->count(),
            ])
            ->sortByDesc('pending_count')
            ->values()
            ->all();
    }


    private function getInitials(?string $name): string
    {
        if (!$name) return '??';
        $words = explode(' ', trim($name));
        return count($words) >= 2
            ? strtoupper(substr($words[0], 0, 1) . substr($words[1], 0, 1))
            : strtoupper(substr($name, 0, 2));
    }


    //SUBMISSION LOGS


    private function getReports(): array
    {
        // All field officers — the denominator for "not submitted"
        $allOfficers = User::role('field_officer')
            ->select('id', 'name', 'first_name', 'last_name', 'email', 'cluster')
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
                'first_name'         => $officer->first_name,
                'last_name'         => $officer->last_name,
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
                'first_name'   => $sub->fieldOfficer?->first_name ?? 'N/A',
                'last_name'    => $sub->fieldOfficer?->last_name ?? 'N/A',
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
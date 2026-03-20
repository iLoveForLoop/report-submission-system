<?php

namespace App\Http\Controllers\ProvincialDirector;

use App\Http\Controllers\Controller;
use App\Models\Program;
use App\Models\Report;
use App\Models\ReportSubmission;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ViewController extends Controller
{
    public function dashboard(Request $request){

        return inertia('provincial-director/dashboard/page', [
            'total_submissions'   => $this->getTotalSubmissions(),
            'active_officers'     => $this->getActiveOfficers(),
            'approved_count'      => $this->getApprovedCount(),
            'pending_count'       => $this->getPendingCount(),
            'cluster_chart_data'  => $this->getClusterChartData($request->month),
            'recent_submissions'  => $this->getRecentSubmissions(),
            'top_programs'        => $this->getTopPrograms(),
        ]);
    }

    public function programs(){

    $programs  = Program::query()
    ->select('id', 'name', 'description','coordinator_id', 'created_at', 'updated_at')
    ->with([
        'coordinator:id,name,email,created_at'
    ])
    ->get();


        return Inertia::render('provincial-director/programs/page',[
            'programs' => Inertia::defer(fn () => $programs)
        ]);
    }


    public function submissionLogs() {

        $reports = $this->getReports();

        return inertia('provincial-director/submission-logs/page', [
            'reports' => $reports,
            'summary' => $this->getSummary($reports),
        ]);
    }


    // PRIVATE FUNCTIONS

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

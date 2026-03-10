<?php

namespace App\Http\Controllers\ProvincialDirector;

use App\Http\Controllers\Controller;
use App\Models\Program;
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
}

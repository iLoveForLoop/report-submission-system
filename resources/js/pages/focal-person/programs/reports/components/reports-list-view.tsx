// components/list-view.tsx
import { Link } from '@inertiajs/react';
import { Clock, EllipsisVertical, FileText, Folder, Users } from 'lucide-react';
import {
    formatDate,
    ReportWithCounts,
    SubmissionChip,
} from './report-card-parts';

export default function ListView({
    reports,
    programId,
}: {
    reports: ReportWithCounts[];
    programId: number;
}) {
    return (
        <div className="overflow-hidden rounded-xl border bg-card">
            {/* ── Header — desktop only ─────────────────────────────────────── */}
            <div className="hidden grid-cols-[32px_1fr_160px_140px_140px_32px] items-center gap-4 border-b bg-muted/50 px-4 py-3 lg:grid">
                <div />
                <span className="text-xs font-semibold text-muted-foreground">
                    Report
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                    Status
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                    Deadline
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                    Created
                </span>
                <div />
            </div>

            {/* ── Rows ─────────────────────────────────────────────────────── */}
            <div className="divide-y">
                {reports.map((report) => {
                    const hasPending = report.submitted_count > 0;
                    const hasAny = report.total_count > 0;

                    return (
                        <Link
                            key={report.id}
                            href={`/focal-person/programs/${programId}/reports/${report.id}/report-submissions`}
                            className={`group flex flex-col px-4 py-4 transition-colors hover:bg-muted/40 lg:grid lg:grid-cols-[32px_1fr_160px_140px_140px_32px] lg:items-center lg:gap-4 lg:py-3 ${
                                hasPending
                                    ? ' dark:bg-amber-950/20'
                                    : 'bg-card-elevated'
                            }`}
                        >
                            {/* Icon — desktop */}
                            <div
                                className={`hidden h-8 w-8 items-center justify-center rounded-md lg:flex ${
                                    hasPending
                                        ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400'
                                        : 'bg-muted text-muted-foreground'
                                }`}
                            >
                                <Folder className="h-4 w-4" />
                            </div>

                            {/* Title + mobile meta */}
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    {/* Mobile: show folder icon inline */}
                                    <div
                                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded lg:hidden ${
                                            hasPending
                                                ? 'bg-violet-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400'
                                                : 'bg-muted text-muted-foreground'
                                        }`}
                                    >
                                        <Folder className="h-3.5 w-3.5" />
                                    </div>

                                    <h2 className="truncate text-sm font-semibold text-foreground">
                                        {report.title}
                                    </h2>

                                    {/* Chip visible on both mobile and desktop in title row */}
                                    <SubmissionChip
                                        submitted={report.submitted_count}
                                        total={report.total_count}
                                        accepted={report.accepted_count}
                                    />
                                </div>

                                {/* Mobile-only meta */}
                                <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground lg:hidden">
                                    <span className="flex items-center gap-1">
                                        <FileText className="h-3 w-3" />
                                        Due:{' '}
                                        {formatDate(
                                            report.deadline ??
                                                report.created_at,
                                        )}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        Created: {formatDate(report.created_at)}
                                    </span>
                                    {hasAny && (
                                        <span className="flex items-center gap-1">
                                            <Users className="h-3 w-3" />
                                            {report.submitted_count +
                                                report.accepted_count}
                                            /{report.total_count}
                                        </span>
                                    )}
                                </div>

                                {/* Progress on mobile */}
                                {/* {hasAny && (
                                    <div className="lg:hidden">
                                        <SubmissionProgressBar
                                            submitted={report.submitted_count}
                                            accepted={report.accepted_count}
                                            total={report.total_count}
                                        />
                                    </div>
                                )} */}
                            </div>

                            {/* Status chip — desktop only (already in title row) */}
                            <div className="hidden lg:block">
                                <SubmissionChip
                                    submitted={report.submitted_count}
                                    total={report.total_count}
                                    accepted={report.accepted_count}
                                />
                            </div>

                            {/* Deadline — desktop */}
                            <div className="hidden lg:block">
                                <p className="text-sm text-foreground">
                                    {formatDate(
                                        report.deadline ?? report.created_at,
                                    )}
                                </p>
                            </div>

                            {/* Created — desktop */}
                            <div className="hidden lg:block">
                                <p className="text-sm text-muted-foreground">
                                    {formatDate(report.created_at)}
                                </p>
                            </div>

                            {/* Progress bar — desktop */}
                            {/* {hasAny && (
                                <div className="col-span-full hidden pl-[calc(32px+1rem)] lg:block">
                                    <SubmissionProgressBar
                                        submitted={report.submitted_count}
                                        accepted={report.accepted_count}
                                        total={report.total_count}
                                    />
                                </div>
                            )} */}

                            {/* Actions */}
                            <button
                                onClick={(e) => e.preventDefault()}
                                className="hidden rounded p-1 opacity-0 transition-all group-hover:opacity-100 hover:bg-accent lg:block"
                            >
                                <EllipsisVertical className="h-4 w-4 text-muted-foreground" />
                            </button>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

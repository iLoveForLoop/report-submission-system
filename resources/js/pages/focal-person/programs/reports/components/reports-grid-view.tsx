// components/grid-view.tsx
import { Link } from '@inertiajs/react';
import { Clock, EllipsisVertical, FileText, Folder } from 'lucide-react';
import {
    formatDate,
    ReportWithCounts,
    SubmissionChip,
    SubmissionProgressBar,
} from './report-card-parts';

export default function GridView({
    reports,
    programId,
}: {
    reports: ReportWithCounts[];
    programId: number;
}) {
    return (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {reports.map((report) => {
                const hasPending = report.submitted_count > 0;
                const hasAny = report.total_count > 0;

                return (
                    <Link
                        key={report.id}
                        href={`/focal-person/programs/${programId}/reports/${report.id}/report-submissions`}
                        className={`group flex flex-col rounded-xl border bg-card px-4 py-3 transition-all hover:shadow-md ${
                            hasPending
                                ? 'border-amber-200 hover:border-amber-300 dark:borde-amber-800'
                                : 'hover:border-primary/20'
                        }`}
                    >
                        <div className="flex items-start gap-3">
                            {/* Folder icon */}
                            <div
                                className={`mt-0.5 rounded-md p-2 transition-colors ${
                                    hasPending
                                        ? 'bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400'
                                        : 'bg-muted text-muted-foreground'
                                }`}
                            >
                                <Folder className="h-4 w-4" />
                            </div>

                            <div className="flex min-w-0 flex-1 flex-col">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="truncate text-sm font-semibold text-foreground">
                                        {report.title}
                                    </h2>
                                    <SubmissionChip
                                        submitted={report.submitted_count}
                                        total={report.total_count}
                                        accepted={report.accepted_count}
                                    />
                                </div>
                                <div className='flex gap-2'>
                                    <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                                        <FileText className="h-3 w-3 shrink-0" />
                                        Deadline:{' '}
                                        {formatDate(
                                            report.deadline ?? report.created_at,
                                        )}
                                    </p>
                                    <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                                        <Clock className="h-3 w-3 shrink-0" />
                                        Created: {formatDate(report.created_at)}
                                    </p>
                                </div>

                            </div>

                            {/* <button
                                onClick={(e) => e.preventDefault()}
                                className="shrink-0 rounded p-1 opacity-0 transition-all group-hover:opacity-100 hover:bg-accent"
                            >
                                <EllipsisVertical className="h-4 w-4 text-muted-foreground" />
                            </button> */}
                        </div>

                        {hasAny && (
                            <SubmissionProgressBar
                                submitted={report.submitted_count}
                                accepted={report.accepted_count}
                                total={report.total_count}
                            />
                        )}
                    </Link>
                );
            })}
        </div>
    );
}

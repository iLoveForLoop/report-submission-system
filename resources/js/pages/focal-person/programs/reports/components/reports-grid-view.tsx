// components/grid-view.tsx
import { Link } from '@inertiajs/react';
import { Clock, FileText, Folder } from 'lucide-react';
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reports.map((report) => {
                const hasPending = report.submitted_count > 0;
                const hasAny = report.total_count > 0;

                const statusStyles = hasPending
                    ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 shadow-sm shadow-amber-500/5'
                    : 'bg-card border-border hover:border-primary/30';

                const iconBoxStyles = hasPending
                    ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400'
                    : 'bg-muted text-muted-foreground';

                return (
                    <Link
                        key={report.id}
                        href={`/focal-person/programs/${programId}/reports/${report.id}/report-submissions`}
                        className={`group flex flex-col justify-between rounded-xl border p-4 transition-all hover:shadow-md ${statusStyles}`}
                    >
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                {/* Folder icon - shrink-0 prevents squishing on long titles */}
                                <div className={`mt-0.5 shrink-0 rounded-lg p-2 transition-colors ${iconBoxStyles}`}>
                                    <Folder className="h-4 w-4" />
                                </div>

                                <div className="flex min-w-0 flex-1 flex-col gap-1">
                                    <div className="flex items-start justify-between gap-2">
                                        <h2 className="truncate text-sm font-bold tracking-tight text-foreground">
                                            {report.title}
                                        </h2>
                                        <SubmissionChip
                                            submitted={report.submitted_count}
                                            total={report.total_count}
                                            accepted={report.accepted_count}
                                        />
                                    </div>

                                    {/* Metadata: Unified gap and alignment */}
                                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                                            <FileText className="h-3 w-3 opacity-70" />
                                            <span>Deadline: {formatDate(report.deadline ?? report.created_at)}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                                            <Clock className="h-3 w-3 opacity-70" />
                                            <span>Created: {formatDate(report.created_at)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar - Pushed to bottom with justify-between */}
                        {hasAny && (
                            <div className="mt-4 pt-1">
                                <SubmissionProgressBar
                                    submitted={report.submitted_count}
                                    accepted={report.accepted_count}
                                    total={report.total_count}
                                />
                            </div>
                        )}
                    </Link>
                );
            })}
        </div>
    );
}

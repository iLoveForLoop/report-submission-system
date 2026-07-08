// components/grid-view.tsx
import { Link } from '@inertiajs/react';
import {
    Clock,
    EllipsisVertical,
    FileText,
    Folder,
    Pencil,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import DeleteReportDialog from './delete-report-dialog';
import EditReportDialog from './edit-report-dialog';
import {
    formatDate,
    ReportWithCounts,
    SubmissionChip,
    SubmissionProgressBar,
} from './report-card-parts';

// ─── Action menu ─────────────────────────────────────────────────────────────

function CardActionMenu({ report }: { report: ReportWithCounts }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    return (
        <>
            {/* Trigger */}
            <div className="relative">
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setMenuOpen((v) => !v);
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-muted hover:text-foreground"
                    aria-label="Report actions"
                >
                    <EllipsisVertical className="h-4 w-4" />
                </button>

                {/* Dropdown */}
                {menuOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-10"
                            onClick={(e) => {
                                e.preventDefault();
                                setMenuOpen(false);
                            }}
                        />
                        <div className="absolute top-8 right-0 z-20 w-40 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setMenuOpen(false);
                                    setEditOpen(true);
                                }}
                                className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
                            >
                                <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                                Edit
                            </button>
                            <div className="mx-2 border-t border-border" />
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setMenuOpen(false);
                                    setDeleteOpen(true);
                                }}
                                className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Dialogs — rendered outside the Link so clicks don't navigate */}
            <EditReportDialog
                report={report}
                open={editOpen}
                onOpenChange={setEditOpen}
            />
            <DeleteReportDialog
                report={report}
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
            />
        </>
    );
}

// ─── GridView ─────────────────────────────────────────────────────────────────

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
                    <div
                        key={report.id}
                        className={`group relative flex flex-col justify-between rounded-xl border p-4 transition-all hover:shadow-md ${statusStyles}`}
                    >
                        {/* Action menu — top right */}
                        <div className="absolute top-3 right-3">
                            <CardActionMenu report={report} />
                        </div>

                        <Link
                            href={`/focal-person/programs/${programId}/reports/${report.id}/report-submissions`}
                            className="flex flex-1 flex-col gap-3"
                        >
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 pr-8">
                                    <div
                                        className={`mt-0.5 shrink-0 rounded-lg p-2 transition-colors ${iconBoxStyles}`}
                                    >
                                        <Folder className="h-4 w-4" />
                                    </div>

                                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <h2 className="truncate text-sm font-bold tracking-tight text-foreground">
                                                {report.title}
                                            </h2>
                                            <SubmissionChip
                                                submitted={
                                                    report.submitted_count
                                                }
                                                total={report.total_count}
                                                accepted={report.accepted_count}
                                            />
                                        </div>

                                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                                            <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                                                <FileText className="h-3 w-3 opacity-70" />
                                                <span>
                                                    Deadline:{' '}
                                                    {formatDate(
                                                        report.deadline ??
                                                            report.created_at,
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                                                <Clock className="h-3 w-3 opacity-70" />
                                                <span>
                                                    Created:{' '}
                                                    {formatDate(
                                                        report.created_at,
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

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
                    </div>
                );
            })}
        </div>
    );
}

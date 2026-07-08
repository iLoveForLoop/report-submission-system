// components/list-view.tsx
import { Link } from '@inertiajs/react';
import {
    Clock,
    EllipsisVertical,
    FileText,
    Folder,
    Pencil,
    Trash2,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import DeleteReportDialog from './delete-report-dialog';
import EditReportDialog from './edit-report-dialog';
import {
    formatDate,
    ReportWithCounts,
    SubmissionChip,
} from './report-card-parts';

// ─── Action menu ─────────────────────────────────────────────────────────────

function RowActionMenu({ report }: { report: ReportWithCounts }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    return (
        <>
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

                {menuOpen && (
                    <>
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

// ─── ListView ─────────────────────────────────────────────────────────────────

export default function ListView({
    reports,
    programId,
}: {
    reports: ReportWithCounts[];
    programId: number;
}) {
    return (
        <div className="overflow-hidden rounded-xl border bg-card">
            {/* Header — desktop only */}
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

            <div className="divide-y">
                {reports.map((report) => {
                    const hasPending = report.submitted_count > 0;
                    const hasAny = report.total_count > 0;

                    return (
                        <div
                            key={report.id}
                            className={`group relative flex flex-col transition-colors hover:bg-muted/40 lg:grid lg:grid-cols-[32px_1fr_160px_140px_140px_32px] lg:items-center lg:gap-4 ${
                                hasPending ? 'dark:bg-amber-950/20' : ''
                            }`}
                        >
                            {/* Clickable area — everything except action menu */}
                            <Link
                                href={`/focal-person/programs/${programId}/reports/${report.id}/report-submissions`}
                                className="flex flex-1 flex-col px-4 py-4 lg:contents"
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
                                        {/* Mobile folder icon */}
                                        <div
                                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded lg:hidden ${
                                                hasPending
                                                    ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400'
                                                    : 'bg-muted text-muted-foreground'
                                            }`}
                                        >
                                            <Folder className="h-3.5 w-3.5" />
                                        </div>

                                        <h2 className="truncate text-sm font-semibold text-foreground">
                                            {report.title}
                                        </h2>

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
                                            Created:{' '}
                                            {formatDate(report.created_at)}
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
                                </div>

                                {/* Status chip — desktop */}
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
                                            report.deadline ??
                                                report.created_at,
                                        )}
                                    </p>
                                </div>

                                {/* Created — desktop */}
                                <div className="hidden lg:block">
                                    <p className="text-sm text-muted-foreground">
                                        {formatDate(report.created_at)}
                                    </p>
                                </div>
                            </Link>

                            {/* Action menu — last column on desktop, absolute on mobile */}
                            <div className="absolute top-3 right-3 z-50 lg:relative lg:top-auto lg:right-auto">
                                <RowActionMenu report={report} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

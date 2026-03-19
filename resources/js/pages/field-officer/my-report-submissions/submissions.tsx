import ViewController from '@/actions/App/Http/Controllers/FieldOfficer/ViewController';
import { Pagination } from '@/components/ui/pagination';
import { FilterType, LaravelPaginator, ReportSubmission } from '@/types';
import { Link } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    MapPin,
    RotateCcw,
    Timer,
    TrendingDown,
    TrendingUp,
} from 'lucide-react';

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
    pending: {
        label: 'Pending Review',
        icon: Clock,
        badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        leftBorder: 'border-l-amber-400',
        glow: 'hover:shadow-amber-100 dark:hover:shadow-amber-950/30',
    },
    approved: {
        label: 'Approved',
        icon: CheckCircle2,
        badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        leftBorder: 'border-l-emerald-400',
        glow: 'hover:shadow-emerald-100 dark:hover:shadow-emerald-950/30',
    },
    accepted: {
        label: 'Approved',
        icon: CheckCircle2,
        badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        leftBorder: 'border-l-emerald-400',
        glow: 'hover:shadow-emerald-100 dark:hover:shadow-emerald-950/30',
    },
    returned: {
        label: 'Returned',
        icon: RotateCcw,
        badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
        leftBorder: 'border-l-rose-400',
        glow: 'hover:shadow-rose-100 dark:hover:shadow-rose-950/30',
    },
    submitted: {
        label: 'Submitted',
        icon: CheckCircle2,
        badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
        leftBorder: 'border-l-blue-400',
        glow: 'hover:shadow-blue-100 dark:hover:shadow-blue-950/30',
    },
} as const;

// ─── Timeliness config ────────────────────────────────────────────────────────

const TIMELINESS_CONFIG = {
    early: {
        label: 'Early',
        icon: TrendingUp,
        className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
    on_time: {
        label: 'On Time',
        icon: Timer,
        className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    },
    late: {
        label: 'Late',
        icon: TrendingDown,
        className: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    },
} as const;

type StatusKey = keyof typeof STATUS_CONFIG;
type TimelinessKey = keyof typeof TIMELINESS_CONFIG;
type ViewMode = 'grid' | 'list';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
    const cfg = STATUS_CONFIG[status as StatusKey] ?? STATUS_CONFIG.pending;
    const Icon = cfg.icon;
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${cfg.badge}`}
        >
            <Icon className="h-3 w-3 flex-shrink-0" />
            {cfg.label}
        </span>
    );
}

function TimelinessBadge({ timeliness }: { timeliness?: string | null }) {
    if (!timeliness) return null;
    const cfg = TIMELINESS_CONFIG[timeliness as TimelinessKey];
    if (!cfg) return null;
    const Icon = cfg.icon;
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${cfg.className}`}
        >
            <Icon className="h-3 w-3 flex-shrink-0" />
            {cfg.label}
        </span>
    );
}

const formatDate = (value: string | Date) =>
    new Date(value).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

const formatTime = (value: string) =>
    new Date(value).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });

// ─── Grid Card ────────────────────────────────────────────────────────────────

function GridCard({ submission }: { submission: ReportSubmission }) {
    const cfg =
        STATUS_CONFIG[submission.status as StatusKey] ?? STATUS_CONFIG.pending;

    return (
        <Link
            href={ViewController.reportSubmissions([
                submission.report!.program,
                submission.report!,
            ])}
            className={`group flex flex-col rounded-xl border border-l-4 border-border/60 bg-card p-5 transition-all hover:shadow-md ${cfg.leftBorder} ${cfg.glow}`}
        >
            {/* Top: title + status */}
            <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                    <div className="shrink-0 rounded-md bg-primary/10 p-1.5">
                        <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <p className="truncate text-sm font-semibold text-foreground">
                        {submission.report?.title ??
                            `Submission #${submission.id}`}
                    </p>
                </div>
                <StatusBadge status={submission.status} />
            </div>

            {/* Program */}
            {submission.report?.program?.name && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 shrink-0" />
                    {submission.report.program.name}
                </p>
            )}

            <div className="mt-4 border-t pt-3">
                {/* Timeliness + file count */}
                <div className="flex items-center justify-between">
                    <TimelinessBadge timeliness={submission.timeliness} />
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <FileText className="h-3.5 w-3.5" />
                        {submission.media?.length ?? 0}{' '}
                        {(submission.media?.length ?? 0) === 1
                            ? 'file'
                            : 'files'}
                    </span>
                </div>

                {/* Dates */}
                <div className="mt-2.5 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Submitted</span>
                        <span className="font-medium text-foreground">
                            {formatDate(submission.created_at)} ·{' '}
                            {formatTime(submission.created_at)}
                        </span>
                    </div>
                    {submission.report?.deadline && (
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">
                                Deadline
                            </span>
                            <span className="text-muted-foreground">
                                {formatDate(submission.report.deadline)}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}

// ─── List Row ─────────────────────────────────────────────────────────────────

function ListRow({ submission }: { submission: ReportSubmission }) {
    const cfg =
        STATUS_CONFIG[submission.status as StatusKey] ?? STATUS_CONFIG.pending;

    return (
        <Link
            href={ViewController.reportSubmissions([
                submission.report!.program,
                submission.report!,
            ])}
            className={`group flex items-center gap-4 rounded-xl border border-l-4 border-border/60 bg-card px-4 py-3.5 transition-all hover:shadow-md ${cfg.leftBorder} ${cfg.glow}`}
        >
            {/* Icon */}
            <div className="shrink-0 rounded-md bg-primary/10 p-2">
                <FileText className="h-4 w-4 text-primary" />
            </div>

            {/* Main info */}
            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold text-foreground">
                        {submission.report?.title ??
                            `Submission #${submission.id}`}
                    </p>
                    <StatusBadge status={submission.status} />
                    <TimelinessBadge timeliness={submission.timeliness} />
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    {submission.report?.program?.name && (
                        <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {submission.report.program.name}
                        </span>
                    )}
                    <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(submission.created_at)}
                    </span>
                    {submission.report?.deadline && (
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Due: {formatDate(submission.report.deadline)}
                        </span>
                    )}
                </div>
            </div>

            {/* Trailing */}
            <div className="hidden shrink-0 flex-col items-end gap-1 sm:flex">
                <span className="text-xs font-medium text-foreground">
                    {formatDate(submission.created_at)}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <FileText className="h-3 w-3" />
                    {submission.media?.length ?? 0} files
                </span>
            </div>

            <span className="hidden shrink-0 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100 sm:block">
                View →
            </span>
        </Link>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface SubmissionsProps {
    submissions?: LaravelPaginator<ReportSubmission>;
    filter?: FilterType;
    viewMode: ViewMode; // ← received from parent, not from hook
}

export default function Submissions({
    submissions,
    viewMode,
}: SubmissionsProps) {
    // ── Empty state ───────────────────────────────────────────────────────────
    if (!submissions || submissions.data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 rounded-full bg-muted/40 p-4">
                    <FileText className="h-10 w-10 text-muted-foreground/40" />
                </div>
                <h3 className="mb-1 text-sm font-semibold text-foreground lg:text-base">
                    No submissions yet
                </h3>
                <p className="max-w-sm text-xs text-muted-foreground lg:text-sm">
                    Your submitted reports will appear here once you start
                    submitting.
                </p>
            </div>
        );
    }

    // ── Group by submitted date ───────────────────────────────────────────────
    const groupedSubmissions = submissions.data.reduce(
        (acc, submission) => {
            const key = formatDate(submission.created_at);
            if (!acc[key]) acc[key] = [];
            acc[key].push(submission);
            return acc;
        },
        {} as Record<string, ReportSubmission[]>,
    );

    return (
        <div className="space-y-6">
            {/* ── Result count ─────────────────────────────────────────────── */}
            <div>
                <p className="text-xs text-muted-foreground">
                    Showing{' '}
                    <span className="font-medium text-foreground">
                        {submissions.from}–{submissions.to}
                    </span>{' '}
                    of {submissions.total} submissions
                </p>
            </div>

            {/* ── Date-grouped content ──────────────────────────────────────── */}
            {Object.entries(groupedSubmissions).map(
                ([date, dateSubmissions]) => (
                    <div key={date} className="space-y-3">
                        {/* Date header */}
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-primary/10 p-2">
                                <Calendar className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                                    Submitted on
                                </p>
                                <p className="text-sm font-semibold text-foreground lg:text-base">
                                    {date}
                                </p>
                            </div>
                            <span className="ml-auto rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                                {dateSubmissions.length}
                            </span>
                        </div>

                        {/* Grid or list */}
                        {viewMode === 'grid' ? (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {dateSubmissions.map((submission) => (
                                    <GridCard
                                        key={submission.id}
                                        submission={submission}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {dateSubmissions.map((submission) => (
                                    <ListRow
                                        key={submission.id}
                                        submission={submission}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ),
            )}

            {/* ── Pagination ────────────────────────────────────────────────── */}
            <Pagination paginator={submissions} />
        </div>
    );
}

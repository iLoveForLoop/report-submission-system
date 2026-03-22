import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ReportSubmission } from '@/types';
import {
    CheckCircle2,
    Clock,
    EllipsisVertical,
    FileText,
    MapPin,
    RotateCcw,
    Timer,
    TrendingDown,
    TrendingUp,
} from 'lucide-react';

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

type TimelinessKey = keyof typeof TIMELINESS_CONFIG;

function TimelinessBadge({
    timeliness,
}: {
    timeliness: string | null | undefined;
}) {
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

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
    accepted: {
        label: 'Accepted',
        icon: CheckCircle2,
        badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        dot: 'bg-emerald-500',
    },
    pending: {
        label: 'Pending Review',
        icon: Clock,
        badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        dot: 'bg-amber-500',
    },
    returned: {
        label: 'Returned',
        icon: RotateCcw,
        badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
        dot: 'bg-rose-500',
    },
} as const;

type StatusKey = keyof typeof STATUS_CONFIG;

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

function StatusDot({ status }: { status: string }) {
    const cfg = STATUS_CONFIG[status as StatusKey] ?? STATUS_CONFIG.pending;
    return <span className={`h-2 w-2 flex-shrink-0 rounded-full ${cfg.dot}`} />;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (value: string) =>
    new Date(value).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

const getInitials = (name?: string) =>
    name
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) ?? 'FO';

// ─── Component ────────────────────────────────────────────────────────────────

export default function ListView({
    reportSubmissions,
    onRowClick,
}: {
    reportSubmissions: ReportSubmission[];
    onRowClick: (submission: ReportSubmission) => void;
}) {
    if (reportSubmissions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/30 py-16 text-center">
                <FileText className="h-10 w-10 text-muted-foreground/30" />
                <p className="text-sm font-medium text-muted-foreground">
                    No submissions yet
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border bg-card">
            {/* ── Header ───────────────────────────────────────────────────── */}
            <div className="hidden grid-cols-[auto_1fr_160px_120px_140px_140px_80px_40px] items-center gap-4 border-b bg-muted/50 px-4 py-3 lg:grid">
                <div className="w-10" />
                <span className="text-xs font-semibold text-muted-foreground">
                    Field Officer
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                    Status
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                    Timeliness
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                    Submitted
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                    Last Updated
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                    Files
                </span>
                <div />
            </div>

            {/* ── Rows ─────────────────────────────────────────────────────── */}
            <div className="divide-y">
                {reportSubmissions.map((submission) => {
                    const statusCfg =
                        STATUS_CONFIG[submission.status as StatusKey] ??
                        STATUS_CONFIG.pending;

                    return (
                        <button
                            key={submission.id}
                            onClick={() => onRowClick(submission)}
                            className="group flex w-full cursor-pointer items-center gap-4 px-4 py-3.5 text-left transition-colors hover:bg-muted/40 lg:grid lg:grid-cols-[auto_1fr_160px_120px_140px_140px_80px_40px] "
                        >
                            {/* Avatar + status dot */}
                            <div className="relative flex-shrink-0">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                                        {getInitials(
                                            submission.field_officer?.name,
                                        )}
                                    </AvatarFallback>
                                </Avatar>
                                {/* <span
                                    className={`absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full ring-2 ring-card ${statusCfg.dot}`}
                                /> */}
                            </div>

                            {/* Officer info */}
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-foreground">
                                    {submission.field_officer?.name ??
                                        'Unknown Officer'}
                                </p>
                                <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                                    {submission.field_officer?.cluster && (
                                        <span className="flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            {submission.field_officer.cluster}
                                        </span>
                                    )}
                                    {/* Mobile-only status pill */}
                                    <span className="lg:hidden">
                                        <StatusDot status={submission.status} />
                                    </span>
                                </div>
                            </div>

                            {/* Status — desktop */}
                            <div className="hidden lg:block">
                                <StatusBadge status={submission.status} />
                            </div>

                            {/* Timeliness — desktop */}
                            <div className="hidden lg:block">
                                <TimelinessBadge
                                    timeliness={submission.timeliness}
                                />
                            </div>

                            {/* Submitted at */}
                            <div className="hidden lg:block">
                                <p className="text-sm text-foreground">
                                    {formatDate(submission.created_at)}
                                </p>
                            </div>

                            {/* Updated at */}
                            <div className="hidden lg:block">
                                <p className="text-sm text-muted-foreground">
                                    {formatDate(submission.updated_at)}
                                </p>
                            </div>

                            {/* Files */}
                            <div className="hidden items-center gap-1.5 lg:flex">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                    {submission.media?.length ?? 0}
                                </span>
                            </div>

                            {/* Mobile trailing info */}
                            <div className="ml-auto flex flex-col items-end gap-1 lg:hidden">
                                <StatusBadge status={submission.status} />
                                <TimelinessBadge
                                    timeliness={submission.timeliness}
                                />
                                <span className="text-xs text-muted-foreground">
                                    {formatDate(submission.created_at)}
                                </span>
                            </div>

                            {/* Action menu */}
                            <button
                                onClick={(e) => e.stopPropagation()}
                                className="hidden rounded-full p-2 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-muted lg:flex lg:items-center lg:justify-center"
                                aria-label="More actions"
                            >
                                <EllipsisVertical className="h-4 w-4" />
                            </button>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

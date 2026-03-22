import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ReportSubmission } from '@/types';
import {
    CheckCircle2,
    Clock,
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

// ─── Status config (keep in sync with ListView) ───────────────────────────────

const STATUS_CONFIG = {
    accepted: {
        label: 'Accepted',
        icon: CheckCircle2,
        badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        ring: 'ring-emerald-500',
        dot: 'bg-emerald-500',
    },
    pending: {
        label: 'Pending Review',
        icon: Clock,
        badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        ring: 'ring-amber-500',
        dot: 'bg-amber-500',
    },
    returned: {
        label: 'Returned',
        icon: RotateCcw,
        badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
        ring: 'ring-rose-500',
        dot: 'bg-rose-500',
    },
} as const;

type StatusKey = keyof typeof STATUS_CONFIG;

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

export default function GridView({
    reportSubmissions,
    onCardClick,
}: {
    reportSubmissions: ReportSubmission[];
    onCardClick: (submission: ReportSubmission) => void;
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reportSubmissions.map((submission) => {
                const cfg =
                    STATUS_CONFIG[submission.status as StatusKey] ??
                    STATUS_CONFIG.pending;
                const Icon = cfg.icon;

                return (
                    <button
                        key={submission.id}
                        onClick={() => onCardClick(submission)}
                        className="group relative flex cursor-pointer flex-col items-center rounded-xl border bg-card p-6 text-center transition-all hover:border-border/80 hover:shadow-lg"
                    >
                        {/* Status badge — top right */}
                        <span
                            className={`absolute top-3 right-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${cfg.badge}`}
                        >
                            <Icon className="h-3 w-3 flex-shrink-0" />
                            {cfg.label}
                        </span>

                        {/* Avatar with status dot */}
                        <div className="relative mt-2 mb-4">
                            <Avatar
                                className={`h-16 w-16 ring-2 ring-offset-2 ring-offset-card ${cfg.ring}`}
                            >
                                <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
                                    {getInitials(
                                        submission.field_officer?.name,
                                    )}
                                </AvatarFallback>
                            </Avatar>
                            {/* <span
                                className={`absolute -right-0.5 -bottom-0.5 h-3.5 w-3.5 rounded-full ring-2 ring-card ${cfg.dot}`}
                            /> */}
                        </div>

                        {/* Officer name */}
                        <h3 className="text-sm font-semibold text-foreground lg:text-base">
                            {`${submission.field_officer.first_name} ${submission.field_officer.last_name}`}
                        </h3>

                        {/* Cluster */}
                        {submission.field_officer?.cluster && (
                            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                {submission.field_officer.cluster}
                            </p>
                        )}

                        {/* Divider */}
                        <div className="my-4 w-full border-t" />

                        {/* Dates */}
                        <div className="w-full space-y-1.5 text-left">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">
                                    Submitted
                                </span>
                                <span className="font-medium text-foreground">
                                    {formatDate(submission.created_at)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">
                                    Last updated
                                </span>
                                <span className="text-muted-foreground">
                                    {formatDate(submission.updated_at)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">
                                    Timeliness
                                </span>
                                <TimelinessBadge
                                    timeliness={submission.timeliness}
                                />
                            </div>
                        </div>

                        {/* Footer — file count */}
                        <div className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg bg-muted px-3 py-2">
                            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-xs font-medium text-muted-foreground">
                                {submission.media?.length ?? 0}{' '}
                                {(submission.media?.length ?? 0) === 1
                                    ? 'file'
                                    : 'files'}{' '}
                                attached
                            </span>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}

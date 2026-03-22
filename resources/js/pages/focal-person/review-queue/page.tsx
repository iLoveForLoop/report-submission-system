import ViewController from '@/actions/App/Http/Controllers/FocalPerson/ViewController';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    CalendarClock,
    ClipboardCheck,
    ClipboardList,
    Clock3,
    FileSearch,
    Search,
    TimerReset,
    User,
    Users,
} from 'lucide-react';
import { P } from 'node_modules/framer-motion/dist/types.d-DagZKalS';
import { useMemo, useState } from 'react';

// ── Types ────────────────────────────────────────────────────────────────────

interface ReviewQueueItem {
    id: string;
    report_id: string;
    report_title: string;
    program_id: string;
    program: string;
    officer: string;
    officer_id: number;
    officer_avatar: string; // initials
    cluster: string;
    submitted_at: string;
    deadline: string | null;
    is_overdue: boolean;
}

interface QueueStats {
    total: number;
    overdue: number;
    oldest_days: number;
}

// ── Breadcrumbs ──────────────────────────────────────────────────────────────

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/focal-person/dashboard' },
    { title: 'Review Queue', href: '/focal-person/review-queue' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(value: string | null) {
    if (!value) return '—';
    return new Date(value).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

function formatRelative(value: string) {
    const diff = Date.now() - new Date(value).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
}

function daysUntil(date: string | null): number | null {
    if (!date) return null;
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function daysSince(dateStr: string): number {
    const diff = Date.now() - new Date(dateStr).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// ── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
    label: string;
    value: number | string;
    icon: React.ReactNode;
    variant?: 'default' | 'warning' | 'danger' | 'violet';
}

function StatCard({ label, value, icon, variant = 'default' }: StatCardProps) {
    const variantStyles: Record<string, string> = {
        default: 'bg-muted/50 border-border',
        warning:
            'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800',
        danger: 'bg-rose-50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-800',
        violet: 'bg-violet-50 border-violet-200 dark:bg-violet-950/20 dark:border-violet-800',
    };
    const valueStyles: Record<string, string> = {
        default: 'text-foreground',
        warning: 'text-amber-700 dark:text-amber-300',
        danger: 'text-rose-700 dark:text-rose-300',
        violet: 'text-violet-700 dark:text-violet-300',
    };
    const labelStyles: Record<string, string> = {
        default: 'text-muted-foreground',
        warning: 'text-amber-600 dark:text-amber-400',
        danger: 'text-rose-600 dark:text-rose-400',
        violet: 'text-violet-600 dark:text-violet-400',
    };

    return (
        <div
            className={`rounded-lg border px-4 py-3 ${variantStyles[variant]}`}
        >
            <p
                className={`text-[10px] font-semibold tracking-wider uppercase ${labelStyles[variant]}`}
            >
                {label}
            </p>
            <div className="mt-1 flex items-center justify-between">
                <p className={`text-2xl font-bold ${valueStyles[variant]}`}>
                    {value}
                </p>
                <span className={labelStyles[variant]}>{icon}</span>
            </div>
        </div>
    );
}

// ── Avatar Initials ───────────────────────────────────────────────────────────

function Avatar({ initials, cluster }: { initials: string; cluster: string }) {
    // Different color per cluster
    const colors: Record<string, string> = {
        'M&M': 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
        "D'ONE":
            'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
    };
    const color =
        colors[cluster] ??
        'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300';

    return (
        <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${color}`}
        >
            {initials}
        </div>
    );
}

// ── Urgency Badge ─────────────────────────────────────────────────────────────

function UrgencyBadge({
    deadline,
    isOverdue,
}: {
    deadline: string | null;
    isOverdue: boolean;
}) {
    if (!deadline) return null;

    const days = daysUntil(deadline);

    if (isOverdue || (days !== null && days < 0)) {
        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
                <AlertTriangle className="h-2.5 w-2.5" />
                {Math.abs(days ?? 0)}d overdue
            </span>
        );
    }
    if (days !== null && days <= 3) {
        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                <Clock3 className="h-2.5 w-2.5" />
                {days}d left
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
            <CalendarClock className="h-2.5 w-2.5" />
            {days}d left
        </span>
    );
}

// ── Waiting Badge (how long the submission has been sitting) ──────────────────

function WaitingBadge({ submittedAt }: { submittedAt: string }) {
    const days = daysSince(submittedAt);

    if (days >= 3) {
        return (
            <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-1 text-[10px] font-medium text-rose-600 ring-1 ring-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:ring-rose-800">
                <TimerReset className="h-3 w-3" />
                Waiting {days}d
            </span>
        );
    }
    if (days >= 1) {
        return (
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-[10px] font-medium text-amber-600 ring-1 ring-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:ring-amber-800">
                <TimerReset className="h-3 w-3" />
                Waiting {days}d
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 rounded-md bg-violet-50 px-2 py-1 text-[10px] font-medium text-green-600 ring-1 ring-green-200 dark:bg-green-950/20 dark:text-green-400 dark:ring-green-800">
            <ClipboardCheck className="h-3 w-3" />
            New
        </span>
    );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ReviewQueuePage() {
    const { queue, stats } = usePage<{
        queue: ReviewQueueItem[];
        stats: QueueStats;
    }>().props;

    const [query, setQuery] = useState('');
    const [sortBy, setSortBy] = useState<'oldest' | 'newest' | 'deadline'>(
        'oldest',
    );

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();

        const results = (queue ?? []).filter((item) => {
            if (!q) return true;
            return (
                item.report_title.toLowerCase().includes(q) ||
                item.officer.toLowerCase().includes(q) ||
                item.program.toLowerCase().includes(q)
            );
        });

        return [...results].sort((a, b) => {
            if (sortBy === 'oldest') {
                return (
                    new Date(a.submitted_at).getTime() -
                    new Date(b.submitted_at).getTime()
                );
            }
            if (sortBy === 'newest') {
                return (
                    new Date(b.submitted_at).getTime() -
                    new Date(a.submitted_at).getTime()
                );
            }
            // deadline — overdue first, then soonest
            const da = daysUntil(a.deadline) ?? 9999;
            const db = daysUntil(b.deadline) ?? 9999;
            return da - db;
        });
    }, [queue, query, sortBy]);

    const isEmpty = filtered.length === 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Review Queue" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <CardHeader className="">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground lg:text-2xl dark:text-white">
                                <ClipboardList className="h-5 w-5 text-primary dark:text-primary-400" />
                                Review Queue
                            </CardTitle>
                            <CardDescription>
                                Submissions awaiting your review, sorted by
                                oldest first by default.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                {/* ── Header Card ── */}
                <Card className="gap-4 py-5 bg-background">
                    <CardContent className="space-y-4 px-5">
                        {/* Stats */}
                        <div className="grid gap-3 sm:grid-cols-3">
                            <StatCard
                                label="Pending Review"
                                value={stats?.total ?? 0}
                                icon={<ClipboardCheck className="h-4 w-4" />}
                                variant="warning"
                            />
                            <StatCard
                                label="Overdue Reports"
                                value={stats?.overdue ?? 0}
                                icon={<AlertTriangle className="h-4 w-4" />}
                                variant="danger"
                            />
                            <StatCard
                                label="Oldest Waiting"
                                value={
                                    stats?.oldest_days
                                        ? `${stats.oldest_days}d`
                                        : '—'
                                }
                                icon={<TimerReset className="h-4 w-4" />}
                                variant={
                                    (stats?.oldest_days ?? 0) >= 3
                                        ? 'warning'
                                        : 'default'
                                }
                            />
                        </div>

                        {/* Search + Sort */}
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <div className="relative w-full sm:max-w-sm">
                                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search report, officer, or program..."
                                    className="w-full rounded-md border bg-background py-2 pr-3 pl-9 text-sm outline-none focus:ring-2 focus:ring-violet-400/30"
                                />
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {(
                                    [
                                        {
                                            key: 'oldest',
                                            label: 'Oldest first',
                                            icon: TimerReset,
                                        },
                                        {
                                            key: 'newest',
                                            label: 'Newest first',
                                            icon: Clock3,
                                        },
                                        {
                                            key: 'deadline',
                                            label: 'By deadline',
                                            icon: CalendarClock,
                                        },
                                    ] as const
                                ).map((item) => (
                                    <button
                                        key={item.key}
                                        onClick={() => setSortBy(item.key)}
                                        className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition-colors ${
                                            sortBy === item.key
                                                ? 'bg-[#1d293d] text-muted dark:bg-gray-900 dark:text-foreground'
                                                : 'hover:bg-accent'
                                        }`}
                                    >
                                        <item.icon className="h-3.5 w-3.5" />
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ── Queue List ── */}
                <div className="grid gap-3 h-[48vh] overflow-y-auto pr-3">
                    {isEmpty ? (
                        <Card className="py-10 text-center">
                            <CardContent className="flex flex-col items-center gap-2">
                                {query ? (
                                    <>
                                        <FileSearch className="h-8 w-8 text-muted-foreground/50" />
                                        <p className="font-medium text-muted-foreground">
                                            No results for "{query}"
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Try a different search term.
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <ClipboardCheck className="h-8 w-8 text-violet-300" />
                                        <p className="font-medium text-muted-foreground">
                                            Queue is clear!
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            No submissions are waiting for
                                            review right now.
                                        </p>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        filtered.map((item) => (
                            <Card
                                key={item.id}
                                className={`group relative overflow-hidden transition-all hover:shadow-lg ${
                                    item.is_overdue
                                        ? 'border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/20'
                                        : 'border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-950/20'
                                }`}
                            >
                                <CardContent className="p-5">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                                        {/* Left Section: Context & Identity */}
                                        <div className="flex items-start gap-4">
                                            <div className="relative">
                                                <Avatar
                                                    initials={item.officer_avatar}
                                                    cluster={item.cluster}
                                                    className="h-12 w-12 border-2 border-background shadow-sm"
                                                />
                                                {item.is_overdue && (
                                                    <span className="absolute -right-1 -top-1 flex h-3 w-3">
                                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75"></span>
                                                        <span className="relative inline-flex h-3 w-3 rounded-full bg-destructive"></span>
                                                    </span>
                                                )}
                                            </div>

                                            <div className="space-y-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="text-sm font-bold tracking-tight text-foreground">
                                                        {item.officer}
                                                    </span>
                                                    {item.cluster && item.cluster !== 'N/A' && (
                                                        <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-secondary-foreground">
                                                            {item.cluster}
                                                        </span>
                                                    )}
                                                </div>

                                                <h3 className="text-base font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
                                                    {item.report_title}
                                                </h3>

                                                <p className="text-xs font-medium text-muted-foreground/80">
                                                    {item.program}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Right Section: Status Badges */}
                                        <div className="flex items-center gap-2 self-end sm:self-start">
                                            <WaitingBadge submittedAt={item.submitted_at} />
                                            <UrgencyBadge
                                                deadline={item.deadline}
                                                isOverdue={item.is_overdue}
                                            />
                                        </div>
                                    </div>

                                    {/* Enhanced Meta Row with Separators */}
                                    <div className="mt-5 flex flex-wrap items-center gap-y-2 text-[11px] font-medium text-muted-foreground border-t border-border/50 pt-4">
                                        <div className="flex items-center gap-1.5">
                                            <Clock3 className="h-3.5 w-3.5" />
                                            <span>Submitted {formatRelative(item.submitted_at)}</span>
                                            <span className="opacity-50">({formatDate(item.submitted_at)})</span>
                                        </div>

                                        <span className="hidden mx-2 text-border sm:block">|</span>

                                        {item.deadline && (
                                            <div className="flex items-center gap-1.5">
                                                <CalendarClock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                                                <span>Deadline: {formatDate(item.deadline)}</span>
                                            </div>
                                        )}

                                        <span className="hidden mx-2 text-border sm:block">|</span>

                                        <div className="flex items-center gap-1.5">
                                            <Users className="h-3.5 w-3.5" />
                                            <span>{item.cluster !== 'N/A' ? item.cluster : 'General'}</span>
                                        </div>
                                    </div>

                                    {/* Call to Action */}
                                    <div className="mt-5">
                                        <Link
                                            href={ViewController.reportSubmissions.url({
                                                program: item.program_id,
                                                report: item.report_id,
                                            })}
                                            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:opacity-90 active:scale-[0.98] sm:w-auto"
                                        >
                                            Review Submission
                                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Result count footer */}
                {!isEmpty && (
                    <p className="pb-2 text-center text-xs text-muted-foreground">
                        Showing {filtered.length} of {queue?.length ?? 0}{' '}
                        submission{(queue?.length ?? 0) !== 1 ? 's' : ''}
                    </p>
                )}
            </div>
        </AppLayout>
    );
}

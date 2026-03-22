import ViewController from '@/actions/App/Http/Controllers/FieldOfficer/ViewController';
import Back from '@/components/back';
import { useViewMode } from '@/hooks/use-view-mode';
import AppLayout from '@/layouts/app-layout';
import { dateFormatter } from '@/lib/utils';
import { BreadcrumbItem, LaravelPaginator, Program, Report } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    CalendarClock,
    CheckCircle2,
    Clock,
    FileText,
    Grid2x2,
    List,
    Loader2,
    RotateCcw,
    Search,
    SlidersHorizontal,
    X,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type SubmissionStatus = 'pending' | 'submitted' | 'returned';

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTH_LABELS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

const STATUS_CONFIG: Record<
    SubmissionStatus,
    {
        label: string;
        icon: React.ElementType;
        badgeClass: string;
        iconClass: string;
    }
> = {
    pending: {
        label: 'Pending',
        icon: Clock,
        badgeClass:
            'bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-800',
        iconClass: 'text-amber-500 dark:text-amber-400',
    },
    submitted: {
        label: 'Submitted',
        icon: CheckCircle2,
        badgeClass:
            'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:ring-emerald-800',
        iconClass: 'text-emerald-500 dark:text-emerald-400',
    },
    returned: {
        label: 'Returned',
        icon: RotateCcw,
        badgeClass:
            'bg-rose-50 text-rose-700 ring-1 ring-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:ring-rose-800',
        iconClass: 'text-rose-500 dark:text-rose-400',
    },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isDeadlineSoon(deadline: string | null): boolean {
    if (!deadline) return false;
    const diff = new Date(deadline).getTime() - Date.now();
    return diff > 0 && diff < 3 * 24 * 60 * 60 * 1000;
}

function isOverdue(deadline: string | null): boolean {
    if (!deadline) return false;
    return new Date(deadline).getTime() < Date.now();
}

function StatusBadge({ status }: { status: SubmissionStatus }) {
    const cfg = STATUS_CONFIG[status];
    const Icon = cfg.icon;
    return (
        <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ${cfg.badgeClass}`}
        >
            <Icon className="h-3 w-3" />
            {cfg.label}
        </span>
    );
}

function DeadlineLabel({
    deadline,
    viewMode,
}: {
    deadline: any;
    viewMode?: string;
}) {
    if (!deadline)
        return (
            <span className="text-xs text-muted-foreground/50 dark:text-gray-600">
                —
            </span>
        );
    const overdue = isOverdue(deadline);
    const soon = isDeadlineSoon(deadline);

    return (
        <div className="flex gap-2">
            {viewMode === 'grid' && (
                <span className="text-xs text-muted-foreground dark:text-gray-400">
                    Deadline:
                </span>
            )}
            <span
                className={`flex items-center gap-1 text-xs ${
                    overdue
                        ? 'text-rose-500 dark:text-rose-400'
                        : soon
                          ? 'text-amber-500 dark:text-amber-400'
                          : 'text-muted-foreground dark:text-gray-400'
                }`}
            >
                {(overdue || soon) && <AlertCircle className="h-3 w-3" />}
                <CalendarClock className="h-3 w-3" />
                {dateFormatter(deadline)}
            </span>
        </div>
    );
}

function StatusPill({ status }: { status: SubmissionStatus }) {
    const colors = {
        pending: 'bg-amber-50 dark:bg-amber-950/30',
        submitted: 'bg-green-50 dark:bg-green-950/30',
        returned: 'bg-red-50 dark:bg-red-950/30',
    };
    const dotColors = {
        pending: 'bg-amber-500 dark:bg-amber-400 animate-pulse',
        submitted: 'bg-green-500 dark:bg-green-400 animate-pulse',
        returned: 'bg-red-500 dark:bg-red-400',
    };
    const textColors = {
        pending: 'text-amber-600 dark:text-amber-400',
        submitted: 'text-green-600 dark:text-green-400',
        returned: 'text-red-600 dark:text-red-400',
    };
    return (
        <div
            className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 ${colors[status]}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${dotColors[status]}`} />
            <span className={`text-xs font-medium ${textColors[status]}`}>
                {STATUS_CONFIG[status].label}
            </span>
        </div>
    );
}

function cardBorderClass(status: SubmissionStatus) {
    return status === 'pending'
        ? 'border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-950/20'
        : status === 'submitted'
          ? 'border-l-4 border-l-green-500 bg-green-50 dark:bg-green-950/20'
          : 'border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/20';
}

function iconBgClass(status: SubmissionStatus) {
    return status === 'pending'
        ? 'bg-amber-100 dark:bg-amber-900/50'
        : status === 'submitted'
          ? 'bg-green-100 dark:bg-green-900/50'
          : 'bg-red-100 dark:bg-red-900/50';
}

function iconColorClass(status: SubmissionStatus) {
    return status === 'pending'
        ? 'text-amber-700 dark:text-amber-400'
        : status === 'submitted'
          ? 'text-green-700 dark:text-green-400'
          : 'text-red-700 dark:text-red-400';
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Reports() {
    const { reports, program } = usePage<{
        reports: LaravelPaginator<Report>;
        program: Program;
    }>().props;

    const reportList = reports?.data ?? [];
    const nextPageUrl = reports?.next_page_url ?? null;

    const [loading, setLoading] = useState(false);
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const { mode: viewMode, updateMode: setViewMode } = useViewMode();

    // ── Filter state ──────────────────────────────────────────────────────────
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<'' | SubmissionStatus>('');
    const [deadlineFrom, setDeadlineFrom] = useState('');
    const [deadlineTo, setDeadlineTo] = useState('');
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const yearOptions = useMemo(
        () =>
            [
                ...new Set(
                    reportList.map((r) => new Date(r.created_at).getFullYear()),
                ),
            ].sort((a, b) => b - a),
        [reportList],
    );

    const activeFilterCount = [
        !!status,
        !!deadlineFrom,
        !!deadlineTo,
        !!year,
        !!month,
    ].filter(Boolean).length;
    const hasAny = !!search || activeFilterCount > 0;

    const clearAll = () => {
        setSearch('');
        setStatus('');
        setDeadlineFrom('');
        setDeadlineTo('');
        setYear('');
        setMonth('');
    };

    // ── Client-side filtering (runs over all loaded records) ──────────────────
    const filtered = useMemo(() => {
        return reportList.filter((r) => {
            if (search && !r.title.toLowerCase().includes(search.toLowerCase()))
                return false;
            if (status && r.submission_status !== status) return false;
            if (
                deadlineFrom &&
                r.deadline &&
                new Date(r.deadline) < new Date(deadlineFrom)
            )
                return false;
            if (deadlineTo && r.deadline) {
                const to = new Date(deadlineTo);
                to.setHours(23, 59, 59, 999);
                if (new Date(r.deadline) > to) return false;
            }
            if (year && new Date(r.created_at).getFullYear() !== Number(year))
                return false;
            if (month && new Date(r.created_at).getMonth() !== Number(month))
                return false;
            return true;
        });
    }, [reportList, search, status, deadlineFrom, deadlineTo, year, month]);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Programs', href: ViewController.programs().url },
        { title: program.name, href: ViewController.reports(program).url },
    ];

    // ── Infinite scroll ───────────────────────────────────────────────────────
    const loadMore = useCallback(() => {
        if (!nextPageUrl || loading) return;
        setLoading(true);
        router.get(
            nextPageUrl,
            {},
            {
                preserveState: true,
                preserveScroll: true,
                only: ['reports'],
                onFinish: () => setLoading(false),
            },
        );
    }, [nextPageUrl, loading]);

    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) loadMore();
            },
            { rootMargin: '200px' },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [loadMore]);

    const hasReports = reportList.length > 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Back link={ViewController.programs()} />

                {/* ── Page header ───────────────────────────────────────────── */}
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h1 className="text-lg leading-tight font-semibold text-foreground lg:text-2xl dark:text-white">
                            {program.name}
                        </h1>
                        {hasReports && (
                            <p className="text-xs text-muted-foreground lg:text-sm dark:text-gray-400">
                                <span className="font-medium text-foreground">
                                    {filtered.length}
                                </span>{' '}
                                of {reports.total} report
                                {reports.total !== 1 ? 's' : ''}
                            </p>
                        )}
                    </div>

                    {hasReports && (
                        <div className="flex items-center gap-1 rounded-lg border bg-card p-1 dark:border-gray-700 dark:bg-gray-800">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`rounded p-2 transition-colors ${
                                    viewMode === 'grid'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground dark:text-gray-400 dark:hover:bg-gray-700'
                                }`}
                                title="Grid view"
                            >
                                <Grid2x2 className="h-3 w-3 lg:h-4 lg:w-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`rounded p-2 transition-colors ${
                                    viewMode === 'list'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground dark:text-gray-400 dark:hover:bg-gray-700'
                                }`}
                                title="List view"
                            >
                                <List className="h-3 w-3 lg:h-4 lg:w-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* ── Empty DB state ────────────────────────────────────────── */}
                {!hasReports && (
                    <div className="flex h-[60vh] flex-col items-center justify-center gap-3 text-center">
                        <img
                            src="/Images/no-report.svg"
                            alt="No reports"
                            className="h-28 opacity-70 dark:opacity-50"
                        />
                        <p className="text-sm text-muted-foreground dark:text-gray-400">
                            No reports yet
                        </p>
                    </div>
                )}

                {/* ── Filter bar ────────────────────────────────────────────── */}
                {hasReports && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            {/* Search */}
                            <div className="relative flex-1">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search reports…"
                                    className="h-9 w-full rounded-lg border bg-background py-2 pr-3 pl-9 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                                />
                                {search && (
                                    <button
                                        onClick={() => setSearch('')}
                                        className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                )}
                            </div>

                            {/* Status quick pills */}
                            <div className="hidden items-center gap-1 sm:flex">
                                {(
                                    [
                                        'pending',
                                        'submitted',
                                        'returned',
                                    ] as SubmissionStatus[]
                                ).map((s) => (
                                    <button
                                        key={s}
                                        onClick={() =>
                                            setStatus(status === s ? '' : s)
                                        }
                                        className={`h-9 rounded-lg border px-3 text-xs font-medium transition-colors ${
                                            status === s
                                                ? STATUS_CONFIG[s].badgeClass
                                                : 'bg-background hover:bg-muted'
                                        }`}
                                    >
                                        {STATUS_CONFIG[s].label}
                                    </button>
                                ))}
                            </div>

                            {/* Filters panel */}
                            <button
                                onClick={() => setShowFilters((v) => !v)}
                                className={`relative flex h-9 items-center gap-2 rounded-lg border px-3 text-sm transition-colors ${
                                    showFilters
                                        ? 'border-primary bg-primary/5 text-primary'
                                        : 'bg-background hover:bg-muted'
                                }`}
                            >
                                <SlidersHorizontal className="h-4 w-4" />
                                <span className="hidden sm:inline">
                                    Filters
                                </span>
                                {activeFilterCount > 0 && (
                                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </button>

                            {/* Clear */}
                            {hasAny && (
                                <button
                                    onClick={clearAll}
                                    className="flex h-9 items-center gap-1.5 rounded-lg border border-dashed px-3 text-xs text-muted-foreground transition-colors hover:border-rose-400 hover:text-rose-500"
                                >
                                    <X className="h-3.5 w-3.5" />
                                    Clear
                                </button>
                            )}
                        </div>

                        {/* Expanded filter panel */}
                        {showFilters && (
                            <div className="rounded-xl border bg-card p-4">
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                    {/* Deadline from */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-muted-foreground">
                                            Deadline from
                                        </label>
                                        <input
                                            type="date"
                                            value={deadlineFrom}
                                            onChange={(e) =>
                                                setDeadlineFrom(e.target.value)
                                            }
                                            className="h-9 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                                        />
                                    </div>

                                    {/* Deadline until */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-muted-foreground">
                                            Deadline until
                                        </label>
                                        <input
                                            type="date"
                                            value={deadlineTo}
                                            onChange={(e) =>
                                                setDeadlineTo(e.target.value)
                                            }
                                            className="h-9 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                                        />
                                    </div>

                                    {/* Year */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-muted-foreground">
                                            Created year
                                        </label>
                                        <select
                                            value={year}
                                            onChange={(e) => {
                                                setYear(e.target.value);
                                                if (!e.target.value)
                                                    setMonth('');
                                            }}
                                            className="h-9 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                                        >
                                            <option value="">All years</option>
                                            {yearOptions.map((y) => (
                                                <option key={y} value={y}>
                                                    {y}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Month */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-muted-foreground">
                                            Created month
                                        </label>
                                        <select
                                            value={month}
                                            onChange={(e) =>
                                                setMonth(e.target.value)
                                            }
                                            disabled={!year}
                                            className="h-9 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <option value="">All months</option>
                                            {MONTH_LABELS.map((label, i) => (
                                                <option key={i} value={i}>
                                                    {label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {activeFilterCount > 0 && (
                                    <div className="mt-3 flex flex-wrap items-center gap-2 border-t pt-3">
                                        <span className="text-xs text-muted-foreground">
                                            Active:
                                        </span>
                                        {status && (
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_CONFIG[status as SubmissionStatus].badgeClass}`}
                                            >
                                                {
                                                    STATUS_CONFIG[
                                                        status as SubmissionStatus
                                                    ].label
                                                }
                                                <button
                                                    onClick={() =>
                                                        setStatus('')
                                                    }
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        )}
                                        {deadlineFrom && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                                From:{' '}
                                                {new Date(
                                                    deadlineFrom,
                                                ).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                                <button
                                                    onClick={() =>
                                                        setDeadlineFrom('')
                                                    }
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        )}
                                        {deadlineTo && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                                Until:{' '}
                                                {new Date(
                                                    deadlineTo,
                                                ).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                                <button
                                                    onClick={() =>
                                                        setDeadlineTo('')
                                                    }
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        )}
                                        {year && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                                Year: {year}
                                                <button
                                                    onClick={() => {
                                                        setYear('');
                                                        setMonth('');
                                                    }}
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        )}
                                        {month && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                                Month:{' '}
                                                {MONTH_LABELS[Number(month)]}
                                                <button
                                                    onClick={() => setMonth('')}
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* ── No filter results ─────────────────────────────────────── */}
                {hasReports && filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                        <FileText className="h-10 w-10 text-muted-foreground/30" />
                        <p className="text-sm font-medium text-muted-foreground">
                            No reports match the current filters
                        </p>
                        <button
                            onClick={clearAll}
                            className="text-xs text-primary hover:underline"
                        >
                            Clear filters
                        </button>
                    </div>
                )}

                {/* ── Grid view ─────────────────────────────────────────────── */}
                {filtered.length > 0 && viewMode === 'grid' && (
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((report) => {
                            const s =
                                report.submission_status as SubmissionStatus;
                            return (
                                <Link
                                    key={report.id}
                                    href={ViewController.reportSubmissions([
                                        program,
                                        report,
                                    ])}
                                    className={`group relative flex gap-3 rounded-xl border p-4 transition-all duration-200 hover:border-gray-300 hover:shadow-sm dark:hover:border-gray-600 ${cardBorderClass(s)}`}
                                >
                                    <div className="flex min-w-0 flex-1 flex-col gap-3">
                                        <div className="flex min-w-0 flex-1 items-start gap-3">
                                            <div
                                                className={`rounded-lg p-2.5 ${iconBgClass(s)}`}
                                            >
                                                <FileText
                                                    className={`h-4 w-4 ${iconColorClass(s)}`}
                                                />
                                            </div>
                                            <div className="flex min-w-0 flex-1 flex-col">
                                                <h3 className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                                    {report.title}
                                                </h3>
                                                {report.description && (
                                                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                                                        {report.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pl-12">
                                            <DeadlineLabel
                                                deadline={report.deadline}
                                                viewMode={viewMode}
                                            />
                                            <StatusPill status={s} />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* ── List view ─────────────────────────────────────────────── */}
                {filtered.length > 0 && viewMode === 'list' && (
                    <div className="flex flex-col overflow-hidden rounded-xl border dark:border-gray-700">
                        <div className="grid grid-cols-12 gap-4 border-b bg-muted/40 px-4 py-2.5 text-xs font-medium tracking-wide text-muted-foreground uppercase dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400">
                            <div className="col-span-5">Report</div>
                            <div className="col-span-3">Deadline</div>
                            <div className="col-span-2 text-right">Status</div>
                        </div>

                        {filtered.map((report) => {
                            const s =
                                report.submission_status as SubmissionStatus;
                            return (
                                <Link
                                    key={report.id}
                                    href={ViewController.reportSubmissions([
                                        program,
                                        report,
                                    ])}
                                    className={`group grid grid-cols-12 items-center gap-4 border-b px-4 py-3 transition-colors last:border-0 hover:bg-accent/50 dark:border-gray-700 dark:hover:bg-gray-800/50 ${cardBorderClass(s)}`}
                                >
                                    <div className="col-span-5 flex min-w-0 items-center gap-3">
                                        <FileText
                                            className={`h-4 w-4 shrink-0 ${iconColorClass(s)}`}
                                        />
                                        <span className="truncate font-medium text-foreground dark:text-white">
                                            {report.title}
                                        </span>
                                    </div>
                                    <div className="col-span-3">
                                        <DeadlineLabel
                                            deadline={report.deadline}
                                        />
                                    </div>
                                    <div className="col-span-2 flex justify-end">
                                        <StatusBadge status={s} />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* ── Infinite scroll sentinel ──────────────────────────────── */}
                {hasReports && (
                    <div ref={sentinelRef} className="flex justify-center py-4">
                        {loading && (
                            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground dark:text-gray-400">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Loading more…
                            </span>
                        )}
                        {!nextPageUrl && !loading && (
                            <p className="text-xs text-muted-foreground/50 dark:text-gray-600">
                                All reports loaded
                            </p>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

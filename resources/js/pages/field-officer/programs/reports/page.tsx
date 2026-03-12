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
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

type SubmissionStatus = 'pending' | 'submitted' | 'returned';

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

function StatusIcon({ status }: { status: SubmissionStatus }) {
    const cfg = STATUS_CONFIG[status];
    const Icon = cfg.icon;
    return (
        <span title={cfg.label}>
            <Icon className={`h-4 w-4 ${cfg.iconClass}`} />
        </span>
    );
}

// ─── Deadline helpers ─────────────────────────────────────────────────────────

function isDeadlineSoon(deadline: string | null): boolean {
    if (!deadline) return false;
    const diff = new Date(deadline).getTime() - Date.now();
    return diff > 0 && diff < 3 * 24 * 60 * 60 * 1000;
}

function isOverdue(deadline: string | null): boolean {
    if (!deadline) return false;
    return new Date(deadline).getTime() < Date.now();
}

function DeadlineLabel({ deadline }: { deadline: any }) {
    if (!deadline)
        return <span className="text-xs text-muted-foreground/50 dark:text-gray-600">—</span>;
    const overdue = isOverdue(deadline);
    const soon = isDeadlineSoon(deadline);

    return (
        <>
            <div className="flex gap-2">
                <span className="text-xs text-muted-foreground dark:text-gray-400">Deadline:</span>
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
        </>
    );
}

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

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Programs',
            href: ViewController.programs().url,
        },
        {
            title: program.name,
            href: ViewController.reports(program).url,
        },
    ];

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
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div>
                            <h1 className="text-lg lg:text-2xl leading-tight font-semibold text-foreground dark:text-white">
                                {program.name}
                            </h1>
                            {hasReports && (
                                <p className="text-xs lg:text-sm text-muted-foreground dark:text-gray-400">
                                    {reports.total} report
                                    {reports.total !== 1 ? 's' : ''}
                                </p>
                            )}
                        </div>
                    </div>

                    {hasReports && (
                        <div className="flex items-center gap-1 rounded-lg border bg-card p-1 dark:border-gray-700 dark:bg-gray-800">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`rounded p-2 transition-colors ${
                                    viewMode === 'grid'
                                        ? 'bg-primary text-primary-foreground dark:bg-primary-600 dark:text-white'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200'
                                }`}
                                title="Grid view"
                            >
                                <Grid2x2 className="h-3 w-3 lg:h-4 lg:w-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`rounded p-2 transition-colors ${
                                    viewMode === 'list'
                                        ? 'bg-primary text-primary-foreground dark:bg-primary-600 dark:text-white'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200'
                                }`}
                                title="List view"
                            >
                                <List className="h-3 w-3 lg:h-4 lg:w-4" />
                            </button>
                        </div>
                    )}
                </div>

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

                {hasReports && viewMode === 'grid' && (
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {reportList.map((report, index) => (
                            <Link
                                key={index}
                                href={ViewController.reportSubmissions([program, report])}
                                className={`group relative flex gap-3 rounded-xl border p-4 transition-all duration-200 hover:border-gray-300 hover:shadow-sm dark:hover:border-gray-600 ${
                                    report.submission_status === "pending"
                                    ? 'border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-950/20'
                                    : report.submission_status === "submitted"
                                        ? 'border-l-4 border-l-green-500 bg-green-50 dark:bg-green-950/20'
                                        : 'border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/20'
                                }`}
                            >
                                <div className="flex min-w-0 flex-1 flex-col gap-3">
                                    <div className="flex items-start gap-3">
                                        <div
                                            className={`rounded-lg p-2.5 ${
                                                report.submission_status === "pending"
                                                ? 'bg-amber-100 dark:bg-amber-900/50'
                                                : report.submission_status === "submitted"
                                                    ? 'bg-green-100 dark:bg-green-900/50'
                                                    : 'bg-red-100 dark:bg-red-900/50'
                                            }`}
                                        >
                                            <FileText
                                            className={`h-4.5 w-4.5 ${
                                                report.submission_status === "pending"
                                                    ? 'text-amber-700 dark:text-amber-400'
                                                    : report.submission_status === "submitted"
                                                        ? 'text-green-700 dark:text-green-400'
                                                        : 'text-red-700 dark:text-red-400'
                                                }`}
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

                                    <div className="flex items-center justify-between pl-12.5">
                                        <DeadlineLabel deadline={report.deadline} />

                                        {report.submission_status === "pending" && (
                                            <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2 py-0.5 dark:bg-amber-950/30">
                                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse dark:bg-amber-400" />
                                                <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Pending</span>
                                            </div>
                                        )}

                                        {report.submission_status === "submitted" && (
                                            <div className="flex items-center gap-1.5 rounded-full bg-green-50 px-2 py-0.5 dark:bg-green-950/30">
                                                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse dark:bg-green-400" />
                                                <span className="text-xs font-medium text-green-600 dark:text-green-400">Submitted</span>
                                            </div>
                                        )}

                                        {report.submission_status === "returned" && (
                                            <div className="flex items-center gap-1.5 rounded-full bg-red-50 px-2 py-0.5 dark:bg-red-950/30">
                                                <span className="h-1.5 w-1.5 rounded-full bg-red-500 dark:bg-red-400" />
                                                <span className="text-xs font-medium text-red-600 dark:text-red-400">Returned</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {hasReports && viewMode === 'list' && (
                    <div className="flex flex-col overflow-hidden rounded-xl border dark:border-gray-700">
                        <div className="grid grid-cols-12 gap-4 border-b bg-muted/40 px-4 py-2.5 text-xs font-medium tracking-wide text-muted-foreground uppercase dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400">
                            <div className="col-span-5">Report</div>
                            <div className="col-span-3">Deadline</div>
                            <div className="col-span-2 text-right">Status</div>
                        </div>

                        {reportList.map((report, index) => (
                            <Link
                                key={index}
                                href={ViewController.reportSubmissions([
                                    program,
                                    report,
                                ])}
                                className={`group grid grid-cols-12 items-center gap-4 border-b px-4 py-3 transition-colors last:border-0 hover:bg-accent/50 dark:border-gray-700 dark:hover:bg-gray-800/50 ${
                                    report.submission_status === "pending"
                                    ? 'border-l-4 border-l-amber-500 bg-amber-50/30 dark:bg-amber-950/10'
                                    : report.submission_status === "submitted"
                                        ? 'border-l-4 border-l-green-500 bg-green-50/30 dark:bg-green-950/10'
                                        : 'border-l-4 border-l-red-500 bg-red-50/30 dark:bg-red-950/10'
                                }`}
                            >
                                <div className="col-span-5 flex min-w-0 items-center gap-3">
                                    <FileText className={`h-4 w-4 flex-shrink-0 ${
                                        report.submission_status === "pending"
                                            ? 'text-amber-500 dark:text-amber-400'
                                            : report.submission_status === "submitted"
                                                ? 'text-green-500 dark:text-green-400'
                                                : 'text-red-500 dark:text-red-400'
                                    }`} />
                                    <span className="truncate font-medium text-foreground dark:text-white">
                                        {report.title}
                                    </span>
                                </div>

                                <div className="col-span-3">
                                    <DeadlineLabel deadline={report.deadline} />
                                </div>
                                <div className="col-span-2 flex justify-end">
                                    <StatusBadge
                                        status={
                                            report.submission_status as SubmissionStatus
                                        }
                                    />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {hasReports && (
                    <div ref={sentinelRef} className="flex justify-center py-4">
                        {loading && (
                            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground dark:text-gray-400">
                                <Loader2 className="h-4 w-4 animate-spin dark:text-gray-400" />
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

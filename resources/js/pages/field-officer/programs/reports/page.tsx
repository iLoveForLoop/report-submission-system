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
        return <span className="text-xs text-muted-foreground/50">—</span>;
    const overdue = isOverdue(deadline);
    const soon = isDeadlineSoon(deadline);

    return (
        <>
            <div className="flex gap-2">
                <span className="text-xs text-muted-foreground">Deadline:</span>
                <span
                    className={`flex items-center gap-1 text-xs ${
                        overdue
                            ? 'text-rose-500 dark:text-rose-400'
                            : soon
                              ? 'text-amber-500 dark:text-amber-400'
                              : 'text-muted-foreground'
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
                            <h1 className="text-lg lg:text-2xl leading-tight font-semibold">
                                {program.name}
                            </h1>
                            {hasReports && (
                                <p className="text-xs lg:text-sm text-muted-foreground">
                                    {reports.total} report
                                    {reports.total !== 1 ? 's' : ''}
                                </p>
                            )}
                        </div>
                    </div>

                    {hasReports && (
                        <div className="flex items-center gap-1 rounded-lg border bg-card p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`rounded p-2 transition-colors ${
                                    viewMode === 'grid'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
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
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
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
                            className="h-28 opacity-70"
                        />
                        <p className="text-sm text-muted-foreground">
                            No reports yet
                        </p>
                    </div>
                )}

                {hasReports && viewMode === 'grid' && (
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {reportList.map((report, index) => (
                            <Link
                                key={index}
                                href={ViewController.reportSubmissions([
                                    program,
                                    report,
                                ])}
                                className="group relative flex flex-col gap-3 rounded-xl border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-sm"
                            >
                                {/* Status icon — top right */}
                                <div className="absolute top-3 right-3">
                                    <StatusIcon
                                        status={
                                            report.submission_status as SubmissionStatus
                                        }
                                    />
                                </div>

                                {/* Icon + title */}
                                <div className="flex items-start gap-3 pr-6">
                                    <div className="rounded-md bg-muted p-2.5">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="flex min-w-0 flex-col">
                                        <h2 className="truncate leading-snug font-medium text-foreground">
                                            {report.title}
                                        </h2>
                                        {report.description && (
                                            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                                                {report.description}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between border-t pt-2.5">
                                    <DeadlineLabel deadline={report.deadline} />
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

                {hasReports && viewMode === 'list' && (
                    <div className="flex flex-col overflow-hidden rounded-xl border">
                        <div className="grid grid-cols-12 gap-4 border-b bg-muted/40 px-4 py-2.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                            <div className="col-span-5">Report</div>
                            <div className="col-span-3">Deadline</div>
                            {/* <div className="col-span-2">Final Deadline</div> */}
                            <div className="col-span-2 text-right">Status</div>
                        </div>

                        {reportList.map((report, index) => (
                            <Link
                                key={index}
                                href={ViewController.reportSubmissions([
                                    program,
                                    report,
                                ])}
                                className="group grid grid-cols-12 items-center gap-4 border-b px-4 py-3 transition-colors last:border-0 hover:bg-accent/50"
                            >
                                <div className="col-span-5 flex min-w-0 items-center gap-3">
                                    <FileText className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                    <span className="truncate font-medium text-foreground">
                                        {report.title}
                                    </span>
                                </div>
                                <div className="col-span-3">
                                    <DeadlineLabel deadline={report.deadline} />
                                </div>
                                {/* <div className="col-span-2 text-xs text-muted-foreground">
                                    {report.final_deadline
                                        ? dateFormatter(report.final_deadline)
                                        : '—'}
                                </div> */}
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
                            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Loading more…
                            </span>
                        )}
                        {!nextPageUrl && !loading && (
                            <p className="text-xs text-muted-foreground/50">
                                All reports loaded
                            </p>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

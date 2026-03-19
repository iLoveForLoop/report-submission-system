import Back from '@/components/back';
import { Button } from '@/components/ui/button';
import { useViewMode } from '@/hooks/use-view-mode';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Program, Report, ReportSubmission } from '@/types';
import { usePage } from '@inertiajs/react';
import {
    Download,
    Grid2x2,
    List,
    Search,
    SlidersHorizontal,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import GridView from './components/grid-view';
import ListView from './components/list-view';
import ReportSubmissionDrawer from './components/report-submission-drawer';

// ─── Types ────────────────────────────────────────────────────────────────────

type StatusFilter = 'all' | 'pending' | 'approved' | 'returned';
type TimelinessFilter = 'all' | 'early' | 'on_time' | 'late';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'returned', label: 'Returned' },
];

const TIMELINESS_OPTIONS: { value: TimelinessFilter; label: string }[] = [
    { value: 'all', label: 'All Timeliness' },
    { value: 'early', label: 'Early' },
    { value: 'on_time', label: 'On Time' },
    { value: 'late', label: 'Late' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Page() {
    const { report, reportSubmissions, program } = usePage<{
        report: Report;
        reportSubmissions: ReportSubmission[];
        program: Program;
    }>().props;

    const { mode: viewMode, updateMode: setViewMode } = useViewMode();

    // Drawer state
    const [selectedSubmission, setSelectedSubmission] =
        useState<ReportSubmission | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Filter state
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [timelinessFilter, setTimelinessFilter] =
        useState<TimelinessFilter>('all');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const handleCardClick = (submission: ReportSubmission) => {
        setSelectedSubmission(submission);
        setIsDrawerOpen(true);
    };

    // ── Active filter count (for badge) ──────────────────────────────────────
    const activeFilterCount = [
        statusFilter !== 'all',
        timelinessFilter !== 'all',
        !!dateFrom,
        !!dateTo,
    ].filter(Boolean).length;

    const clearFilters = () => {
        setSearch('');
        setStatusFilter('all');
        setTimelinessFilter('all');
        setDateFrom('');
        setDateTo('');
    };

    // ── Filtered submissions ──────────────────────────────────────────────────
    const filteredSubmissions = useMemo(() => {
        return reportSubmissions.filter((sub) => {
            // Name search
            if (search) {
                const name = sub.field_officer?.name?.toLowerCase() ?? '';
                if (!name.includes(search.toLowerCase())) return false;
            }

            // Status
            if (statusFilter !== 'all' && sub.status !== statusFilter)
                return false;

            // Timeliness
            if (
                timelinessFilter !== 'all' &&
                sub.timeliness !== timelinessFilter
            )
                return false;

            // Date from
            if (dateFrom) {
                const submittedAt = new Date(sub.created_at);
                if (submittedAt < new Date(dateFrom)) return false;
            }

            // Date to
            if (dateTo) {
                const submittedAt = new Date(sub.created_at);
                const to = new Date(dateTo);
                to.setHours(23, 59, 59, 999);
                if (submittedAt > to) return false;
            }

            return true;
        });
    }, [
        reportSubmissions,
        search,
        statusFilter,
        timelinessFilter,
        dateFrom,
        dateTo,
    ]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `Programs/${program.name}/Reports/${report.title}/Report Submissions`,
            href: `/focal-person/programs/${program.id}/reports/${report.id}/report-submissions`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Back link={`/focal-person/programs/${program.id}/reports`} />

                {/* ── Top bar ───────────────────────────────────────────────── */}
                <div className="flex items-center justify-between gap-3">
                    <h1 className="truncate text-lg font-semibold lg:text-xl">
                        {report.title}
                    </h1>
                    <div className="flex flex-shrink-0 items-center gap-2">
                        {/* View toggle */}
                        <div className="flex items-center gap-1 rounded-lg border bg-background p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`rounded p-2 transition-colors ${
                                    viewMode === 'grid'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'hover:bg-muted'
                                }`}
                                title="Grid view"
                            >
                                <Grid2x2 className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`rounded p-2 transition-colors ${
                                    viewMode === 'list'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'hover:bg-muted'
                                }`}
                                title="List view"
                            >
                                <List className="h-4 w-4" />
                            </button>
                        </div>

                        <Button asChild variant="outline" size="sm">
                            <a
                                href={`/downloads/folder/${report.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Download className="h-4 w-4" />
                                Download All
                            </a>
                        </Button>
                    </div>
                </div>

                {/* ── Search + filter bar ───────────────────────────────────── */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        {/* Search input */}
                        <div className="relative flex-1">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search field officer name…"
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

                        {/* Filter toggle button */}
                        <button
                            onClick={() => setShowFilters((v) => !v)}
                            className={`relative flex h-9 items-center gap-2 rounded-lg border px-3 text-sm transition-colors ${
                                showFilters
                                    ? 'border-primary bg-primary/5 text-primary'
                                    : 'bg-background hover:bg-muted'
                            }`}
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                            <span className="hidden sm:inline">Filters</span>
                            {activeFilterCount > 0 && (
                                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>

                        {/* Clear all — only when filters are active */}
                        {(activeFilterCount > 0 || search) && (
                            <button
                                onClick={clearFilters}
                                className="flex h-9 items-center gap-1.5 rounded-lg border border-dashed px-3 text-xs text-muted-foreground transition-colors hover:border-rose-400 hover:text-rose-500"
                            >
                                <X className="h-3.5 w-3.5" />
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Expanded filter panel */}
                    {showFilters && (
                        <div className="grid gap-3 rounded-xl border bg-card p-4 sm:grid-cols-2 lg:grid-cols-4">
                            {/* Status */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground">
                                    Status
                                </label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(
                                            e.target.value as StatusFilter,
                                        )
                                    }
                                    className="h-9 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                                >
                                    {STATUS_OPTIONS.map((o) => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Timeliness */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground">
                                    Timeliness
                                </label>
                                <select
                                    value={timelinessFilter}
                                    onChange={(e) =>
                                        setTimelinessFilter(
                                            e.target.value as TimelinessFilter,
                                        )
                                    }
                                    className="h-9 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                                >
                                    {TIMELINESS_OPTIONS.map((o) => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Date from */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground">
                                    Submitted from
                                </label>
                                <input
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) =>
                                        setDateFrom(e.target.value)
                                    }
                                    className="h-9 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                                />
                            </div>

                            {/* Date to */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground">
                                    Submitted until
                                </label>
                                <input
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                    className="h-9 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                                />
                            </div>
                        </div>
                    )}

                    {/* Result count */}
                    <p className="text-xs text-muted-foreground">
                        Showing{' '}
                        <span className="font-medium text-foreground">
                            {filteredSubmissions.length}
                        </span>{' '}
                        of {reportSubmissions.length} submissions
                    </p>
                </div>

                {/* ── Content ───────────────────────────────────────────────── */}
                {filteredSubmissions.length === 0 ? (
                    <div className="flex h-[50vh] flex-col items-center justify-center gap-3 text-center">
                        <img
                            src="/Images/no-report.svg"
                            alt="No results"
                            className="mb-2 h-28 opacity-60"
                        />
                        <p className="text-sm font-medium text-muted-foreground">
                            {reportSubmissions.length === 0
                                ? 'No submissions yet'
                                : 'No submissions match the current filters'}
                        </p>
                        {reportSubmissions.length > 0 && (
                            <button
                                onClick={clearFilters}
                                className="text-xs text-primary hover:underline"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : viewMode === 'grid' ? (
                    <GridView
                        reportSubmissions={filteredSubmissions}
                        onCardClick={handleCardClick}
                    />
                ) : (
                    <ListView
                        reportSubmissions={filteredSubmissions}
                        onRowClick={handleCardClick}
                    />
                )}
            </div>

            <ReportSubmissionDrawer
                submission={selectedSubmission}
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            />
        </AppLayout>
    );
}

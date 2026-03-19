import ViewController from '@/actions/App/Http/Controllers/FocalPerson/ViewController';
import { Pagination } from '@/components/ui/pagination';
import { useViewMode } from '@/hooks/use-view-mode';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, LaravelPaginator, Program } from '@/types';
import { router, usePage } from '@inertiajs/react';
import {
    ClipboardCheck,
    FolderOpen,
    Folders,
    Grid2x2,
    List,
    Search,
    SlidersHorizontal,
    User,
    X,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Filters {
    search?: string;
    year?: number | string;
    month?: number | string;
    pending_only?: boolean | string;
}

interface PageProps {
    programs: LaravelPaginator<Program>;
    available_years: number[];
    filters?: Filters;
}

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

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Programs', href: ViewController.programs().url },
];

// ─── Pending Review Chip ──────────────────────────────────────────────────────

function PendingReviewChip({ count }: { count: number }) {
    if (count <= 0) return null;
    return (
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-violet-50 px-2 py-1 text-xs font-medium text-violet-700 ring-1 ring-violet-200 dark:bg-violet-950/30 dark:text-violet-400 dark:ring-violet-800">
            <ClipboardCheck className="h-3 w-3" />
            {count > 99 ? '99+' : count} to review
        </span>
    );
}

// ─── Summary Bar ─────────────────────────────────────────────────────────────

function SummaryBar({
    programs,
    total,
    from,
    to,
    filters,
}: {
    programs: Program[];
    total: number;
    from: number | null;
    to: number | null;
    filters: Filters;
}) {
    const needsReview = programs.filter(
        (p) => (p.pending_submissions_count ?? 0) > 0,
    ).length;
    const totalPending = programs.reduce(
        (sum, p) => sum + (p.pending_submissions_count ?? 0),
        0,
    );

    const yearLabel = filters.year ? ` · ${filters.year}` : '';
    const monthLabel = filters.month
        ? ` ${MONTH_LABELS[Number(filters.month) - 1]}`
        : '';

    return (
        <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">
                Showing{' '}
                <span className="font-medium text-foreground">{from}</span>–
                <span className="font-medium text-foreground">{to}</span> of{' '}
                <span className="font-medium text-foreground">{total}</span>{' '}
                programs{monthLabel}
                {yearLabel}
            </p>

            {needsReview > 0 && (
                <div className="inline-flex items-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 dark:border-violet-800 dark:bg-violet-950/30">
                    <ClipboardCheck className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                    <span className="text-xs font-medium text-violet-700 dark:text-violet-300">
                        {totalPending} submission{totalPending !== 1 ? 's' : ''}{' '}
                        across {needsReview} program
                        {needsReview !== 1 ? 's' : ''} need
                        {needsReview === 1 ? 's' : ''} your review
                    </span>
                </div>
            )}
        </div>
    );
}

// ─── Grid Card ────────────────────────────────────────────────────────────────

function ProgramGridCard({
    program,
    href,
}: {
    program: Program;
    href: string;
}) {
    const pendingCount = program.pending_submissions_count ?? 0;
    const hasPending = pendingCount > 0;

    return (
        <a
            href={href}
            onClick={(e) => {
                e.preventDefault();
                router.visit(href);
            }}
            className={`group block rounded-xl border bg-card p-4 transition-all hover:shadow-md ${
                hasPending
                    ? 'border-violet-200 hover:border-violet-300 dark:border-violet-800'
                    : 'hover:border-primary/20'
            }`}
        >
            <div className="flex items-start gap-3">
                <div
                    className={`rounded-lg p-2.5 transition-colors ${
                        hasPending
                            ? 'bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400'
                            : 'bg-muted text-muted-foreground'
                    }`}
                >
                    <Folders className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="truncate leading-tight font-semibold text-foreground">
                        {program.name}
                    </h3>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                        {program.description}
                    </p>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-1.5">
                    <User className="h-3 w-3 shrink-0 text-muted-foreground" />
                    <span className="truncate text-xs text-muted-foreground">
                        {program.coordinator?.name}
                    </span>
                </div>
                <PendingReviewChip count={pendingCount} />
            </div>
        </a>
    );
}

// ─── List Row ─────────────────────────────────────────────────────────────────

function ProgramListRow({ program, href }: { program: Program; href: string }) {
    const pendingCount = program.pending_submissions_count ?? 0;
    const hasPending = pendingCount > 0;

    return (
        <a
            href={href}
            onClick={(e) => {
                e.preventDefault();
                router.visit(href);
            }}
            className={`group grid grid-cols-12 items-center gap-4 border-b px-4 py-3 transition-colors last:border-b-0 ${
                hasPending
                    ? 'bg-violet-50/50 hover:bg-violet-50 dark:bg-violet-950/10 dark:hover:bg-violet-950/20'
                    : 'hover:bg-accent/50'
            }`}
        >
            <div className="col-span-5 flex min-w-0 items-center gap-2">
                <Folders
                    className={`h-4 w-4 shrink-0 ${hasPending ? 'text-violet-500' : 'text-muted-foreground'}`}
                />
                <span className="truncate text-sm font-medium text-foreground">
                    {program.name}
                </span>
                <PendingReviewChip count={pendingCount} />
            </div>
            <div className="col-span-3 flex min-w-0 items-center gap-1.5">
                <User className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate text-sm text-muted-foreground">
                    {program.coordinator?.name}
                </span>
            </div>
            <div className="col-span-4 truncate text-sm text-muted-foreground">
                {program.description}
            </div>
        </a>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Programs() {
    const {
        programs,
        available_years,
        filters = {},
    } = usePage<PageProps>().props;
    const { mode: viewMode, updateMode: setViewMode } = useViewMode();

    // ── Filter state (initialised from server-side filters) ───────────────────
    const [search, setSearch] = useState(filters.search ?? '');
    const [year, setYear] = useState<string>(String(filters.year ?? ''));
    const [month, setMonth] = useState<string>(String(filters.month ?? ''));
    const [pendingOnly, setPendingOnly] = useState(!!filters.pending_only);
    const [showFilters, setShowFilters] = useState(false);
    const [isFiltering, setIsFiltering] = useState(false);

    // Debounce ref for search
    const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── Active filter count ───────────────────────────────────────────────────
    const activeFilterCount = [!!year, !!month, pendingOnly].filter(
        Boolean,
    ).length;

    // ── Fire request ──────────────────────────────────────────────────────────
    const applyFilters = useCallback(
        (
            overrides: Partial<{
                search: string;
                year: string;
                month: string;
                pendingOnly: boolean;
            }> = {},
        ) => {
            const s =
                overrides.search !== undefined ? overrides.search : search;
            const y = overrides.year !== undefined ? overrides.year : year;
            const m = overrides.month !== undefined ? overrides.month : month;
            const po =
                overrides.pendingOnly !== undefined
                    ? overrides.pendingOnly
                    : pendingOnly;

            const params: Record<string, unknown> = { page: 1 };
            if (s) params.search = s;
            if (y) params.year = y;
            if (y && m) params.month = m; // month only valid with year
            if (po) params.pending_only = 1;

            setIsFiltering(true);
            router.get(ViewController.programs().url, params, {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => setIsFiltering(false),
            });
        },
        [search, year, month, pendingOnly],
    );

    // Debounced search
    const handleSearchChange = (value: string) => {
        setSearch(value);
        if (searchTimer.current) clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => {
            applyFilters({ search: value });
        }, 400);
    };

    // Immediate filter changes
    const handleYearChange = (value: string) => {
        setYear(value);
        if (!value) setMonth(''); // clear month when year cleared
        applyFilters({ year: value, month: value ? month : '' });
    };

    const handleMonthChange = (value: string) => {
        setMonth(value);
        applyFilters({ month: value });
    };

    const handlePendingToggle = (value: boolean) => {
        setPendingOnly(value);
        applyFilters({ pendingOnly: value });
    };

    const clearAll = () => {
        setSearch('');
        setYear('');
        setMonth('');
        setPendingOnly(false);
        setIsFiltering(true);
        router.get(
            ViewController.programs().url,
            { page: 1 },
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => setIsFiltering(false),
            },
        );
    };

    // Cleanup debounce on unmount
    useEffect(
        () => () => {
            if (searchTimer.current) clearTimeout(searchTimer.current);
        },
        [],
    );

    const hasPrograms = programs.data.length > 0;
    const hasAnyFilter = !!search || activeFilterCount > 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* ── Page header ───────────────────────────────────────────── */}
                <div className="flex items-center justify-between gap-3">
                    <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
                        All Programs
                    </h1>

                    {/* View toggle */}
                    <div className="flex items-center gap-1 rounded-lg border bg-background p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`rounded p-2 transition-colors ${
                                viewMode === 'grid'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
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
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                            title="List view"
                        >
                            <List className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* ── Search + filter bar ───────────────────────────────────── */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    handleSearchChange(e.target.value)
                                }
                                placeholder="Search programs…"
                                className="h-9 w-full rounded-lg border bg-background py-2 pr-3 pl-9 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                            />
                            {search && (
                                <button
                                    onClick={() => handleSearchChange('')}
                                    className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Pending only quick toggle */}
                        <button
                            onClick={() => handlePendingToggle(!pendingOnly)}
                            className={`flex h-9 items-center gap-2 rounded-lg border px-3 text-sm transition-colors ${
                                pendingOnly
                                    ? 'border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-700 dark:bg-violet-950/40 dark:text-violet-300'
                                    : 'bg-background hover:bg-muted'
                            }`}
                            title="Show only programs with pending submissions"
                        >
                            <ClipboardCheck className="h-4 w-4" />
                            <span className="hidden sm:inline">
                                Needs review
                            </span>
                        </button>

                        {/* Filters toggle */}
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

                        {/* Clear all */}
                        {hasAnyFilter && (
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
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {/* Year */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-muted-foreground">
                                        Created year
                                    </label>
                                    <select
                                        value={year}
                                        onChange={(e) =>
                                            handleYearChange(e.target.value)
                                        }
                                        className="h-9 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                                    >
                                        <option value="">All years</option>
                                        {available_years.map((y) => (
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
                                            handleMonthChange(e.target.value)
                                        }
                                        disabled={!year}
                                        className="h-9 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="">All months</option>
                                        {MONTH_LABELS.map((label, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Pending only (also in panel for visibility) */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-muted-foreground">
                                        Submission status
                                    </label>
                                    <button
                                        onClick={() =>
                                            handlePendingToggle(!pendingOnly)
                                        }
                                        className={`flex h-9 w-full items-center gap-2 rounded-lg border px-3 text-sm transition-colors ${
                                            pendingOnly
                                                ? 'border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-700 dark:bg-violet-950/40 dark:text-violet-300'
                                                : 'bg-background text-muted-foreground hover:bg-muted'
                                        }`}
                                    >
                                        <ClipboardCheck className="h-4 w-4 shrink-0" />
                                        {pendingOnly
                                            ? 'Showing: needs review'
                                            : 'All programs'}
                                    </button>
                                </div>
                            </div>

                            {/* Active chips */}
                            {activeFilterCount > 0 && (
                                <div className="mt-3 flex flex-wrap items-center gap-2 border-t pt-3">
                                    <span className="text-xs text-muted-foreground">
                                        Active:
                                    </span>
                                    {year && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                            Year: {year}
                                            <button
                                                onClick={() =>
                                                    handleYearChange('')
                                                }
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    )}
                                    {month && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                            Month:{' '}
                                            {MONTH_LABELS[Number(month) - 1]}
                                            <button
                                                onClick={() =>
                                                    handleMonthChange('')
                                                }
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    )}
                                    {pendingOnly && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-950/30 dark:text-violet-300">
                                            Needs review
                                            <button
                                                onClick={() =>
                                                    handlePendingToggle(false)
                                                }
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Result count */}
                    {hasPrograms && (
                        <p className="text-xs text-muted-foreground">
                            Showing{' '}
                            <span className="font-medium text-foreground">
                                {programs.from}
                            </span>
                            –
                            <span className="font-medium text-foreground">
                                {programs.to}
                            </span>{' '}
                            of{' '}
                            <span className="font-medium text-foreground">
                                {programs.total}
                            </span>{' '}
                            programs
                        </p>
                    )}
                </div>

                {/* ── Loading spinner ───────────────────────────────────────── */}
                {isFiltering && (
                    <div className="flex justify-center py-8">
                        <div className="h-7 w-7 animate-spin rounded-full border-b-2 border-primary" />
                    </div>
                )}

                {/* ── Empty state ───────────────────────────────────────────── */}
                {!isFiltering && !hasPrograms && (
                    <div className="flex h-[45vh] flex-col items-center justify-center gap-3 text-center">
                        <FolderOpen className="h-12 w-12 text-muted-foreground/30" />
                        <p className="text-sm font-medium text-muted-foreground">
                            {hasAnyFilter
                                ? 'No programs match the current filters'
                                : 'No programs yet'}
                        </p>
                        {hasAnyFilter && (
                            <button
                                onClick={clearAll}
                                className="text-xs text-primary hover:underline"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                )}

                {/* ── Content ───────────────────────────────────────────────── */}
                {!isFiltering && hasPrograms && (
                    <>
                        {/* <SummaryBar
                            programs={programs.data}
                            total={programs.total}
                            from={programs.from}
                            to={programs.to}
                            filters={filters}
                        /> */}

                        {/* Grid view */}
                        {viewMode === 'grid' && (
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {programs.data.map((program) => (
                                    <ProgramGridCard
                                        key={program.id}
                                        program={program}
                                        href={
                                            ViewController.reports(program).url
                                        }
                                    />
                                ))}
                            </div>
                        )}

                        {/* List view */}
                        {viewMode === 'list' && (
                            <div className="overflow-hidden rounded-xl border">
                                <div className="grid grid-cols-12 gap-4 border-b bg-muted/50 px-4 py-2.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                    <div className="col-span-5">Name</div>
                                    <div className="col-span-3">
                                        Coordinator
                                    </div>
                                    <div className="col-span-4">
                                        Description
                                    </div>
                                </div>
                                {programs.data.map((program) => (
                                    <ProgramListRow
                                        key={program.id}
                                        program={program}
                                        href={
                                            ViewController.reports(program).url
                                        }
                                    />
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {programs.last_page > 1 && (
                            <Pagination
                                paginator={programs}
                                filters={Object.fromEntries(
                                    Object.entries({
                                        search,
                                        year,
                                        month,
                                        pending_only: pendingOnly || undefined,
                                    }).filter(([, v]) => !!v),
                                )}
                            />
                        )}
                    </>
                )}
            </div>
        </AppLayout>
    );
}

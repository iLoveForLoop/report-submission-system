import ViewController from '@/actions/App/Http/Controllers/FieldOfficer/ViewController';
import { Pagination } from '@/components/ui/pagination';
import { useViewMode } from '@/hooks/use-view-mode';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, LaravelPaginator, Program } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    ClipboardList,
    Folders,
    Grid2x2,
    Layers,
    List,
    Search,
    SlidersHorizontal,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';

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

// ─── Sub-components ───────────────────────────────────────────────────────────

function ReportDueChip() {
    return (
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-amber-50 px-2 py-1 text-xs text-amber-600 ring-1 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-800">
            <ClipboardList className="h-3 w-3" />
            Report due
        </span>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Page() {
    const { programs } = usePage<{ programs: LaravelPaginator<Program> }>()
        .props;
    const { mode: viewMode, updateMode: setViewMode } = useViewMode();

    // ── Filter state ──────────────────────────────────────────────────────────
    const [search, setSearch] = useState('');
    const [pendingOnly, setPendingOnly] = useState(false);
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    // Year options derived from current page's programs
    const yearOptions = useMemo(
        () =>
            [
                ...new Set(
                    programs.data.map((p) =>
                        new Date(p.created_at).getFullYear(),
                    ),
                ),
            ].sort((a, b) => b - a),
        [programs.data],
    );

    const activeFilterCount = [pendingOnly, !!year, !!month].filter(
        Boolean,
    ).length;
    const hasAny = !!search || activeFilterCount > 0;

    const clearAll = () => {
        setSearch('');
        setPendingOnly(false);
        setYear('');
        setMonth('');
    };

    // ── Client-side filtering ─────────────────────────────────────────────────
    const filtered = useMemo(() => {
        return programs.data.filter((p) => {
            if (search && !p.name.toLowerCase().includes(search.toLowerCase()))
                return false;
            if (pendingOnly && !p.has_pending_reports) return false;
            if (year && new Date(p.created_at).getFullYear() !== Number(year))
                return false;
            if (month && new Date(p.created_at).getMonth() !== Number(month))
                return false;
            return true;
        });
    }, [programs.data, search, pendingOnly, year, month]);

    const hasPrograms = programs.data.length > 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* ── Page header ───────────────────────────────────────────── */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="flex items-center gap-2 text-lg font-semibold text-foreground lg:text-2xl dark:text-white">
                            <Layers className="dark:text-primary-400 h-5 w-5 text-primary" />
                            All Programs
                        </h1>
                        {hasPrograms && (
                            <p className="text-xs text-muted-foreground lg:text-sm dark:text-gray-400">
                                Showing{' '}
                                <span className="font-medium text-foreground">
                                    {filtered.length}
                                </span>{' '}
                                of {programs.total} programs
                            </p>
                        )}
                    </div>

                    {hasPrograms && (
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
                                <List className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* ── Empty DB state ────────────────────────────────────────── */}
                {!hasPrograms && (
                    <div className="flex h-[60vh] flex-col items-center justify-center gap-2 py-12 text-center">
                        <Folders className="h-16 w-16 text-muted-foreground/50 dark:text-gray-600" />
                        <h2 className="text-xl font-medium text-muted-foreground dark:text-gray-300">
                            No programs yet
                        </h2>
                        <p className="text-sm text-muted-foreground dark:text-gray-400">
                            Programs will appear here once they are created
                        </p>
                    </div>
                )}

                {/* ── Filter bar ────────────────────────────────────────────── */}
                {hasPrograms && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            {/* Search */}
                            <div className="relative flex-1">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search programs…"
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

                            {/* Pending quick toggle */}
                            <button
                                onClick={() => setPendingOnly((v) => !v)}
                                className={`flex h-9 items-center gap-2 rounded-lg border px-3 text-sm transition-colors ${
                                    pendingOnly
                                        ? 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                                        : 'bg-background hover:bg-muted'
                                }`}
                            >
                                <ClipboardList className="h-4 w-4" />
                                <span className="hidden sm:inline">
                                    Has due reports
                                </span>
                            </button>

                            {/* Filters panel toggle */}
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
                                <div className="grid gap-4 sm:grid-cols-2">
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
                                        {pendingOnly && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
                                                Has due reports
                                                <button
                                                    onClick={() =>
                                                        setPendingOnly(false)
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
                {hasPrograms && filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                        <Folders className="h-10 w-10 text-muted-foreground/30" />
                        <p className="text-sm font-medium text-muted-foreground">
                            No programs match the current filters
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
                        {filtered.map((program) => {
                            const hasPending = program.has_pending_reports;
                            return (
                                <Link
                                    key={program.id}
                                    href={ViewController.reports(program)}
                                    className={`group relative flex gap-3 rounded-xl border p-4 transition-all duration-200 hover:border-gray-300 hover:shadow-sm dark:hover:border-gray-600 ${
                                        hasPending
                                            ? 'border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-950/20'
                                            : 'border-l-4 border-l-green-500 bg-green-50 dark:bg-green-950/20'
                                    }`}
                                >
                                    <div className="flex min-w-0 flex-1 flex-col gap-3">
                                        <div className="flex min-w-0 items-start gap-3">
                                            <div
                                                className={`rounded-lg p-2.5 ${hasPending ? 'bg-amber-100 dark:bg-amber-900/50' : 'bg-emerald-100 dark:bg-emerald-900/50'}`}
                                            >
                                                <Folders
                                                    className={`h-4 w-4 ${hasPending ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}
                                                />
                                            </div>
                                            <div className="flex min-w-0 flex-1 flex-col">
                                                <h3 className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                                    {program.name}
                                                </h3>
                                                <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                                                    {program.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pl-11">
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                                                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                                                        {program.coordinator.name.charAt(
                                                            0,
                                                        )}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {program.coordinator.name}
                                                </span>
                                            </div>
                                            {hasPending && (
                                                <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2 py-0.5 dark:bg-amber-950/30">
                                                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500 dark:bg-amber-400" />
                                                    <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                                                        Due soon
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* ── List view ─────────────────────────────────────────────── */}
                {filtered.length > 0 && viewMode === 'list' && (
                    <div className="flex flex-col">
                        <div className="grid grid-cols-12 gap-4 border-b px-4 py-2 text-xs font-medium tracking-wide text-muted-foreground uppercase dark:border-gray-700 dark:text-gray-400">
                            <div className="col-span-5">Name</div>
                            <div className="col-span-3">Coordinator</div>
                            <div className="col-span-3">Description</div>
                            <div className="col-span-1" />
                        </div>

                        {filtered.map((program) => {
                            const hasPending = program.has_pending_reports;
                            return (
                                <Link
                                    key={program.id}
                                    href={ViewController.reports(program)}
                                    className={`group grid grid-cols-12 items-center gap-4 border-b border-l-4 px-4 py-3 transition-colors hover:brightness-95 dark:border-gray-700 ${
                                        hasPending
                                            ? 'border-l-amber-500 bg-amber-50 dark:bg-amber-950/20'
                                            : 'border-l-green-500 bg-green-50 dark:bg-green-950/20'
                                    }`}
                                >
                                    <div className="col-span-5 flex min-w-0 items-center gap-2">
                                        <div
                                            className={`shrink-0 rounded-md p-1.5 ${hasPending ? 'bg-amber-100 dark:bg-amber-900/50' : 'bg-emerald-100 dark:bg-emerald-900/50'}`}
                                        >
                                            <Folders
                                                className={`h-3.5 w-3.5 ${hasPending ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}
                                            />
                                        </div>
                                        <h2 className="truncate text-sm font-medium text-foreground dark:text-white">
                                            {program.name}
                                        </h2>
                                        {hasPending && <ReportDueChip />}
                                    </div>
                                    <div className="col-span-3 flex min-w-0 items-center gap-2">
                                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                                            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                                                {program.coordinator.name.charAt(
                                                    0,
                                                )}
                                            </span>
                                        </div>
                                        <span className="truncate text-sm text-muted-foreground dark:text-gray-400">
                                            {program.coordinator.name}
                                        </span>
                                    </div>
                                    <div className="col-span-3 truncate text-sm text-muted-foreground dark:text-gray-400">
                                        {program.description}
                                    </div>
                                    <div className="col-span-1 flex justify-end">
                                        {hasPending && (
                                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500 dark:bg-amber-400" />
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* ── Pagination ────────────────────────────────────────────── */}
                {hasPrograms && <Pagination paginator={programs} />}
            </div>
        </AppLayout>
    );
}

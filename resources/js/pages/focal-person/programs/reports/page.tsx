import Back from '@/components/back';
import { useViewMode } from '@/hooks/use-view-mode';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Program } from '@/types';
import { usePage } from '@inertiajs/react';
import {
    FileText,
    Grid2x2,
    List,
    Search,
    SlidersHorizontal,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import EmptyReport from '../components/empty-report';
import { ReportWithCounts } from './components/report-card-parts';
import ReportDialog from './components/report-dialog';
import GridView from './components/reports-grid-view';
import ListView from './components/reports-list-view';

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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReportsPage() {
    const { program, reports } = usePage<{
        program: Program;
        reports: ReportWithCounts[];
    }>().props;

    const [open, setOpen] = useState(false);
    const { mode: viewMode, updateMode: setViewMode } = useViewMode();

    // ── Filter state ──────────────────────────────────────────────────────────
    const [search, setSearch] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [deadlineFrom, setDeadlineFrom] = useState('');
    const [deadlineTo, setDeadlineTo] = useState('');
    const [createdYear, setCreatedYear] = useState('');
    const [createdMonth, setCreatedMonth] = useState('');

    const yearOptions = useMemo(
        () =>
            [
                ...new Set(
                    reports.map((r) => new Date(r.created_at).getFullYear()),
                ),
            ].sort((a, b) => b - a),
        [reports],
    );

    const activeFilterCount = [
        !!deadlineFrom,
        !!deadlineTo,
        !!createdYear,
        !!createdMonth,
    ].filter(Boolean).length;

    const clearFilters = () => {
        setSearch('');
        setDeadlineFrom('');
        setDeadlineTo('');
        setCreatedYear('');
        setCreatedMonth('');
    };

    // ── Filtered reports ──────────────────────────────────────────────────────
    const filteredReports = useMemo(() => {
        return reports.filter((report) => {
            if (
                search &&
                !report.title.toLowerCase().includes(search.toLowerCase())
            )
                return false;

            if (
                deadlineFrom &&
                report.deadline &&
                new Date(report.deadline) < new Date(deadlineFrom)
            )
                return false;

            if (deadlineTo && report.deadline) {
                const to = new Date(deadlineTo);
                to.setHours(23, 59, 59, 999);
                if (new Date(report.deadline) > to) return false;
            }

            const createdAt = new Date(report.created_at);
            if (createdYear && createdAt.getFullYear() !== Number(createdYear))
                return false;
            if (createdMonth && createdAt.getMonth() !== Number(createdMonth))
                return false;

            return true;
        });
    }, [reports, search, deadlineFrom, deadlineTo, createdYear, createdMonth]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `Programs/${program.name}/Reports`,
            href: `/focal-person/programs/${program.id}/reports`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Back link="/focal-person/programs" />

                {/* ── Top bar ───────────────────────────────────────────────── */}
                <div className="flex items-center justify-between gap-3">
                    <h1 className="truncate text-lg font-semibold lg:text-xl">
                        {program.name}
                    </h1>

                    <div className="flex flex-shrink-0 items-center gap-2">
                        {/* View toggle — only shown when reports exist */}
                        {reports.length > 0 && (
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
                        )}
                        <ReportDialog
                            program={program}
                            open={open}
                            setOpen={setOpen}
                        />
                    </div>
                </div>

                {/* ── Empty state ───────────────────────────────────────────── */}
                {reports.length === 0 ? (
                    <EmptyReport setIsOpen={setOpen} />
                ) : (
                    <>
                        {/* ── Search + filter bar ───────────────────────────── */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                {/* Search */}
                                <div className="relative flex-1">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        placeholder="Search report title…"
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

                                {/* Filter toggle */}
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

                                {/* Clear all */}
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
                                <div className="rounded-xl border bg-card p-4">
                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-muted-foreground">
                                                Deadline from
                                            </label>
                                            <input
                                                type="date"
                                                value={deadlineFrom}
                                                onChange={(e) =>
                                                    setDeadlineFrom(
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-9 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-muted-foreground">
                                                Deadline until
                                            </label>
                                            <input
                                                type="date"
                                                value={deadlineTo}
                                                onChange={(e) =>
                                                    setDeadlineTo(
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-9 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-muted-foreground">
                                                Created year
                                            </label>
                                            <select
                                                value={createdYear}
                                                onChange={(e) => {
                                                    setCreatedYear(
                                                        e.target.value,
                                                    );
                                                    if (!e.target.value)
                                                        setCreatedMonth('');
                                                }}
                                                className="h-9 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                                            >
                                                <option value="">
                                                    All years
                                                </option>
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
                                                value={createdMonth}
                                                onChange={(e) =>
                                                    setCreatedMonth(
                                                        e.target.value,
                                                    )
                                                }
                                                disabled={!createdYear}
                                                className="h-9 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <option value="">
                                                    All months
                                                </option>
                                                {MONTH_LABELS.map(
                                                    (label, i) => (
                                                        <option
                                                            key={i}
                                                            value={i}
                                                        >
                                                            {label}
                                                        </option>
                                                    ),
                                                )}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Active filter chips */}
                                    {activeFilterCount > 0 && (
                                        <div className="mt-3 flex flex-wrap items-center gap-2 border-t pt-3">
                                            <span className="text-xs text-muted-foreground">
                                                Active:
                                            </span>
                                            {deadlineFrom && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                                    From:{' '}
                                                    {new Date(
                                                        deadlineFrom,
                                                    ).toLocaleDateString(
                                                        'en-US',
                                                        {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                        },
                                                    )}
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
                                                    ).toLocaleDateString(
                                                        'en-US',
                                                        {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                        },
                                                    )}
                                                    <button
                                                        onClick={() =>
                                                            setDeadlineTo('')
                                                        }
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </span>
                                            )}
                                            {createdYear && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                                    Year: {createdYear}
                                                    <button
                                                        onClick={() => {
                                                            setCreatedYear('');
                                                            setCreatedMonth('');
                                                        }}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </span>
                                            )}
                                            {createdMonth && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                                    Month:{' '}
                                                    {
                                                        MONTH_LABELS[
                                                            Number(createdMonth)
                                                        ]
                                                    }
                                                    <button
                                                        onClick={() =>
                                                            setCreatedMonth('')
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
                            <p className="text-xs text-muted-foreground">
                                Showing{' '}
                                <span className="font-medium text-foreground">
                                    {filteredReports.length}
                                </span>{' '}
                                of {reports.length} reports
                            </p>
                        </div>

                        {/* ── Content ───────────────────────────────────────── */}
                        {filteredReports.length === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                                <FileText className="h-10 w-10 text-muted-foreground/30" />
                                <p className="text-sm font-medium text-muted-foreground">
                                    No reports match the current filters
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="text-xs text-primary hover:underline"
                                >
                                    Clear filters
                                </button>
                            </div>
                        ) : viewMode === 'grid' ? (
                            <GridView
                                reports={filteredReports}
                                programId={program.id}
                            />
                        ) : (
                            <ListView
                                reports={filteredReports}
                                programId={program.id}
                            />
                        )}
                    </>
                )}
            </div>
        </AppLayout>
    );
}

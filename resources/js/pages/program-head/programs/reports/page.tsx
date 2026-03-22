import ViewController from '@/actions/App/Http/Controllers/ProgramHead/ViewController';
import Back from '@/components/back';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Program, Report } from '@/types';
import { Deferred, Link, usePage } from '@inertiajs/react';
import { Clock, FileText, Folder, Search, SlidersHorizontal, X } from 'lucide-react';
import { Activity, useMemo, useState } from 'react';
import ReportDialog from './components/report-dialog';
// import ReportEllipsis from './components/report-ellipsis';

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

export const formatDate = (date: string | Date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

export default function Reports() {
    const { reports, program } = usePage<{
        reports: Report[];
        program: Program;
    }>().props;

    const [isOpen, setIsOpen] = useState(false);

    // Filters
    const [search, setSearch] = useState('');
    const [deadlineFrom, setDeadlineFrom] = useState('');
    const [deadlineTo, setDeadlineTo] = useState('');
    const [createdYear, setCreatedYear] = useState('');
    const [createdMonth, setCreatedMonth] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Reports',
            href: ViewController.programs().url,
        },
    ];

    const yearOptions = useMemo(() => {
        if (!reports?.length) return [];
        const years = reports.map((r) => new Date(r.created_at).getFullYear());
        return [...new Set(years)].sort((a, b) => b - a);
    }, [reports]);

    const filteredReports = useMemo(() => {
        if (!reports?.length) return [];
        return reports.filter((r) => {
            const created = new Date(r.created_at);
            const deadline = r.deadline ? new Date(r.deadline) : null;

            const matchesSearch =
                !search || r.title.toLowerCase().includes(search.toLowerCase());

            const matchesDeadlineFrom =
                !deadlineFrom ||
                (deadline && deadline >= new Date(deadlineFrom));

            const matchesDeadlineTo =
                !deadlineTo || (deadline && deadline <= new Date(deadlineTo));

            const matchesYear =
                !createdYear || created.getFullYear() === Number(createdYear);

            const matchesMonth =
                !createdMonth || created.getMonth() === Number(createdMonth);

            return (
                matchesSearch &&
                matchesDeadlineFrom &&
                matchesDeadlineTo &&
                matchesYear &&
                matchesMonth
            );
        });
    }, [reports, search, deadlineFrom, deadlineTo, createdYear, createdMonth]);

    const activeFilterCount = [
        deadlineFrom,
        deadlineTo,
        createdYear,
        createdMonth,
    ].filter(Boolean).length;

    const hasAnyFilter = search || activeFilterCount > 0;

    function clearFilters() {
        setSearch('');
        setDeadlineFrom('');
        setDeadlineTo('');
        setCreatedYear('');
        setCreatedMonth('');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col">
                {/* Toolbar */}
                <div className="flex justify-between gap-3 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                        <Back link={ViewController.programs()} />
                        <div className="h-4 w-px bg-border" />
                        <Folder className="h-4 w-4 text-muted-foreground" />
                        <h1 className="text-sm font-semibold text-foreground dark:text-white">
                            {program?.name}
                        </h1>
                        {reports?.length > 0 && (
                            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground dark:bg-gray-700 dark:text-gray-400">
                                {reports.length}
                            </span>
                        )}
                    </div>

                    <ReportDialog
                        program={program}
                        open={isOpen}
                        setOpen={setIsOpen}
                    />
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-4">
                    <Deferred data="reports" fallback={<ReportsSkeleton />}>
                        <div className="space-y-4">
                            {/* ── Search + filter bar ── */}
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
                                            className="h-9 w-full rounded-lg border bg-card py-2 pr-3 pl-9 text-sm outline-none focus:ring-2 focus:ring-primary/40"
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
                                        onClick={() =>
                                            setShowFilters((v) => !v)
                                        }
                                        className={`relative flex h-9 items-center bg-card gap-2 rounded-lg border px-3 text-sm transition-colors ${
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
                                    {hasAnyFilter && (
                                        <button
                                            onClick={clearFilters}
                                            className="flex h-9 items-center gap-1.5 rounded-lg border border-dashed px-3 text-xs text-muted-foreground transition-colors hover:border-rose-400 hover:text-rose-500 dark:border-gray-700"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                            <span className="hidden sm:inline">
                                                Clear
                                            </span>
                                        </button>
                                    )}
                                </div>

                                {/* Expanded filter panel */}
                                {showFilters && (
                                    <div className="rounded-xl border bg-card p-4 dark:border-gray-700">
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
                                                    className="h-9 w-full rounded-lg border bg-card-elevated px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
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
                                                    className="h-9 w-full rounded-lg border bg-card-elevated px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
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
                                                    className="h-9 w-full rounded-lg border bg-card-elevated px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                                                >
                                                    <option value="">
                                                        All years
                                                    </option>
                                                    {yearOptions.map((y) => (
                                                        <option
                                                            key={y}
                                                            value={y}
                                                        >
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
                                                    className="h-9 w-full rounded-lg border bg-card-elevated px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
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
                                            <div className="mt-3 flex flex-wrap items-center gap-2 border-t pt-3 dark:border-gray-700">
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
                                                                setDeadlineFrom(
                                                                    '',
                                                                )
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
                                                                setDeadlineTo(
                                                                    '',
                                                                )
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
                                                                setCreatedYear(
                                                                    '',
                                                                );
                                                                setCreatedMonth(
                                                                    '',
                                                                );
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
                                                                Number(
                                                                    createdMonth,
                                                                )
                                                            ]
                                                        }
                                                        <button
                                                            onClick={() =>
                                                                setCreatedMonth(
                                                                    '',
                                                                )
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
                                {reports?.length > 0 && (
                                    <p className="text-xs text-muted-foreground">
                                        Showing{' '}
                                        <span className="font-medium text-foreground">
                                            {filteredReports.length}
                                        </span>{' '}
                                        of {reports.length} reports
                                    </p>
                                )}
                            </div>

                            {/* ── Empty state ── */}
                            <Activity
                                mode={
                                    reports?.length === 0 ? 'visible' : 'hidden'
                                }
                            >
                                <div className="flex h-[50vh] flex-col items-center justify-center gap-3 text-center">
                                    <img
                                        src="/Images/no-report.svg"
                                        alt="No reports"
                                        className="h-28 dark:opacity-45"
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        No reports yet
                                    </p>
                                </div>
                            </Activity>

                            {/* ── Reports grid ── */}
                            <Activity
                                mode={
                                    reports?.length > 0 ? 'visible' : 'hidden'
                                }
                            >
                                {filteredReports.length === 0 &&
                                hasAnyFilter ? (
                                    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                                        <Search className="h-8 w-8 text-muted-foreground/40" />
                                        <p className="text-sm font-medium text-muted-foreground">
                                            No reports match your filters
                                        </p>
                                        <button
                                            onClick={clearFilters}
                                            className="text-xs text-primary hover:underline"
                                        >
                                            Clear filters
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                        {filteredReports.map(
                                            (report, index) => (
                                                <Link
                                                    key={index}
                                                    href={ViewController.submissions(report)}
                                                    className="group flex flex-col gap-4 rounded-xl border bg-card-elevated p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-md dark:border-gray-800"
                                                >
                                                    {/* Icon + title section */}
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="flex items-start gap-3 min-w-0">
                                                            {/* Folder/File Icon with distinct background */}
                                                            <div className="shrink-0 rounded-lg bg-muted p-2.5 transition-colors group-hover:bg-primary/10 dark:bg-gray-800">
                                                                <FileText className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary dark:text-gray-400" />
                                                            </div>

                                                            {/* Title and Deadline */}
                                                            <div className="min-w-0 flex-1">
                                                                <h2 className="truncate text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary dark:text-white">
                                                                    {report.title}
                                                                </h2>

                                                                {report.deadline ? (
                                                                    <p className="mt-0.5 text-[11px] font-medium text-muted-foreground dark:text-gray-400">
                                                                        Deadline: {formatDate(report.deadline)}
                                                                    </p>
                                                                ) : (
                                                                    <p className="mt-0.5 text-[11px] italic text-muted-foreground/60">
                                                                        No deadline set
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* If you re-enable the ellipsis, it goes here */}
                                                    </div>

                                                    {/* Footer: Metadata Row */}
                                                    <div className="mt-auto flex items-center justify-between border-t border-border pt-3 dark:border-gray-700/50">
                                                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground dark:text-gray-500">
                                                            <Clock className="h-3 w-3 opacity-70" />
                                                            <span>Created {formatDate(report.created_at)}</span>
                                                        </div>

                                                        {/* Status Indicator (Optional) */}
                                                        <div className="h-1.5 w-1.5 rounded-full bg-border group-hover:bg-primary transition-colors" />
                                                    </div>
                                                </Link>
                                            ),
                                        )}
                                    </div>
                                )}
                            </Activity>
                        </div>
                    </Deferred>
                </div>
            </div>
        </AppLayout>
    );
}

function ReportsSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <div className="h-9 flex-1 animate-pulse rounded-lg bg-muted" />
                <div className="h-9 w-24 animate-pulse rounded-lg bg-muted" />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex flex-col gap-3 rounded-xl border bg-card p-4 dark:border-gray-700"
                    >
                        <div className="flex items-start gap-3">
                            <div className="h-9 w-9 animate-pulse rounded-lg bg-muted" />
                            <div className="flex-1 space-y-1.5">
                                <div className="h-3.5 w-36 animate-pulse rounded bg-muted" />
                                <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 border-t pt-2 dark:border-gray-700">
                            <div className="h-3 w-28 animate-pulse rounded bg-muted" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

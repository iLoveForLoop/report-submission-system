import ViewController from '@/actions/App/Http/Controllers/ProvincialDirector/ViewController';
import ProgramGridSkeleton from '@/components/skeleton-loader';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { Program, User, type BreadcrumbItem } from '@/types';
import { Deferred, usePage, useRemember } from '@inertiajs/react';
import {
    Eye,
    EyeClosed,
    Layers,
    Search,
    SlidersHorizontal,
    X,
} from 'lucide-react';
import { Activity, useMemo, useState } from 'react';
import ToggleGridList from '../../../components/toggle-list-grid';
import EmptyProgram from './components/empty-programs';
import GridView from './components/grid-view';
import ListView from './components/list';
import ReviewProgram from './components/review';

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
    {
        title: 'Programs',
        href: ViewController.programs().url,
    },
];

export default function ProgramsPage() {
    const [open, setOpen] = useState<boolean>(false);
    const [isList, setIsList] = useRemember<boolean>(false);
    const [selectReviewProgram, setSelecReviewProgram] =
        useState<Program | null>();
    const [reviewOpen, setReviewOpen] = useState<boolean>(true);

    // Filters
    const [search, setSearch] = useState('');
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const { programs } = usePage<{ programs: Program[] }>().props;
    const { coordinators } = usePage<{
        coordinators: User[];
    }>().props;

    const availableYears = useMemo(() => {
        if (!programs?.length) return [];
        const years = programs.map((p) => new Date(p.created_at).getFullYear());
        return [...new Set(years)].sort((a, b) => b - a);
    }, [programs]);

    const filteredPrograms = useMemo(() => {
        if (!programs?.length) return [];
        return programs.filter((p) => {
            const date = new Date(p.created_at);
            const matchesSearch =
                !search ||
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                (p.description ?? '')
                    .toLowerCase()
                    .includes(search.toLowerCase());
            const matchesYear = !year || date.getFullYear() === Number(year);
            const matchesMonth =
                !month || date.getMonth() + 1 === Number(month);
            return matchesSearch && matchesYear && matchesMonth;
        });
    }, [programs, search, year, month]);

    const activeFilterCount = [year, month].filter(Boolean).length;
    const hasAnyFilter = search || year || month;

    function clearAll() {
        setSearch('');
        setYear('');
        setMonth('');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div
                className="flex h-full flex-1 flex-col"
                onClick={(e) => {
                    if (e.target === e.currentTarget)
                        setSelecReviewProgram(null);
                }}
            >
                {/* Toolbar */}
                <div className="flex flex-col gap-3 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            <h1 className="flex items-center gap-2 text-lg font-semibold text-foreground lg:text-2xl dark:text-white">
                                <Layers className="dark:text-primary-400 h-5 w-5 text-primary" />
                                All Programs
                            </h1>
                            {programs?.length > 0 && (
                                <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground dark:bg-gray-700 dark:text-gray-400">
                                    {programs.length}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            onClick={() => setReviewOpen((prev) => !prev)}
                            variant="outline"
                            size="sm"
                        >
                            {reviewOpen ? (
                                <EyeClosed className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                            <span className="hidden sm:inline">
                                {reviewOpen ? 'Hide' : 'Show'} Preview
                            </span>
                            <span className="sm:hidden">
                                {reviewOpen ? 'Hide' : 'Show'}
                            </span>
                        </Button>
                        <ToggleGridList isList={isList} setIsList={setIsList} />
                    </div>
                </div>

                {/* Content */}
                <div
                    className="relative flex-1 overflow-hidden"
                    onClick={(e) => {
                        if (e.target === e.currentTarget)
                            setSelecReviewProgram(null);
                    }}
                >
                    <Deferred
                        data="programs"
                        fallback={
                            <ProgramGridSkeleton
                                isList={isList}
                                reviewOpen={reviewOpen}
                            />
                        }
                    >
                        <ScrollArea className="h-full w-full">
                            <div
                                className={cn(
                                    'space-y-3 p-4 transition-all duration-300 ease-in-out',
                                    reviewOpen ? 'sm:mr-[350px]' : 'sm:mr-0',
                                )}
                            >
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
                                                placeholder="Search programs…"
                                                className="h-9 w-full rounded-lg border bg-background py-2 pr-3 pl-9 text-sm outline-none focus:ring-2 focus:ring-primary/40 dark:border-gray-700 dark:bg-gray-900"
                                            />
                                            {search && (
                                                <button
                                                    onClick={() =>
                                                        setSearch('')
                                                    }
                                                    className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
                                                >
                                                    <X className="h-3.5 w-3.5" />
                                                </button>
                                            )}
                                        </div>

                                        {/* Filters toggle */}
                                        <button
                                            onClick={() =>
                                                setShowFilters((v) => !v)
                                            }
                                            className={`relative flex h-9 items-center gap-2 rounded-lg border px-3 text-sm transition-colors ${
                                                showFilters
                                                    ? 'border-primary bg-primary/5 text-primary'
                                                    : 'bg-background hover:bg-muted dark:border-gray-700 dark:bg-gray-900'
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
                                                onClick={clearAll}
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
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                {/* Year */}
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-medium text-muted-foreground">
                                                        Created year
                                                    </label>
                                                    <select
                                                        value={year}
                                                        onChange={(e) => {
                                                            setYear(
                                                                e.target.value,
                                                            );
                                                            setMonth('');
                                                        }}
                                                        className="h-9 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 dark:border-gray-700 dark:bg-gray-900"
                                                    >
                                                        <option value="">
                                                            All years
                                                        </option>
                                                        {availableYears.map(
                                                            (y) => (
                                                                <option
                                                                    key={y}
                                                                    value={y}
                                                                >
                                                                    {y}
                                                                </option>
                                                            ),
                                                        )}
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
                                                            setMonth(
                                                                e.target.value,
                                                            )
                                                        }
                                                        disabled={!year}
                                                        className="h-9 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900"
                                                    >
                                                        <option value="">
                                                            All months
                                                        </option>
                                                        {MONTH_LABELS.map(
                                                            (label, i) => (
                                                                <option
                                                                    key={i + 1}
                                                                    value={
                                                                        i + 1
                                                                    }
                                                                >
                                                                    {label}
                                                                </option>
                                                            ),
                                                        )}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* ── Program list/grid ── */}
                                <Activity
                                    mode={
                                        programs?.length === 0
                                            ? 'visible'
                                            : 'hidden'
                                    }
                                >
                                    <EmptyProgram setIsOpen={setOpen} />
                                </Activity>

                                <Activity
                                    mode={
                                        programs?.length > 0
                                            ? 'visible'
                                            : 'hidden'
                                    }
                                >
                                    {/* No results after filtering */}
                                    {filteredPrograms.length === 0 &&
                                    hasAnyFilter ? (
                                        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                                            <Search className="h-8 w-8 text-muted-foreground/40" />
                                            <p className="text-sm font-medium text-muted-foreground">
                                                No programs match your filters
                                            </p>
                                            <button
                                                onClick={clearAll}
                                                className="text-xs text-primary hover:underline"
                                            >
                                                Clear filters
                                            </button>
                                        </div>
                                    ) : isList ? (
                                        <ListView
                                            programs={filteredPrograms}
                                            selectReviewProgram={
                                                selectReviewProgram
                                            }
                                            setSelecReviewProgram={
                                                setSelecReviewProgram
                                            }
                                        />
                                    ) : (
                                        <GridView
                                            programs={filteredPrograms}
                                            selectReviewProgram={
                                                selectReviewProgram
                                            }
                                            setSelecReviewProgram={
                                                setSelecReviewProgram
                                            }
                                        />
                                    )}
                                </Activity>
                            </div>
                        </ScrollArea>
                    </Deferred>

                    {/* Review Panel */}
                    <div
                        className={cn(
                            'fixed right-0 bottom-0 z-50 h-[50vh] w-full border-l bg-background transition-transform duration-300 ease-in-out',
                            'rounded-t-xl border-t shadow-lg',
                            'sm:absolute sm:top-0 sm:h-full sm:w-[350px] sm:rounded-none sm:border-t-0 sm:shadow-none',
                            reviewOpen
                                ? 'translate-y-0 sm:translate-x-0'
                                : 'translate-y-full sm:translate-x-full sm:translate-y-0',
                        )}
                    >
                        <ReviewProgram program={selectReviewProgram} />

                        {reviewOpen && (
                            <button
                                onClick={() => setReviewOpen(false)}
                                className="absolute top-2 right-2 rounded-full bg-muted p-1.5 sm:hidden"
                            >
                                <EyeClosed className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

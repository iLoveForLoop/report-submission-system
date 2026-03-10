import ViewController from '@/actions/App/Http/Controllers/FocalPerson/ViewController';
import ToggleGridList from '@/components/toggle-list-grid';
import { Pagination } from '@/components/ui/pagination';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, LaravelPaginator, Program } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { ClipboardCheck, FolderOpen, Folders, User } from 'lucide-react';
import { useState } from 'react';
import FilterBtn from '../../../components/filter';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Programs',
        href: ViewController.programs().url,
    },
];

// ── Pending Review Chip ──────────────────────────────────────────────────────
// Shown on program cards that have submissions waiting for the focal person.
// Uses a count when > 0 so the focal person knows how many need attention.

interface PendingReviewChipProps {
    count: number;
}

export function PendingReviewChip({ count }: PendingReviewChipProps) {
    if (count <= 0) return null;

    return (
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-violet-50 px-2 py-1 text-xs font-medium text-violet-700 ring-1 ring-violet-200 dark:bg-violet-950/30 dark:text-violet-400 dark:ring-violet-800">
            <ClipboardCheck className="h-3 w-3" />
            {count === 1
                ? '1 to review'
                : `${count > 99 ? '99+' : count} to review`}
        </span>
    );
}

// ── Summary Bar ──────────────────────────────────────────────────────────────
// Shows total programs and how many need attention — gives the focal person
// a quick at-a-glance overview before they even scan the cards.

interface SummaryBarProps {
    programs: Program[];
    total: number;
    from: number | null;
    to: number | null;
    selectedYear: number | null;
}

function SummaryBar({
    programs,
    total,
    from,
    to,
    selectedYear,
}: SummaryBarProps) {
    const needsReview = programs.filter(
        (p) => (p.pending_submissions_count ?? 0) > 0,
    ).length;

    const totalPending = programs.reduce(
        (sum, p) => sum + (p.pending_submissions_count ?? 0),
        0,
    );

    return (
        <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">
                Showing{' '}
                <span className="font-medium text-foreground">{from}</span> to{' '}
                <span className="font-medium text-foreground">{to}</span> of{' '}
                <span className="font-medium text-foreground">{total}</span>{' '}
                programs{selectedYear ? ` from ${selectedYear}` : ''}
            </p>

            {/* Only show the summary when there's something to act on */}
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

// ── Grid Card ────────────────────────────────────────────────────────────────

interface ProgramCardProps {
    program: Program;
    href: string;
}

function ProgramGridCard({ program, href }: ProgramCardProps) {
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
            {/* Top: icon + name */}
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

            {/* Bottom: coordinator + chip */}
            <div className="mt-4 flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-1.5">
                    <User className="h-3 w-3 shrink-0 text-muted-foreground" />
                    <span className="truncate text-xs text-muted-foreground">
                        {program.coordinator.name}
                    </span>
                </div>
                <PendingReviewChip count={pendingCount} />
            </div>
        </a>
    );
}

// ── List Row ─────────────────────────────────────────────────────────────────

function ProgramListRow({ program, href }: ProgramCardProps) {
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
            {/* Name + chip */}
            <div className="col-span-5 flex min-w-0 items-center gap-2">
                <Folders
                    className={`h-4 w-4 shrink-0 ${
                        hasPending ? 'text-violet-500' : 'text-muted-foreground'
                    }`}
                />
                <span className="truncate text-sm font-medium text-foreground">
                    {program.name}
                </span>
                <PendingReviewChip count={pendingCount} />
            </div>

            {/* Coordinator */}
            <div className="col-span-3 flex min-w-0 items-center gap-1.5">
                <User className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate text-sm text-muted-foreground">
                    {program.coordinator.name}
                </span>
            </div>

            {/* Description */}
            <div className="col-span-4 truncate text-sm text-muted-foreground">
                {program.description}
            </div>
        </a>
    );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function Programs() {
    const [isList, setIsList] = useState<boolean>(false);
    const [isFiltering, setIsFiltering] = useState<boolean>(false);

    const { programs, filters } = usePage<{
        programs: LaravelPaginator<Program>;
        filters?: { year?: number };
    }>().props;

    const [selectedYear, setSelectedYear] = useState<number | null>(
        filters?.year || null,
    );

    const handleYearFilter = (year: number | null) => {
        setSelectedYear(year);
        setIsFiltering(true);

        const params: Record<string, unknown> = { page: 1 };
        if (year) params.year = year;

        router.get(route('focal-person.programs.index'), params, {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => setIsFiltering(false),
        });
    };

    const isLoading = isFiltering;
    const hasPrograms = programs.data.length > 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* ── Header ── */}
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
                        All Programs
                    </h1>
                    <div className="flex items-center gap-3">
                        <FilterBtn
                            onSelect={handleYearFilter}
                            selectedYear={selectedYear}
                        />
                        <ToggleGridList isList={isList} setIsList={setIsList} />
                    </div>
                </div>

                {/* ── Loading ── */}
                {isLoading && (
                    <div className="flex justify-center py-8">
                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
                    </div>
                )}

                {/* ── Empty State ── */}
                {!isLoading && !hasPrograms && (
                    <div className="flex h-[50vh] flex-col items-center justify-center gap-2 py-12 text-center">
                        <FolderOpen className="h-12 w-12 text-muted-foreground/40" />
                        <p className="text-sm font-medium text-muted-foreground md:text-base">
                            {selectedYear
                                ? `No programs found for ${selectedYear}`
                                : 'No programs yet'}
                        </p>
                        {selectedYear && (
                            <button
                                onClick={() => handleYearFilter(null)}
                                className="mt-1 text-sm text-primary hover:underline"
                            >
                                Clear filter
                            </button>
                        )}
                    </div>
                )}

                {/* ── Results ── */}
                {!isLoading && hasPrograms && (
                    <>
                        {/* Summary bar — shows total + pending review callout */}
                        <SummaryBar
                            programs={programs.data}
                            total={programs.total}
                            from={programs.from}
                            to={programs.to}
                            selectedYear={selectedYear}
                        />

                        {/* Grid View */}
                        {!isList && (
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

                        {/* List View */}
                        {isList && (
                            <div className="overflow-hidden rounded-xl border">
                                {/* Header row */}
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
                    </>
                )}

                {/* ── Pagination ── */}
                {!isLoading && hasPrograms && programs.last_page > 1 && (
                    <Pagination
                        paginator={programs}
                        filters={selectedYear ? { year: selectedYear } : {}}
                    />
                )}
            </div>
        </AppLayout>
    );
}

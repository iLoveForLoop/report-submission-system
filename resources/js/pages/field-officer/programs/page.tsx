// field-officer/page.tsx
import ViewController from '@/actions/App/Http/Controllers/FieldOfficer/ViewController';
import { Pagination } from '@/components/ui/pagination';
import { useViewMode } from '@/hooks/use-view-mode';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, LaravelPaginator, Program } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    ClipboardList,
    EllipsisVertical,
    Folders,
    Grid2x2,
    List,
} from 'lucide-react';
import { Activity } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Programs',
        href: ViewController.programs().url,
    },
];

function ReportDueChip() {
    return (
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-amber-50 px-2 py-1 text-xs text-amber-600 ring-1 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-800">
            <ClipboardList className="h-3 w-3" />
            Report due
        </span>
    );
}

export default function Page() {
    const { programs } = usePage<{ programs: LaravelPaginator<Program> }>()
        .props;
    const { mode: viewMode, updateMode: setViewMode } = useViewMode();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-semibold text-foreground lg:text-2xl">
                            All Programs
                        </h1>
                        {programs.data.length > 0 && (
                            <p className="mt-1 text-xs text-muted-foreground lg:text-sm">
                                Showing {programs.from} to {programs.to} of{' '}
                                {programs.total} programs
                            </p>
                        )}
                    </div>

                    {programs.data.length > 0 && (
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
                                <List className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>

                <Activity
                    mode={programs.data.length <= 0 ? 'visible' : 'hidden'}
                >
                    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center h-[60vh]">
                        <Folders className="h-16 w-16 text-muted-foreground/50" />
                        <h2 className="text-xl font-medium text-muted-foreground">
                            No programs yet
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Programs will appear here once they are created
                        </p>
                    </div>
                </Activity>

                <Activity
                    mode={programs.data.length > 0 ? 'visible' : 'hidden'}
                >
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                            {programs.data.map((program, index) => (
                                <Link
                                    key={index}
                                    href={ViewController.reports(program)}
                                    className="group"
                                >
                                    <div className="flex gap-3 rounded-lg border bg-card p-3 transition-all hover:border-primary/20 hover:shadow">
                                        <div className="flex min-w-0 flex-1 flex-col gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-md bg-muted p-3">
                                                    <Folders className="h-5 text-muted-foreground" />
                                                </div>
                                                <div className="flex min-w-0 flex-col">
                                                    <h1 className="truncate font-medium text-foreground">
                                                        {program.name}
                                                    </h1>
                                                    <p className="truncate text-sm text-muted-foreground">
                                                        {program.description}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pl-15">
                                                <p className="font-lighter truncate text-xs text-gray-500">
                                                    {program.coordinator.name}
                                                </p>
                                                {program.has_pending_reports && (
                                                    <ReportDueChip />
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <button
                                                onClick={(e) =>
                                                    e.preventDefault()
                                                }
                                                className="flex-shrink-0 rounded p-1 opacity-0 transition-all group-hover:opacity-100 hover:bg-accent"
                                            >
                                                <EllipsisVertical className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            <div className="grid grid-cols-12 gap-4 border-b px-4 py-2 text-sm font-medium text-muted-foreground">
                                <div className="col-span-5">Name</div>
                                <div className="col-span-3">Coordinator</div>
                                <div className="col-span-3">Description</div>
                                <div className="col-span-1"></div>
                            </div>
                            {programs.data.map((program, index) => (
                                <Link
                                    key={index}
                                    href={ViewController.reports(program)}
                                    className="group"
                                >
                                    <div className="grid grid-cols-12 items-center gap-4 border-b px-4 py-3 transition-colors hover:bg-accent/50">
                                        <div className="col-span-5 flex min-w-0 items-center gap-2">
                                            <Folders className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                                            <h2 className="truncate font-medium text-foreground">
                                                {program.name}
                                            </h2>
                                            {program.has_pending_reports && (
                                                <ReportDueChip />
                                            )}
                                        </div>
                                        <div className="col-span-3 truncate text-sm text-muted-foreground">
                                            {program.coordinator.name}
                                        </div>
                                        <div className="col-span-3 truncate text-sm text-muted-foreground">
                                            {program.description}
                                        </div>
                                        <div className="col-span-1 flex justify-end">
                                            <button
                                                onClick={(e) =>
                                                    e.preventDefault()
                                                }
                                                className="rounded p-1 opacity-0 transition-all group-hover:opacity-100 hover:bg-accent"
                                            >
                                                <EllipsisVertical className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    <Pagination paginator={programs} />
                </Activity>
            </div>
        </AppLayout>
    );
}

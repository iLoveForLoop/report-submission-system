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
    Layers,
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
                        <h1 className="flex items-center gap-2 text-lg font-semibold text-foreground lg:text-2xl dark:text-white">
                            <Layers className="h-5 w-5 text-primary dark:text-primary-400" />
                            All Programs
                        </h1>
                        {programs.data.length > 0 && (
                            <p className="text-xs text-muted-foreground lg:text-sm dark:text-gray-400">
                                Showing {programs.from} to {programs.to} of{' '}
                                {programs.total} programs
                            </p>
                        )}
                    </div>

                    {programs.data.length > 0 && (
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
                                <List className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>

                <Activity
                    mode={programs.data.length <= 0 ? 'visible' : 'hidden'}
                >
                    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center h-[60vh]">
                        <Folders className="h-16 w-16 text-muted-foreground/50 dark:text-gray-600"/>
                        <h2 className="text-xl font-medium text-muted-foreground dark:text-gray-300">
                            No programs yet
                        </h2>
                        <p className="text-sm text-muted-foreground dark:text-gray-400">
                            Programs will appear here once they are created
                        </p>
                    </div>
                </Activity>

                <Activity
                    mode={programs.data.length > 0 ? 'visible' : 'hidden'}
                >
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                            {programs.data.map((program, index) => {
                                const hasPending = program.has_pending_reports;

                                return (
                                    <Link
                                        key={index}
                                        href={ViewController.reports(program)}
                                        className="group"
                                    >
                                        <div
                                            className={`group relative flex gap-3 rounded-xl border p-4 transition-all duration-200 hover:border-gray-300 hover:shadow-sm dark:hover:border-gray-600 ${
                                                hasPending
                                                ? "border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-950/20"
                                                : "border-l-4 border-l-green-500 bg-green-50 dark:bg-green-950/20"
                                            }`}
                                        >
                                            <div className="flex min-w-0 flex-1 flex-col gap-3">
                                                <div className="flex items-start gap-3">
                                                    <div
                                                        className={`rounded-lg p-2.5 ${
                                                        hasPending
                                                            ? "bg-amber-100 dark:bg-amber-900/50"
                                                            : "bg-emerald-100 dark:bg-emerald-900/50"
                                                        }`}
                                                    >
                                                        <Folders
                                                        className={`h-4.5 w-4.5 ${
                                                            hasPending
                                                                ? "text-amber-600 dark:text-amber-400"
                                                                : "text-emerald-600 dark:text-emerald-400"
                                                        }`}
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
                                                        <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center dark:bg-gray-700">
                                                            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                                                                {program.coordinator.name.charAt(0)}
                                                            </span>
                                                        </div>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                                            {program.coordinator.name}
                                                        </span>
                                                    </div>

                                                    {hasPending && (
                                                        <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2 py-0.5 dark:bg-amber-950/30">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse dark:bg-amber-400" />
                                                            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                                                                Due soon
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            <div className="grid grid-cols-12 gap-4 border-b px-4 py-2 text-sm font-medium text-muted-foreground dark:border-gray-700 dark:text-gray-400">
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
                                    <div className="grid grid-cols-12 items-center gap-4 border-b px-4 py-3 transition-colors hover:bg-accent/50 dark:border-gray-700 dark:hover:bg-gray-800/50">
                                        <div className="col-span-5 flex min-w-0 items-center gap-2">
                                            <Folders className="h-5 w-5 flex-shrink-0 text-muted-foreground dark:text-gray-500" />
                                            <h2 className="truncate font-medium text-foreground dark:text-white">
                                                {program.name}
                                            </h2>
                                            {program.has_pending_reports && (
                                                <ReportDueChip />
                                            )}
                                        </div>
                                        <div className="col-span-3 truncate text-sm text-muted-foreground dark:text-gray-400">
                                            {program.coordinator.name}
                                        </div>
                                        <div className="col-span-3 truncate text-sm text-muted-foreground dark:text-gray-400">
                                            {program.description}
                                        </div>
                                        <div className="col-span-1 flex justify-end">
                                            <EllipsisVertical className="h-4 w-4 text-muted-foreground/50 dark:text-gray-600" />
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

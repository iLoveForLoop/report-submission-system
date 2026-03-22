import ViewController from '@/actions/App/Http/Controllers/ProvincialDirector/ViewController';
import Back from '@/components/back';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Report, ReportSubmission } from '@/types';
import { usePage } from '@inertiajs/react';
import { FileStack } from 'lucide-react';
import { useState } from 'react';
import SubmissionCard from './components/submission-card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Submissions',
        href: ViewController.programs().url,
    },
];

const STATUS_TABS = [
    'all',
    'draft',
    'submitted',
    'accepted',
    'returned',
] as const;

export default function Submission() {
    const { submissions = [], report } = usePage<{
        submissions: ReportSubmission[];
        report: Report;
    }>().props;
    const [statusFilter, setStatusFilter] = useState<
        'all' | ReportSubmission['status']
    >('all');

    const filtered =
        statusFilter === 'all'
            ? submissions
            : submissions.filter((s) => s.status === statusFilter);

    const counts = submissions.reduce(
        (acc, s) => {
            acc[s.status] = (acc[s.status] ?? 0) + 1;
            return acc;
        },
        {} as Record<string, number>,
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col">
                {/* Toolbar */}
                <div className="flex flex-col gap-3 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                        <Back
                            link={ViewController.reports(report.program_id)}
                        />
                        <div className="h-4 w-px bg-border" />
                        <FileStack className="h-4 w-4 text-muted-foreground" />
                        <h1 className="text-sm font-semibold text-foreground dark:text-white">
                            Report Submissions
                        </h1>
                        {submissions.length > 0 && (
                            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground dark:bg-gray-700 dark:text-gray-400">
                                {submissions.length}
                            </span>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-4">
                    <div className="space-y-4">
                        {/* Status filter tabs */}
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex flex-wrap gap-1">
                                {STATUS_TABS.map((status) => {
                                    const count =
                                        status === 'all'
                                            ? submissions.length
                                            : (counts[status] ?? 0);
                                    const isActive = statusFilter === status;

                                    return (
                                        <button
                                            key={status}
                                            onClick={() =>
                                                setStatusFilter(status)
                                            }
                                            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-all ${
                                                isActive
                                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                            }`}
                                        >
                                            {status}
                                            {count > 0 && (
                                                <span
                                                    className={`rounded-full px-1.5 py-0.5 text-xs ${
                                                        isActive
                                                            ? 'bg-white/20 text-primary-foreground'
                                                            : 'bg-muted text-muted-foreground'
                                                    }`}
                                                >
                                                    {count}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {statusFilter !== 'all' && (
                                <button
                                    onClick={() => setStatusFilter('all')}
                                    className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Clear filter
                                </button>
                            )}
                        </div>

                        {/* Empty state */}
                        {filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <FileStack className="mb-3 h-10 w-10 text-muted-foreground/30" />
                                <p className="text-sm font-medium text-muted-foreground">
                                    No
                                    {statusFilter !== 'all'
                                        ? ` ${statusFilter}`
                                        : ''}{' '}
                                    submissions found
                                </p>
                                {statusFilter !== 'all' && (
                                    <button
                                        onClick={() => setStatusFilter('all')}
                                        className="mt-2 text-xs text-primary hover:underline"
                                    >
                                        View all submissions
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {filtered.map((submission) => (
                                    <SubmissionCard
                                        key={submission.id}
                                        submission={submission}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

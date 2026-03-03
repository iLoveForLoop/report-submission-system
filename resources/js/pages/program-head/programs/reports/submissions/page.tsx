import ViewController from '@/actions/App/Http/Controllers/ProgramHead/ViewController';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, ReportSubmission } from '@/types';
import { usePage, Link } from '@inertiajs/react';
import { useState } from 'react';
import SubmissionCard from './components/submission-card';
import { ArrowLeft } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: `Submissions`,
        href: ViewController.programs().url,
    },
];

export default function Submission() {
    const { submissions = [] } = usePage<{ submissions: ReportSubmission[] }>()
        .props;
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
            <div className="min-h-screen bg-background">
                {/* Header Section */}
                <div className="border-b border-border bg-background px-4 py-6 sm:px-6 lg:px-8">
                    <div className="mx-auto">
                        {/* Back Button */}
                        <Link
                            href={ViewController.programs().url}
                            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Programs
                        </Link>

                        {/* Page Header */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
                                    Report Submissions
                                </h1>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {submissions.length} submission{submissions.length !== 1 ? 's' : ''} total
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="px-4 py-6 sm:px-6 lg:px-8">
                    {/* Filter Tabs */}
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-1">
                            {(
                                [
                                    'all',
                                    'draft',
                                    'submitted',
                                    'accepted',
                                    'returned',
                                ] as const
                            ).map((status) => {
                                const count =
                                    status === 'all'
                                        ? submissions.length
                                        : (counts[status] ?? 0);
                                const isActive = statusFilter === status;

                                return (
                                    <button
                                        key={status}
                                        onClick={() => setStatusFilter(status)}
                                        className={`
                                            inline-flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium capitalize transition-all
                                            ${
                                                isActive
                                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                            }
                                        `}
                                    >
                                        {status}
                                        {count > 0 && (
                                            <span
                                                className={`
                                                    rounded-full px-2 py-0.5 text-xs font-medium
                                                    ${
                                                        isActive
                                                            ? 'bg-primary-foreground/20 text-primary-foreground'
                                                            : 'bg-muted text-muted-foreground'
                                                    }
                                                `}
                                            >
                                                {count}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Active Filter Indicator */}
                        {statusFilter !== 'all' && (
                            <button
                                onClick={() => setStatusFilter('all')}
                                className="text-sm text-muted-foreground hover:text-foreground"
                            >
                                Clear filter
                            </button>
                        )}
                    </div>

                    {/* Cards */}
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <p className="text-sm text-muted-foreground">
                                No {statusFilter !== 'all' ? statusFilter : ''} submissions found.
                            </p>
                            {statusFilter !== 'all' && (
                                <button
                                    onClick={() => setStatusFilter('all')}
                                    className="mt-2 text-sm text-primary hover:underline"
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
        </AppLayout>
    );
}

// submissions.tsx
import ViewController from '@/actions/App/Http/Controllers/FieldOfficer/ViewController';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import { FilterType, LaravelPaginator, ReportSubmission } from '@/types';
// import { router } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import {
    AlertCircle,
    Calendar,
    CheckCircle,
    Clock,
    FileText,
    Grid2X2,
    List,
    User,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

type ViewMode = 'grid' | 'list';

interface SubmissionsProps {
    submissions?: LaravelPaginator<ReportSubmission>;
    filter?: FilterType;
}

export default function Submissions({
    submissions,
    // filter = 'all',
}: SubmissionsProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('grid');

    if (!submissions || submissions.data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 rounded-full bg-muted/30 p-3 lg:p-4">
                    <FileText className="h-10 w-10 text-muted-foreground/50 lg:h-12 lg:w-12" />
                </div>
                <h3 className="mb-2 text-sm font-medium text-foreground lg:text-lg">
                    No submissions yet
                </h3>
                <p className="max-w-md text-sm text-muted-foreground lg:text-base">
                    You haven't submitted any reports yet. Your submissions will
                    appear here once you start submitting reports.


                </p>
            </div>
        );
    }

    // Group submissions by date (using the data array from paginator)
    const groupedSubmissions = submissions.data.reduce(
        (acc, submission) => {
            const dateKey = new Date(submission.created_at).toLocaleDateString(
                'en-US',
                {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                },
            );

            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(submission);
            return acc;
        },
        {} as Record<string, ReportSubmission[]>,
    );

    // Get status details
    const getStatusDetails = (status: string) => {
        switch (status.toLowerCase()) {
            case 'submitted':
                return {
                    icon: CheckCircle,
                    color: 'text-chart-2',
                    bgColor: 'bg-chart-2/10',
                    borderColor: 'border-chart-2/20',
                    label: 'Submitted',
                };
            case 'pending':
                return {
                    icon: Clock,
                    color: 'text-amber-500',
                    bgColor: 'bg-amber-500/10',
                    borderColor: 'border-amber-500/20',
                    label: 'Pending',
                };
            case 'approved':
            case 'accepted':
                return {
                    icon: CheckCircle,
                    color: 'text-green-500',
                    bgColor: 'bg-green-500/10',
                    borderColor: 'border-green-500/20',
                    label: 'Approved',
                };
            case 'rejected':
                return {
                    icon: XCircle,
                    color: 'text-destructive',
                    bgColor: 'bg-destructive/10',
                    borderColor: 'border-destructive/20',
                    label: 'Rejected',
                };
            default:
                return {
                    icon: AlertCircle,
                    color: 'text-chart-4',
                    bgColor: 'bg-chart-4/10',
                    borderColor: 'border-chart-4/20',
                    label: status.charAt(0).toUpperCase() + status.slice(1),
                };
        }
    };

    // Format time
    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    // Handle pagination
    // const handlePageChange = (page: number) => {
    //     if (
    //         page === submissions.current_page ||
    //         page < 1 ||
    //         page > submissions.last_page
    //     )
    //         return;

    //     router.get(window.location.pathname, {
    //         page,
    //         filter,
    //     });
    // };

    return (
        <div className="space-y-6">
            {/* Results count and view toggle */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-sm font-semibold text-foreground lg:text-lg">
                        My Submissions
                    </h2>
                    <p className="text-xs text-muted-foreground lg:text-sm">
                        Showing {submissions.from} to {submissions.to} of{' '}
                        {submissions.total} results
                    </p>
                </div>

                {/* View mode toggle */}
                <div className="flex items-center gap-2 rounded-lg border bg-card p-1">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`rounded-md p-2 transition-all ${
                            viewMode === 'grid'
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        }`}
                        title="Grid view"
                    >
                        <Grid2X2 className="h-3 w-3 lg:h-4 lg:w-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`rounded-md p-2 transition-all ${
                            viewMode === 'list'
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        }`}
                        title="List view"
                    >
                        <List className="h-3 w-3 lg:h-4 lg:w-4" />
                    </button>
                </div>
            </div>

            {/* Content */}
            {Object.entries(groupedSubmissions).length > 0 && (
                <>
                    {Object.entries(groupedSubmissions).map(
                        ([date, dateSubmissions]) => (
                            <div key={date} className="space-y-4">
                                {/* Date header */}
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-primary/5 p-2">
                                        <Calendar className="h-4 w-4 text-primary lg:h-5 lg:w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground lg:text-sm">
                                            Submitted on
                                        </p>
                                        <p className="text-sm font-semibold text-foreground lg:text-lg">
                                            {date}
                                        </p>
                                    </div>
                                    
                                </div>

                                {/* Content based on view mode */}
                                {viewMode === 'grid' ? (
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {dateSubmissions.map((submission) => {
                                            const statusDetails =
                                                getStatusDetails(
                                                    submission.status,
                                                );
                                            const StatusIcon =
                                                statusDetails.icon;

                                            return (
                                                <Link
                                                    href={ViewController.reportSubmissions(
                                                        [
                                                            submission.report!
                                                                .program,
                                                            submission.report!,
                                                        ],
                                                    )}
                                                >
                                                    <Card
                                                        key={submission.id}
                                                        className="group border-border/50 transition-all duration-200 hover:border-primary/20 hover:shadow-lg"
                                                    >
                                                        <CardHeader className="pb-3">
                                                            <div className="flex items-start justify-between">
                                                                <div>
                                                                    <div className="mb-2 flex items-center gap-2">
                                                                        <div className="rounded-md bg-primary/5 p-1.5">
                                                                            <FileText className="h-4 w-4 text-primary" />
                                                                        </div>
                                                                        <CardTitle className="text-base font-semibold">
                                                                            Report
                                                                            #
                                                                            {
                                                                                submission.id
                                                                            }
                                                                        </CardTitle>
                                                                    </div>
                                                                    <p className="text-xs text-muted-foreground">
                                                                        Submitted
                                                                        at{' '}
                                                                        {formatTime(
                                                                            submission.created_at,
                                                                        )}
                                                                    </p>
                                                                </div>
                                                                <div
                                                                    className={`rounded-full px-3 py-1.5 ${statusDetails.bgColor} ${statusDetails.borderColor} border`}
                                                                >
                                                                    <div className="flex items-center gap-1.5">
                                                                        <StatusIcon
                                                                            className={`h-3.5 w-3.5 ${statusDetails.color}`}
                                                                        />
                                                                        <span
                                                                            className={`text-xs font-medium ${statusDetails.color}`}
                                                                        >
                                                                            {
                                                                                statusDetails.label
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                    <CardTitle className="text-sm font-semibold lg:text-base">
                                                                        Report #
                                                                        {
                                                                            submission.id
                                                                        }
                                                                    </CardTitle>
                                                                </div>
                                                            </div>
                                                            <div
                                                                className={`rounded-full px-3 py-1.5 ${statusDetails.bgColor} ${statusDetails.borderColor} border`}
                                                            >
                                                                <div className="flex items-center gap-1.5">
                                                                    <StatusIcon
                                                                        className={`h-2.5 w-2.5 lg:h-3.5 lg:w-3.5 ${statusDetails.color}`}
                                                                    />
                                                                    <span
                                                                        className={`text-xs font-medium ${statusDetails.color}`}
                                                                    >
                                                                        {
                                                                            statusDetails.label
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </CardHeader>
                                                    </Card>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    // List View
                                    <div className="space-y-3">
                                        {dateSubmissions.map((submission) => {
                                            const statusDetails =
                                                getStatusDetails(
                                                    submission.status,
                                                );
                                            const StatusIcon =
                                                statusDetails.icon;

                                            return (
                                                <Link
                                                    href={ViewController.reportSubmissions(
                                                        [
                                                            submission.report!
                                                                .program,
                                                            submission.report!,
                                                        ],
                                                    )}
                                                >
                                                    <Card
                                                        key={submission.id}
                                                        className="group border-border/50 transition-all duration-200 hover:border-primary/20 hover:shadow"
                                                    >
                                                        <CardContent className="p-4">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="rounded-lg bg-primary/5 p-2">
                                                                        <FileText className="h-5 w-5 text-primary" />
                                                                    </div>
                                                                    <div>
                                                                        <div className="mb-1 flex items-center gap-2">
                                                                            <h3 className="text-base font-semibold text-foreground">
                                                                                Report
                                                                                #
                                                                                {
                                                                                    submission.id
                                                                                }
                                                                            </h3>
                                                                            <div
                                                                                className={`rounded-full px-2 py-1 ${statusDetails.bgColor} ${statusDetails.borderColor} border`}
                                                                            >
                                                                                <div className="flex items-center gap-1.5">
                                                                                    <StatusIcon
                                                                                        className={`h-3 w-3 ${statusDetails.color}`}
                                                                                    />
                                                                                    <span
                                                                                        className={`text-xs font-medium ${statusDetails.color}`}
                                                                                    >
                                                                                        {
                                                                                            statusDetails.label
                                                                                        }
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-center gap-4 text-sm">
                                                                            <div className="flex items-center gap-2">
                                                                                <User className="h-4 w-4 text-muted-foreground" />
                                                                                <span className="text-muted-foreground">
                                                                                    {
                                                                                        submission
                                                                                            .field_officer
                                                                                            .name
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                            <span className="text-muted-foreground">
                                                                                •
                                                                            </span>
                                                                            <span className="text-muted-foreground">
                                                                                {formatTime(
                                                                                    submission.created_at,
                                                                                )}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-4">
                                                                    <span className="text-sm text-muted-foreground">
                                                                        {new Date(
                                                                            submission.updated_at,
                                                                        ).toLocaleDateString(
                                                                            'en-US',
                                                                            {
                                                                                month: 'short',
                                                                                day: 'numeric',
                                                                            },
                                                                        )}
                                                                    </span>
                                                                    <button className="text-sm font-medium text-primary transition-colors hover:text-primary/80">
                                                                        View
                                                                        Details
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ),
                    )}

                    {/* Pagination - Built using Laravel's paginator structure */}
                    <Pagination paginator={submissions} />
                </>
            )}
        </div>
    );
}

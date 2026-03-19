import ViewController from '@/actions/App/Http/Controllers/FieldOfficer/ViewController';
import Back from '@/components/back';
import AppLayout from '@/layouts/app-layout';
import { breadcrumbs } from '@/pages/field-officer/dashboard/page';
import { Program, Report, ReportSubmission } from '@/types';
import { usePage } from '@inertiajs/react';
import {
    AlertCircle,
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    MessageSquare,
    Upload,
    User,
} from 'lucide-react';
import { useState } from 'react';
import EditReportSubmissionDialog from './components/edit-report-submission-dialog';
import EmptyReportSubmission from './components/empty-submission';
import ReportSubmissionDialog from './components/report-submission-dialog';
import MediaCard from './components/sample-template';

const STATUS_MAP = {
    submitted: {
        text: 'Submitted',
        textColor: 'text-emerald-600 dark:text-emerald-400',
        borderColor: 'border-emerald-500',
        bgColor: 'bg-emerald-500/10 dark:bg-emerald-500/20',
        icon: CheckCircle2,
    },
    returned: {
        text: 'Returned',
        textColor: 'text-red-600 dark:text-red-400',
        borderColor: 'border-red-500',
        bgColor: 'bg-red-500/10 dark:bg-red-500/20',
        icon: AlertCircle,
    },
    accepted: {
        text: 'Accepted',
        textColor: 'text-blue-600 dark:text-blue-400',
        borderColor: 'border-blue-500',
        bgColor: 'bg-blue-500/10 dark:bg-blue-500/20',
        icon: CheckCircle2,
    },
};

export default function Page() {
    const [submitOpen, setSubmitOpen] = useState<boolean>(false);
    const [editOpen, setEditOpen] = useState<boolean>(false);

    const { program, report, reportSubmission, hasSubmitted } = usePage<{
        program: Program;
        report: Report;
        reportSubmission: ReportSubmission & { media?: any[] };
        hasSubmitted: boolean;
    }>().props;

    // -----------------------
    // Date-only comparison
    // -----------------------
    const deadlineDate = new Date(report.deadline);
    const today = new Date();

    deadlineDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const isOverdue = deadlineDate < today;
    const isToday = deadlineDate.getTime() === today.getTime();

    const daysUntilDeadline = Math.ceil(
        (deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    const statusInfo = STATUS_MAP[reportSubmission?.status] ?? {
        text: 'Unknown',
        textColor: 'text-gray-600 dark:text-gray-400',
        borderColor: 'border-gray-500',
        bgColor: 'bg-gray-500/10 dark:bg-gray-500/20',
        icon: AlertCircle,
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header Section */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <Back link={ViewController.reports(program)} />
                        {/* Show submit dialog if not yet submitted, edit dialog if already submitted */}
                        {hasSubmitted && reportSubmission ? (
                            <EditReportSubmissionDialog
                                open={editOpen}
                                setOpen={setEditOpen}
                                report={report}
                                submission={reportSubmission}
                            />
                        ) : (
                            <ReportSubmissionDialog
                                open={submitOpen}
                                hasSubmitted={hasSubmitted}
                                setOpen={setSubmitOpen}
                                report={report}
                            />
                        )}
                    </div>

                    {/* Title and Deadline Card */}
                    <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-background via-background to-muted/20 p-8 shadow-sm">
                        <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-primary/5 blur-3xl dark:bg-primary/10" />
                        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-primary/5 blur-3xl dark:bg-primary/10" />

                        <div className="relative gap-6 lg:flex lg:items-start lg:justify-between">
                            <div className="flex-1">
                                <h1 className="mb-3 text-lg font-bold tracking-tight text-foreground lg:text-3xl dark:text-white">
                                    {report.title}
                                </h1>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-gray-400">
                                    <FileText className="h-4 w-4 dark:text-gray-500" />
                                    <span>Report Submission</span>
                                    {hasSubmitted && (
                                        <>
                                            <span className="mx-2 dark:text-gray-600">
                                                •
                                            </span>
                                            <div
                                                className={`flex items-center gap-1.5 rounded p-1 font-medium ${statusInfo.textColor} ${statusInfo.bgColor} ${statusInfo.borderColor}`}
                                            >
                                                <CheckCircle2 className="h-4 w-4" />
                                                <span>{statusInfo.text}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Enhanced Deadline Badge */}
                            <div
                                className={`mt-5 inline-flex items-center gap-3 rounded-xl px-3 py-2 shadow-sm transition-all lg:mt-0 lg:px-5 lg:py-3 ${
                                    isOverdue
                                        ? 'border-2 border-destructive/30 bg-destructive/10 text-destructive shadow-destructive/10 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400'
                                        : daysUntilDeadline <= 3
                                          ? 'border-2 border-amber-500/30 bg-amber-500/10 text-amber-700 shadow-amber-500/10 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400'
                                          : 'border-2 border-emerald-500/30 bg-emerald-500/10 text-emerald-700 shadow-emerald-500/10 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400'
                                }`}
                            >
                                <div
                                    className={`rounded-full p-2 ${
                                        isOverdue
                                            ? 'bg-destructive/20 dark:bg-red-900/50'
                                            : daysUntilDeadline <= 3
                                              ? 'bg-amber-500/20 dark:bg-amber-900/50'
                                              : 'bg-emerald-500/20 dark:bg-emerald-900/50'
                                    }`}
                                >
                                    {isOverdue ? (
                                        <AlertCircle className="h-4 w-4" />
                                    ) : (
                                        <Clock className="h-4 w-4" />
                                    )}
                                </div>

                                <div className="flex flex-col leading-tight">
                                    <span className="text-xs font-medium opacity-80 dark:opacity-70">
                                        {isOverdue
                                            ? 'Overdue'
                                            : isToday
                                              ? 'Today'
                                              : 'Deadline'}
                                    </span>

                                    <span className="text-xs font-bold lg:text-sm dark:text-inherit">
                                        {deadlineDate.toLocaleDateString(
                                            'en-US',
                                            {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            },
                                        )}

                                        {!isOverdue &&
                                            daysUntilDeadline <= 3 && (
                                                <span className="ml-1.5 text-xs font-medium opacity-80 dark:opacity-70">
                                                    ({daysUntilDeadline}d left)
                                                </span>
                                            )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sample Template Section */}
                <MediaCard
                    templates={report.templates}
                    references={report.references}
                />

                {/* Empty State - Show only if no report submission */}
                {!reportSubmission && (
                    <EmptyReportSubmission setIsOpen={setSubmitOpen} />
                )}

                {/* Single Submission Card - Show only if report submission exists */}
                {reportSubmission && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-foreground/90 dark:text-white">
                                Your Submission
                            </h2>
                            <div
                                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium ${statusInfo.borderColor} ${statusInfo.bgColor} ${statusInfo.textColor} `}
                            >
                                <statusInfo.icon className="h-4 w-4" />
                                <span>{statusInfo.text}</span>
                            </div>
                        </div>

                        <div
                            className={`group relative overflow-hidden rounded-2xl border-2 shadow-md transition-all duration-300 hover:shadow-lg dark:shadow-gray-900/50 ${
                                reportSubmission?.status === 'returned'
                                    ? 'border-l-4 border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-950/20'
                                    : reportSubmission?.status === 'accepted'
                                      ? 'border-l-4 border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/20'
                                      : reportSubmission?.status === 'submitted'
                                        ? 'border-l-4 border-green-500 bg-green-50 dark:border-green-500 dark:bg-green-950/20'
                                        : 'border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800/50'
                            }`}
                        >
                            {/* Decorative Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent dark:from-primary/10" />
                            <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl dark:bg-primary/20" />

                            <div className="relative p-6">
                                {/* Main Content */}
                                <div className="flex items-start gap-6">
                                    {/* Icon Section */}
                                    <div className="dark:from-primary-600 dark:to-primary-700 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
                                        <FileText className="h-8 w-8 text-primary-foreground dark:text-white" />
                                    </div>

                                    {/* Details Section */}
                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-foreground lg:text-xl dark:text-white">
                                                Report Submitted
                                            </h3>
                                            <p className="mt-1 text-xs text-muted-foreground lg:text-sm dark:text-gray-400">
                                                Your report has been
                                                successfully submitted and is
                                                under review
                                            </p>
                                        </div>

                                        {/* Info Grid */}
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            {/* Submitted By */}
                                            <div className="flex items-start gap-3 rounded-xl border bg-background/50 p-4 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/50">
                                                <div className="dark:bg-primary-900/50 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                                    <User className="dark:text-primary-400 h-5 w-5 text-primary" />
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs font-medium text-muted-foreground dark:text-gray-400">
                                                        Submitted By
                                                    </span>
                                                    <span className="text-sm font-semibold text-foreground lg:text-base dark:text-white">
                                                        {reportSubmission
                                                            ?.field_officer
                                                            ?.name || 'N/A'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Submission Date */}
                                            <div className="flex items-start gap-3 rounded-xl border bg-background/50 p-4 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/50">
                                                <div className="dark:bg-primary-900/50 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                                    <Calendar className="dark:text-primary-400 h-5 w-5 text-primary" />
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs font-medium text-muted-foreground dark:text-gray-400">
                                                        Submission Date
                                                    </span>
                                                    <span className="text-sm font-semibold text-foreground lg:text-base dark:text-white">
                                                        {reportSubmission?.created_at
                                                            ? new Date(
                                                                  reportSubmission.created_at,
                                                              ).toLocaleDateString(
                                                                  'en-US',
                                                                  {
                                                                      month: 'long',
                                                                      day: 'numeric',
                                                                      year: 'numeric',
                                                                  },
                                                              )
                                                            : 'N/A'}
                                                    </span>
                                                </div>
                                            </div>

                                            {reportSubmission?.status ===
                                                'returned' && (
                                                <div className="flex items-start gap-3 rounded-xl border bg-background/50 p-4 backdrop-blur-sm sm:col-span-2 dark:border-gray-700 dark:bg-gray-800/50">
                                                    <div className="dark:bg-primary-900/50 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                                        <MessageSquare className="dark:text-primary-400 h-5 w-5 text-primary" />
                                                    </div>
                                                    <div className="flex flex-1 flex-col gap-1">
                                                        <span className="text-xs font-medium text-muted-foreground dark:text-gray-400">
                                                            Remarks
                                                        </span>
                                                        <span className="text-sm font-semibold text-foreground lg:text-base dark:text-white">
                                                            {
                                                                reportSubmission.remarks
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="mt-6 flex items-center justify-between border-t pt-4 dark:border-gray-700">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground lg:text-sm dark:text-gray-400">
                                        <Upload className="h-4 w-4 dark:text-gray-500" />
                                        <span>
                                            Uploaded{' '}
                                            {reportSubmission?.created_at
                                                ? new Date(
                                                      reportSubmission.created_at,
                                                  ).toLocaleTimeString(
                                                      'en-US',
                                                      {
                                                          hour: 'numeric',
                                                          minute: '2-digit',
                                                          hour12: true,
                                                      },
                                                  )
                                                : ''}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    Bell,
    Building2,
    Calendar,
    CheckCircle2,
    ChevronRight,
    Clock,
    Download,
    FileCheck,
    FileClock,
    FileText,
    FileWarning,
    FolderOpen,
    Upload,
    Users,
    XCircle,
} from 'lucide-react';

export const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Field Officer Dashboard',
        href: '/field-officer/dashboard',
    },
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface RecentProgram {
    id: string;
    name: string;
    description: string;
    reports_count: number;
    coordinator: string;
    progress: number;
    deadline: string | null;
}

interface PendingReport {
    id: string;
    title: string;
    program: string;
    program_id: string;
    deadline: string | null;
    final_deadline: string | null;
    status: 'pending' | 'returned';
    priority: 'high' | 'medium' | 'low';
}

interface RecentSubmission {
    id: string;
    report_title: string;
    program: string;
    submitted_at: string;
    status: 'pending' | 'approved' | 'returned';
    feedback: string | null;
}

interface UpcomingDeadline {
    id: string;
    report: string;
    program: string;
    program_id: string;
    deadline: string;
    days_left: number;
    has_template: boolean;
}

interface DashboardProps {
    programs_count: number;
    pending_reports_count: number;
    submitted_reports_count: number;
    returned_reports_count: number;
    recent_programs: RecentProgram[];
    pending_reports: PendingReport[];
    recent_submissions: RecentSubmission[];
    upcoming_deadlines: UpcomingDeadline[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const getStatusBadge = (status: string) => {
    const statusConfig = {
        approved: {
            class: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
            icon: CheckCircle2,
            label: 'Approved',
        },
        pending: {
            class: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
            icon: Clock,
            label: 'Pending Review',
        },
        returned: {
            class: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
            icon: XCircle,
            label: 'Returned',
        },
        draft: {
            class: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
            icon: FileText,
            label: 'Draft',
        },
    };
    return (
        statusConfig[status as keyof typeof statusConfig] ??
        statusConfig.pending
    );
};

const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
        high: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
        medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        low: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    };
    return (
        priorityConfig[priority as keyof typeof priorityConfig] ??
        priorityConfig.medium
    );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Dashboard() {
    const {
        programs_count,
        pending_reports_count,
        submitted_reports_count,
        returned_reports_count,
        recent_programs,
        pending_reports,
        recent_submissions,
        upcoming_deadlines,
    } = usePage<{ props: DashboardProps }>().props as unknown as DashboardProps;

    const stats = [
        {
            title: 'Active Programs',
            value: programs_count,
            change: `${programs_count} total`,
            icon: FolderOpen,
            color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
            link: '/field-officer/programs',
        },
        {
            title: 'Pending Reports',
            value: pending_reports_count,
            change: 'Need submission',
            icon: FileClock,
            color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
            link: '/field-officer/pending-reports',
        },
        {
            title: 'Submitted Reports',
            value: submitted_reports_count,
            change: 'Total submitted',
            icon: FileCheck,
            color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
            link: '/field-officer/my-reports-submissions',
        },
        {
            title: 'Returned Reports',
            value: returned_reports_count,
            change: 'Need revision',
            icon: FileWarning,
            color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
            link: '/field-officer/my-report-submissions?filter=returned',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Field Officer Dashboard" />

            <div className="flex-1 space-y-8 bg-background p-6 md:p-8">
                {/* ── Welcome Header ───────────────────────────────────────── */}
                <div className="relative overflow-hidden rounded-xl border border-border bg-card p-8">
                    <div className="relative z-10">
                        <div className="grid grid-rows-1 lg:grid-cols-2">
                            <div>
                                <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
                                    Field Officer Dashboard
                                </h1>
                                <div className="mt-1 flex items-center gap-2 text-muted-foreground">
                                    <span className="text-xs lg:text-sm">
                                        Welcome back, Field Officer
                                    </span>
                                    {pending_reports_count > 0 && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-600 dark:text-amber-400">
                                            <Bell className="h-3 w-3" />
                                            {pending_reports_count} pending
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="mt-5 flex items-center gap-3 lg:mt-0 lg:justify-end">
                                <Link
                                    href="/field-officer/programs"
                                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-xs font-medium transition-colors hover:bg-accent lg:text-sm"
                                >
                                    <FolderOpen className="h-4 w-4" />
                                    View Programs
                                </Link>
                                <Link
                                    href="/field-officer/pending-reports"
                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 lg:text-sm"
                                >
                                    <Upload className="h-4 w-4" />
                                    New Submission
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Stats Grid ───────────────────────────────────────────── */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => (
                        <Link
                            key={index}
                            href={stat.link}
                            className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:shadow-lg"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                            <div className="relative">
                                <div className="flex items-center justify-between">
                                    <div
                                        className={`rounded-lg ${stat.color} p-2.5`}
                                    >
                                        <stat.icon className="h-5 w-5" />
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-2xl font-bold">
                                        {stat.value}
                                    </h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {stat.title}
                                    </p>
                                    <p className="mt-2 text-xs text-muted-foreground/70">
                                        {stat.change}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* ── Main Content Grid ────────────────────────────────────── */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left Column */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Active Programs */}
                        <div className="rounded-xl border bg-card">
                            <div className="flex items-center justify-between border-b p-6">
                                <div className="items-center gap-3 lg:flex">
                                    <h2 className="mb-1 text-sm font-semibold lg:mb-0 lg:text-lg">
                                        Active Programs
                                    </h2>
                                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                        {recent_programs.length} programs
                                    </span>
                                </div>
                                <Link
                                    href="/field-officer/programs"
                                    className="flex items-center gap-1 text-xs text-primary hover:underline lg:text-sm"
                                >
                                    View all
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </div>

                            {recent_programs.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                                    <FolderOpen className="h-10 w-10 text-muted-foreground/30" />
                                    <p className="text-sm text-muted-foreground">
                                        No programs yet
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {recent_programs.map((program) => (
                                        <Link
                                            key={program.id}
                                            href={`/field-officer/programs/${program.id}/reports`}
                                            className="block p-6 transition-colors hover:bg-muted/50"
                                        >
                                            <div className="mb-3 items-start justify-between lg:flex">
                                                <div className="mb-1 lg:mb-0">
                                                    <h3 className="flex items-center gap-2 text-sm font-medium lg:text-base">
                                                        <Building2 className="h-4 w-4 text-muted-foreground" />
                                                        {program.name}
                                                    </h3>
                                                    <p className="mt-1 text-xs text-muted-foreground lg:text-sm">
                                                        {program.description}
                                                    </p>
                                                </div>
                                                <span className="rounded-full bg-primary/5 px-2 py-1 text-xs text-primary">
                                                    {program.reports_count}{' '}
                                                    reports
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div className="grid grid-rows-1 items-center gap-2 lg:flex">
                                                    <Users className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-muted-foreground">
                                                        Coordinator:
                                                    </span>
                                                    <span className="font-medium">
                                                        {program.coordinator}
                                                    </span>
                                                </div>
                                                <div className="grid grid-rows-1 items-center gap-2 lg:flex">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-muted-foreground">
                                                        Deadline:
                                                    </span>
                                                    <span className="font-medium">
                                                        {formatDate(
                                                            program.deadline,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <div className="mb-2 flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground">
                                                        Overall Progress
                                                    </span>
                                                    <span className="font-medium">
                                                        {program.progress}%
                                                    </span>
                                                </div>
                                                <div className="h-2 overflow-hidden rounded-full bg-muted">
                                                    <div
                                                        className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60 transition-all"
                                                        style={{
                                                            width: `${program.progress}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Reports Due */}
                        <div className="rounded-xl border bg-card">
                            <div className="flex items-center justify-between border-b p-6">
                                <div className="items-center gap-3 lg:flex">
                                    <h2 className="text-sm font-semibold lg:text-lg">
                                        Reports Due
                                    </h2>
                                    <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                                        {pending_reports_count} pending
                                    </span>
                                </div>
                                <Link
                                    href="/field-officer/pending-reports"
                                    className="flex items-center gap-1 text-xs text-primary hover:underline lg:text-sm"
                                >
                                    View all
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </div>

                            {pending_reports.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                                    <FileCheck className="h-10 w-10 text-emerald-400/50" />
                                    <p className="text-sm text-muted-foreground">
                                        All caught up! No pending reports.
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {pending_reports.map((report) => (
                                        <div
                                            key={report.id}
                                            className="p-6 transition-colors hover:bg-muted/50"
                                        >
                                            <div className="mb-3 items-start justify-between lg:flex">
                                                <div className="mb-1 flex-1 lg:mb-0">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                                        <h3 className="text-sm font-medium lg:text-base">
                                                            {report.title}
                                                        </h3>
                                                        {report.status ===
                                                            'returned' && (
                                                            <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-xs text-rose-600 dark:text-rose-400">
                                                                Returned
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="mt-1 text-xs text-muted-foreground lg:text-sm">
                                                        {report.program}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`rounded-full px-2 py-1 text-xs font-medium ${getPriorityBadge(report.priority)}`}
                                                >
                                                    {report.priority} priority
                                                </span>
                                            </div>
                                            <div className="items-center justify-between text-sm lg:flex">
                                                <div className="mb-5 grid grid-cols-2 gap-4 lg:mb-0">
                                                    <div className="grid grid-rows-1 items-center gap-2 lg:flex">
                                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-xs text-muted-foreground">
                                                            Deadline:
                                                        </span>
                                                        <span className="text-xs font-medium">
                                                            {formatDate(
                                                                report.deadline,
                                                            )}
                                                        </span>
                                                    </div>
                                                    {report.final_deadline && (
                                                        <div className="grid grid-rows-1 items-center gap-2 lg:flex">
                                                            <AlertCircle className="h-4 w-4 text-muted-foreground" />
                                                            <span className="text-xs text-muted-foreground">
                                                                Final:
                                                            </span>
                                                            <span className="text-xs font-medium">
                                                                {formatDate(
                                                                    report.final_deadline,
                                                                )}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <Link
                                                    href={`/field-officer/programs/${report.program_id}/reports/${report.id}/reports-submissions`}
                                                    className="rounded-md border px-3 py-1 text-sm text-primary hover:underline"
                                                >
                                                    Submit Report →
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Recent Submissions */}
                        <div className="rounded-xl border bg-card">
                            <div className="border-b p-6">
                                <h2 className="text-sm font-semibold lg:text-lg">
                                    Recent Submissions
                                </h2>
                            </div>

                            {recent_submissions.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                                    <FileText className="h-10 w-10 text-muted-foreground/30" />
                                    <p className="text-sm text-muted-foreground">
                                        No submissions yet
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {recent_submissions.map((submission) => {
                                        const status = getStatusBadge(
                                            submission.status,
                                        );
                                        const StatusIcon = status.icon;
                                        return (
                                            <div
                                                key={submission.id}
                                                className="p-4 transition-colors hover:bg-muted/50"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div
                                                        className={`rounded-full p-2 ${status.class}`}
                                                    >
                                                        <StatusIcon className="h-4 w-4" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-medium">
                                                            {
                                                                submission.report_title
                                                            }
                                                        </p>
                                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                                            {submission.program}
                                                        </p>
                                                        <p className="mt-1 text-xs text-muted-foreground">
                                                            {formatDateTime(
                                                                submission.submitted_at,
                                                            )}
                                                        </p>
                                                        {/* {submission.feedback && (
                                                            <p className="mt-2 rounded bg-muted p-2 text-xs">
                                                                <span className="font-medium">
                                                                    Feedback:
                                                                </span>{' '}
                                                                {
                                                                    submission.feedback
                                                                }
                                                            </p>
                                                        )} */}
                                                    </div>
                                                    <span
                                                        className={`rounded-full px-2 py-1 text-xs font-medium ${status.class}`}
                                                    >
                                                        {status.label}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <div className="border-t p-4">
                                <Link
                                    href="/field-officer/my-reports-submissions"
                                    className="flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                                >
                                    View all submissions
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>

                        {/* Upcoming Deadlines */}
                        <div className="rounded-xl border bg-card">
                            <div className="border-b p-6">
                                <h2 className="flex items-center gap-2 text-sm font-semibold lg:text-lg">
                                    <Calendar className="h-4 w-4 lg:h-5 lg:w-5" />
                                    Upcoming Deadlines
                                </h2>
                            </div>

                            {upcoming_deadlines.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                                    <Calendar className="h-10 w-10 text-muted-foreground/30" />
                                    <p className="text-sm text-muted-foreground">
                                        No upcoming deadlines
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {upcoming_deadlines.map((deadline) => (
                                        <Link
                                            key={deadline.id}
                                            href={`/field-officer/programs/${deadline.program_id}/reports/${deadline.id}/reports-submissions`}
                                            className="block p-4 transition-colors hover:bg-muted/50"
                                        >
                                            <div className="mb-2 flex items-start justify-between">
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {deadline.report}
                                                    </p>
                                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                                        {deadline.program}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                                                        deadline.days_left <= 2
                                                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                                            : deadline.days_left <=
                                                                5
                                                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                                              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                    }`}
                                                >
                                                    {deadline.days_left} days
                                                    left
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-muted-foreground">
                                                    Due:{' '}
                                                    {formatDate(
                                                        deadline.deadline,
                                                    )}
                                                </span>
                                                {deadline.has_template && (
                                                    <span className="inline-flex items-center gap-1 text-primary">
                                                        <Download className="h-3 w-3" />
                                                        Template
                                                    </span>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div className="rounded-xl border bg-card p-6">
                            <h2 className="mb-4 text-sm font-semibold lg:text-lg">
                                Quick Actions
                            </h2>
                            <div className="grid grid-cols-2 gap-3">
                                <Link
                                    href="/field-officer/programs"
                                    className="group flex flex-col items-center gap-2 rounded-lg border border-input p-4 transition-colors hover:bg-accent"
                                >
                                    <FolderOpen className="h-4 w-4 text-muted-foreground group-hover:text-foreground lg:h-5 lg:w-5" />
                                    <span className="text-xs font-medium">
                                        Programs
                                    </span>
                                </Link>
                                <Link
                                    href="/field-officer/my-reports-submissions"
                                    className="group flex flex-col items-center gap-2 rounded-lg border border-input p-4 transition-colors hover:bg-accent"
                                >
                                    <FileText className="h-4 w-4 text-muted-foreground group-hover:text-foreground lg:h-5 lg:w-5" />
                                    <span className="text-xs font-medium">
                                        Submissions
                                    </span>
                                </Link>
                                <Link
                                    href="/field-officer/notifications"
                                    className="group flex flex-col items-center gap-2 rounded-lg border border-input p-4 transition-colors hover:bg-accent"
                                >
                                    <Bell className="h-4 w-4 text-muted-foreground group-hover:text-foreground lg:h-5 lg:w-5" />
                                    <span className="text-xs font-medium">
                                        Notifications
                                    </span>
                                </Link>
                                <button
                                    onClick={() => window.print()}
                                    className="group flex flex-col items-center gap-2 rounded-lg border border-input p-4 transition-colors hover:bg-accent"
                                >
                                    <Download className="h-4 w-4 text-muted-foreground group-hover:text-foreground lg:h-5 lg:w-5" />
                                    <span className="text-xs font-medium">
                                        Export
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

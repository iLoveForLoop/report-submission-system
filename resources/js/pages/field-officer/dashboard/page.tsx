// field-officer/dashboard/page.tsx
import AppLayout from '@/layouts/app-layout';
import { Auth, type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
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
    Layers,
    RefreshCw,
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
    auth: Auth;
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

const getStatusConfig = (status: string) => {
    const statusConfig = {
        approved: {
            badgeClass:
                'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
            iconClass:
                'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400',
            icon: CheckCircle2,
            label: 'Approved',
        },
        pending: {
            badgeClass:
                'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
            iconClass:
                'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',
            icon: Clock,
            label: 'Under Review',
        },
        returned: {
            badgeClass:
                'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
            iconClass:
                'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400',
            icon: XCircle,
            label: 'Returned',
        },
        draft: {
            badgeClass: 'bg-muted text-muted-foreground',
            iconClass: 'bg-muted text-muted-foreground',
            icon: FileText,
            label: 'Draft',
        },
    };
    return (
        statusConfig[status as keyof typeof statusConfig] ??
        statusConfig.pending
    );
};

const getPriorityConfig = (priority: string) => {
    const configs = {
        high: {
            badgeClass:
                'border border-red-300 bg-red-100 text-red-700 dark:border-red-700 dark:bg-red-900/40 dark:text-red-400',
            label: 'HIGH',
        },
        medium: {
            badgeClass:
                'border border-amber-300 bg-amber-100 text-amber-700 dark:border-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
            label: 'MED',
        },
        low: {
            badgeClass:
                'border border-green-300 bg-green-100 text-green-700 dark:border-green-700 dark:bg-green-900/40 dark:text-green-400',
            label: 'LOW',
        },
    };
    return configs[priority as keyof typeof configs] ?? configs.medium;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({
    title,
    badge,
    badgeVariant = 'neutral',
    action,
    headerColor,
}: {
    title: string;
    badge?: string | number;
    badgeVariant?: 'neutral' | 'warning' | 'danger' | 'success';
    action?: { label: string; href: string };
    headerColor?: string;
}) {
    const badgeOnColor = 'bg-white/20 text-white';
    const defaultBadgeClasses = {
        neutral: 'bg-muted text-muted-foreground',
        warning:
            'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
        danger: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
        success:
            'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
    };

    const hasColor = Boolean(headerColor);

    return (
        <div
            className={`flex items-center justify-between border-b-2 border-border px-5 py-3 ${headerColor ?? 'bg-muted/40'}`}
        >
            <div className="flex items-center gap-2.5">
                <span
                    className={`text-sm font-semibold tracking-tight ${hasColor ? 'text-white' : 'text-foreground'}`}
                >
                    {title}
                </span>
                {/* {badge !== undefined && (
                    <span
                        className={`rounded px-1.5 py-0.5 text-xs font-medium ${hasColor ? badgeOnColor : defaultBadgeClasses[badgeVariant]}`}
                    >
                        {badge}
                    </span>
                )} */}
            </div>
            {action && (
                <Link
                    href={action.href}
                    className={`flex items-center gap-1 text-xs font-medium hover:underline ${hasColor ? 'text-white/80 hover:text-white' : 'text-primary'}`}
                >
                    {action.label}
                    <ChevronRight className="h-3.5 w-3.5" />
                </Link>
            )}
        </div>
    );
}

function MetaItem({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center gap-1.5">
            <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{label}:</span>
            <span className="text-xs font-medium text-foreground">{value}</span>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Dashboard() {
    const {
        auth,
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
            icon: Layers,
            accent: 'border-l-blue-500',
            valueColor: 'text-blue-600 dark:text-blue-400',
            link: '/field-officer/programs',
        },
        {
            title: 'Pending Reports',
            value: pending_reports_count,
            icon: FileClock,
            accent: 'border-l-amber-500',
            valueColor: 'text-amber-600 dark:text-amber-400',
            link: '/field-officer/pending-reports',
        },
        {
            title: 'Submitted',
            value: submitted_reports_count,
            icon: FileCheck,
            accent: 'border-l-green-500',
            valueColor: 'text-green-600 dark:text-green-400',
            link: '/field-officer/my-reports-submissions',
        },
        {
            title: 'Returned',
            value: returned_reports_count,
            icon: FileWarning,
            accent: 'border-l-red-500',
            valueColor: 'text-red-600 dark:text-red-400',
            link: '/field-officer/pending-reports',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Field Officer Dashboard" />

            <div className="flex-1 space-y-6 bg-background p-6 md:p-8">
                {/* ── System Header (with traffic lights) ─────────────── */}
                <div className="border border-border bg-card">
                    <div className="flex items-center gap-3 border-b border-border/50 bg-muted/30 px-5 py-2">
                        <div className="flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
                            <span className="h-2.5 w-2.5 rounded-full bg-black/70" />
                        </div>
                    </div>

                    <div className="bg-card-elevated px-5 py-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="">
                                <h1 className="font-md text-xl tracking-tight text-foreground">
                                    Welcome,{' '}
                                    <span className="font-bold">
                                        {auth.user.name}
                                    </span>
                                </h1>
                                <div className="mt-1 flex flex-wrap items-center gap-3">
                                    <p className="text-sm text-muted-foreground">
                                        Manage your program reports and
                                        submissions
                                    </p>
                                    {pending_reports_count > 0 && (
                                        <span className="flex items-center gap-1.5 rounded border-2 border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                            <Bell className="h-3.5 w-3.5" />
                                            {pending_reports_count} pending
                                            action
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Link
                                    href="/field-officer/programs"
                                    className="flex items-center gap-1.5 rounded border-2 border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                                >
                                    <FolderOpen className="h-3.5 w-3.5" />
                                    Programs
                                </Link>
                                <Link
                                    href="/field-officer/pending-reports"
                                    className="flex items-center gap-1.5 rounded border-2 border-primary bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                                >
                                    <Upload className="h-3.5 w-3.5" />
                                    New Submission
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Stats Row ───────────────────────────────────────────── */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, i) => (
                        <Link
                            key={i}
                            href={stat.link}
                            className={`group flex items-center gap-4 rounded border-2 border-l-4 border-border bg-card-elevated p-4 transition-colors hover:bg-muted/50 ${stat.accent}`}
                        >
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                    {stat.title}
                                </p>
                                <p
                                    className={`mt-1 text-3xl leading-none font-bold ${stat.valueColor}`}
                                >
                                    {stat.value}
                                </p>
                            </div>
                            <stat.icon className="h-8 w-8 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-muted-foreground/60" />
                        </Link>
                    ))}
                </div>

                {/* ── Main Grid ───────────────────────────────────────────── */}
                <div className="grid gap-5 lg:grid-cols-3">
                    {/* Left — 2/3 width */}
                    <div className="space-y-5 lg:col-span-2">
                        {/* Active Programs */}
                        <div className="rounded border-2 border-border bg-card-elevated">
                            <SectionHeader
                                title="Active Programs"
                                badge={`${recent_programs.length} enrolled`}
                                badgeVariant="neutral"
                                headerColor="bg-blue-500"
                                action={{
                                    label: 'View all',
                                    href: '/field-officer/programs',
                                }}
                            />
                            {recent_programs.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
                                    <FolderOpen className="h-9 w-9 text-muted-foreground/20" />
                                    <p className="text-xs text-muted-foreground">
                                        No programs assigned.
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y-2 divide-border">
                                    {recent_programs.map((program) => (
                                        <Link
                                            key={program.id}
                                            href={`/field-officer/programs/${program.id}/reports`}
                                            className="block px-5 py-4 transition-colors hover:bg-muted/30"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex min-w-0 items-start gap-2">
                                                    <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                                                    <div className="min-w-0">
                                                        <p className="text-sm leading-snug font-medium text-foreground">
                                                            {program.name}
                                                        </p>
                                                        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                                                            {
                                                                program.description
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="shrink-0 rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
                                                    {program.reports_count}{' '}
                                                    reports
                                                </span>
                                            </div>

                                            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
                                                <MetaItem
                                                    icon={Users}
                                                    label="Coordinator"
                                                    value={program.coordinator}
                                                />
                                                <MetaItem
                                                    icon={Calendar}
                                                    label="Deadline"
                                                    value={formatDate(
                                                        program.deadline,
                                                    )}
                                                />
                                            </div>

                                            <div className="mt-3">
                                                <div className="mb-1 flex items-center justify-between">
                                                    <span className="text-xs text-muted-foreground">
                                                        Progress
                                                    </span>
                                                    <span className="text-xs font-medium text-foreground">
                                                        {program.progress}%
                                                    </span>
                                                </div>
                                                <div className="h-1.5 w-full overflow-hidden rounded-sm bg-muted">
                                                    <div
                                                        className="h-full bg-blue-500 transition-all"
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
                        <div className="rounded border-2 border-border bg-card-elevated">
                            <SectionHeader
                                title="Reports Due"
                                badge={`${pending_reports_count} pending`}
                                badgeVariant="warning"
                                headerColor="bg-amber-500"
                                action={{
                                    label: 'View all',
                                    href: '/field-officer/pending-reports',
                                }}
                            />
                            {pending_reports.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
                                    <FileCheck className="h-9 w-9 text-green-400/60" />
                                    <p className="text-sm font-medium text-muted-foreground">
                                        All reports submitted
                                    </p>
                                    <p className="text-xs text-muted-foreground/60">
                                        No pending reports at this time.
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y-2 divide-border">
                                    {pending_reports.map((report) => {
                                        const priority = getPriorityConfig(
                                            report.priority,
                                        );
                                        return (
                                            <div
                                                key={report.id}
                                                className="px-5 py-4 transition-colors hover:bg-muted/30"
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex min-w-0 items-start gap-2">
                                                        <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                                                        <div className="min-w-0">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <p className="text-sm leading-snug font-medium text-foreground">
                                                                    {
                                                                        report.title
                                                                    }
                                                                </p>
                                                                {/* <span
                                                                    className={`rounded px-1.5 py-0.5 text-xs font-medium ${priority.badgeClass}`}
                                                                >
                                                                    {
                                                                        priority.label
                                                                    }
                                                                </span> */}
                                                                {report.status ===
                                                                    'returned' && (
                                                                    <span className="flex items-center gap-1 rounded border border-red-300 bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-700 dark:border-red-700 dark:bg-red-900/40 dark:text-red-400">
                                                                        <RefreshCw className="h-3 w-3" />
                                                                        Returned
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                                {report.program}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Link
                                                        href={`/field-officer/programs/${report.program_id}/reports/${report.id}/reports-submissions`}
                                                        className="shrink-0 px-3 py-1 text-xs font-medium text-primary hover:underline"
                                                    >
                                                        Submit →
                                                    </Link>
                                                </div>

                                                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
                                                    <MetaItem
                                                        icon={Clock}
                                                        label="Deadline"
                                                        value={formatDate(
                                                            report.deadline,
                                                        )}
                                                    />
                                                    {report.final_deadline && (
                                                        <MetaItem
                                                            icon={AlertTriangle}
                                                            label="Final deadline"
                                                            value={formatDate(
                                                                report.final_deadline,
                                                            )}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right — 1/3 width */}
                    <div className="space-y-5">
                        {/* Recent Submissions */}
                        <div className="rounded border-2 border-border bg-card-elevated">
                            <SectionHeader
                                title="Recent Submissions"
                                headerColor="bg-slate-600"
                            />

                            {recent_submissions.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
                                    <FileText className="h-9 w-9 text-muted-foreground/20" />
                                    <p className="text-xs text-muted-foreground">
                                        No submissions yet.
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y-2 divide-border">
                                    {recent_submissions.map((submission) => {
                                        const status = getStatusConfig(
                                            submission.status,
                                        );
                                        const StatusIcon = status.icon;
                                        return (
                                            <div
                                                key={submission.id}
                                                className="flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-muted/30"
                                            >
                                                <div
                                                    className={`mt-0.5 shrink-0 rounded p-1.5 ${status.iconClass}`}
                                                >
                                                    <StatusIcon className="h-3.5 w-3.5" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-medium text-foreground">
                                                        {
                                                            submission.report_title
                                                        }
                                                    </p>
                                                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                                        {submission.program}
                                                    </p>
                                                    <p className="mt-1 text-xs text-muted-foreground/60">
                                                        {formatDateTime(
                                                            submission.submitted_at,
                                                        )}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`shrink-0 self-start rounded px-1.5 py-0.5 text-xs font-medium ${status.badgeClass}`}
                                                >
                                                    {status.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <div className="border-t-2 border-border px-4 py-3">
                                <Link
                                    href="/field-officer/my-reports-submissions"
                                    className="flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                                >
                                    View all submissions
                                    <ChevronRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                        </div>

                        {/* Upcoming Deadlines */}
                        <div className="rounded border-2 border-border bg-card-elevated">
                            <SectionHeader
                                title="Upcoming Deadlines"
                                headerColor="bg-slate-600"
                            />

                            {upcoming_deadlines.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
                                    <Calendar className="h-9 w-9 text-muted-foreground/20" />
                                    <p className="text-xs text-muted-foreground">
                                        No upcoming deadlines.
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y-2 divide-border">
                                    {upcoming_deadlines.map((deadline) => {
                                        const urgencyClass =
                                            deadline.days_left <= 2
                                                ? 'border border-red-300 bg-red-100 text-red-700 dark:border-red-700 dark:bg-red-900/40 dark:text-red-400'
                                                : deadline.days_left <= 5
                                                  ? 'border border-amber-300 bg-amber-100 text-amber-700 dark:border-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
                                                  : 'border border-green-300 bg-green-100 text-green-700 dark:border-green-700 dark:bg-green-900/40 dark:text-green-400';
                                        return (
                                            <Link
                                                key={deadline.id}
                                                href={`/field-officer/programs/${deadline.program_id}/reports/${deadline.id}/reports-submissions`}
                                                className="block px-4 py-3.5 transition-colors hover:bg-muted/30"
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-medium text-foreground">
                                                            {deadline.report}
                                                        </p>
                                                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                                            {deadline.program}
                                                        </p>
                                                        <div className="mt-1.5 flex items-center gap-3">
                                                            <MetaItem
                                                                icon={Calendar}
                                                                label="Due"
                                                                value={formatDate(
                                                                    deadline.deadline,
                                                                )}
                                                            />
                                                            {deadline.has_template && (
                                                                <span className="flex items-center gap-1 text-xs font-medium text-primary">
                                                                    <Download className="h-3 w-3" />
                                                                    Template
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span
                                                        className={`shrink-0 rounded px-2 py-0.5 text-xs font-semibold ${urgencyClass}`}
                                                    >
                                                        {deadline.days_left}d
                                                        left
                                                    </span>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div className="rounded border-2 border-border bg-card-elevated">
                            <SectionHeader
                                title="Quick Actions"
                                headerColor="bg-slate-600"
                            />
                            <div className="grid grid-cols-2 divide-x-2 divide-y-2 divide-border">
                                <Link
                                    href="/field-officer/programs"
                                    className="group flex flex-col items-center gap-2 px-4 py-5 transition-colors hover:bg-muted/30"
                                >
                                    <FolderOpen className="h-5 w-5 text-blue-500/50 transition-colors group-hover:text-blue-500" />
                                    <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">
                                        Programs
                                    </span>
                                </Link>
                                <Link
                                    href="/field-officer/my-reports-submissions"
                                    className="group flex flex-col items-center gap-2 px-4 py-5 transition-colors hover:bg-muted/30"
                                >
                                    <FileText className="h-5 w-5 text-violet-500/50 transition-colors group-hover:text-violet-500" />
                                    <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">
                                        Submissions
                                    </span>
                                </Link>
                                <Link
                                    href="/field-officer/notifications"
                                    className="group flex flex-col items-center gap-2 px-4 py-5 transition-colors hover:bg-muted/30"
                                >
                                    <Bell className="h-5 w-5 text-amber-500/50 transition-colors group-hover:text-amber-500" />
                                    <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">
                                        Alerts
                                    </span>
                                </Link>
                                <button
                                    onClick={() => window.print()}
                                    className="group flex flex-col items-center gap-2 px-4 py-5 transition-colors hover:bg-muted/30"
                                >
                                    <Download className="h-5 w-5 text-green-500/50 transition-colors group-hover:text-green-500" />
                                    <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">
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

// focal-person/dashboard/page.tsx
import AppLayout from '@/layouts/app-layout';
import { Auth, type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    AlertTriangle,
    Bell,
    Calendar,
    CheckCircle2,
    ChevronRight,
    ClipboardList,
    Clock,
    FileCheck,
    FileClock,
    FileText,
    FileX,
    Folder,
    MapPin,
    RefreshCcw,
    Users,
} from 'lucide-react';

export const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Focal Person Dashboard',
        href: '/focal-person/dashboard',
    },
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface PendingSubmission {
    id: string;
    report_title: string;
    program: string;
    officer: string;
    officer_avatar: string;
    cluster: string;
    submitted_at: string;
    deadline: string | null;
    is_overdue: boolean;
}

interface OverdueReport {
    id: string;
    report_title: string;
    program: string;
    deadline: string;
    days_overdue: number;
    submitted: number;
    total_officers: number;
}

interface RecentActivity {
    id: string;
    type: 'accepted' | 'returned';
    report_title: string;
    officer: string;
    program: string;
    actioned_at: string;
}

interface AssignedProgram {
    id: string;
    name: string;
    pending_count: number;
    total_reports: number;
}

interface DashboardProps {
    auth: Auth;
    pending_count: number;
    approved_today: number;
    approved_this_week: number;
    returned_count: number;
    overdue_count: number;
    assigned_programs_count: number;
    pending_submissions: PendingSubmission[];
    overdue_reports: OverdueReport[];
    recent_activity: RecentActivity[];
    assigned_programs: AssignedProgram[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (value: string | null) => {
    if (!value) return '—';
    return new Date(value).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

const formatDateTime = (value: string) => {
    return new Date(value).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
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
    const badgeClasses = {
        neutral: 'bg-white/20 text-white',
        warning: 'bg-white/20 text-white',
        danger: 'bg-white/20 text-white',
        success: 'bg-white/20 text-white',
    };

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
                {badge !== undefined && (
                    <span
                        className={`rounded px-1.5 py-0.5 text-xs font-medium ${hasColor ? badgeClasses[badgeVariant] : defaultBadgeClasses[badgeVariant]}`}
                    >
                        {badge}
                    </span>
                )}
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
        pending_count,
        approved_this_week,
        returned_count,
        overdue_count,
        assigned_programs_count,
        pending_submissions,
        overdue_reports,
        recent_activity,
        assigned_programs,
    } = usePage<{ props: DashboardProps }>().props as unknown as DashboardProps;

    const stats = [
        {
            title: 'Assigned Programs',
            value: assigned_programs_count,
            icon: Folder,
            accent: 'border-l-blue-500',
            valueColor: 'text-blue-600 dark:text-blue-400',
            link: '/focal-person/programs',
        },
        {
            title: 'Pending Review',
            value: pending_count,
            icon: FileClock,
            accent: 'border-l-amber-500',
            valueColor: 'text-amber-600 dark:text-amber-400',
            link: '/focal-person/submissions?filter=pending',
        },
        {
            title: 'Approved This Week',
            value: approved_this_week,
            icon: FileCheck,
            accent: 'border-l-green-500',
            valueColor: 'text-green-600 dark:text-green-400',
            link: '/focal-person/submissions?filter=approved',
        },
        {
            title: 'Returned for Revision',
            value: returned_count,
            icon: FileX,
            accent: 'border-l-red-500',
            valueColor: 'text-red-600 dark:text-red-400',
            link: '/focal-person/submissions?filter=returned',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Focal Person Dashboard" />

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

                    <div className="px-5 py-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="font-md text-xl tracking-tight text-foreground">
                                    Welcome,{' '}
                                    <span className="font-bold">
                                        {auth.user.name}
                                    </span>
                                </h1>
                                <div className="mt-1 flex flex-wrap items-center gap-3 text-muted-foreground">
                                    <p className="text-sm text-muted-foreground">
                                        Review and manage officer report
                                        submissions
                                    </p>
                                    {pending_count > 0 && (
                                        <span className="flex items-center gap-1.5 rounded border-2 border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                            <Bell className="h-3.5 w-3.5" />
                                            {pending_count} pending
                                        </span>
                                    )}
                                    {overdue_count > 0 && (
                                        <span className="flex items-center gap-1.5 rounded border-2 border-red-300 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 dark:border-red-700 dark:bg-red-900/30 dark:text-red-400">
                                            <AlertTriangle className="h-3.5 w-3.5" />
                                            {overdue_count} overdue
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Link
                                    href="/focal-person/programs"
                                    className="flex items-center gap-1.5 rounded border-2 border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                                >
                                    <Folder className="h-3.5 w-3.5" />
                                    My Programs
                                </Link>
                                <Link
                                    href="/focal-person/review-queue"
                                    className="flex items-center gap-1.5 rounded border-2 border-primary bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                                >
                                    <ClipboardList className="h-3.5 w-3.5" />
                                    Review Queue
                                    {pending_count > 0 && (
                                        <span className="rounded bg-white/20 px-1.5 py-0.5 text-xs leading-none font-bold">
                                            {pending_count}
                                        </span>
                                    )}
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
                            className={`group flex items-center gap-4 rounded border-2 border-l-4 border-border bg-card p-4 transition-colors hover:bg-muted/50 ${stat.accent}`}
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
                        {/* Review Queue */}
                        <div className="rounded border-2 border-border bg-card">
                            <SectionHeader
                                title="Review Queue"
                                badge={`${pending_count} pending`}
                                badgeVariant="warning"
                                headerColor="bg-blue-500"
                                action={{
                                    label: 'View all',
                                    href: '/focal-person/review-queue',
                                }}
                            />

                            {pending_submissions.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
                                    <CheckCircle2 className="h-9 w-9 text-green-400/60" />
                                    <p className="text-sm font-medium text-muted-foreground">
                                        All caught up
                                    </p>
                                    <p className="text-xs text-muted-foreground/60">
                                        No submissions pending review.
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y-2 divide-border">
                                    {pending_submissions.map((sub) => (
                                        <div
                                            key={sub.id}
                                            className="px-5 py-4 transition-colors hover:bg-muted/30"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex min-w-0 items-start gap-2">
                                                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                                                    <div className="min-w-0">
                                                        <p className="text-sm leading-snug font-medium text-foreground">
                                                            {sub.report_title}
                                                        </p>
                                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                                            {sub.program}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex shrink-0 items-center gap-2">
                                                    {sub.is_overdue && (
                                                        <span className="flex items-center gap-1 rounded border border-red-300 bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:border-red-700 dark:bg-red-900/40 dark:text-red-400">
                                                            <AlertCircle className="h-3 w-3" />
                                                            Overdue
                                                        </span>
                                                    )}
                                                    <Link
                                                        href={`/focal-person/submissions/${sub.id}`}
                                                        className="px-3 py-1 text-xs font-medium text-primary hover:underline"
                                                    >
                                                        Review →
                                                    </Link>
                                                </div>
                                            </div>

                                            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
                                                <MetaItem
                                                    icon={Users}
                                                    label="Officer"
                                                    value={sub.officer}
                                                />
                                                <MetaItem
                                                    icon={MapPin}
                                                    label="Cluster"
                                                    value={sub.cluster}
                                                />
                                                <MetaItem
                                                    icon={Clock}
                                                    label="Submitted"
                                                    value={formatDateTime(
                                                        sub.submitted_at,
                                                    )}
                                                />
                                                {sub.deadline && (
                                                    <MetaItem
                                                        icon={Calendar}
                                                        label="Deadline"
                                                        value={formatDate(
                                                            sub.deadline,
                                                        )}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Overdue Reports */}
                        {overdue_reports.length > 0 && (
                            <div className="rounded border-2 border-red-400 bg-card dark:border-red-700">
                                <div className="flex items-center justify-between border-b-2 border-red-300 bg-red-50/60 px-5 py-3 dark:border-red-700 dark:bg-red-950/20">
                                    <div className="flex items-center gap-2.5">
                                        <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                        <span className="text-sm font-semibold text-red-700 dark:text-red-400">
                                            Overdue Reports
                                        </span>
                                        <span className="rounded border border-red-300 bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-700 dark:border-red-700 dark:bg-red-900/50 dark:text-red-400">
                                            {overdue_reports.length}
                                        </span>
                                    </div>
                                </div>

                                <div className="divide-y-2 divide-red-200 dark:divide-red-900/40">
                                    {overdue_reports.map((report) => (
                                        <div
                                            key={report.id}
                                            className="px-5 py-4 transition-colors hover:bg-red-50/40 dark:hover:bg-red-950/10"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex min-w-0 items-start gap-2">
                                                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                                                    <div className="min-w-0">
                                                        <p className="text-sm leading-snug font-medium text-foreground">
                                                            {
                                                                report.report_title
                                                            }
                                                        </p>
                                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                                            {report.program}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="shrink-0 rounded border border-red-300 bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700 dark:border-red-700 dark:bg-red-900/40 dark:text-red-400">
                                                    {report.days_overdue}d
                                                    overdue
                                                </span>
                                            </div>

                                            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
                                                <MetaItem
                                                    icon={Calendar}
                                                    label="Deadline"
                                                    value={formatDate(
                                                        report.deadline,
                                                    )}
                                                />
                                                <MetaItem
                                                    icon={Users}
                                                    label="Submitted"
                                                    value={`${report.submitted} / ${report.total_officers} officers`}
                                                />
                                                <div className="flex items-center gap-2">
                                                    <div className="h-1.5 w-24 overflow-hidden rounded-sm bg-red-200 dark:bg-red-900/40">
                                                        <div
                                                            className="h-full bg-red-400"
                                                            style={{
                                                                width:
                                                                    report.total_officers >
                                                                    0
                                                                        ? `${(report.submitted / report.total_officers) * 100}%`
                                                                        : '0%',
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">
                                                        {report.total_officers >
                                                        0
                                                            ? Math.round(
                                                                  (report.submitted /
                                                                      report.total_officers) *
                                                                      100,
                                                              )
                                                            : 0}
                                                        %
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right — 1/3 width */}
                    <div className="space-y-5">
                        {/* Recent Activity */}
                        <div className="rounded border-2 border-border bg-card">
                            <SectionHeader
                                title="Recent Activity"
                                headerColor="bg-slate-600"
                            />

                            {recent_activity.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
                                    <FileText className="h-9 w-9 text-muted-foreground/20" />
                                    <p className="text-xs text-muted-foreground">
                                        No activity recorded yet.
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y-2 divide-border">
                                    {recent_activity.map((activity) => {
                                        const isApproved =
                                            activity.type === 'accepted';
                                        return (
                                            <div
                                                key={activity.id}
                                                className="flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-muted/30"
                                            >
                                                <div
                                                    className={`mt-0.5 shrink-0 rounded p-1.5 ${
                                                        isApproved
                                                            ? 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400'
                                                            : 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400'
                                                    }`}
                                                >
                                                    {isApproved ? (
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                    ) : (
                                                        <RefreshCcw className="h-3.5 w-3.5" />
                                                    )}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-medium text-foreground">
                                                        {activity.report_title}
                                                    </p>
                                                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                                        {activity.program}
                                                    </p>
                                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                                        {activity.officer}
                                                    </p>
                                                    <p className="mt-1 text-xs text-muted-foreground/60">
                                                        {formatDateTime(
                                                            activity.actioned_at,
                                                        )}
                                                    </p>
                                                </div>

                                                <span
                                                    className={`shrink-0 self-start rounded px-1.5 py-0.5 text-xs font-medium ${
                                                        isApproved
                                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                                                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
                                                    }`}
                                                >
                                                    {isApproved
                                                        ? 'Approved'
                                                        : 'Returned'}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <div className="border-t-2 border-border px-4 py-3">
                                <Link
                                    href="/focal-person/submission-logs"
                                    className="flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                                >
                                    View all submissions
                                    <ChevronRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                        </div>

                        {/* My Programs */}
                        <div className="rounded border-2 border-border bg-card">
                            <SectionHeader
                                title="My Programs"
                                badge={assigned_programs_count}
                                badgeVariant="neutral"
                                headerColor="bg-slate-600"
                            />

                            {assigned_programs.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
                                    <Folder className="h-9 w-9 text-muted-foreground/20" />
                                    <p className="text-xs text-muted-foreground">
                                        No programs assigned.
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y-2 divide-border">
                                    {assigned_programs.map((program) => (
                                        <Link
                                            key={program.id}
                                            href={`/focal-person/programs/${program.id}`}
                                            className="flex items-center justify-between px-4 py-3.5 transition-colors hover:bg-muted/30"
                                        >
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-foreground">
                                                    {program.name}
                                                </p>
                                                <p className="mt-0.5 text-xs text-muted-foreground">
                                                    {program.total_reports}{' '}
                                                    total reports
                                                </p>
                                            </div>
                                            <div className="ml-3 flex shrink-0 items-center gap-2">
                                                {program.pending_count > 0 && (
                                                    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                                                        {program.pending_count}{' '}
                                                        pending
                                                    </span>
                                                )}
                                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

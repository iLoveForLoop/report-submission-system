// focal-person/dashboard/page.tsx
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    Bell,
    Calendar,
    CheckCircle2,
    ChevronRight,
    ClipboardCheck,
    Clock,
    FileCheck,
    FileClock,
    FileText,
    FileWarning,
    FolderOpen,
    MapPin,
    RotateCcw,
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

const getActivityBadge = (type: 'accepted' | 'returned') => {
    return type === 'accepted'
        ? {
              class: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
              icon: CheckCircle2,
              label: 'Approved',
          }
        : {
              class: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
              icon: RotateCcw,
              label: 'Returned',
          };
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Dashboard() {
    const {
        pending_count,
        approved_today,
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
            change: 'Under your review',
            icon: FolderOpen,
            color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
            link: '/focal-person/programs',
        },
        {
            title: 'Pending Review',
            value: pending_count,
            change: 'Awaiting your action',
            icon: FileClock,
            color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
            link: '/focal-person/submissions?filter=pending',
        },
        {
            title: 'Approved This Week',
            value: approved_this_week,
            change: `${approved_today} today`,
            icon: FileCheck,
            color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
            link: '/focal-person/submissions?filter=approved',
        },
        {
            title: 'Returned',
            value: returned_count,
            change: 'Sent back for revision',
            icon: FileWarning,
            color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
            link: '/focal-person/submissions?filter=returned',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Focal Person Dashboard" />

            <div className="flex-1 space-y-8 bg-background p-6 md:p-8">
                {/* ── Welcome Header ───────────────────────────────────────── */}
                <div className="landing-page relative overflow-hidden rounded-xl border border-border bg-card p-8">
                    <div className="relative z-10">
                        <div className="grid grid-rows-1 lg:grid-cols-2">
                            <div>
                                <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
                                    Focal Person Dashboard
                                </h1>
                                <div className="mt-1 flex items-center gap-2 text-muted-foreground">
                                    <span className="text-xs lg:text-sm">
                                        Welcome back, Focal Person
                                    </span>
                                    {pending_count > 0 && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-600 dark:text-amber-400">
                                            <Bell className="h-3 w-3" />
                                            {pending_count} pending review
                                        </span>
                                    )}
                                    {overdue_count > 0 && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-xs text-rose-600 dark:text-rose-400">
                                            <AlertCircle className="h-3 w-3" />
                                            {overdue_count} overdue
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="mt-5 flex items-center gap-3 lg:mt-0 lg:justify-end">
                                <Link
                                    href="/focal-person/programs"
                                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-xs font-medium transition-colors hover:bg-accent lg:text-sm"
                                >
                                    <FolderOpen className="h-4 w-4" />
                                    My Programs
                                </Link>
                                <Link
                                    href="/focal-person/submissions?filter=pending"
                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 lg:text-sm"
                                >
                                    <ClipboardCheck className="h-4 w-4" />
                                    Review Queue
                                    {pending_count > 0 && (
                                        <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-xs font-bold">
                                            {pending_count}
                                        </span>
                                    )}
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

                {/* ── Main Content ─────────────────────────────────────────── */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left Column — 2/3 */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Pending Review Queue */}
                        <div className="rounded-xl border bg-card">
                            <div className="flex items-center justify-between border-b p-6">
                                <div className="items-center gap-3 lg:flex">
                                    <h2 className="mb-1 text-sm font-semibold lg:mb-0 lg:text-lg">
                                        Review Queue
                                    </h2>
                                    <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                                        {pending_count} pending
                                    </span>
                                </div>
                                <Link
                                    href="/focal-person/submissions?filter=pending"
                                    className="flex items-center gap-1 text-xs text-primary hover:underline lg:text-sm"
                                >
                                    View all
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </div>

                            {pending_submissions.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                                    <ClipboardCheck className="h-10 w-10 text-emerald-400/50" />
                                    <p className="text-sm text-muted-foreground">
                                        All caught up! No submissions pending
                                        review.
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {pending_submissions.map((sub) => (
                                        <div
                                            key={sub.id}
                                            className="p-6 transition-colors hover:bg-muted/50"
                                        >
                                            <div className="mb-3 items-start justify-between lg:flex">
                                                <div className="mb-1 flex-1 lg:mb-0">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                                        <h3 className="text-sm font-medium lg:text-base">
                                                            {sub.report_title}
                                                        </h3>
                                                        {sub.is_overdue && (
                                                            <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-xs text-rose-600 dark:text-rose-400">
                                                                Overdue
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="mt-1 text-xs text-muted-foreground lg:text-sm">
                                                        {sub.program}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="items-center justify-between text-sm lg:flex">
                                                <div className="mb-5 grid grid-cols-2 gap-4 lg:mb-0">
                                                    <div className="grid grid-rows-1 items-center gap-2 lg:flex">
                                                        <Users className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-xs text-muted-foreground">
                                                            Officer:
                                                        </span>
                                                        <span className="text-xs font-medium">
                                                            {sub.officer}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-rows-1 items-center gap-2 lg:flex">
                                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-xs text-muted-foreground">
                                                            Cluster:
                                                        </span>
                                                        <span className="text-xs font-medium">
                                                            {sub.cluster}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-rows-1 items-center gap-2 lg:flex">
                                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-xs text-muted-foreground">
                                                            Submitted:
                                                        </span>
                                                        <span className="text-xs font-medium">
                                                            {formatDateTime(
                                                                sub.submitted_at,
                                                            )}
                                                        </span>
                                                    </div>
                                                    {sub.deadline && (
                                                        <div className="grid grid-rows-1 items-center gap-2 lg:flex">
                                                            <AlertCircle className="h-4 w-4 text-muted-foreground" />
                                                            <span className="text-xs text-muted-foreground">
                                                                Deadline:
                                                            </span>
                                                            <span className="text-xs font-medium">
                                                                {formatDate(
                                                                    sub.deadline,
                                                                )}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <Link
                                                    href={`/focal-person/submissions/${sub.id}`}
                                                    className="rounded-md border px-3 py-1 text-sm text-primary hover:underline"
                                                >
                                                    Review →
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Overdue Reports */}
                        {overdue_reports.length > 0 && (
                            <div className="rounded-xl border border-rose-200 bg-card dark:border-rose-900">
                                <div className="flex items-center justify-between border-b border-rose-200 p-6 dark:border-rose-900">
                                    <div className="items-center gap-3 lg:flex">
                                        <h2 className="mb-1 text-sm font-semibold text-rose-700 lg:mb-0 lg:text-lg dark:text-rose-400">
                                            Overdue Reports
                                        </h2>
                                        <span className="rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                                            {overdue_reports.length} reports
                                        </span>
                                    </div>
                                </div>
                                <div className="divide-y divide-rose-100 dark:divide-rose-900/40">
                                    {overdue_reports.map((report) => (
                                        <div
                                            key={report.id}
                                            className="p-6 transition-colors hover:bg-rose-50/50 dark:hover:bg-rose-950/20"
                                        >
                                            <div className="mb-3 items-start justify-between lg:flex">
                                                <div className="mb-1 flex-1 lg:mb-0">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-4 w-4 text-rose-400" />
                                                        <h3 className="text-sm font-medium lg:text-base">
                                                            {
                                                                report.report_title
                                                            }
                                                        </h3>
                                                    </div>
                                                    <p className="mt-1 text-xs text-muted-foreground lg:text-sm">
                                                        {report.program}
                                                    </p>
                                                </div>
                                                <span className="rounded-full bg-rose-500/10 px-2 py-1 text-xs font-medium text-rose-600 dark:text-rose-400">
                                                    {report.days_overdue}d
                                                    overdue
                                                </span>
                                            </div>
                                            <div className="items-center justify-between lg:flex">
                                                <div className="mb-4 grid grid-cols-2 gap-4 lg:mb-0">
                                                    <div className="grid grid-rows-1 items-center gap-2 lg:flex">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-xs text-muted-foreground">
                                                            Deadline:
                                                        </span>
                                                        <span className="text-xs font-medium text-rose-600 dark:text-rose-400">
                                                            {formatDate(
                                                                report.deadline,
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-rows-1 items-center gap-2 lg:flex">
                                                        <Users className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-xs text-muted-foreground">
                                                            Submitted:
                                                        </span>
                                                        <span className="text-xs font-medium">
                                                            {report.submitted}/
                                                            {
                                                                report.total_officers
                                                            }{' '}
                                                            officers
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="h-1.5 w-full max-w-[120px] overflow-hidden rounded-full bg-rose-100 dark:bg-rose-900/40">
                                                    <div
                                                        className="h-full rounded-full bg-rose-400"
                                                        style={{
                                                            width:
                                                                report.total_officers >
                                                                0
                                                                    ? `${(report.submitted / report.total_officers) * 100}%`
                                                                    : '0%',
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column — 1/3 */}
                    <div className="space-y-6">
                        {/* Recent Activity */}
                        <div className="rounded-xl border bg-card">
                            <div className="border-b p-6">
                                <h2 className="text-sm font-semibold lg:text-lg">
                                    Recent Activity
                                </h2>
                            </div>

                            {recent_activity.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                                    <FileText className="h-10 w-10 text-muted-foreground/30" />
                                    <p className="text-sm text-muted-foreground">
                                        No activity yet
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {recent_activity.map((activity) => {
                                        const badge = getActivityBadge(
                                            activity.type,
                                        );
                                        const Icon = badge.icon;
                                        return (
                                            <div
                                                key={activity.id}
                                                className="p-4 transition-colors hover:bg-muted/50"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div
                                                        className={`rounded-full p-2 ${badge.class}`}
                                                    >
                                                        <Icon className="h-4 w-4" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-medium">
                                                            {
                                                                activity.report_title
                                                            }
                                                        </p>
                                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                                            {activity.program}
                                                        </p>
                                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                                            {activity.officer}
                                                        </p>
                                                        <p className="mt-1 text-xs text-muted-foreground">
                                                            {formatDateTime(
                                                                activity.actioned_at,
                                                            )}
                                                        </p>
                                                    </div>
                                                    <span
                                                        className={`rounded-full px-2 py-1 text-xs font-medium ${badge.class}`}
                                                    >
                                                        {badge.label}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <div className="border-t p-4">
                                <Link
                                    href="/focal-person/submissions"
                                    className="flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                                >
                                    View all submissions
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>

                        {/* Assigned Programs */}
                        <div className="rounded-xl border bg-card">
                            <div className="border-b p-6">
                                <h2 className="flex items-center gap-2 text-sm font-semibold lg:text-lg">
                                    <FolderOpen className="h-4 w-4 lg:h-5 lg:w-5" />
                                    My Programs
                                </h2>
                            </div>

                            {assigned_programs.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                                    <FolderOpen className="h-10 w-10 text-muted-foreground/30" />
                                    <p className="text-sm text-muted-foreground">
                                        No programs assigned
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {assigned_programs.map((program) => (
                                        <Link
                                            key={program.id}
                                            href={`/focal-person/programs/${program.id}`}
                                            className="block p-4 transition-colors hover:bg-muted/50"
                                        >
                                            <div className="mb-2 flex items-start justify-between">
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {program.name}
                                                    </p>
                                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                                        {program.total_reports}{' '}
                                                        reports
                                                    </p>
                                                </div>
                                                {program.pending_count > 0 && (
                                                    <span className="rounded-full bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                                                        {program.pending_count}{' '}
                                                        pending
                                                    </span>
                                                )}
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

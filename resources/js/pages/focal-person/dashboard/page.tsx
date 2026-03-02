//field-officer/dashboard/page.tsx
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
FileText,
Calendar,
Clock,
CheckCircle2,
AlertCircle,
XCircle,
Upload,
Download,
Bell,
ChevronRight,
FolderOpen,
FileCheck,
FileWarning,
FileClock,
BarChart3,
Users,
Building2
} from 'lucide-react';

export const breadcrumbs: BreadcrumbItem[] = [
{
    title: 'Focal Person Dashboard',
    href: '/focal-person/dashboard',
},
];

export default function Dashboard() {
// Mock data based on actual models: Program, Report, ReportSubmission
const stats = [
    {
    title: 'Active Programs',
    value: '6',
    change: '+2 this month',
    icon: FolderOpen,
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    link: '/field-officer/programs'
    },
    {
    title: 'Pending Reports',
    value: '8',
    change: '3 due this week',
    icon: FileClock,
    color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    link: '/field-officer/my-report-submissions?filter=pending'
    },
    {
    title: 'Submitted Reports',
    value: '24',
    change: '12 approved',
    icon: FileCheck,
    color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    link: '/field-officer/my-report-submissions?filter=accepted'
    },
    {
    title: 'Rejected Reports',
    value: '3',
    change: 'Need revision',
    icon: FileWarning,
    color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    link: '/field-officer/my-report-submissions?filter=rejected'
    },
];

const recentPrograms = [
    {
    id: 1,
    name: 'Barangay Development Program',
    description: 'Infrastructure projects for remote barangays',
    reports_count: 8,
    coordinator: 'Maria Santos',
    progress: 75,
    deadline: '2024-03-30'
    },
    {
    id: 2,
    name: 'Disaster Risk Reduction',
    description: 'Emergency preparedness and response training',
    reports_count: 5,
    coordinator: 'Juan Dela Cruz',
    progress: 45,
    deadline: '2024-04-15'
    },
    {
    id: 3,
    name: 'Health & Nutrition Program',
    description: 'Community health initiatives',
    reports_count: 12,
    coordinator: 'Ana Lopez',
    progress: 90,
    deadline: '2024-03-20'
    },
    {
    id: 4,
    name: 'Livelihood Development',
    description: 'Skills training and small business support',
    reports_count: 6,
    coordinator: 'Pedro Reyes',
    progress: 30,
    deadline: '2024-05-01'
    },
];

const pendingReports = [
    {
    id: 1,
    title: 'Monthly Progress Report - February',
    program: 'Barangay Development Program',
    deadline: '2024-02-28',
    final_deadline: '2024-03-05',
    status: 'pending',
    priority: 'high'
    },
    {
    id: 2,
    title: 'Quarterly Financial Statement',
    program: 'Health & Nutrition Program',
    deadline: '2024-03-15',
    final_deadline: '2024-03-20',
    status: 'draft',
    priority: 'medium'
    },
    {
    id: 3,
    title: 'Training Completion Report',
    program: 'Livelihood Development',
    deadline: '2024-03-10',
    final_deadline: '2024-03-15',
    status: 'pending',
    priority: 'high'
    },
    {
    id: 4,
    title: 'Beneficiary Assessment',
    program: 'Disaster Risk Reduction',
    deadline: '2024-03-25',
    final_deadline: '2024-03-30',
    status: 'draft',
    priority: 'low'
    },
];

const recentSubmissions = [
    {
    id: 1,
    report_title: 'January Progress Report',
    program: 'Barangay Development Program',
    submitted_at: '2024-02-15T10:30:00',
    status: 'approved',
    feedback: 'Well documented. All requirements met.'
    },
    {
    id: 2,
    report_title: 'Q1 Financial Report',
    program: 'Health & Nutrition Program',
    submitted_at: '2024-02-14T14:20:00',
    status: 'pending',
    feedback: null
    },
    {
    id: 3,
    report_title: 'Training Needs Assessment',
    program: 'Livelihood Development',
    submitted_at: '2024-02-13T09:15:00',
    status: 'rejected',
    feedback: 'Please include participant demographics and signatures.'
    },
    {
    id: 4,
    report_title: 'Emergency Response Report',
    program: 'Disaster Risk Reduction',
    submitted_at: '2024-02-12T16:45:00',
    status: 'approved',
    feedback: 'Excellent work. Keep it up!'
    },
];

const upcomingDeadlines = [
    {
    id: 1,
    report: 'Monthly Accomplishment Report',
    program: 'Barangay Development Program',
    deadline: '2024-02-28',
    days_left: 2,
    has_template: true
    },
    {
    id: 2,
    report: 'Financial Disbursement Report',
    program: 'Health & Nutrition Program',
    deadline: '2024-03-05',
    days_left: 5,
    has_template: true
    },
    {
    id: 3,
    report: 'Beneficiary List Update',
    program: 'Livelihood Development',
    deadline: '2024-03-10',
    days_left: 10,
    has_template: false
    },
];

const getStatusBadge = (status: string) => {
    const statusConfig = {
    'approved': { class: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', icon: CheckCircle2, label: 'Approved' },
    'pending': { class: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', icon: Clock, label: 'Pending Review' },
    'rejected': { class: 'bg-rose-500/10 text-rose-600 dark:text-rose-400', icon: XCircle, label: 'Rejected' },
    'draft': { class: 'bg-gray-500/10 text-gray-600 dark:text-gray-400', icon: FileText, label: 'Draft' },
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
};

const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
    'high': 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    'medium': 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    'low': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    };
    return priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium;
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
    });
};

const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
    });
};

return (
    <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Field Officer Dashboard" />

        <div className="flex-1 space-y-8 p-6 md:p-8 bg-background">
            {/* Welcome Header */}
            <div className="landing-page relative overflow-hidden rounded-xl border border-border bg-card p-8">
                <div className="relative z-10">
                    <div className="grid grid-rows-1 lg:grid-cols-2">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                                Focal Person Dashboard
                            </h1>
                            <div className="text-muted-foreground mt-1 flex items-center gap-2">
                                <span className='text-xs lg:text-sm'>Welcome back, Focal Person</span>
                                <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                    <Bell className="w-3 h-3" />
                                    3 new notifications
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center lg:justify-end gap-3 mt-5 lg:mt-0">
                            <Link
                                href="/field-officer/programs"
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-xs lg:text-sm font-medium hover:bg-accent transition-colors"
                            >
                                <FolderOpen className="w-4 h-4" />
                                View Programs
                            </Link>
                            <Link
                                href="/field-officer/my-report-submissions"
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs lg:text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                            >
                                <Upload className="w-4 h-4" />
                                New Submission
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Field Officer Dashboard
                    </h1>

                    <div className="text-muted-foreground mt-1 flex items-center gap-2">
                        <span className='text-sm'>Welcome back, Field Officer</span>
                        <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            <Bell className="w-3 h-3" />
                            3 new notifications
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/field-officer/programs"
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-xs lg:text-sm font-medium hover:bg-accent transition-colors"
                    >
                        <FolderOpen className="w-4 h-4" />
                        View Programs
                    </Link>
                    <Link
                        href="/field-officer/my-report-submissions"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs lg:text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                        <Upload className="w-4 h-4" />
                        New Submission
                    </Link>
                </div>
            </div> */}

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Link
                        key={index}
                        href={stat.link}
                        className="group relative overflow-hidden rounded-xl border bg-card p-6 hover:shadow-lg transition-all"
                    >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative">
                            <div className="flex items-center justify-between">
                                <div className={`rounded-lg ${stat.color} p-2.5`}>
                                    <stat.icon className="h-5 w-5" />
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="mt-4">
                                <h3 className="text-2xl font-bold">{stat.value}</h3>
                                <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
                                <p className="text-xs text-muted-foreground/70 mt-2">{stat.change}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Programs & Pending Reports */}
            <div className="lg:col-span-2 space-y-6">
                {/* Active Programs */}
                <div className="rounded-xl border bg-card">
                    <div className="flex items-center justify-between p-6 border-b">
                        <div className="lg:flex items-center gap-3">
                            <h2 className="text-sm lg:text-lg font-semibold mb-1 lg:mb-0">Active Programs</h2>
                            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                {recentPrograms.length} programs
                            </span>
                        </div>
                        <Link
                            href="/field-officer/programs"
                            className="text-xs lg:text-sm text-primary hover:underline flex items-center gap-1"
                        >
                            View all
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="divide-y">
                        {recentPrograms.map((program) => (
                        <div key={program.id} className="p-6 hover:bg-muted/50 transition-colors">
                            <div className="lg:flex items-start justify-between mb-3">
                                <div className='mb-1 lg:mb-0'>
                                    <h3 className="text-sm lg:text-base font-medium flex items-center gap-2">
                                        <Building2 className="w-4 h-4 text-muted-foreground" />
                                        {program.name}
                                    </h3>
                                    <p className="text-xs lg:text-sm text-muted-foreground mt-1">{program.description}</p>
                                </div>
                                <span className="text-xs bg-primary/5 text-primary px-2 py-1 rounded-full">
                                    {program.reports_count} reports
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="grid grid-rows-1 lg:flex items-center gap-2">
                                        <Users className="w-4 h-4 text-muted-foreground" />
                                        <span   className="text-muted-foreground">Coordinator:</span>
                                        <span className="font-medium">{program.coordinator}</span>
                                </div>
                                <div className="grid grid-rows-1 lg:flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Deadline:</span>
                                    <span className="font-medium">{formatDate(program.deadline)}</span>
                                </div>
                            </div>
                            <div className="mt-4">
                            <div className="flex items-center justify-between text-sm mb-2">
                                <span className="text-muted-foreground">Overall Progress</span>
                                <span className="font-medium">{program.progress}%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all"
                                style={{ width: `${program.progress}%` }}
                                />
                            </div>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>

                {/* Pending Reports */}
                <div className="rounded-xl border bg-card">
                    <div className="flex items-center justify-between p-6 border-b">
                        <div className="lg:flex items-center gap-3">
                            <h2 className="text-sm lg:text-lg font-semibold">Reports Due</h2>
                            <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                                {pendingReports.length} pending
                            </span>
                        </div>
                        <Link
                            href="/field-officer/my-report-submissions?filter=pending"
                            className="text-xs lg:text-sm text-primary hover:underline flex items-center gap-1"
                        >
                            View all
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="divide-y">
                        {pendingReports.map((report) => (
                        <div key={report.id} className="p-6 hover:bg-muted/50 transition-colors">
                            <div className="lg:flex items-start justify-between mb-3">
                                <div className="flex-1 mb-1 lg:mb-0">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-muted-foreground" />
                                        <h3 className="text-sm lg:text-base font-medium">{report.title}</h3>
                                    </div>
                                    <p className="text-xs lg:text-sm text-muted-foreground mt-1">{report.program}</p>
                                </div>
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getPriorityBadge(report.priority)}`}>
                                    {report.priority} priority
                                </span>
                            </div>
                            <div className="lg:flex items-center justify-between text-sm">
                                <div className="grid grid-cols-2 gap-4 mb-5 lg:mb-0">
                                    <div className="grid grid-rows-1 lg:flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">Deadline:</span>
                                        <span className="text-xs font-medium">{formatDate(report.deadline)}</span>
                                    </div>
                                    <div className="grid grid-rows-1 lg:flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">Final:</span>
                                        <span className="text-xs font-medium">{formatDate(report.final_deadline)}</span>
                                    </div>
                                </div>
                                <Link
                                    href={`/field-officer/programs/reports/${report.id}`}
                                    className="text-primary hover:underline text-sm border px-3 py-1 rounded-md"
                                >
                                    Submit Report →
                                </Link>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Column - Submissions & Deadlines */}
            <div className="space-y-6">
                {/* Recent Submissions */}
                <div className="rounded-xl border bg-card">
                <div className="p-6 border-b">
                    <h2 className="text-sm lg:text-lg font-semibold">Recent Submissions</h2>
                </div>
                <div className="divide-y">
                    {recentSubmissions.map((submission) => {
                    const status = getStatusBadge(submission.status);
                    const StatusIcon = status.icon;
                    return (
                        <div key={submission.id} className="p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start gap-3">
                            <div className={`rounded-full p-2 ${status.class}`}>
                            <StatusIcon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{submission.report_title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{submission.program}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {formatDateTime(submission.submitted_at)}
                            </p>
                            {submission.feedback && (
                                <p className="text-xs bg-muted p-2 rounded mt-2">
                                <span className="font-medium">Feedback:</span> {submission.feedback}
                                </p>
                            )}
                            </div>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${status.class}`}>
                            {status.label}
                            </span>
                        </div>
                        </div>
                    );
                    })}
                </div>
                <div className="p-4 border-t">
                    <Link
                    href="/field-officer/my-report-submissions"
                    className="text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-1"
                    >
                    View all submissions
                    <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
                </div>

                {/* Upcoming Deadlines */}
                <div className="rounded-xl border bg-card">
                <div className="p-6 border-b">
                    <h2 className="text-sm lg:text-lg font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4 lg:w-5 lg:h-5" />
                    Upcoming Deadlines
                    </h2>
                </div>
                <div className="divide-y">
                    {upcomingDeadlines.map((deadline) => (
                    <div key={deadline.id} className="p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                        <div>
                            <p className="text-sm font-medium">{deadline.report}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{deadline.program}</p>
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            deadline.days_left <= 2
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                            : deadline.days_left <= 5
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        }`}>
                            {deadline.days_left} days left
                        </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                        <span className="text-xs  text-muted-foreground">Due: {formatDate(deadline.deadline)}</span>
                        {deadline.has_template && (
                            <span className="inline-flex items-center gap-1 text-primary">
                            <Download className="w-3 h-3" />
                            Template
                            </span>
                        )}
                        </div>
                    </div>
                    ))}
                </div>
                </div>

                {/* Quick Actions */}
                <div className="rounded-xl border bg-card p-6">
                <h2 className="text-sm lg:text-lg font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-3">
                    <Link
                    href="/field-officer/programs"
                    className="flex flex-col items-center gap-2 p-4 rounded-lg border border-input hover:bg-accent transition-colors group"
                    >
                    <FolderOpen className="w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground group-hover:text-foreground" />
                    <span className="text-xs font-medium">Programs</span>
                    </Link>
                    <Link
                    href="/field-officer/my-report-submissions"
                    className="flex flex-col items-center gap-2 p-4 rounded-lg border border-input hover:bg-accent transition-colors group"
                    >
                    <FileText className="w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground group-hover:text-foreground" />
                    <span className="text-xs font-medium">Submissions</span>
                    </Link>
                    <Link
                    href="/field-officer/notifications"
                    className="flex flex-col items-center gap-2 p-4 rounded-lg border border-input hover:bg-accent transition-colors group"
                    >
                    <Bell className="w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground group-hover:text-foreground" />
                    <span className="text-xs font-medium">Notifications</span>
                    </Link>
                    <button
                    onClick={() => window.print()}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg border border-input hover:bg-accent transition-colors group"
                    >
                    <Download className="w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground group-hover:text-foreground" />
                    <span className="text-xs font-medium">Export</span>
                    </button>
                </div>
                </div>
            </div>
            </div>

            {/* Activity Overview - Optional Section */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border bg-card p-6">
                <div className="flex items-center gap-3 mb-4">
                <div className="rounded-lg bg-blue-500/10 p-2">
                    <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <p className="text-lg lg:text-2xl font-bold">85%</p>
                    <p className="text-xs lg:text-sm text-muted-foreground">Submission Rate</p>
                </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full w-[85%] bg-blue-500 rounded-full" />
                </div>
            </div>

            <div className="rounded-xl border bg-card p-6">
                <div className="flex items-center gap-3 mb-4">
                <div className="rounded-lg bg-emerald-500/10 p-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                    <p className="text-lg lg:text-2xl font-bold">12</p>
                    <p className="text-xs lg:text-sm text-muted-foreground">Approved Reports</p>
                </div>
                </div>
                <p className="text-xs text-muted-foreground">+3 from last month</p>
            </div>

            <div className="rounded-xl border bg-card p-6">
                <div className="flex items-center gap-3 mb-4">
                <div className="rounded-lg bg-amber-500/10 p-2">
                    <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                    <p className="text-lg lg:text-2xl font-bold">8</p>
                    <p className="text-xs lg:text-sm text-muted-foreground">In Review</p>
                </div>
                </div>
                <p className="text-xs text-muted-foreground">Average review time: 3 days</p>
            </div>

            <div className="rounded-xl border bg-card p-6">
                <div className="flex items-center gap-3 mb-4">
                <div className="rounded-lg bg-purple-500/10 p-2">
                    <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                    <p className="text-lg lg:text-2xl font-bold">4</p>
                    <p className="text-xs lg:text-sm text-muted-foreground">Active Programs</p>
                </div>
                </div>
                <p className="text-xs text-muted-foreground">2 ending this month</p>
            </div>
            </div>
        </div>
        </AppLayout>
    );
}

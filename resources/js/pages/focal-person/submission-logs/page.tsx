import AppLayout from '@/layouts/app-layout';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { CheckCircle2, Clock3, Search, XCircle, File, FolderOpen, FileClock, FileCheck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type UserSubmission = {
    id: number;
    name: string;
    email: string;
    submittedAt: string | null;
    cluster: 'm&m' | 'd1';
};

type ReportItem = {
    id: number;
    title: string;
    program: string;
    dueDate: string;
    assignments: UserSubmission[];
};

type ReportFilter = 'all' | 'open' | 'overdue' | 'completed';
type UserStatusFilter = 'all' | 'submitted' | 'not_submitted' | 'late';
type ClusterFilter = 'all' | 'm&m' | 'd1';
const USERS_PER_PAGE = 15;

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Submission Logs',
        href: '/focal-person/submission-logs',
    },
];

const createAssignments = (
    startId: number,
    total: number,
    submittedCount: number,
    dueDate: string,
): UserSubmission[] => {
    const due = new Date(`${dueDate}T00:00:00`);

    return Array.from({ length: total }, (_, index) => {
        const id = startId + index;
        const cluster: 'm&m' | 'd1' = index % 2 === 0 ? 'm&m' : 'd1';
        const isSubmitted = index < submittedCount;
        let submittedAt: string | null = null;

        if (isSubmitted) {
            const submissionDate = new Date(due);
            // Most are on-time; some are late to make statuses realistic.
            const offsetDays = index % 10 === 0 ? 1 : -((index % 5) + 1);
            submissionDate.setDate(due.getDate() + offsetDays);
            submissionDate.setHours(8 + (index % 9), (index * 7) % 60, 0, 0);
            submittedAt = submissionDate.toISOString();
        }

        return {
            id,
            name: `Field Officer ${id}`,
            email: `field.officer${id}@example.com`,
            submittedAt,
            cluster,
        };
    });
};

const mockReports: ReportItem[] = [
    {
        id: 1,
        title: 'Monthly Accomplishment Report - February',
        program: 'Barangay Development Program',
        dueDate: '2026-02-25',
        assignments: createAssignments(1, 70, 58, '2026-02-25'),
    },
    {
        id: 2,
        title: 'Training Completion Report',
        program: 'Disaster Preparedness Training',
        dueDate: '2026-03-03',
        assignments: createAssignments(1001, 64, 52, '2026-03-03'),
    },
    {
        id: 3,
        title: 'Solid Waste Monitoring Report',
        program: 'Environmental Compliance Program',
        dueDate: '2026-03-07',
        assignments: createAssignments(2001, 55, 47, '2026-03-07'),
    },
];

const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

const formatDateTime = (date: string) =>
    new Date(date).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

const getUserStatus = (dueDate: string, submittedAt: string | null) => {
    const due = new Date(dueDate);
    const now = new Date();

    if (submittedAt) {
        return new Date(submittedAt) > due ? 'submitted_late' : 'submitted_on_time';
    }

    return due < now ? 'late' : 'not_submitted';
};

const getReportStatus = (report: ReportItem): ReportFilter => {
    const withStatus = report.assignments.map((user) => getUserStatus(report.dueDate, user.submittedAt));
    const submittedCount = withStatus.filter((s) => s === 'submitted_on_time' || s === 'submitted_late').length;
    const isOverdue = new Date(report.dueDate) < new Date();

    if (submittedCount === report.assignments.length) return 'completed';
    if (isOverdue) return 'overdue';
    return 'open';
};

export default function SubmissionLogs() {
    const [reportSearch, setReportSearch] = useState('');
    const [reportStatusFilter, setReportStatusFilter] = useState<ReportFilter>('all');
    const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userSearch, setUserSearch] = useState('');
    const [userStatusFilter, setUserStatusFilter] = useState<UserStatusFilter>('all');
    const [clusterFilter, setClusterFilter] = useState<ClusterFilter>('all');
    const [userPage, setUserPage] = useState(1);

    const filteredReports = useMemo(() => {
        return mockReports.filter((report) => {
            const matchesSearch =
                report.title.toLowerCase().includes(reportSearch.toLowerCase()) ||
                report.program.toLowerCase().includes(reportSearch.toLowerCase());

            const matchesFilter =
                reportStatusFilter === 'all' || getReportStatus(report) === reportStatusFilter;

            return matchesSearch && matchesFilter;
        });
    }, [reportSearch, reportStatusFilter]);

    const summary = useMemo(() => {
        const reportTotal = filteredReports.length;
        const open = filteredReports.filter((report) => getReportStatus(report) === 'open').length;
        const overdue = filteredReports.filter((report) => getReportStatus(report) === 'overdue').length;
        const completed = filteredReports.filter((report) => getReportStatus(report) === 'completed').length;

        return {
            reportTotal,
            open,
            overdue,
            completed,
        };
    }, [filteredReports]);

    const filteredUsers = useMemo(() => {
        if (!selectedReport) return [];

        return selectedReport.assignments.filter((user) => {
            const status = getUserStatus(selectedReport.dueDate, user.submittedAt);
            const matchesSearch =
                user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                user.email.toLowerCase().includes(userSearch.toLowerCase());

            const matchesStatus =
                userStatusFilter === 'all' ||
                (userStatusFilter === 'submitted' && (status === 'submitted_on_time' || status === 'submitted_late')) ||
                (userStatusFilter === 'not_submitted' && status === 'not_submitted') ||
                (userStatusFilter === 'late' && status === 'late');
            const matchesCluster = clusterFilter === 'all' || user.cluster === clusterFilter;

            return matchesSearch && matchesStatus && matchesCluster;
        });
    }, [clusterFilter, selectedReport, userSearch, userStatusFilter]);

    const totalUserPages = Math.max(1, Math.ceil(filteredUsers.length / USERS_PER_PAGE));
    const paginatedUsers = useMemo(() => {
        const start = (userPage - 1) * USERS_PER_PAGE;
        return filteredUsers.slice(start, start + USERS_PER_PAGE);
    }, [filteredUsers, userPage]);

    useEffect(() => {
        setUserPage(1);
    }, [userSearch, userStatusFilter, clusterFilter, selectedReport]);

    useEffect(() => {
        if (userPage > totalUserPages) {
            setUserPage(totalUserPages);
        }
    }, [totalUserPages, userPage]);

    const openReportModal = (report: ReportItem) => {
        setSelectedReport(report);
        setUserSearch('');
        setUserStatusFilter('all');
        setClusterFilter('all');
        setUserPage(1);
        setIsModalOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Submission Logs" />

            <div className="flex-1 space-y-6 p-6 md:p-8 bg-background">
                <div className="rounded-xl border bg-card p-8">
                    <h1 className="text-xl md:text-2xl font-bold text-foreground">Submission Logs</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Click a report row to open the user submission list and status in a modal.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border bg-card p-4">
                        <div className='p-3 inline-flex rounded-md mb-3 bg-gray-100  dark:bg-[#1e1e1e]'>
                            <File strokeWidth={2} className="w-5 h-5 dark:text-white text-black" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">{summary.reportTotal}</h2>
                        <p className="text-xs lg:text-sm lg:mb-0 text-gray-400 ">Reports</p>
                    </div>
                    <div className="rounded-xl border bg-card p-4">
                        <div className='p-3  inline-flex rounded-md mb-3 bg-[#e6f9f2] dark:bg-[#091c15]'>
                            <FolderOpen strokeWidth={2} className="w-5 h-5 text-emerald-500 " />
                        </div>
                        <h2 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">{summary.open}</h2>
                        <p className="text-xs lg:text-sm lg:mb-0 text-gray-400">Open Reports</p>
                    </div>

                    <div className="rounded-xl border bg-card p-4">
                        <div className='p-3  inline-flex rounded-md mb-3 bg-[#fff5e6] dark:bg-[#221809]'>
                            <FileClock strokeWidth={2} className="w-5 h-5 text-amber-500 " />
                        </div>
                        <h2 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-2">{summary.overdue}</h2>
                        <p className="text-xs lg:text-sm  lg:mb-0 text-gray-400">Overdue Reports</p>

                    </div>
                    <div className="rounded-xl border bg-card p-4">
                        <div className='p-3 inline-flex rounded-md mb-3 bg-[#eaf3ff] dark:bg-[#04243e] '>
                            <FileCheck strokeWidth={2} className="w-5 h-5 text-blue-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">{summary.completed}</h2>
                        <p className="text-xs lg:text-sm lg:mb-0 text-gray-400">Completed Reports</p>
                    </div>
                </div>

                <div className="rounded-xl border bg-card p-4 md:p-6 space-y-4">
                    <div className="grid gap-3 md:grid-cols-2">
                        <div className="relative">
                            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={reportSearch}
                                onChange={(e) => setReportSearch(e.target.value)}
                                placeholder="Search report or program"
                                className="w-full rounded-lg border bg-background pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                            />
                        </div>

                        <select
                            value={reportStatusFilter}
                            onChange={(e) => setReportStatusFilter(e.target.value as ReportFilter)}
                            className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                        >
                            <option value="all">All Report Status</option>
                            <option value="open">Open</option>
                            <option value="overdue">Overdue</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </div>

                <div className="rounded-xl border bg-card overflow-hidden">
                    <div className="border-b px-6 py-4">
                        <h2 className="text-sm md:text-base font-semibold">Report List ({filteredReports.length})</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px]">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="text-left text-xs font-semibold text-muted-foreground px-6 py-3">Report</th>
                                    <th className="text-left text-xs font-semibold text-muted-foreground px-6 py-3">Program</th>
                                    <th className="text-left text-xs font-semibold text-muted-foreground px-6 py-3">Due Date</th>
                                    <th className="text-left text-xs font-semibold text-muted-foreground px-6 py-3">Submitted</th>
                                    <th className="text-left text-xs font-semibold text-muted-foreground px-6 py-3">Report Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReports.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center text-sm text-muted-foreground">
                                            No reports found for selected filters.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredReports.map((report) => {
                                        const submittedCount = report.assignments.filter((u) => u.submittedAt).length;
                                        const reportStatus = getReportStatus(report);

                                        return (
                                            <tr
                                                key={report.id}
                                                onClick={() => openReportModal(report)}
                                                className="border-t hover:bg-muted/40 transition-colors cursor-pointer"
                                                title="View assigned users"
                                            >
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-medium">{report.title}</p>
                                                </td>
                                                <td className="px-6 py-4 text-sm">{report.program}</td>
                                                <td className="px-6 py-4 text-sm">{formatDate(report.dueDate)}</td>
                                                <td className="px-6 py-4 text-sm">
                                                    {submittedCount}/{report.assignments.length}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {reportStatus === 'completed' ? (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 text-xs font-medium">
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                            Completed
                                                        </span>
                                                    ) : reportStatus === 'overdue' ? (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1 text-xs font-medium">
                                                            <Clock3 className="w-3.5 h-3.5" />
                                                            Overdue
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2.5 py-1 text-xs font-medium">
                                                            <XCircle className="w-3.5 h-3.5" />
                                                            Open
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-h-[95vh] w-[95vw] !max-w-4xl !p-0 flex flex-col overflow-hidden">
                    {/* Fixed Header */}
                    <div className="flex-shrink-0 p-6 pb-4 border-b">
                        <DialogHeader>
                            <DialogTitle className='text-left'>{selectedReport ? `Users for: ${selectedReport.title}` : 'Report Users'}</DialogTitle>
                            <DialogDescription className='text-left'>
                                {selectedReport
                                    ? `${selectedReport.program} | Due ${formatDate(selectedReport.dueDate)}`
                                    : 'Click a report to view assigned users.'}
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    {selectedReport && (
                        <>
                            {/* Fixed Filters */}
                            <div className="flex-shrink-0 px-6 py-4 border-b">
                                <div className="grid gap-3 md:grid-cols-3">
                                    <div className="relative">
                                        <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            value={userSearch}
                                            onChange={(e) => setUserSearch(e.target.value)}
                                            placeholder="Search user name or email"
                                            className="w-full rounded-lg border bg-background pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                                        />
                                    </div>
                                    <select
                                        value={userStatusFilter}
                                        onChange={(e) => setUserStatusFilter(e.target.value as UserStatusFilter)}
                                        className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                                    >
                                        <option value="all">All User Status</option>
                                        <option value="submitted">Submitted</option>
                                        <option value="not_submitted">Not Submitted</option>
                                        <option value="late">Late</option>
                                    </select>
                                    <select
                                        value={clusterFilter}
                                        onChange={(e) => setClusterFilter(e.target.value as ClusterFilter)}
                                        className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                                    >
                                        <option value="all">All Clusters</option>
                                        <option value="m&m">M&M</option>
                                        <option value="d1">D1</option>
                                    </select>
                                </div>
                            </div>

                            {/* Scrollable Table */}
                            <div className="flex-1 min-h-0 overflow-y-auto md:min-h-[300px]">
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[700px]">
                                        <thead className="bg-muted/50 sticky top-0 z-10">
                                            <tr>
                                                <th className="text-left text-xs font-semibold text-muted-foreground px-6 py-3">User</th>
                                                <th className="text-left text-xs font-semibold text-muted-foreground px-6 py-3">Cluster</th>
                                                <th className="text-left text-xs font-semibold text-muted-foreground px-6 py-3">Due Date</th>
                                                <th className="text-left text-xs font-semibold text-muted-foreground px-6 py-3">Submitted At</th>
                                                <th className="text-left text-xs font-semibold text-muted-foreground px-6 py-3">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredUsers.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="px-6 py-10 text-center text-sm text-muted-foreground">
                                                        No users found for selected filters.
                                                    </td>
                                                </tr>
                                            ) : (
                                                paginatedUsers.map((user) => {
                                                    const status = getUserStatus(selectedReport.dueDate, user.submittedAt);
                                                    return (
                                                        <tr key={user.id} className="border-t hover:bg-muted/40 transition-colors">
                                                            <td className="px-6 py-2 lg:py-4">
                                                                <p className="text-sm font-medium">{user.name}</p>
                                                                <p className="text-xs text-muted-foreground">{user.email}</p>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm uppercase">{user.cluster}</td>
                                                            <td className="px-6 py-4 text-sm">{formatDate(selectedReport.dueDate)}</td>
                                                            <td className="px-6 py-4 text-sm">
                                                                {user.submittedAt ? formatDateTime(user.submittedAt) : '-'}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {status === 'submitted_on_time' ? (
                                                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 text-xs font-medium">
                                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                                        Submitted
                                                                    </span>
                                                                ) : status === 'submitted_late' ? (
                                                                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2.5 py-1 text-xs font-medium">
                                                                        <Clock3 className="w-3.5 h-3.5" />
                                                                        Submitted Late
                                                                    </span>
                                                                ) : status === 'late' ? (
                                                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1 text-xs font-medium">
                                                                        <Clock3 className="w-3.5 h-3.5" />
                                                                        Late
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 px-2.5 py-1 text-xs font-medium">
                                                                        <XCircle className="w-3.5 h-3.5" />
                                                                        Not Submitted
                                                                    </span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Fixed Footer */}
                            {filteredUsers.length > 0 && (
                                <div className="flex-shrink-0 px-6 py-4 border-t bg-background">
                                    <div className="flex items-center justify-between sm:flex-row sm:items-center sm:justify-between">
                                        <p className="text-xs text-muted-foreground">
                                            Showing {(userPage - 1) * USERS_PER_PAGE + 1}-
                                            {Math.min(userPage * USERS_PER_PAGE, filteredUsers.length)} of {filteredUsers.length}
                                        </p>
                                        <div className="flex items-center gap-2 self-start sm:self-auto">
                                            <button
                                                type="button"
                                                onClick={() => setUserPage((prev) => Math.max(1, prev - 1))}
                                                disabled={userPage === 1}
                                                className="rounded-md border px-3 py-1.5 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Previous
                                            </button>
                                            <span className="text-xs text-muted-foreground">
                                                Page {userPage} of {totalUserPages}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => setUserPage((prev) => Math.min(totalUserPages, prev + 1))}
                                                disabled={userPage === totalUserPages}
                                                className="rounded-md border px-3 py-1.5 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

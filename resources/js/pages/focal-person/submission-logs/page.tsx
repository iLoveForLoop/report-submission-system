// focal-person/submission-logs/page.tsx
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    Clock3,
    File,
    FileCheck,
    FileClock,
    FolderOpen,
    RotateCcw,
    Search,
    XCircle,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type OfficerStatus =
    | 'submitted_on_time'
    | 'submitted_late'
    | 'pending' // submitted but awaiting focal review
    | 'returned' // focal person returned it
    | 'not_submitted'; // never submitted

type ReportStatus = 'open' | 'overdue' | 'completed';
type ReportStatusFilter = 'all' | ReportStatus;
type OfficerStatusFilter =
    | 'all'
    | 'submitted'
    | 'pending'
    | 'returned'
    | 'not_submitted';
type ClusterFilter = 'all' | 'M&M' | "D'ONE";

interface OfficerRow {
    id: number;
    name: string;
    email: string;
    cluster: string;
    submitted_at: string | null;
    reviewed_at: string | null;
    status: OfficerStatus;
    submission_status?: 'pending' | 'approved' | 'returned';
}

interface ReportItem {
    id: number;
    title: string;
    program: string;
    deadline: string | null;
    final_deadline: string | null;
    submitted_count: number;
    total_officers: number;
    report_status: ReportStatus;
    officers: OfficerRow[];
}

interface Summary {
    total: number;
    open: number;
    overdue: number;
    completed: number;
}

interface PageProps {
    reports: ReportItem[];
    summary: Summary;
}

const OFFICERS_PER_PAGE = 15;

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Submission Logs', href: '/focal-person/submission-logs' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (value: string | null) => {
    if (!value) return '—';
    return new Date(value).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

const formatDateTime = (value: string | null) => {
    if (!value) return '—';
    return new Date(value).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

// ─── Status badge configs ─────────────────────────────────────────────────────

const REPORT_STATUS_CONFIG: Record<
    ReportStatus,
    { label: string; className: string; icon: React.ElementType }
> = {
    completed: {
        label: 'Completed',
        className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        icon: CheckCircle2,
    },
    overdue: {
        label: 'Overdue',
        className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        icon: Clock3,
    },
    open: {
        label: 'Open',
        className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
        icon: FolderOpen,
    },
};

const OFFICER_STATUS_CONFIG: Record<
    OfficerStatus,
    { label: string; className: string; icon: React.ElementType }
> = {
    submitted_on_time: {
        label: 'Submitted',
        className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        icon: CheckCircle2,
    },
    submitted_late: {
        label: 'Submitted Late',
        className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
        icon: Clock3,
    },
    pending: {
        label: 'Pending Review',
        className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        icon: Clock3,
    },
    returned: {
        label: 'Returned',
        className: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
        icon: RotateCcw,
    },
    not_submitted: {
        label: 'Not Submitted',
        className: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
        icon: XCircle,
    },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function ReportStatusBadge({ status }: { status: ReportStatus }) {
    const cfg = REPORT_STATUS_CONFIG[status];
    const Icon = cfg.icon;
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${cfg.className}`}
        >
            <Icon className="h-3.5 w-3.5" />
            {cfg.label}
        </span>
    );
}

function OfficerStatusBadge({ status }: { status: OfficerStatus }) {
    const cfg = OFFICER_STATUS_CONFIG[status];
    const Icon = cfg.icon;
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${cfg.className}`}
        >
            <Icon className="h-3.5 w-3.5" />
            {cfg.label}
        </span>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SubmissionLogs() {
    const { reports, summary } = usePage<{ props: PageProps }>()
        .props as unknown as PageProps;

    // Report-level filters
    const [reportSearch, setReportSearch] = useState('');
    const [reportStatusFilter, setReportStatusFilter] =
        useState<ReportStatusFilter>('all');

    // Modal state
    const [selectedReport, setSelectedReport] = useState<ReportItem | null>(
        null,
    );
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Officer-level filters (inside modal)
    const [officerSearch, setOfficerSearch] = useState('');
    const [officerStatusFilter, setOfficerStatusFilter] =
        useState<OfficerStatusFilter>('all');
    const [clusterFilter, setClusterFilter] = useState<ClusterFilter>('all');
    const [officerPage, setOfficerPage] = useState(1);

    // ── Report filtering ──────────────────────────────────────────────────────

    const filteredReports = useMemo(() => {
        return reports.filter((report) => {
            const matchesSearch =
                report.title
                    .toLowerCase()
                    .includes(reportSearch.toLowerCase()) ||
                report.program
                    .toLowerCase()
                    .includes(reportSearch.toLowerCase());

            const matchesStatus =
                reportStatusFilter === 'all' ||
                report.report_status === reportStatusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [reports, reportSearch, reportStatusFilter]);

    // ── Officer filtering (inside modal) ──────────────────────────────────────

    const filteredOfficers = useMemo(() => {
        if (!selectedReport) return [];

        return selectedReport.officers.filter((officer) => {
            const matchesSearch =
                officer.name
                    .toLowerCase()
                    .includes(officerSearch.toLowerCase()) ||
                officer.email
                    .toLowerCase()
                    .includes(officerSearch.toLowerCase());

            const matchesStatus = (() => {
                if (officerStatusFilter === 'all') return true;
                if (officerStatusFilter === 'submitted') {
                    return (
                        officer.status === 'submitted_on_time' ||
                        officer.status === 'submitted_late'
                    );
                }
                return officer.status === officerStatusFilter;
            })();

            const matchesCluster =
                clusterFilter === 'all' || officer.cluster === clusterFilter;

            return matchesSearch && matchesStatus && matchesCluster;
        });
    }, [selectedReport, officerSearch, officerStatusFilter, clusterFilter]);

    const totalOfficerPages = Math.max(
        1,
        Math.ceil(filteredOfficers.length / OFFICERS_PER_PAGE),
    );

    const paginatedOfficers = useMemo(() => {
        const start = (officerPage - 1) * OFFICERS_PER_PAGE;
        return filteredOfficers.slice(start, start + OFFICERS_PER_PAGE);
    }, [filteredOfficers, officerPage]);

    // Reset page on filter change
    useEffect(() => {
        setOfficerPage(1);
    }, [officerSearch, officerStatusFilter, clusterFilter, selectedReport]);
    useEffect(() => {
        if (officerPage > totalOfficerPages) setOfficerPage(totalOfficerPages);
    }, [totalOfficerPages, officerPage]);

    const openModal = (report: ReportItem) => {
        setSelectedReport(report);
        setOfficerSearch('');
        setOfficerStatusFilter('all');
        setClusterFilter('all');
        setOfficerPage(1);
        setIsModalOpen(true);
    };

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Submission Logs" />

            <div className="flex-1 space-y-6 bg-background p-6 md:p-8">
                {/* Header */}
                <div className="rounded-xl border bg-card p-8">
                    <h1 className="text-xl font-bold text-foreground md:text-2xl">
                        Submission Logs
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Click a report row to see the submission status of all
                        field officers.
                    </p>
                </div>

                {/* Summary cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border bg-card p-4">
                        <div className="mb-3 inline-flex rounded-md bg-muted p-3">
                            <File className="h-5 w-5" />
                        </div>
                        <h2 className="mb-2 text-2xl font-bold">
                            {summary.total}
                        </h2>
                        <p className="text-xs text-muted-foreground lg:text-sm">
                            Total Reports
                        </p>
                    </div>
                    <div className="rounded-xl border bg-card p-4">
                        <div className="mb-3 inline-flex rounded-md bg-emerald-500/10 p-3">
                            <FolderOpen className="h-5 w-5 text-emerald-500" />
                        </div>
                        <h2 className="mb-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                            {summary.open}
                        </h2>
                        <p className="text-xs text-muted-foreground lg:text-sm">
                            Open Reports
                        </p>
                    </div>
                    <div className="rounded-xl border bg-card p-4">
                        <div className="mb-3 inline-flex rounded-md bg-amber-500/10 p-3">
                            <FileClock className="h-5 w-5 text-amber-500" />
                        </div>
                        <h2 className="mb-2 text-2xl font-bold text-amber-600 dark:text-amber-400">
                            {summary.overdue}
                        </h2>
                        <p className="text-xs text-muted-foreground lg:text-sm">
                            Overdue Reports
                        </p>
                    </div>
                    <div className="rounded-xl border bg-card p-4">
                        <div className="mb-3 inline-flex rounded-md bg-blue-500/10 p-3">
                            <FileCheck className="h-5 w-5 text-blue-500" />
                        </div>
                        <h2 className="mb-2 text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {summary.completed}
                        </h2>
                        <p className="text-xs text-muted-foreground lg:text-sm">
                            Completed Reports
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="rounded-xl border bg-card p-4 md:p-6">
                    <div className="grid gap-3 md:grid-cols-2">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                value={reportSearch}
                                onChange={(e) =>
                                    setReportSearch(e.target.value)
                                }
                                placeholder="Search by report title or program…"
                                className="w-full rounded-lg border bg-background py-2 pr-3 pl-9 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                            />
                        </div>
                        <select
                            value={reportStatusFilter}
                            onChange={(e) =>
                                setReportStatusFilter(
                                    e.target.value as ReportStatusFilter,
                                )
                            }
                            className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                        >
                            <option value="all">All Report Statuses</option>
                            <option value="open">Open</option>
                            <option value="overdue">Overdue</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </div>

                {/* Reports table */}
                <div className="overflow-hidden rounded-xl border bg-card">
                    <div className="border-b px-6 py-4">
                        <h2 className="text-sm font-semibold md:text-base">
                            Report List ({filteredReports.length})
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px]">
                            <thead className="bg-muted/50">
                                <tr>
                                    {[
                                        'Report',
                                        'Program',
                                        'Deadline',
                                        'Submitted',
                                        'Status',
                                    ].map((h) => (
                                        <th
                                            key={h}
                                            className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReports.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-6 py-10 text-center text-sm text-muted-foreground"
                                        >
                                            No reports found for the selected
                                            filters.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredReports.map((report) => (
                                        <tr
                                            key={report.id}
                                            onClick={() => openModal(report)}
                                            className="cursor-pointer border-t transition-colors hover:bg-muted/40"
                                            title="Click to view officer submissions"
                                        >
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-medium">
                                                    {report.title}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground">
                                                {report.program}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {formatDate(report.deadline)}
                                                {report.final_deadline && (
                                                    <p className="text-xs text-muted-foreground">
                                                        Final:{' '}
                                                        {formatDate(
                                                            report.final_deadline,
                                                        )}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className="font-medium">
                                                    {report.submitted_count}
                                                </span>
                                                <span className="text-muted-foreground">
                                                    /{report.total_officers}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <ReportStatusBadge
                                                    status={
                                                        report.report_status
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ── Officer detail modal ─────────────────────────────────────── */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="flex max-h-[95vh] w-[95vw] !max-w-4xl flex-col overflow-hidden !p-0">
                    {/* Fixed header */}
                    <div className="flex-shrink-0 border-b p-6 pb-4">
                        <DialogHeader>
                            <DialogTitle className="text-left">
                                {selectedReport?.title ?? 'Report'}
                            </DialogTitle>
                            <DialogDescription className="text-left">
                                {selectedReport
                                    ? `${selectedReport.program} · Due ${formatDate(selectedReport.deadline)}`
                                    : ''}
                            </DialogDescription>
                        </DialogHeader>

                        {/* Quick stats inside modal */}
                        {selectedReport &&
                            (() => {
                                const counts = selectedReport.officers.reduce(
                                    (acc, o) => {
                                        if (
                                            o.status === 'submitted_on_time' ||
                                            o.status === 'submitted_late'
                                        )
                                            acc.submitted++;
                                        else if (o.status === 'pending')
                                            acc.pending++;
                                        else if (o.status === 'returned')
                                            acc.returned++;
                                        else acc.not_submitted++;
                                        return acc;
                                    },
                                    {
                                        submitted: 0,
                                        pending: 0,
                                        returned: 0,
                                        not_submitted: 0,
                                    },
                                );

                                return (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                            {counts.submitted} submitted
                                        </span>
                                        <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                                            {counts.pending} pending review
                                        </span>
                                        <span className="rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-600 dark:text-rose-400">
                                            {counts.returned} returned
                                        </span>
                                        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                            {counts.not_submitted} not submitted
                                        </span>
                                    </div>
                                );
                            })()}
                    </div>

                    {selectedReport && (
                        <>
                            {/* Fixed filters */}
                            <div className="flex-shrink-0 border-b px-6 py-4">
                                <div className="grid gap-3 md:grid-cols-3">
                                    <div className="relative">
                                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <input
                                            type="text"
                                            value={officerSearch}
                                            onChange={(e) =>
                                                setOfficerSearch(e.target.value)
                                            }
                                            placeholder="Search officer name or email…"
                                            className="w-full rounded-lg border bg-background py-2 pr-3 pl-9 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                                        />
                                    </div>
                                    <select
                                        value={officerStatusFilter}
                                        onChange={(e) =>
                                            setOfficerStatusFilter(
                                                e.target
                                                    .value as OfficerStatusFilter,
                                            )
                                        }
                                        className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                                    >
                                        <option value="all">
                                            All Statuses
                                        </option>
                                        <option value="submitted">
                                            Submitted
                                        </option>
                                        <option value="pending">
                                            Pending Review
                                        </option>
                                        <option value="returned">
                                            Returned
                                        </option>
                                        <option value="not_submitted">
                                            Not Submitted
                                        </option>
                                    </select>
                                    <select
                                        value={clusterFilter}
                                        onChange={(e) =>
                                            setClusterFilter(
                                                e.target.value as ClusterFilter,
                                            )
                                        }
                                        className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                                    >
                                        <option value="all">
                                            All Clusters
                                        </option>
                                        <option value="M&M">M&M</option>
                                        <option value="D'ONE">D'ONE</option>
                                    </select>
                                </div>
                            </div>

                            {/* Scrollable table */}
                            <div className="min-h-0 flex-1 overflow-y-auto md:min-h-[300px]">
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[700px]">
                                        <thead className="sticky top-0 z-10 bg-muted/50">
                                            <tr>
                                                {[
                                                    'Officer',
                                                    'Cluster',
                                                    'Submitted At',
                                                    'Reviewed At',
                                                    'Status',
                                                ].map((h) => (
                                                    <th
                                                        key={h}
                                                        className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground"
                                                    >
                                                        {h}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredOfficers.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan={5}
                                                        className="px-6 py-10 text-center text-sm text-muted-foreground"
                                                    >
                                                        No officers match the
                                                        selected filters.
                                                    </td>
                                                </tr>
                                            ) : (
                                                paginatedOfficers.map(
                                                    (officer) => (
                                                        <tr
                                                            key={officer.id}
                                                            className="border-t transition-colors hover:bg-muted/40"
                                                        >
                                                            <td className="px-6 py-3 lg:py-4">
                                                                <p className="text-sm font-medium">
                                                                    {
                                                                        officer.name
                                                                    }
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {
                                                                        officer.email
                                                                    }
                                                                </p>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm uppercase">
                                                                {officer.cluster ??
                                                                    '—'}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm">
                                                                {formatDateTime(
                                                                    officer.submitted_at,
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm">
                                                                {formatDateTime(
                                                                    officer.reviewed_at,
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <OfficerStatusBadge
                                                                    status={
                                                                        officer.status
                                                                    }
                                                                />
                                                            </td>
                                                        </tr>
                                                    ),
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Fixed footer — pagination */}
                            {filteredOfficers.length > OFFICERS_PER_PAGE && (
                                <div className="flex-shrink-0 border-t bg-background px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-muted-foreground">
                                            Showing{' '}
                                            {(officerPage - 1) *
                                                OFFICERS_PER_PAGE +
                                                1}
                                            –
                                            {Math.min(
                                                officerPage * OFFICERS_PER_PAGE,
                                                filteredOfficers.length,
                                            )}{' '}
                                            of {filteredOfficers.length}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setOfficerPage((p) =>
                                                        Math.max(1, p - 1),
                                                    )
                                                }
                                                disabled={officerPage === 1}
                                                className="rounded-md border px-3 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                Previous
                                            </button>
                                            <span className="text-xs text-muted-foreground">
                                                Page {officerPage} of{' '}
                                                {totalOfficerPages}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setOfficerPage((p) =>
                                                        Math.min(
                                                            totalOfficerPages,
                                                            p + 1,
                                                        ),
                                                    )
                                                }
                                                disabled={
                                                    officerPage ===
                                                    totalOfficerPages
                                                }
                                                className="rounded-md border px-3 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-50"
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

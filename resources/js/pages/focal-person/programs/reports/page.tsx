import ViewController from '@/actions/App/Http/Controllers/FocalPerson/ViewController';
import Back from '@/components/back';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Program, Report } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    ClipboardCheck,
    Clock,
    EllipsisVertical,
    FileText,
    Folder,
    Users,
} from 'lucide-react';
import { Activity, useState } from 'react';
import EmptyReport from '../components/empty-report';
import ReportDialog from './components/report-dialog';

// ── Extended Report type for this page ──────────────────────────────────────

interface ReportWithCounts extends Report {
    submitted_count: number; // submissions with status = 'submitted'
    total_count: number; // total assigned field officers
    accepted_count: number; // submissions with status = 'accepted'
}

// ── Submission Progress Chip ─────────────────────────────────────────────────

interface SubmissionChipProps {
    submitted: number;
    total: number;
    accepted: number;
}

function SubmissionChip({ submitted, total, accepted }: SubmissionChipProps) {
    // Nothing assigned yet — don't show a chip
    if (total === 0) return null;

    const allDone = submitted + accepted >= total;
    const hasPending = submitted > 0;
    const progressPct = Math.round(((submitted + accepted) / total) * 100);

    if (allDone && accepted === total) {
        // Every submission has been accepted — fully reviewed
        return (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:ring-emerald-800">
                <CheckCircle2 className="h-3 w-3" />
                All reviewed
            </span>
        );
    }

    if (hasPending) {
        // There are submissions waiting for focal person action
        return (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-violet-50 px-2 py-1 text-xs font-medium text-violet-700 ring-1 ring-violet-200 dark:bg-violet-950/30 dark:text-violet-400 dark:ring-violet-800">
                <ClipboardCheck className="h-3 w-3" />
                {submitted} to review
            </span>
        );
    }

    // Submissions exist but none are in "submitted" state yet
    return (
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-500 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700">
            <Clock className="h-3 w-3" />
            {progressPct}% submitted
        </span>
    );
}

// ── Progress Bar ─────────────────────────────────────────────────────────────

interface ProgressBarProps {
    submitted: number;
    accepted: number;
    total: number;
}

function SubmissionProgressBar({
    submitted,
    accepted,
    total,
}: ProgressBarProps) {
    if (total === 0) return null;

    const acceptedPct = Math.round((accepted / total) * 100);
    const submittedPct = Math.round((submitted / total) * 100);

    return (
        <div className="mt-3 space-y-1">
            {/* Bar */}
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                {/* Accepted portion — emerald */}
                <div
                    className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                    style={{ width: `${acceptedPct + submittedPct}%` }}
                >
                    {/* Submitted (not yet accepted) overlaid as violet at the leading edge */}
                    <div
                        className="ml-auto h-full rounded-full bg-violet-400"
                        style={{
                            width:
                                acceptedPct + submittedPct > 0
                                    ? `${Math.round((submitted / (submitted + accepted || 1)) * 100)}%`
                                    : '0%',
                        }}
                    />
                </div>
            </div>

            {/* Label */}
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {submitted + accepted} / {total} submitted
                </span>
                {accepted > 0 && (
                    <span className="text-emerald-600 dark:text-emerald-400">
                        {accepted} accepted
                    </span>
                )}
            </div>
        </div>
    );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function CreateReport() {
    const [open, setOpen] = useState<boolean>(false);

    const { program, reports } = usePage<{
        program: Program;
        reports: ReportWithCounts[];
    }>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `Programs/${program.name}/Reports`,
            href: ViewController.reports(program).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Back link={ViewController.programs()} />

                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold lg:text-xl">
                        {program.name}
                    </h1>
                    <ReportDialog
                        program={program}
                        open={open}
                        setOpen={setOpen}
                    />
                </div>

                {/* Empty state */}
                <Activity mode={reports.length === 0 ? 'visible' : 'hidden'}>
                    <EmptyReport setIsOpen={setOpen} />
                </Activity>

                <Activity mode={reports.length > 0 ? 'visible' : 'hidden'}>
                    {/* Summary banner — only visible when submissions need review */}

                    <div className="grid grid-rows-1 gap-3 lg:grid-cols-3">
                        {reports.map((report, index) => {
                            const hasPending = report.submitted_count > 0;
                            const hasAny = report.total_count > 0;

                            return (
                                <Link
                                    href={ViewController.reportSubmissions([
                                        program,
                                        report,
                                    ])}
                                    key={index}
                                    className={`group flex flex-col rounded-xl border bg-background/50 px-4 py-3 transition-all hover:shadow-md ${
                                        hasPending
                                            ? 'border-violet-200 hover:border-violet-300 dark:border-violet-800'
                                            : 'hover:border-primary/20'
                                    }`}
                                >
                                    {/* Top row: icon + title + actions */}
                                    <div className="flex items-start gap-3">
                                        {/* Folder icon — tinted violet when there's pending work */}
                                        <div
                                            className={`mt-0.5 rounded-md p-2 transition-colors ${
                                                hasPending
                                                    ? 'bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400'
                                                    : 'bg-muted text-muted-foreground'
                                            }`}
                                        >
                                            <Folder className="h-4 w-4" />
                                        </div>

                                        <div className="flex min-w-0 flex-1 flex-col">
                                            {/* Title + chip on same line */}
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h2 className="truncate text-sm font-semibold text-foreground">
                                                    {report.title}
                                                </h2>
                                                <SubmissionChip
                                                    submitted={
                                                        report.submitted_count
                                                    }
                                                    total={report.total_count}
                                                    accepted={
                                                        report.accepted_count
                                                    }
                                                />
                                            </div>

                                            {/* Deadline */}
                                            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                                                <FileText className="h-3 w-3 shrink-0" />
                                                Deadline:{' '}
                                                {new Date(
                                                    report.deadline ??
                                                        report.created_at,
                                                ).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        </div>

                                        {/* Ellipsis menu */}
                                        <button
                                            onClick={(e) => e.preventDefault()}
                                            className="shrink-0 rounded p-1 opacity-0 transition-all group-hover:opacity-100 hover:bg-accent"
                                        >
                                            <EllipsisVertical className="h-4 w-4 text-muted-foreground" />
                                        </button>
                                    </div>

                                    {/* Progress bar — only when there are assigned field officers */}
                                    {hasAny && (
                                        <SubmissionProgressBar
                                            submitted={report.submitted_count}
                                            accepted={report.accepted_count}
                                            total={report.total_count}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </Activity>
            </div>
        </AppLayout>
    );
}

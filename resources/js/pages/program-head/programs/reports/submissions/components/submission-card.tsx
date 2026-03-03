import { Media, ReportSubmission } from '@/types';
import {
    ChevronDown,
    Download,
    Eye,
    File,
    FileSpreadsheet,
    FileText,
    Image,
} from 'lucide-react';
import { useState } from 'react';

const STATUS_CONFIG: Record<
    ReportSubmission['status'],
    { label: string; badge: string; dot: string }
> = {
    draft: {
        label: 'Draft',
        badge: 'bg-[var(--muted)] text-[var(--muted-foreground)] border border-[var(--border)]',
        dot: 'bg-[var(--muted-foreground)]',
    },
    submitted: {
        label: 'Submitted',
        badge: 'bg-blue-50 text-blue-600 border border-blue-100',
        dot: 'bg-blue-400',
    },
    accepted: {
        label: 'Accepted',
        badge: 'bg-green-50 text-green-700 border border-green-100',
        dot: 'bg-green-400',
    },
    returned: {
        label: 'Returned',
        badge: 'bg-red-50 text-red-600 border border-red-100',
        dot: 'bg-red-400',
    },
};

const TIMELINESS_CONFIG = {
    early: { label: 'Early', icon: '↑', cls: 'text-cyan-600' },
    on_time: { label: 'On Time', icon: '✓', cls: 'text-green-600' },
    late: { label: 'Late', icon: '↓', cls: 'text-red-600' },
} as const;

function formatBytes(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr: string) {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(dateStr));
}

function getFileIcon(mimeType: string) {
    if (mimeType.includes('word') || mimeType.includes('document'))
        return FileText;
    if (mimeType.includes('pdf')) return FileText;
    if (mimeType.includes('sheet') || mimeType.includes('excel'))
        return FileSpreadsheet;
    if (mimeType.includes('image')) return Image;
    return File;
}

function StatusBadge({ status }: { status: ReportSubmission['status'] }) {
    const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.submitted;
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide ${cfg.badge}`}
        >
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${cfg.dot}`} />
            {cfg.label}
        </span>
    );
}

export default function SubmissionCard({
    submission,
}: {
    submission: ReportSubmission;
}) {
    const [expanded, setExpanded] = useState(false);
    const timeliness = submission.timeliness
        ? (TIMELINESS_CONFIG[
              submission.timeliness as keyof typeof TIMELINESS_CONFIG
          ] ?? null)
        : null;

    const media: Media[] = submission.media ?? [];

    return (
        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            {/* Card Header */}
            <div
                className={`flex items-start justify-between gap-3 px-5 py-4 ${expanded ? 'border-b border-[var(--border)]' : ''}`}
            >
                {/* Left: Officer info */}
                <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center gap-2.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 text-sm font-bold text-white">
                            {submission.field_officer?.first_name?.[0] ??
                                '?'}{' '}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-[var(--foreground)]">
                                {submission.field_officer?.name ??
                                    'Unknown Officer'}
                            </p>
                            {submission.field_officer?.employee_code && (
                                <p className="text-xs text-[var(--muted-foreground)]">
                                    {submission.field_officer.employee_code}
                                </p>
                            )}
                        </div>
                    </div>
                    <p className="mb-1 font-mono text-xs text-[var(--muted-foreground)]">
                        #{submission.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                        Submitted {formatDate(submission.created_at)}
                    </p>
                </div>

                {/* Right: Status & Timeliness */}
                <div className="flex flex-col items-end gap-2">
                    <StatusBadge status={submission.status} />
                    {timeliness && (
                        <span
                            className={`flex items-center gap-1 text-xs font-semibold ${timeliness.cls}`}
                        >
                            {timeliness.icon} {timeliness.label}
                        </span>
                    )}
                </div>
            </div>

            {/* Attachments */}
            {media.length > 0 && (
                <div className="border-b border-[var(--border)] px-5 py-3">
                    <p className="mb-2 text-xs font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                        Attachments ({media.length})
                    </p>
                    <div className="flex flex-col gap-1.5">
                        {media.map((file) => {
                            const FileIcon = getFileIcon(file.mime_type);
                            return (
                                <a
                                    key={file.id}
                                    href={file.original_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2.5 rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 no-underline transition-colors hover:bg-[var(--accent)]"
                                >
                                    <FileIcon className="h-5 w-5 text-[var(--foreground)]" />
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-[var(--foreground)]">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-[var(--muted-foreground)]">
                                            {formatBytes(file.size)}
                                        </p>
                                    </div>
                                    {/* View and Download buttons */}
                                    <div className="flex shrink-0 items-center gap-1.5">
                                        <span
                                            onClick={(e) => {
                                                e.preventDefault();
                                                window.open(
                                                    file.original_url,
                                                    '_blank',
                                                );
                                            }}
                                            className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-xs font-medium text-[var(--foreground)] transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                                        >
                                            <Eye className="h-3 w-3" />
                                            View
                                        </span>
                                        <span
                                            onClick={(e) => {
                                                e.preventDefault();
                                                const link =
                                                    document.createElement('a');
                                                link.href = file.original_url;
                                                link.download = file.file_name;
                                                link.click();
                                            }}
                                            className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-xs font-medium text-[var(--foreground)] transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                                        >
                                            <Download className="h-3 w-3" />
                                            Download
                                        </span>
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-2.5">
                <span className="text-xs text-[var(--muted-foreground)]">
                    Report ID: {submission.report_id.slice(0, 8).toUpperCase()}
                </span>
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="flex cursor-pointer items-center gap-1 rounded-md border-none bg-transparent px-2 py-1 text-xs font-medium text-indigo-500 transition-colors hover:bg-indigo-50"
                >
                    {expanded ? 'Less' : 'Details'}
                    <ChevronDown
                        className={`h-3 w-3 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                    />
                </button>
            </div>

            {/* Expanded Details */}
            {expanded && (
                <div className="border-t border-[var(--border)] px-5 pt-3 pb-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <p className="mb-1 text-xs font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                                Description
                            </p>
                            <p className="text-sm text-[var(--foreground)]">
                                {submission.description ?? (
                                    <em className="text-[var(--muted-foreground)]">
                                        None
                                    </em>
                                )}
                            </p>
                        </div>
                        <div>
                            <p className="mb-1 text-xs font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                                Remarks
                            </p>
                            <p className="text-sm text-[var(--foreground)]">
                                {submission.remarks ?? (
                                    <em className="text-[var(--muted-foreground)]">
                                        None
                                    </em>
                                )}
                            </p>
                        </div>
                        <div>
                            <p className="mb-1 text-xs font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                                Last Updated
                            </p>
                            <p className="text-sm text-[var(--foreground)]">
                                {formatDate(submission.updated_at)}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// components/report-card-parts.tsx
// Shared between GridView and ListView — do not import React here,
// each consumer file handles its own imports.

import { CheckCircle2, ClipboardCheck, Clock, Users } from 'lucide-react';

export interface ReportWithCounts {
    id: number;
    title: string;
    deadline: string | null;
    created_at: string;
    submitted_count: number;
    total_count: number;
    accepted_count: number;
}

export const formatDate = (value: string) =>
    new Date(value).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

export function SubmissionChip({
    submitted,
    total,
    accepted,
}: {
    submitted: number;
    total: number;
    accepted: number;
}) {
    if (total === 0) return null;

    if (accepted === total) {
        return (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:ring-emerald-800">
                <CheckCircle2 className="h-3 w-3" />
                All reviewed
            </span>
        );
    }
    if (submitted > 0) {
        return (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-violet-50 px-2 py-1 text-xs font-medium text-violet-700 ring-1 ring-violet-200 dark:bg-violet-950/30 dark:text-violet-400 dark:ring-violet-800">
                <ClipboardCheck className="h-3 w-3" />
                {submitted} to review
            </span>
        );
    }

    const pct = Math.round(((submitted + accepted) / total) * 100);
    return (
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-500 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700">
            <Clock className="h-3 w-3" />
            {pct}% submitted
        </span>
    );
}

export function SubmissionProgressBar({
    submitted,
    accepted,
    total,
}: {
    submitted: number;
    accepted: number;
    total: number;
}) {
    if (total === 0) return null;

    const acceptedPct = Math.round((accepted / total) * 100);
    const submittedPct = Math.round((submitted / total) * 100);

    return (
        <div className="mt-3 space-y-1">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                    className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                    style={{ width: `${acceptedPct + submittedPct}%` }}
                >
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

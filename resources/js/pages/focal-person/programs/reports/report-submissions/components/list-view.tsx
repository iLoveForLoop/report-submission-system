import { ReportSubmission } from '@/types';
import { EllipsisVertical, File } from 'lucide-react';

export default function ListView({
    reportSubmissions,
}: {
    reportSubmissions: ReportSubmission[];
}) {
    return (
        <div className="space-y-2">
            {reportSubmissions.map((submission) => (
                <div
                    key={submission.id}
                    className="group flex items-center gap-4 rounded-lg border border-border bg-background px-4 py-3 transition hover:bg-muted/40"
                >
                    {/* File Icon */}
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                        <File className="h-5 w-5 text-muted-foreground" />
                    </div>

                    {/* Main Content */}
                    <div className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-sm font-medium">
                            {submission.media?.[0]?.name ?? 'Untitled file'}
                        </span>

                        <span className="text-xs text-muted-foreground">
                            {submission.field_officer?.name} • Submitted{' '}
                            {new Date(submission.created_at).toLocaleDateString(
                                'en-US',
                                {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                },
                            )}
                        </span>
                    </div>

                    {/* Actions */}
                    <button
                        className="rounded-full p-2 text-muted-foreground opacity-0 transition group-hover:opacity-100 hover:bg-muted"
                        aria-label="More actions"
                    >
                        <EllipsisVertical className="h-4 w-4" />
                    </button>
                </div>
            ))}
        </div>
    );
}

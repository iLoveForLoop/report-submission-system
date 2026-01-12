import { Button } from '@/components/ui/button';
import { ReportSubmission } from '@/types';
import { EllipsisVertical, File } from 'lucide-react';

export default function GridView({
    reportSubmissions,
}: {
    reportSubmissions: ReportSubmission[];
}) {
    return (
        <div className="grid grid-cols-3 gap-5">
            {reportSubmissions.map((submission) => {
                const file = submission.media?.[0];

                return (
                    <div
                        key={submission.id}
                        className="group relative flex cursor-pointer flex-col rounded-xl border border-border bg-background p-4 transition hover:shadow-md"
                        onDoubleClick={() =>
                            window.open(
                                file?.original_url,
                                '_blank',
                                'noopener,noreferrer',
                            )
                        }
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between pb-2">
                            <h1 className="truncate text-sm font-semibold">
                                {file?.name}
                            </h1>

                            <button
                                onClick={(e) => e.stopPropagation()}
                                className="rounded-full p-1.5 text-muted-foreground opacity-0 transition group-hover:opacity-100 hover:bg-muted"
                                aria-label="More actions"
                            >
                                <EllipsisVertical className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Preview */}
                        <div className="relative flex h-32 items-center justify-center overflow-hidden rounded-lg bg-muted">
                            {file?.mime_type?.startsWith('image/') ? (
                                <img
                                    src={file.original_url}
                                    alt={file.name}
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                />
                            ) : (
                                <File className="h-10 w-10 text-muted-foreground" />
                            )}
                        </div>

                        {/* Info */}
                        <div className="mt-4 flex items-center justify-between">
                            <div className="mt-3 space-y-1">
                                <p className="truncate text-sm font-medium">
                                    {submission.field_officer?.name}
                                </p>

                                <p className="text-xs text-muted-foreground">
                                    Submitted on{' '}
                                    {new Date(
                                        submission.created_at,
                                    ).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </p>
                            </div>
                            <div className="space-x-2">
                                <Button
                                    variant={'ghost'}
                                    className="transition-colors duration-150 hover:bg-destructive/80"
                                >
                                    Return
                                </Button>
                                <Button className="bg-teal-500 hover:bg-teal-600">
                                    Accept
                                </Button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

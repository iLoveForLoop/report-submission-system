import { updateStatus } from '@/actions/App/Http/Controllers/ReportSubmissionController';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ReportSubmission } from '@/types';
import { Form } from '@inertiajs/react';
import { Calendar, Clock, Download, Eye, FileText, X } from 'lucide-react';
import { useState } from 'react';
import { FilePreviewModal } from './file-preview-modal';
import { ModalState, isImage, isSpreadsheet } from './file-preview-types';

export default function ReportSubmissionDrawer({
    submission,
    isOpen,
    onClose,
}: {
    submission: ReportSubmission | null;
    isOpen: boolean;
    onClose: () => void;
}) {
    const [showReturnForm, setShowReturnForm] = useState(false);
    const [remarks, setRemarks] = useState('');
    const [modal, setModal] = useState<ModalState>({
        isOpen: false,
        item: null,
        allItems: [],
        currentIndex: 0,
    });

    const openPreview = (fileId: number) => {
        const files = submission?.media ?? [];
        const index = files.findIndex((f) => f.id === fileId);
        if (index === -1) return;
        setModal({
            isOpen: true,
            item: files[index],
            allItems: files,
            currentIndex: index,
        });
    };

    const closePreview = () => {
        setModal((prev) => ({ ...prev, isOpen: false, item: null }));
    };

    const navigatePreview = (indexOrDir: number | 'prev' | 'next') => {
        setModal((prev) => {
            let next: number;
            if (indexOrDir === 'prev') next = prev.currentIndex - 1;
            else if (indexOrDir === 'next') next = prev.currentIndex + 1;
            else next = indexOrDir;

            if (next < 0 || next >= prev.allItems.length) return prev;
            return { ...prev, currentIndex: next, item: prev.allItems[next] };
        });
    };

    const getFileIcon = (mime: string, name: string) => {
        if (isImage(mime)) return 'image';
        if (isSpreadsheet(mime, name)) return 'sheet';
        return 'file';
    };

    console.log(submission);

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
                    isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 z-50 h-full w-full max-w-2xl overflow-y-auto bg-background shadow-2xl transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {submission && (
                    <>
                        {/* Header */}
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-6 py-4">
                            <h2 className="text-lg font-semibold">
                                Report Submission Details
                            </h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="rounded-full"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Content */}
                        <div className="space-y-6 p-6">
                            {/* Submitter Info */}
                            <div className="flex items-start gap-4 rounded-lg border border-border bg-muted/30 p-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarFallback className="bg-gray-500 text-lg font-semibold text-white">
                                        {submission.field_officer?.name
                                            ?.split(' ')
                                            .map((n: any) => n[0])
                                            .join('')
                                            .toUpperCase() || 'FO'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-2">
                                    <div>
                                        <h3 className="text-base font-semibold">
                                            {submission.field_officer?.name ||
                                                'Unknown Officer'}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Field Officer
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm">
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            <span>
                                                {new Date(
                                                    submission.created_at,
                                                ).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </span>
                                        </div>
                                        {submission.timeliness && (
                                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                                <Clock className="h-4 w-4" />
                                                <span className="capitalize">
                                                    {submission.timeliness}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Status Badge */}
                                <div>
                                    {submission.status === 'accepted' ? (
                                        <span className="inline-flex items-center rounded-full bg-teal-500/10 px-3 py-1 text-sm font-medium text-teal-600">
                                            Accepted
                                        </span>
                                    ) : submission.status === 'returned' ? (
                                        <span className="inline-flex items-center rounded-full bg-red-500/10 px-3 py-1 text-sm font-medium text-red-600">
                                            Returned
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center rounded-full bg-yellow-500/10 px-3 py-1 text-sm font-medium text-yellow-600">
                                            Pending
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Previous Remarks */}
                            {submission.remarks && (
                                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                                    <h4 className="mb-2 text-sm font-medium text-amber-900">
                                        Previous Remarks
                                    </h4>
                                    <p className="text-sm text-amber-800">
                                        {submission.remarks}
                                    </p>
                                </div>
                            )}

                            {/* Submitted Files */}
                            <div className="space-y-3">
                                <h3 className="flex items-center gap-2 text-base font-semibold">
                                    <FileText className="h-5 w-5" />
                                    Submitted Files (
                                    {submission.media?.length || 0})
                                </h3>

                                {submission.media &&
                                submission.media.length > 0 ? (
                                    <div className="space-y-2">
                                        {submission.media.map((file) => {
                                            const fileType = getFileIcon(
                                                file.mime_type,
                                                file.name,
                                            );
                                            return (
                                                <div
                                                    key={file.id}
                                                    className="flex items-center justify-between rounded-lg border border-border bg-background p-4 transition hover:bg-muted/40"
                                                >
                                                    <div className="flex min-w-0 flex-1 items-center gap-3">
                                                        <div
                                                            className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                                                                fileType ===
                                                                'sheet'
                                                                    ? 'bg-emerald-500/10'
                                                                    : fileType ===
                                                                        'image'
                                                                      ? 'bg-blue-500/10'
                                                                      : 'bg-gray-500/10'
                                                            }`}
                                                        >
                                                            <FileText
                                                                className={`h-5 w-5 ${
                                                                    fileType ===
                                                                    'sheet'
                                                                        ? 'text-emerald-600'
                                                                        : fileType ===
                                                                            'image'
                                                                          ? 'text-blue-600'
                                                                          : 'text-gray-600'
                                                                }`}
                                                            />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="truncate text-sm font-medium">
                                                                {file.name}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {file.size
                                                                    ? `${(file.size / 1024).toFixed(2)} KB`
                                                                    : 'Unknown size'}
                                                                {' · '}
                                                                <span className="uppercase">
                                                                    {file.name
                                                                        .split(
                                                                            '.',
                                                                        )
                                                                        .pop()}
                                                                </span>
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        {/* View Button — opens modal */}
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                openPreview(
                                                                    file.id,
                                                                )
                                                            }
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View
                                                        </Button>

                                                        {/* Download Button */}
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <a
                                                                href={
                                                                    file.original_url
                                                                }
                                                                download
                                                            >
                                                                <Download className="mr-2 h-4 w-4" />
                                                                Download
                                                            </a>
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
                                        <FileText className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">
                                            No files submitted
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Additional Information */}
                            {submission.description && (
                                <div className="space-y-3">
                                    <h3 className="text-base font-semibold">
                                        Additional Information
                                    </h3>
                                    <div className="rounded-lg border border-border bg-muted/30 p-4">
                                        <pre className="text-sm whitespace-pre-wrap">
                                            {submission.description}
                                        </pre>
                                    </div>
                                </div>
                            )}

                            {/* Activity Log */}
                            {submission.activities &&
                                submission.activities.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="flex items-center gap-2 text-base font-semibold">
                                            <Clock className="h-5 w-5" />
                                            Activity History (
                                            {submission.activities.length})
                                        </h3>

                                        <div className="space-y-2">
                                            {submission.activities.map(
                                                (log) => (
                                                    <div
                                                        key={log.id}
                                                        className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-3"
                                                    >
                                                        <Avatar className="h-8 w-8 flex-shrink-0">
                                                            <AvatarFallback className="bg-gray-400 text-xs text-white">
                                                                {log.causer?.name
                                                                    ?.split(' ')
                                                                    .map(
                                                                        (
                                                                            n: string,
                                                                        ) =>
                                                                            n[0],
                                                                    )
                                                                    .join('')
                                                                    .toUpperCase() ||
                                                                    '?'}
                                                            </AvatarFallback>
                                                        </Avatar>

                                                        <div className="flex-1 space-y-1">
                                                            <div className="flex items-center justify-between">
                                                                <p className="text-sm font-medium">
                                                                    {log.causer
                                                                        ?.name ||
                                                                        'System'}
                                                                </p>
                                                                <span className="text-xs text-muted-foreground">
                                                                    {new Date(
                                                                        log.created_at,
                                                                    ).toLocaleDateString(
                                                                        'en-US',
                                                                        {
                                                                            month: 'short',
                                                                            day: 'numeric',
                                                                            year: 'numeric',
                                                                            hour: '2-digit',
                                                                            minute: '2-digit',
                                                                        },
                                                                    )}
                                                                </span>
                                                            </div>

                                                            <p className="text-sm text-muted-foreground">
                                                                {
                                                                    log.description
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}
                        </div>

                        {/* Footer Actions */}
                        {submission.status !== 'accepted' &&
                            submission.status !== 'returned' && (
                                <div className="sticky bottom-0 border-t border-border bg-background px-6 py-4">
                                    {!showReturnForm ? (
                                        <div className="flex gap-3">
                                            <Button
                                                variant="outline"
                                                className="flex-1 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                                                onClick={() =>
                                                    setShowReturnForm(true)
                                                }
                                            >
                                                Return for Revision
                                            </Button>

                                            <Form
                                                className="flex-1"
                                                {...updateStatus.form.patch({
                                                    reportSubmission:
                                                        submission.id,
                                                })}
                                                onSuccess={() => onClose()}
                                            >
                                                <input
                                                    type="hidden"
                                                    name="status"
                                                    value="accepted"
                                                />
                                                <Button
                                                    type="submit"
                                                    className="w-full bg-green-600 hover:bg-green-800 dark:bg-green-500 dark:hover:bg-green-700"
                                                >
                                                    Accept Submission
                                                </Button>
                                            </Form>
                                        </div>
                                    ) : (
                                        <Form
                                            {...updateStatus.form.patch({
                                                reportSubmission: submission.id,
                                            })}
                                            onSuccess={() => {
                                                onClose();
                                                setShowReturnForm(false);
                                                setRemarks('');
                                            }}
                                            className="space-y-4"
                                        >
                                            <input
                                                type="hidden"
                                                name="status"
                                                value="returned"
                                            />

                                            <div className="space-y-2">
                                                <Label htmlFor="remarks">
                                                    Remarks{' '}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </Label>
                                                <Textarea
                                                    id="remarks"
                                                    name="remarks"
                                                    placeholder="Please provide specific feedback on what needs to be revised..."
                                                    value={remarks}
                                                    onChange={(e) =>
                                                        setRemarks(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="min-h-[100px] resize-none"
                                                    required
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    This will be sent to the
                                                    field officer for revision.
                                                </p>
                                            </div>

                                            <div className="flex gap-3">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="flex-1"
                                                    onClick={() => {
                                                        setShowReturnForm(
                                                            false,
                                                        );
                                                        setRemarks('');
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    variant="destructive"
                                                    className="flex-1"
                                                    disabled={!remarks.trim()}
                                                >
                                                    Return Submission
                                                </Button>
                                            </div>
                                        </Form>
                                    )}
                                </div>
                            )}
                    </>
                )}
            </div>

            {/* File Preview Modal — z-60 so it sits above the drawer (z-50) */}
            {modal.isOpen && (
                <div
                    className="z-60"
                    style={{ position: 'relative', zIndex: 60 }}
                >
                    <FilePreviewModal
                        state={modal}
                        onClose={closePreview}
                        onNavigate={navigatePreview}
                    />
                </div>
            )}
        </>
    );
}

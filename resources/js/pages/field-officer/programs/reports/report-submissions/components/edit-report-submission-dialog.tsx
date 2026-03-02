import ReportSubmissionController from '@/actions/App/Http/Controllers/ReportSubmissionController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Report, ReportSubmission } from '@/types';

import { Form } from '@inertiajs/react';
import {
    AlertCircle,
    Calendar,
    Download,
    Eye,
    FileText,
    FileUp,
    Folder,
    Pencil,
    UploadCloud,
    XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface DynamicFieldDefinition {
    id: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'textarea' | 'file';
    required: boolean;
}

interface MediaFile {
    id: string;
    name: string;
    size: number;
    download_url: string;
    url: string;
    field_id?: string;
    model_id?: string;
}

interface EditReportSubmissionDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    report: Report;
    submission: ReportSubmission & { media?: MediaFile[] };
}

export default function EditReportSubmissionDialog({
    open,
    setOpen,
    report,
    submission,
}: EditReportSubmissionDialogProps) {
    const schema = (report.form_schema || []) as DynamicFieldDefinition[];
    const [uploadedFiles, setUploadedFiles] = useState<Record<string, File[]>>(
        {},
    );
    const [filesToDelete, setFilesToDelete] = useState<string[]>([]);
    const [existingFiles, setExistingFiles] = useState<
        Record<string, MediaFile[]>
    >({});

    // Load existing submission data on mount / when submission changes
    useEffect(() => {
        if (submission?.media && submission.media.length > 0) {
            const filesByField: Record<string, MediaFile[]> = {};

            submission.media.forEach((file: MediaFile) => {
                const fieldId = file.field_id || 'unknown';

                console.log('Field ID: ', fieldId);
                if (!filesByField[fieldId]) {
                    filesByField[fieldId] = [];
                }
                filesByField[fieldId].push(file);
            });

            setExistingFiles(filesByField);
        }
    }, [submission]);

    const handleFieldChange = (fieldId: string, files: FileList | null) => {
        if (files) {
            const fileArray = Array.from(files);
            setUploadedFiles((prev) => ({ ...prev, [fieldId]: fileArray }));
        }
    };

    const clearFiles = (fieldId: string) => {
        setUploadedFiles((prev) => {
            const newState = { ...prev };
            delete newState[fieldId];
            return newState;
        });
    };

    const markFileForDeletion = (fileId: string, fieldId: string) => {
        setFilesToDelete((prev) => [...prev, fileId]);
        setExistingFiles((prev) => ({
            ...prev,
            [fieldId]: prev[fieldId].filter((f) => f.id !== fileId),
        }));
    };

    const formatDate = (dateString: string | Date) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handleClose = () => {
        setOpen(false);
        setUploadedFiles({});
        setFilesToDelete([]);
    };

    // console.log('Report: ', report);
    console.log('Report Submissiona: ', submission);
    // console.log('Submission Data: ', submission);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-950 dark:hover:text-blue-300"
                >
                    <Pencil className="mr-1 h-3.5 w-3.5" />
                    Edit
                </Button>
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto p-0 overflow-x-hidden">
                <div className="sticky top-0 z-10 border-b bg-white px-6 py-4 dark:dark:bg-[#141414] ">
                    <DialogHeader>
                        <div className="flex items-start justify-between">
                            <div>
                                <DialogTitle className="text-sm lg:text-xl text-start">
                                    Edit Submission: {report.title}
                                </DialogTitle>
                                <DialogDescription className="mt-1 text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                                    Update your submission details and files
                                    below.
                                </DialogDescription>
                            </div>
                            <div className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                <Pencil className="h-3.5 w-3.5" />
                                Editing Mode
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <Form
                    {...ReportSubmissionController.update.form(submission?.id)}
                    encType="multipart/form-data"
                    onSuccess={handleClose}
                >
                    {({ processing, errors }) => (
                        <div className="space-y-8 px-6 pb-6">
                            {/* Report Info Banner */}
                            <div className="rounded-xl border bg-blue-50/50 p-4 dark:border dark:dark:bg-[#141414] ">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:border dark:dark:bg-[#141414] ">
                                        <FileText className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium text-blue-900 dark:text-foreground">
                                            Report Details
                                        </h4>
                                        <div className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="text-blue-600 dark:text-blue-300 h-3.5 w-3.5" />
                                                <span className='dark:text-blue-300'>
                                                    Deadline:{' '}
                                                </span>
                                                {formatDate(
                                                    report.deadline,
                                                )}
                                            </div>
                                            {report.program && (
                                                <div className="flex items-center gap-2">
                                                    <Folder className="text-blue-600 dark:text-blue-300 h-3.5 w-3.5" />
                                                    <span className='dark:text-blue-300'>
                                                        Program:{' '}
                                                    </span>
                                                    {report.program.name}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Hidden Fields */}
                            <input
                                type="hidden"
                                name="report_id"
                                value={report.id}
                            />
                            <input type="hidden" name="_method" value="PUT" />
                            {filesToDelete.length > 0 && (
                                <input
                                    type="hidden"
                                    name="files_to_delete"
                                    value={JSON.stringify(filesToDelete)}
                                />
                            )}

                            {/* General Information Section */}
                            <div className="space-y-5">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                                        <FileText className="h-3.5 w-3.5 text-purple-600 dark:text-purple-300" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        General Information
                                    </h3>
                                </div>

                                <div className="space-y-4 rounded-xl border bg-white p-5 shadow-sm dark:border dark:dark:bg-[#141414]">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="description"
                                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Description / Notes
                                        </Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            defaultValue={
                                                submission?.description ?? ''
                                            }
                                            placeholder="Add any additional notes or context about your submission..."
                                            className="text-xs min-h-[100px] border-gray-200 bg-white focus:border-2 focus:ring-gray-500 dark:border-gray-700 dark:dark:bg-[#141414] dark:focus:border-gray-400 dark:focus:ring-gray-400"
                                        />
                                        <p className="text-xs text-gray-400 dark:text-gray-500">
                                            Optional: Provide any clarifying
                                            information about your submission.
                                        </p>
                                        <InputError
                                            message={errors.description}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Required Attachments Section */}
                            <div className="space-y-5">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900">
                                        <FileUp className="h-3.5 w-3.5 text-amber-600 dark:text-amber-300" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        Attachments
                                    </h3>
                                </div>

                                {schema.length === 0 ? (
                                    <div className="rounded-xl border border-dashed bg-gray-50 p-8 text-center dark:border dark:dark:bg-[#141414]">
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            No attachments required
                                        </p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500">
                                            This report doesn't require any file
                                            attachments
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {schema.map((field, index) => {
                                            const fieldExistingFiles =
                                                existingFiles[field.id] || [];
                                            const hasExistingFiles =
                                                fieldExistingFiles.length > 0;

                                            console.log(
                                                'Existing files: ',
                                                existingFiles,
                                            );

                                            console.log(
                                                'Field Existing files: ',
                                                fieldExistingFiles,
                                            );

                                            return (
                                                <div
                                                    key={field.id}
                                                    className="rounded-xl border bg-white p-5 shadow-sm transition-all hover:border-amber-200 dark:border dark:dark:bg-[#141414] dark:hover:border-amber-800"
                                                >
                                                    <div className="space-y-4">
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <Label
                                                                    htmlFor={
                                                                        field.id
                                                                    }
                                                                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                                                >
                                                                    {
                                                                        field.label
                                                                    }
                                                                    {field.required && (
                                                                        <span className="ml-1 text-red-500 dark:text-red-400">
                                                                            *
                                                                        </span>
                                                                    )}
                                                                </Label>
                                                                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                                                                    Attachment #
                                                                    {index + 1}{' '}
                                                                    of{' '}
                                                                    {
                                                                        schema.length
                                                                    }
                                                                </p>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                {uploadedFiles[
                                                                    field.id
                                                                ] && (
                                                                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
                                                                        {
                                                                            uploadedFiles[
                                                                                field
                                                                                    .id
                                                                            ]
                                                                                .length
                                                                        }{' '}
                                                                        new
                                                                    </span>
                                                                )}
                                                                {hasExistingFiles &&
                                                                    !uploadedFiles[
                                                                        field.id
                                                                    ] && (
                                                                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                                                            {
                                                                                fieldExistingFiles.length
                                                                            }{' '}
                                                                            existing
                                                                        </span>
                                                                    )}
                                                            </div>
                                                        </div>

                                                        {/* Existing Files */}
                                                        {hasExistingFiles && (
                                                            <div className="space-y-2">
                                                                <p className="text-xs font-medium text-blue-700 dark:text-blue-400">
                                                                    Current
                                                                    Files:
                                                                </p>
                                                                {fieldExistingFiles.map(
                                                                    (file) => (
                                                                        <div
                                                                            key={
                                                                                file.id
                                                                            }
                                                                            className="flex items-center justify-between rounded-lg border border-border bg-background p-3 transition hover:bg-muted/40 dark:border-gray-800"
                                                                        >
                                                                            <div className="flex min-w-0 flex-1 items-center gap-3">
                                                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-500/10">
                                                                                    <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                                                                </div>
                                                                                <div className="min-w-0 flex-1">
                                                                                    <p className="truncate text-sm font-medium dark:text-gray-200">
                                                                                        {
                                                                                            file.name
                                                                                        }
                                                                                    </p>
                                                                                    <p className="text-xs text-muted-foreground dark:text-gray-400">
                                                                                        {file.size
                                                                                            ? `${(file.size / 1024).toFixed(2)} KB`
                                                                                            : 'Unknown size'}
                                                                                    </p>
                                                                                </div>
                                                                            </div>

                                                                            <div className="flex gap-2">
                                                                                <Button
                                                                                    variant="outline"
                                                                                    size="sm"
                                                                                    type="button"
                                                                                    onClick={() =>
                                                                                        window.open(
                                                                                            file.url,
                                                                                            '_blank',
                                                                                            'noopener,noreferrer',
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                                    View
                                                                                </Button>

                                                                                <Button
                                                                                    variant="outline"
                                                                                    size="sm"
                                                                                    asChild
                                                                                >
                                                                                    <a
                                                                                        href={
                                                                                            file.download_url
                                                                                        }
                                                                                    >
                                                                                        <Download className="mr-2 h-4 w-4" />
                                                                                        Download
                                                                                    </a>
                                                                                </Button>

                                                                                <Button
                                                                                    type="button"
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-950 dark:hover:text-red-300"
                                                                                    onClick={() =>
                                                                                        markFileForDeletion(
                                                                                            file.id,
                                                                                            field.id,
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <XCircle className="h-4 w-4" />
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    ),
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* Upload New / Replacement Files */}
                                                        <div
                                                            className={cn(
                                                                'relative cursor-pointer rounded-lg border-2 border-dashed transition-all',
                                                                uploadedFiles[
                                                                    field.id
                                                                ]
                                                                    ? 'border-green-300 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50'
                                                                    : 'border-gray-200 bg-gray-50/50 hover:border-amber-300 hover:bg-amber-50/50 dark:border-gray-700 dark:bg-gray-900/50 dark:hover:border-amber-700 dark:hover:bg-amber-950/50',
                                                            )}
                                                            onClick={() => {
                                                                if (
                                                                    !uploadedFiles[
                                                                        field.id
                                                                    ]
                                                                ) {
                                                                    document
                                                                        .getElementById(
                                                                            field.id,
                                                                        )
                                                                        ?.click();
                                                                }
                                                            }}
                                                        >
                                                            <Input
                                                                id={field.id}
                                                                type="file"
                                                                multiple
                                                                name={`submission_data[${field.id}][]`}
                                                                required={
                                                                    field.required &&
                                                                    !uploadedFiles[
                                                                        field.id
                                                                    ] &&
                                                                    !hasExistingFiles
                                                                }
                                                                className="absolute inset-0 cursor-pointer opacity-0"
                                                                onChange={(e) =>
                                                                    handleFieldChange(
                                                                        field.id,
                                                                        e.target
                                                                            .files,
                                                                    )
                                                                }
                                                            />

                                                            {uploadedFiles[
                                                                field.id
                                                            ] ? (
                                                                <div className="p-4">
                                                                    <div className="mb-3 flex items-center justify-between">
                                                                        <p className="text-sm font-medium text-green-700 dark:text-green-400">
                                                                            New
                                                                            Files
                                                                            Selected
                                                                        </p>
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="h-7 px-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950 dark:hover:text-red-300"
                                                                            onClick={(
                                                                                e,
                                                                            ) => {
                                                                                e.stopPropagation();
                                                                                clearFiles(
                                                                                    field.id,
                                                                                );
                                                                            }}
                                                                        >
                                                                            Clear
                                                                            all
                                                                        </Button>
                                                                    </div>
                                                                    <ul className="space-y-2">
                                                                        {uploadedFiles[
                                                                            field
                                                                                .id
                                                                        ].map(
                                                                            (
                                                                                file,
                                                                                i,
                                                                            ) => (
                                                                                <li
                                                                                    key={
                                                                                        i
                                                                                    }
                                                                                    className="flex items-center gap-3 text-sm"
                                                                                >
                                                                                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-amber-100 dark:bg-amber-900">
                                                                                        <FileText className="h-4 w-4 text-amber-600 dark:text-amber-300" />
                                                                                    </div>
                                                                                    <div className="min-w-0 flex-1">
                                                                                        <p className="truncate font-medium text-gray-700 dark:text-gray-300">
                                                                                            {
                                                                                                file.name
                                                                                            }
                                                                                        </p>
                                                                                        <p className="text-xs text-gray-400 dark:text-gray-500">
                                                                                            {(
                                                                                                file.size /
                                                                                                1024
                                                                                            ).toFixed(
                                                                                                1,
                                                                                            )}{' '}
                                                                                            KB
                                                                                        </p>
                                                                                    </div>
                                                                                </li>
                                                                            ),
                                                                        )}
                                                                    </ul>
                                                                </div>
                                                            ) : (
                                                                <div className="flex flex-col items-center py-6">
                                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900">
                                                                        <UploadCloud className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                                                                    </div>
                                                                    <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                        {hasExistingFiles
                                                                            ? 'Click to upload additional files'
                                                                            : 'Click to upload files'}
                                                                    </p>
                                                                    <p className="text-xs text-gray-400 dark:text-gray-500">
                                                                        PDF,
                                                                        Images,
                                                                        DOCX
                                                                        (Max
                                                                        10MB
                                                                        each)
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <InputError
                                                            message={
                                                                errors[
                                                                    `submission_data.${field.id}`
                                                                ]
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Error Summary */}
                            {Object.keys(errors).length > 0 && (
                                <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/50">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500 dark:text-red-400" />
                                        <div>
                                            <p className="text-sm font-medium text-red-800 dark:text-red-300">
                                                Please fix the following errors:
                                            </p>
                                            <ul className="mt-1 list-inside list-disc text-sm text-red-700 dark:text-red-400">
                                                {Object.entries(errors).map(
                                                    ([key, value]) => (
                                                        <li key={key}>
                                                            {value as string}
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="sticky bottom-0 -mx-6 border-t bg-white px-6 py-4 dark:border-gray-800 dark:dark:bg-[#141414]">
                                <div className="flex justify-end gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleClose}
                                        className="px-6"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="min-w-[140px] bg-blue-600 px-6 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                                    >
                                        {processing ? (
                                            <div className="flex items-center gap-2">
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent dark:text-muted" />
                                                Updating...
                                            </div>
                                        ) : (
                                            'Update Submission'
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
